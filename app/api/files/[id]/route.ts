import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUserId } from "@/lib/database"
import { neon } from "@neondatabase/serverless"
import { del } from "@vercel/blob"

const sql = neon(process.env.DATABASE_URL!)

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sessionId = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!sessionId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const userId = await getCurrentUserId(sessionId)
    if (!userId) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    const fileId = params.id
    const { searchParams } = new URL(request.url)
    const fileType = searchParams.get("type") // 'photo' or 'receipt'

    let fileRecord
    let tableName = ""

    // Get file record based on type
    if (fileType === "photo") {
      tableName = "purchase_request_item_photos"
      const [record] = await sql`
        SELECT prip.*, pri.purchase_request_id, pr.user_id
        FROM purchase_request_item_photos prip
        JOIN purchase_request_items pri ON prip.purchase_request_item_id = pri.id
        JOIN purchase_requests pr ON pri.purchase_request_id = pr.id
        WHERE prip.id = ${fileId} AND pr.user_id = ${userId}
      `
      fileRecord = record
    } else if (fileType === "receipt") {
      tableName = "package_receipts"
      const [record] = await sql`
        SELECT pr.*, p.user_id
        FROM package_receipts pr
        JOIN packages p ON pr.package_id = p.id
        WHERE pr.id = ${fileId} AND p.user_id = ${userId}
      `
      fileRecord = record
    }

    if (!fileRecord) {
      return NextResponse.json({ error: "File not found or access denied" }, { status: 404 })
    }

    // Delete from Vercel Blob
    try {
      await del(fileRecord.file_url)
    } catch (blobError) {
      console.error("Error deleting from blob:", blobError)
      // Continue with database deletion even if blob deletion fails
    }

    // Delete from database
    if (fileType === "photo") {
      await sql`DELETE FROM purchase_request_item_photos WHERE id = ${fileId}`
    } else if (fileType === "receipt") {
      await sql`DELETE FROM package_receipts WHERE id = ${fileId}`
    }

    return NextResponse.json({ message: "File deleted successfully" })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
  }
}

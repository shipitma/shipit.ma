import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUserId } from "@/lib/database"
import { neon } from "@neondatabase/serverless"
import { del } from "@vercel/blob"

const sql = neon(process.env.DATABASE_URL!)

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const sessionId = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!sessionId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const userId = await getCurrentUserId(sessionId)
    if (!userId) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    const attachmentId = id

    // Get attachment record and verify ownership
    const [attachment] = await sql`
      SELECT * FROM attachments 
      WHERE id = ${attachmentId} AND user_id = ${userId}
    `

    if (!attachment) {
      return NextResponse.json({ error: "Attachment not found or access denied" }, { status: 404 })
    }

    // Delete from Vercel Blob
    try {
      await del(attachment.file_url)
    } catch (blobError) {
      console.error("Error deleting from blob:", blobError)
      // Continue with database deletion even if blob deletion fails
    }

    // Delete from database
    await sql`DELETE FROM attachments WHERE id = ${attachmentId}`

    return NextResponse.json({ message: "Attachment deleted successfully" })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Failed to delete attachment" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const sessionId = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!sessionId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const userId = await getCurrentUserId(sessionId)
    if (!userId) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    const attachmentId = id
    const body = await request.json()
    const { relatedType, relatedId } = body

    // Update attachment with related entity info
    const [updatedAttachment] = await sql`
      UPDATE attachments 
      SET related_type = ${relatedType}, related_id = ${relatedId}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${attachmentId} AND user_id = ${userId}
      RETURNING *
    `

    if (!updatedAttachment) {
      return NextResponse.json({ error: "Attachment not found or access denied" }, { status: 404 })
    }

    return NextResponse.json(updatedAttachment)
  } catch (error) {
    console.error("Update error:", error)
    return NextResponse.json({ error: "Failed to update attachment" }, { status: 500 })
  }
}

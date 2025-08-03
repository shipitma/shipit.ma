import { NextRequest, NextResponse } from "next/server"
import { getCurrentUserId } from "@/lib/database"
import { neon } from "@neondatabase/serverless"
import { DeleteObjectCommand } from "@aws-sdk/client-s3"
import { r2Client, R2_BUCKET_NAME } from "@/lib/r2"

const sql = neon(process.env.DATABASE_URL!)

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get session ID from authorization header
    const sessionId = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!sessionId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const userId = await getCurrentUserId(sessionId)
    if (!userId) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    const fileId = params.id

    // Get file details
    const [file] = await sql`
      SELECT * FROM attachments 
      WHERE id = ${fileId} AND user_id = ${userId}
    `

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Delete from R2 - extract the key from file_url
    try {
      const fileUrl = file.file_url
      // Extract the key from the URL: https://account.r2.cloudflarestorage.com/bucket/userId/timestamp-randomString.ext
      const urlParts = fileUrl.split('/')
      const key = urlParts.slice(-2).join('/') // Get userId/filename part
      if (key) {
        await r2Client.send(
          new DeleteObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: key,
          })
        )
      }
    } catch (error) {
      // Continue with database deletion even if R2 deletion fails
    }

    // Delete from database
    await sql`
      DELETE FROM attachments 
      WHERE id = ${fileId} AND user_id = ${userId}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}

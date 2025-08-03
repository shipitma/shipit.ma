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

    const attachmentId = params.id

    // Get attachment details
    const [attachment] = await sql`
      SELECT * FROM attachments 
      WHERE id = ${attachmentId} AND user_id = ${userId}
    `

    if (!attachment) {
      return NextResponse.json({ error: "Attachment not found" }, { status: 404 })
    }

    // Delete from R2 - extract the key from file_url
    try {
      const fileUrl = attachment.file_url
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
      WHERE id = ${attachmentId} AND user_id = ${userId}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}

export async function PATCH(
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

    const attachmentId = params.id
    const body = await request.json()
    const { relatedType, relatedId } = body

    // Update attachment
    const [updatedAttachment] = await sql`
      UPDATE attachments 
      SET related_type = ${relatedType}, related_id = ${relatedId}
      WHERE id = ${attachmentId} AND user_id = ${userId}
      RETURNING *
    `

    if (!updatedAttachment) {
      return NextResponse.json({ error: "Attachment not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      attachment: updatedAttachment,
    })
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}

import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUserId } from "@/lib/database"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const sessionId = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!sessionId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const userId = await getCurrentUserId(sessionId)
    if (!userId) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const attachmentType = formData.get("type") as string // 'photo' or 'receipt'
    const relatedType = formData.get("relatedType") as string // 'purchase_request_item' or 'package'
    const relatedId = formData.get("relatedId") as string // Optional - can be set later

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!attachmentType) {
      return NextResponse.json({ error: "Attachment type is required" }, { status: 400 })
    }

    // Check file size (20MB for all file types)
    const maxSize = 20 * 1024 * 1024 // 20MB
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: `File too large. Maximum size is ${maxSize / (1024 * 1024)}MB`,
        },
        { status: 400 },
      )
    }

    // Generate unique filename with user ID and timestamp
    const timestamp = Date.now()
    const randomSuffix = Math.random().toString(36).substring(2, 8)
    const fileExtension = file.name.split(".").pop()
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const filename = `user-${userId}/${attachmentType}s/${timestamp}-${randomSuffix}-${cleanFileName}`

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: false,
    })

    // Store attachment info in database
    const [attachment] = await sql`
      INSERT INTO attachments (
        user_id, file_url, file_name, file_size, file_type, 
        attachment_type, related_type, related_id
      ) VALUES (
        ${userId}, ${blob.url}, ${file.name}, ${file.size}, ${file.type},
        ${attachmentType}, ${relatedType || null}, ${relatedId || null}
      ) RETURNING *
    `

    return NextResponse.json({
      id: attachment.id,
      url: blob.url,
      filename: file.name,
      size: file.size,
      type: file.type,
      pathname: blob.pathname,
      attachmentType,
      relatedType,
      relatedId,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      {
        error: "Upload failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

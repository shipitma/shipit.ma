import { NextRequest, NextResponse } from "next/server"
import { getCurrentUserId } from "@/lib/database"
import { neon } from "@neondatabase/serverless"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { r2Client, R2_BUCKET_NAME, R2_CUSTOM_DOMAIN, ensureBucketExists } from "@/lib/r2"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    // Get session ID from authorization header
    const sessionId = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!sessionId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Get user ID from session
    const userId = await getCurrentUserId(sessionId)
    if (!userId) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large. Maximum size is 10MB." }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only JPEG, PNG, GIF, and PDF are allowed." }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split('.').pop()
    const filename = `${userId}/${timestamp}-${randomString}.${fileExtension}`

    // Convert file to buffer
    const fileBuffer = await file.arrayBuffer()

    // Skip bucket creation - assume bucket exists

    // Upload to R2
    await r2Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: filename,
        Body: Buffer.from(fileBuffer),
        ContentType: file.type,
        ACL: "public-read", // Make object publicly readable
      }),
    )

    // Get the public URL using custom domain
    const publicUrl = `https://${R2_CUSTOM_DOMAIN}/${filename}`

    // Save to database
    const result = await sql`
      INSERT INTO attachments (user_id, file_url, file_name, file_size, file_type, attachment_type)
      VALUES (${userId}, ${publicUrl}, ${file.name}, ${file.size}, ${file.type}, ${type})
      RETURNING id, file_url
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Failed to save file metadata" }, { status: 500 })
    }

    const attachment = result[0]

    return NextResponse.json({
      success: true,
      id: attachment.id,
      url: attachment.file_url,
      filename: attachment.file_name,
      originalName: file.name,
      fileSize: file.size,
      fileType: file.type,
    })
  } catch (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUserId } from "@/lib/database"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!sessionId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const userId = await getCurrentUserId(sessionId)
    if (!userId) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const attachmentType = searchParams.get("type")
    const relatedType = searchParams.get("relatedType")
    const relatedId = searchParams.get("relatedId")

    let query = sql`
      SELECT * FROM attachments 
      WHERE user_id = ${userId}
    `

    // Add filters if provided
    if (attachmentType) {
      query = sql`
        SELECT * FROM attachments 
        WHERE user_id = ${userId} AND attachment_type = ${attachmentType}
      `
    }

    if (relatedType && relatedId) {
      query = sql`
        SELECT * FROM attachments 
        WHERE user_id = ${userId} 
        AND related_type = ${relatedType} 
        AND related_id = ${relatedId}
      `
    }

    query = sql`${query} ORDER BY uploaded_at DESC`

    const attachments = await query

    return NextResponse.json(attachments)
  } catch (error) {
    console.error("Error fetching attachments:", error)
    return NextResponse.json({ error: "Failed to fetch attachments" }, { status: 500 })
  }
}

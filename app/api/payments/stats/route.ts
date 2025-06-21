import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getCurrentUserId } from "@/lib/database"

function getDatabase() {
  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL
  if (!databaseUrl) {
    throw new Error("No database URL found")
  }
  return neon(databaseUrl)
}

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

    const sql = getDatabase()

    // Check if table exists first
    try {
      await sql`SELECT 1 FROM payment_requests LIMIT 1`
    } catch (error) {
      // Return default stats if table doesn't exist
      return NextResponse.json({
        pending: 0,
        overdue: 0,
        paid: 0,
        processing: 0,
      })
    }

    let result
    try {
      result = await sql`
        SELECT 
          status,
          COUNT(*) as count
        FROM payment_requests 
        WHERE user_id = ${userId}
        GROUP BY status
      `
    } catch (error) {
      return NextResponse.json({
        pending: 0,
        overdue: 0,
        paid: 0,
        processing: 0,
      })
    }

    const stats = {
      pending: 0,
      overdue: 0,
      paid: 0,
      processing: 0,
    }

    result.forEach((row: any) => {
      const count = Number(row.count) || 0
      if (row.status === "pending") stats.pending = count
      if (row.status === "overdue") stats.overdue = count
      if (row.status === "paid") stats.paid = count
      if (row.status === "processing") stats.processing = count
    })

    return NextResponse.json(stats)
  } catch (error) {
    return NextResponse.json({
      pending: 0,
      overdue: 0,
      paid: 0,
      processing: 0,
    })
  }
}

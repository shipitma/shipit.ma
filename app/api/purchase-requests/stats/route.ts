import { type NextRequest, NextResponse } from "next/server"
import { getPurchaseRequestStats, getCurrentUserId } from "@/lib/database"

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

    const stats = await getPurchaseRequestStats(userId)
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching purchase request stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}

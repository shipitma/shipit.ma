import { type NextRequest, NextResponse } from "next/server"
import { getDashboardStats, getCurrentUserId } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    console.log("Dashboard stats API called")

    const authHeader = request.headers.get("authorization")
    console.log("Auth header:", authHeader ? "present" : "missing")

    const sessionId = authHeader?.replace("Bearer ", "")

    if (!sessionId) {
      console.log("No session ID provided")
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    console.log("Getting user ID for session:", sessionId.substring(0, 10) + "...")
    const userId = await getCurrentUserId(sessionId)

    if (!userId) {
      console.log("Invalid session - no user found")
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    console.log("Fetching stats for user:", userId)
    const stats = await getDashboardStats(userId)
    console.log("Stats fetched:", stats)

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch stats",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

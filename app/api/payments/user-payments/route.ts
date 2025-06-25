import { NextRequest, NextResponse } from "next/server"
import { getCurrentUserId, getPayments } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = await getCurrentUserId(sessionId)
    if (!userId) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const statusFilter = searchParams.get("status")

    const payments = await getPayments(userId, statusFilter || undefined)

    return NextResponse.json(payments)
  } catch (error) {
    console.error("Error fetching user payments:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 
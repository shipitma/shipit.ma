import { type NextRequest, NextResponse } from "next/server"
import { refreshNeonSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await request.json()

    if (!refreshToken) {
      return NextResponse.json({ error: "Refresh token required" }, { status: 400 })
    }

    const result = await refreshNeonSession(refreshToken)
    if (!result) {
      return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      accessToken: result.accessToken,
      sessionId: result.sessionId,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to refresh token" }, { status: 500 })
  }
}

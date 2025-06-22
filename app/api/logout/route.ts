import { type NextRequest, NextResponse } from "next/server"
import { invalidateSession, validateNeonToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    let sessionId: string | null = null

    // Try to get sessionId from request body first
    try {
      const body = await request.json()
      sessionId = body.sessionId
    } catch {
      // If no body, try to get from Authorization header
      const authHeader = request.headers.get("authorization")
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7)
        
        // For Neon Auth tokens, we need to extract session info
        if (token.startsWith("neon_")) {
          // For now, we'll just return success since the token will expire
          return NextResponse.json({ success: true })
        } else {
          // Assume it's a session ID
          sessionId = token
        }
      }
    }

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID requis" }, { status: 400 })
    }

    // Invalidate session
    await invalidateSession(sessionId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Échec de la déconnexion" }, { status: 500 })
  }
}

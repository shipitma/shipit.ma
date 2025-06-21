import { type NextRequest, NextResponse } from "next/server"
import { invalidateSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID requis" }, { status: 400 })
    }

    // Invalidate session
    await invalidateSession(sessionId)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Échec de la déconnexion" }, { status: 500 })
  }
}

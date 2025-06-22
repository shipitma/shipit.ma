import { type NextRequest, NextResponse } from "next/server"
import {
  getNeonSession,
  createNeonUser,
  createNeonSession,
  invalidateNeonSession,
  updateUserLastLogin,
} from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { sessionId, firstName, lastName, email, address } = await request.json()

    if (!sessionId || !firstName || !lastName || !address) {
      return NextResponse.json({ error: "Données d'inscription incomplètes" }, { status: 400 })
    }

    // Verify session
    const session = await getNeonSession(sessionId)
    if (!session || session.session_type !== "pending_registration") {
      return NextResponse.json({ error: "Session invalide ou expirée" }, { status: 401 })
    }

    // Create user with Neon Auth
    const userId = await createNeonUser({
      phoneNumber: session.phone_number,
      firstName,
      lastName,
      email,
      addressLine: address.line,
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country || "Morocco",
    })

    // Invalidate the pending registration session
    await invalidateNeonSession(sessionId)

    // Create authenticated session with Neon Auth
    const userAgent = request.headers.get("user-agent") || undefined
    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined

    const {
      sessionId: newSessionId,
      accessToken,
      refreshToken,
    } = await createNeonSession(session.phone_number, "authenticated", userId, userAgent, ipAddress)

    // Update last login
    await updateUserLastLogin(userId)

    return NextResponse.json({
      success: true,
      sessionId: newSessionId,
      accessToken,
      refreshToken,
      user: {
        id: userId,
        phoneNumber: session.phone_number,
        firstName,
        lastName,
        email,
        phoneVerified: true,
        emailVerified: false,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Échec de l'enregistrement de l'utilisateur" }, { status: 500 })
  }
}

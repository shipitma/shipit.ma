import { type NextRequest, NextResponse } from "next/server"
import {
  getNeonSession,
  createNeonUser,
  createNeonSession,
  invalidateNeonSession,
  updateUserLastLogin,
  cleanupPendingRegistrationSessions,
} from "@/lib/auth"
import { serverTranslate, getLanguageFromRequest } from "@/lib/server-translations"

export async function POST(request: NextRequest) {
  try {
    const { sessionId, firstName, lastName, email, address } = await request.json()
    
    // Get user's preferred language from request headers
    const language = getLanguageFromRequest(request)

    if (!sessionId || !firstName || !lastName || !address) {
      const errorMessage = await serverTranslate('errors.incompleteRegistration', language, 'Incomplete registration data')
      return NextResponse.json({ error: errorMessage }, { status: 400 })
    }

    // Verify session
    const session = await getNeonSession(sessionId)
    if (!session || session.session_type !== "pending_registration") {
      const errorMessage = await serverTranslate('errors.invalidSession', language, 'Invalid or expired session')
      return NextResponse.json({ error: errorMessage }, { status: 401 })
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

    // Clean up any other pending_registration sessions for this phone number
    await cleanupPendingRegistrationSessions(session.phone_number, sessionId)

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
    const language = getLanguageFromRequest(request)
    const errorMessage = await serverTranslate('errors.registrationFailed', language, 'User registration failed')
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { verifyOTPCode, createNeonSession, userExists, getNeonUserByPhone, updateUserLastLogin, cleanupPendingRegistrationSessions, createNeonUser, updateNeonUser } from "@/lib/auth"
import { serverTranslate, getLanguageFromRequest } from "@/lib/server-translations"

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, otp, purpose: requestedPurpose } = await request.json()
    
    // Get user's preferred language from request headers
    const language = getLanguageFromRequest(request)

    if (!phoneNumber || !otp) {
      const errorMessage = await serverTranslate('auth.phoneNumber', language, 'Phone Number')
      return NextResponse.json({ error: errorMessage }, { status: 400 })
    }

    if (otp.length !== 6) {
      const errorMessage = await serverTranslate('errors.invalidOtp', language, 'Invalid OTP format')
      return NextResponse.json({ error: errorMessage }, { status: 400 })
    }

    // Use requested purpose or determine from user existence
    const purpose = requestedPurpose || (await userExists(phoneNumber) ? "login" : "register")

    // Verify OTP code
    const verificationResult = await verifyOTPCode(phoneNumber, otp, purpose)

    if (!verificationResult.success) {
      const errorMessage = await serverTranslate('errors.invalidOtp', language, 'Invalid OTP code')
      return NextResponse.json({ error: errorMessage }, { status: 400 })
    }

    // Get user agent and IP for session tracking
    const userAgent = request.headers.get("user-agent") || undefined
    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined

    const isExistingUser = await userExists(phoneNumber)
    
    if (isExistingUser) {
      // User exists - create authenticated session with Neon Auth
      const user = await getNeonUserByPhone(phoneNumber)
      if (!user) {
        const errorMessage = await serverTranslate('errors.userNotFound', language, 'User not found')
        return NextResponse.json({ error: errorMessage }, { status: 404 })
      }

      // Clean up any pending registration sessions for this user
      await cleanupPendingRegistrationSessions(phoneNumber)

      const { sessionId, accessToken, refreshToken } = await createNeonSession(
        phoneNumber,
        "authenticated",
        user.id,
        userAgent,
        ipAddress,
      )

      // Update last login
      await updateUserLastLogin(user.id)

      return NextResponse.json({
        success: true,
        isNewUser: false,
        sessionId,
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          phoneNumber: user.phone_number,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          phoneVerified: user.phone_verified,
          emailVerified: user.email_verified,
        },
      })
    } else {
      // New user - they should have been created during registration
      // This should not happen if registration flow is working correctly
      const errorMessage = await serverTranslate('errors.userNotFound', language, 'User not found. Please register first.')
      return NextResponse.json({ error: errorMessage }, { status: 404 })
    }
  } catch (error) {
    const language = getLanguageFromRequest(request)
    const errorMessage = await serverTranslate('errors.otpVerificationFailed', language, 'OTP verification failed')
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { verifyOTPCode, createNeonSession, userExists, getNeonUserByPhone, updateUserLastLogin } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, otp } = await request.json()

    if (!phoneNumber || !otp) {
      return NextResponse.json({ error: "Numéro de téléphone et code OTP requis" }, { status: 400 })
    }

    if (otp.length !== 6) {
      return NextResponse.json({ error: "Format OTP invalide" }, { status: 400 })
    }

    // Check if user exists to determine purpose
    const isExistingUser = await userExists(phoneNumber)
    const purpose = isExistingUser ? "login" : "register"

    // Verify OTP code
    const verificationResult = await verifyOTPCode(phoneNumber, otp, purpose)

    if (!verificationResult.success) {
      return NextResponse.json({ error: verificationResult.message }, { status: 400 })
    }

    // Get user agent and IP for session tracking
    const userAgent = request.headers.get("user-agent") || undefined
    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || undefined

    if (isExistingUser) {
      // User exists - create authenticated session with Neon Auth
      const user = await getNeonUserByPhone(phoneNumber)
      if (!user) {
        return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
      }

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
      // New user - create pending registration session
      const { sessionId } = await createNeonSession(
        phoneNumber,
        "pending_registration",
        undefined,
        userAgent,
        ipAddress,
      )

      return NextResponse.json({
        success: true,
        isNewUser: true,
        sessionId,
      })
    }
  } catch (error) {
    return NextResponse.json({ error: "Échec de la vérification OTP" }, { status: 500 })
  }
}

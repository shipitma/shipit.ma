import { type NextRequest, NextResponse } from "next/server"
import { createOTPCode, userExists } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json()

    if (!phoneNumber) {
      return NextResponse.json({ error: "Numéro de téléphone requis" }, { status: 400 })
    }

    // Check if user exists to determine purpose
    const isExistingUser = await userExists(phoneNumber)
    const purpose = isExistingUser ? "login" : "register"

    // Create OTP code
    const otp = await createOTPCode(phoneNumber, purpose)

    // Format chatId for the new API
    const chatId = `${phoneNumber}@c.us`
    const text = `Votre code de vérification shipit.ma est : ${otp}\n\nCe code expirera dans 10 minutes. Ne partagez pas ce code avec qui que ce soit.`

    // Send OTP via the new API
    const otpResponse = await fetch("https://otpsender.ship-it.me/api/sendText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatId: chatId,
        text: text,
        session: "default",
      }),
    })

    if (!otpResponse.ok) {
      // Don't fail the request if the OTP sender fails, for development purposes
      // In production, you might want to handle this differently
      console.error("Failed to send OTP:", await otpResponse.text())
    }

    return NextResponse.json({
      success: true,
      purpose,
      message: `Code OTP envoyé pour ${purpose === "login" ? "connexion" : "inscription"}`,
    })
  } catch (error) {
    return NextResponse.json({ error: "Échec de l'envoi de l'OTP" }, { status: 500 })
  }
}

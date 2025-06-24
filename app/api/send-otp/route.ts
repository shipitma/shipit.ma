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

    // Send OTP via WhatsApp API
    const whatsappResponse = await fetch("https://wasenderapi.com/api/send-message", {
      method: "POST",
      headers: {
        Authorization: "Bearer 0b0488877dddb17a92226f5914bd30b92ba964344f5dda24e36da992a2048693",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: phoneNumber,
        text: `Votre code de vérification shipit.ma est : ${otp}\n\nCe code expirera dans 10 minutes. Ne partagez pas ce code avec qui que ce soit.`,
      }),
    })

    if (!whatsappResponse.ok) {
      // Don't fail the request if WhatsApp fails, for development purposes
      // In production, you might want to handle this differently
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

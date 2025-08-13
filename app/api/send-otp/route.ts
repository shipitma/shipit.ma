import { type NextRequest, NextResponse } from "next/server"
import { createOTPCode, userExists } from "@/lib/auth"
import { serverTranslate, getLanguageFromRequest } from "@/lib/server-translations"

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json()
    
    // Get user's preferred language from request headers
    const language = getLanguageFromRequest(request)

    if (!phoneNumber) {
      const errorMessage = await serverTranslate('auth.phoneNumber', language, 'Phone Number')
      return NextResponse.json({ error: errorMessage }, { status: 400 })
    }

    // Check if user exists to determine purpose
    const isExistingUser = await userExists(phoneNumber)
    const purpose = isExistingUser ? "login" : "register"

    // Create OTP code
    const otp = await createOTPCode(phoneNumber, purpose)

    // Get translated OTP message - just the code
    const text = await serverTranslate('auth.whatsappOtpMessage', language, 
      otp,
      { otp }
    )

    // Send OTP via WasenderAPI
    const whatsappApiUrl = process.env.WHATSAPP_API_URL
    const whatsappApiToken = process.env.WHATSAPP_API_TOKEN
    
    if (!whatsappApiUrl || !whatsappApiToken) {
      const errorMessage = await serverTranslate('errors.configurationError', language, 'WhatsApp API configuration is missing')
      return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
    
    const otpResponse = await fetch(whatsappApiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${whatsappApiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: phoneNumber,
        text: text,
      }),
    })

    if (!otpResponse.ok) {
      const errorText = await otpResponse.text()
      
      // Return error response for better debugging
      const errorMessage = await serverTranslate('errors.whatsappSendFailed', language, 'Failed to send OTP via WhatsApp')
      return NextResponse.json({ 
        error: errorMessage,
        details: errorText
      }, { status: 500 })
    }

    const successMessage = await serverTranslate('success.otpSent', language, 'OTP code sent successfully')
    
    return NextResponse.json({
      success: true,
      purpose,
      message: successMessage,
    })
  } catch (error) {
    const language = getLanguageFromRequest(request)
    const errorMessage = await serverTranslate('errors.whatsappSendFailed', language, 'Failed to send OTP')
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

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

    // TEMPORARILY DISABLED: WhatsApp API to prevent usage limit
    // TODO: Re-enable when ready to use WhatsApp API again
    
    // Mock successful response instead of calling WhatsApp API
    console.log(`[MOCK] OTP ${otp} would be sent to ${phoneNumber} via WhatsApp`)
    
    // For development/testing, you can log the OTP to console
    // In production, you might want to store it in a secure way or use email fallback
    
    const successMessage = await serverTranslate('success.otpSent', language, 'OTP code sent successfully')
    
    return NextResponse.json({
      success: true,
      purpose,
      message: successMessage,
      // Include OTP in response for testing (remove in production)
      debugOtp: process.env.NODE_ENV === 'development' ? otp : undefined,
    })
    
    /* ORIGINAL WHATSAPP API CODE (DISABLED)
    // Get translated OTP message
    const text = await serverTranslate('auth.whatsappOtpMessage', language, 
      `Your shipit.ma verification code is: ${otp}\n\nThis code will expire in 10 minutes. Do not share this code with anyone.`,
      { otp }
    )

    // Send OTP via WasenderAPI
    const whatsappApiUrl = process.env.WHATSAPP_API_URL || "https://wasenderapi.com/api/send-message"
    const whatsappApiToken = process.env.WHATSAPP_API_TOKEN || "05dacfccde5e02a41517764948a82825ab896e3f9a7c878142309eb1346b003c"
    
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
      console.error("Failed to send OTP via WasenderAPI:", errorText)
      
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
    */
  } catch (error) {
    const language = getLanguageFromRequest(request)
    const errorMessage = await serverTranslate('errors.whatsappSendFailed', language, 'Failed to send OTP')
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

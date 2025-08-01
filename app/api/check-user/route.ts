import { type NextRequest, NextResponse } from "next/server"
import { userExists } from "@/lib/auth"
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

    const exists = await userExists(phoneNumber)

    return NextResponse.json({
      success: true,
      exists,
    })
  } catch (error) {
    const language = getLanguageFromRequest(request)
    const errorMessage = await serverTranslate('errors.userCheckFailed', language, 'Failed to check user')
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
} 
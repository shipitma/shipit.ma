import { type NextRequest, NextResponse } from "next/server"
import {
  createNeonUser,
  getNeonUserByPhone,
} from "@/lib/auth"
import { serverTranslate, getLanguageFromRequest } from "@/lib/server-translations"

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, firstName, lastName, phoneVerified = false } = await request.json()
    
    // Get user's preferred language from request headers
    const language = getLanguageFromRequest(request)

    if (!phoneNumber || !firstName || !lastName) {
      const errorMessage = await serverTranslate('errors.incompleteRegistration', language, 'Incomplete registration data')
      return NextResponse.json({ error: errorMessage }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await getNeonUserByPhone(phoneNumber)
    if (existingUser) {
      const errorMessage = await serverTranslate('errors.userExists', language, 'User already exists')
      return NextResponse.json({ error: errorMessage }, { status: 409 })
    }

    // Create user with Neon Auth (basic info only)
    const userId = await createNeonUser({
      phoneNumber,
      firstName,
      lastName,
      email: undefined,
      addressLine: "",
      city: "",
      state: undefined,
      zip: undefined,
      country: "Morocco",
    })

    return NextResponse.json({
      success: true,
      userId,
      user: {
        id: userId,
        phoneNumber,
        firstName,
        lastName,
        email: null,
        phoneVerified: false,
        emailVerified: false,
      },
    })
  } catch (error) {
    const language = getLanguageFromRequest(request)
    const errorMessage = await serverTranslate('errors.registrationFailed', language, 'User registration failed')
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

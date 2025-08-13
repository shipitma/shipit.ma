import { type NextRequest, NextResponse } from "next/server"
import { getNeonUserByPhone, updateNeonUser } from "@/lib/auth"
import { serverTranslate, getLanguageFromRequest } from "@/lib/server-translations"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { firstName, lastName, email, addressLine, city, state, zip, country } = await request.json()
    const language = getLanguageFromRequest(request)

    if (!firstName || !lastName) {
      const errorMessage = await serverTranslate('errors.incompleteData', language, 'First name and last name are required')
      return NextResponse.json({ error: errorMessage }, { status: 400 })
    }

    // Update user with new information
    const updatedUser = await updateNeonUser(id, {
      firstName,
      lastName,
      email: email || null,
      addressLine: addressLine || null,
      city: city || null,
      state: state || null,
      zip: zip || null,
      country: country || "Morocco",
    })

    if (!updatedUser) {
      const errorMessage = await serverTranslate('errors.userNotFound', language, 'User not found')
      return NextResponse.json({ error: errorMessage }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        phoneNumber: updatedUser.phone_number,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        email: updatedUser.email,
        addressLine: updatedUser.address_line,
        city: updatedUser.city,
        state: updatedUser.state,
        zip: updatedUser.zip,
        country: updatedUser.country,
        phoneVerified: updatedUser.phone_verified,
        emailVerified: updatedUser.email_verified,
      },
    })
  } catch (error) {
    const language = getLanguageFromRequest(request)
    const errorMessage = await serverTranslate('errors.updateFailed', language, 'Failed to update user profile')
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

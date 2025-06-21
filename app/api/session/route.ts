import { type NextRequest, NextResponse } from "next/server"
import { getNeonUserById, validateNeonToken } from "@/lib/auth"
import { getCurrentUser } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")
    console.log("Session API - Token type:", token.startsWith("neon_") ? "Neon Auth" : "Phone Auth")

    // Handle Neon Auth tokens (start with "neon_")
    if (token.startsWith("neon_")) {
      const tokenValidation = await validateNeonToken(token)
      if (tokenValidation.valid && tokenValidation.userId) {
        const user = await getNeonUserById(tokenValidation.userId)
        if (user) {
          return NextResponse.json({
            id: user.id,
            phone_number: user.phone_number,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            address_line: user.address_line,
            city: user.city,
            state: user.state,
            zip: user.zip,
            country: user.country,
            phone_verified: user.phone_verified,
            email_verified: user.email_verified,
            created_at: user.created_at,
          })
        }
      }
    }

    // Handle phone auth sessions (hash format)
    const user = await getCurrentUser(token)
    if (user) {
      return NextResponse.json({
        id: user.id,
        phone_number: user.phone_number,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        address_line: user.address_line,
        city: user.city,
        state: user.state,
        zip: user.zip,
        country: user.country,
        phone_verified: true, // Phone auth users are verified
        email_verified: user.email ? true : false,
        created_at: user.created_at,
      })
    }

    return NextResponse.json({ error: "Invalid session" }, { status: 401 })
  } catch (error) {
    console.error("Error fetching user session:", error)
    return NextResponse.json({ error: "Failed to fetch user session" }, { status: 500 })
  }
}

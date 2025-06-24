import { type NextRequest, NextResponse } from "next/server"
import { validateNeonToken, getNeonUserById } from "@/lib/auth"
import { neon } from "@neondatabase/serverless"

function getDatabase() {
  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL
  if (!databaseUrl) {
    throw new Error("No database URL found")
  }
  return neon(databaseUrl)
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    
    // Validate the token
    const tokenValidation = await validateNeonToken(token)
    if (!tokenValidation.valid || !tokenValidation.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Check if the user is requesting their own data
    if (tokenValidation.userId !== id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const user = await getNeonUserById(id)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    
    // Validate the token
    const tokenValidation = await validateNeonToken(token)
    if (!tokenValidation.valid || !tokenValidation.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Check if the user is updating their own data
    if (tokenValidation.userId !== id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()
    const sql = getDatabase()

    // Get current user data to preserve unchanged fields
    const currentUser = await getNeonUserById(id)
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Update user data
    const [updatedUser] = await sql`
      UPDATE users 
      SET 
        first_name = ${body.first_name || currentUser.first_name},
        last_name = ${body.last_name || currentUser.last_name},
        email = ${body.email || currentUser.email || null},
        address_line = ${body.address_line || currentUser.address_line},
        city = ${body.city || currentUser.city},
        state = ${body.state || currentUser.state || null},
        zip = ${body.zip || currentUser.zip || null},
        country = ${body.country || currentUser.country},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

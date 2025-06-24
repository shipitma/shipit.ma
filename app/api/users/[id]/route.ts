import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/database"
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
    const sessionId = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!sessionId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const user = await getCurrentUser(sessionId)
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
    const sessionId = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!sessionId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const user = await getCurrentUser(sessionId)
    if (!user || user.id !== id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()
    const sql = getDatabase()

    // Update user data
    const [updatedUser] = await sql`
      UPDATE users 
      SET 
        first_name = ${body.first_name || user.first_name},
        last_name = ${body.last_name || user.last_name},
        email = ${body.email || user.email || null},
        address_line = ${body.address_line || user.address_line},
        city = ${body.city || user.city},
        state = ${body.state || user.state || null},
        zip = ${body.zip || user.zip || null},
        country = ${body.country || user.country},
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

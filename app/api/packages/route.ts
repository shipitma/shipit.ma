import { type NextRequest, NextResponse } from "next/server"
import { getPackages, getCurrentUserId, getNextPackageId } from "@/lib/database"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!sessionId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const userId = await getCurrentUserId(sessionId)
    if (!userId) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    const packages = await getPackages(userId)
    return NextResponse.json(packages)
  } catch (error) {
    console.error("Error fetching packages:", error)
    return NextResponse.json({ error: "Failed to fetch packages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionId = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!sessionId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const userId = await getCurrentUserId(sessionId)
    if (!userId) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    const body = await request.json()
    const { description, retailer, tracking_number, weight, dimensions, items, notes, attachments } = body

    // Generate incremental ID
    const packageId = await getNextPackageId()

    // Create the package
    await sql`
      INSERT INTO packages (
        id, user_id, description, status, tracking_number, weight, dimensions, retailer, created_at, updated_at
      ) VALUES (
        ${packageId}, ${userId}, ${description}, 'expected', ${tracking_number || null}, ${weight || null}, ${dimensions || null}, ${retailer}, NOW(), NOW()
      )
    `

    // Update attachments to link them to this package
    if (attachments && attachments.length > 0) {
      for (const attachment of attachments) {
        // Find attachment by URL and update its related_id
        await sql`
          UPDATE attachments 
          SET related_type = 'package', related_id = ${packageId}
          WHERE file_url = ${attachment.url} AND related_id IS NULL
        `
      }
    }

    // Add items to the package
    for (const item of items) {
      if (item.trim()) {
        await sql`
          INSERT INTO package_items (
            package_id, name, quantity
          ) VALUES (
            ${packageId}, ${item.trim()}, 1
          )
        `
      }
    }

    // Add initial timeline entry
    await sql`
      INSERT INTO package_timeline (
        package_id, status, date, time, completed, description
      ) VALUES (
        ${packageId}, 'expected', ${new Date().toISOString().split("T")[0]}, ${new Date().toTimeString().split(" ")[0]}, true, 'Colis ajouté'
      )
    `

    return NextResponse.json({ id: packageId, message: "Package created successfully" })
  } catch (error) {
    console.error("Error creating package:", error)
    return NextResponse.json({ error: "Failed to create package" }, { status: 500 })
  }
}

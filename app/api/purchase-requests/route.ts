import { type NextRequest, NextResponse } from "next/server"
import { getPurchaseRequests, getCurrentUserId, getNextPurchaseRequestId } from "@/lib/database"
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

    const purchaseRequests = await getPurchaseRequests(userId)
    return NextResponse.json(purchaseRequests)
  } catch (error) {
    console.error("Error fetching purchase requests:", error)
    return NextResponse.json({ error: "Failed to fetch purchase requests" }, { status: 500 })
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
    const { items, notes } = body

    // Generate incremental ID
    const requestId = await getNextPurchaseRequestId()

    // Create the purchase request
    await sql`
      INSERT INTO purchase_requests (
        id, user_id, date, status, total_amount, created_at, updated_at
      ) VALUES (
        ${requestId}, ${userId}, ${new Date().toISOString()}, 'pending_review', 0, NOW(), NOW()
      )
    `

    // Add items to the purchase request
    for (const item of items) {
      if (item.name.trim()) {
        const [insertedItem] = await sql`
          INSERT INTO purchase_request_items (
            purchase_request_id, name, url, quantity, variant, price
          ) VALUES (
            ${requestId}, ${item.name}, ${item.url || null}, ${item.quantity || 1}, ${item.variant || null}, 0
          ) RETURNING id
        `

        // Update attachments to link them to this item
        if (item.attachments && item.attachments.length > 0) {
          for (const attachment of item.attachments) {
            // Find attachment by URL and update its related_id
            await sql`
              UPDATE attachments 
              SET related_type = 'purchase_request_item', related_id = ${insertedItem.id.toString()}
              WHERE file_url = ${attachment.url} AND related_id IS NULL
            `
          }
        }
      }
    }

    // Add initial timeline entry
    await sql`
      INSERT INTO purchase_request_timeline (
        purchase_request_id, status, date, time, completed, description
      ) VALUES (
        ${requestId}, 'pending_review', ${new Date().toISOString().split("T")[0]}, ${new Date().toTimeString().split(" ")[0]}, true, 'Demande soumise'
      )
    `

    return NextResponse.json({ id: requestId, message: "Purchase request created successfully" })
  } catch (error) {
    console.error("Error creating purchase request:", error)
    return NextResponse.json({ error: "Failed to create purchase request" }, { status: 500 })
  }
}

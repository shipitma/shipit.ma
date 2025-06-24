import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getCurrentUserId } from "@/lib/database"

function getDatabase() {
  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL
  if (!databaseUrl) {
    throw new Error("No database URL found")
  }
  return neon(databaseUrl)
}

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

    // Get status filter from query parameters
    const { searchParams } = new URL(request.url)
    const statusFilter = searchParams.get("status") || "all"

    const sql = getDatabase()

    // First, let's check if the table exists
    try {
      await sql`SELECT 1 FROM payment_requests LIMIT 1`
    } catch (error) {
      return NextResponse.json({ error: "Payment system not initialized" }, { status: 500 })
    }

    // Build the WHERE clause for status filtering
    const statusCondition = statusFilter && statusFilter !== "all" ? sql`AND status = ${statusFilter}` : sql``

    // Get payment requests - simplified query first
    let payments
    try {
      payments = await sql`
        SELECT 
          id,
          user_id,
          type,
          related_id,
          amount,
          due_date,
          status,
          paid_date,
          receipt_url,
          payment_methods,
          created_at,
          updated_at
        FROM payment_requests 
        WHERE user_id = ${userId} ${statusCondition}
        ORDER BY created_at DESC
      `
    } catch (error) {
      return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 })
    }

    // Process each payment
    const processedPayments = []
    for (const payment of payments) {
      try {
        // Handle payment_methods
        let paymentMethods = []
        if (payment.payment_methods) {
          if (typeof payment.payment_methods === "string") {
            try {
              paymentMethods = JSON.parse(payment.payment_methods)
            } catch {
              paymentMethods = []
            }
          } else if (Array.isArray(payment.payment_methods)) {
            paymentMethods = payment.payment_methods
          }
        }

        // Get breakdown - with error handling
        const breakdown = {}
        try {
          const breakdownResult = await sql`
            SELECT item_key, item_value 
            FROM payment_breakdowns 
            WHERE payment_request_id = ${payment.id}
          `

          breakdownResult.forEach((item: any) => {
            breakdown[item.item_key] = Number(item.item_value) || 0
          })
        } catch (error) {
          // Continue without breakdown
        }

        processedPayments.push({
          ...payment,
          payment_methods: paymentMethods,
          breakdown: breakdown,
        })
      } catch (error) {
        // Add payment with minimal data
        processedPayments.push({
          ...payment,
          payment_methods: [],
          breakdown: {},
        })
      }
    }

    return NextResponse.json(processedPayments)
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

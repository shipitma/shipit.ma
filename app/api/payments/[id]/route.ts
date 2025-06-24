import { type NextRequest, NextResponse } from "next/server"
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
    const sql = getDatabase()

    // Get payment request
    const [payment] = await sql`
      SELECT * FROM payment_requests WHERE id = ${id}
    `

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    // Get breakdown
    const breakdown = await sql`
      SELECT item_key, item_value FROM payment_breakdowns 
      WHERE payment_request_id = ${id}
    `

    // Build breakdown object
    payment.breakdown = {}
    breakdown.forEach((item: any) => {
      payment.breakdown[item.item_key] = Number(item.item_value)
    })

    // Payment methods are now stored as an array column
    payment.payment_methods = payment.payment_methods || []

    return NextResponse.json(payment)
  } catch (error) {
    console.error("Error fetching payment:", error)
    return NextResponse.json({ error: "Failed to fetch payment" }, { status: 500 })
  }
}

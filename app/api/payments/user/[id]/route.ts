import { NextRequest, NextResponse } from "next/server"
import { getCurrentUserId, getPaymentById } from "@/lib/database"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = await getCurrentUserId(sessionId)
    if (!userId) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    const payment = await getPaymentById(params.id)
    
    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    // Ensure user can only access their own payments
    if (payment.user_id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json(payment)
  } catch (error) {
    console.error("Error fetching payment:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 
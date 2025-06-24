import { type NextRequest, NextResponse } from "next/server"
import { getPurchaseRequestById } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const purchaseRequest = await getPurchaseRequestById(id)

    if (!purchaseRequest) {
      return NextResponse.json({ error: "Purchase request not found" }, { status: 404 })
    }

    return NextResponse.json(purchaseRequest)
  } catch (error) {
    console.error("Error fetching purchase request:", error)
    return NextResponse.json({ error: "Failed to fetch purchase request" }, { status: 500 })
  }
}

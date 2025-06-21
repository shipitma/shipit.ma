import { type NextRequest, NextResponse } from "next/server"
import { getPurchaseRequestById } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const purchaseRequest = await getPurchaseRequestById(params.id)

    if (!purchaseRequest) {
      return NextResponse.json({ error: "Purchase request not found" }, { status: 404 })
    }

    return NextResponse.json(purchaseRequest)
  } catch (error) {
    console.error("Error fetching purchase request:", error)
    return NextResponse.json({ error: "Failed to fetch purchase request" }, { status: 500 })
  }
}

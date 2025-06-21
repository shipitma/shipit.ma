import { type NextRequest, NextResponse } from "next/server"
import { getPackageById } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const packageData = await getPackageById(params.id)

    if (!packageData) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 })
    }

    return NextResponse.json(packageData)
  } catch (error) {
    console.error("Error fetching package:", error)
    return NextResponse.json({ error: "Failed to fetch package" }, { status: 500 })
  }
}

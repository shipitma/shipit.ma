import { type NextRequest, NextResponse } from "next/server"
import { userExists } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json()

    if (!phoneNumber) {
      return NextResponse.json({ error: "Numéro de téléphone requis" }, { status: 400 })
    }

    const exists = await userExists(phoneNumber)

    return NextResponse.json({
      success: true,
      exists,
    })
  } catch (error) {
    return NextResponse.json({ error: "Échec de la vérification de l'utilisateur" }, { status: 500 })
  }
} 
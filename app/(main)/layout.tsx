import type React from "react"
import AuthenticatedLayout from "@/components/layout/authenticated-layout"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shipit - Tableau de Bord",
  description: "Gérez vos achats en Turquie et vos expéditions vers le Maroc",
  keywords: "tableau de bord, achats Turquie, expéditions Maroc, gestion colis",
  generator: "Shipit",
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>
} 
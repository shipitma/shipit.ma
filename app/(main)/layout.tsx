import type React from "react"
import AuthenticatedLayout from "@/components/layout/authenticated-layout"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Package Forwarding Dashboard",
  description: "Morocco to Turkey package forwarding service",
  generator: "v0.dev",
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>
} 
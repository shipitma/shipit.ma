"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import MainLayout from "@/components/layout/main-layout"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      router.push("/login")
    }
  }, [router])

  return <MainLayout>{children}</MainLayout>
}

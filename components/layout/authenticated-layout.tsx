"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import MainLayout from "@/components/layout/main-layout"

// Define public routes that don't require authentication
const publicRoutes = ['/login', '/register', '/verify', '/']

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    const isPublicRoute = publicRoutes.includes(pathname)
    
    if (!token && !isPublicRoute) {
      router.push("/login")
    }
  }, [router, pathname])

  // For public routes, render children directly without MainLayout
  if (publicRoutes.includes(pathname)) {
    return <>{children}</>
  }

  // For protected routes, use MainLayout
  return <MainLayout>{children}</MainLayout>
} 
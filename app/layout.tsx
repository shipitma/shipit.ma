import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/lib/auth-context"
import { PostHogProvider } from "@/components/posthog-provider"
import AuthenticatedLayout from "@/components/layout/authenticated-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Package Forwarding Dashboard",
  description: "Morocco to Turkey package forwarding service",
    generator: 'v0.dev'
}

// Define public routes that don't require authentication
const publicRoutes = ['/login', '/register', '/verify', '/']

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <PostHogProvider>
              <AuthenticatedLayout>
            {children}
              </AuthenticatedLayout>
            </PostHogProvider>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

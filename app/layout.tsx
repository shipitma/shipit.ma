import type React from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/lib/auth-context"
import { PostHogProvider } from "@/components/posthog-provider"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shipit - Vos Achats Mondiaux au Maroc, Simplifiés",
  description:
    "Accédez aux meilleures marques des USA, Turquie, Espagne et France. Nous gérons tout, de l'achat à la livraison directe à votre porte au Maroc. Oubliez les tracas, vivez l'expérience shopping sans frontières !",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <PostHogProvider>
              {children}
            </PostHogProvider>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

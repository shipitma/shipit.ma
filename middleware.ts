import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Rate limiting store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function middleware(request: NextRequest) {
  // Rate limiting for OTP endpoints
  if (request.nextUrl.pathname.startsWith("/api/send-otp") || request.nextUrl.pathname.startsWith("/api/verify-otp")) {
    const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown"
    const now = Date.now()
    const windowMs = 15 * 60 * 1000 // 15 minutes
    const maxRequests = 5

    const key = `rate_limit:${ip}`
    const current = rateLimitStore.get(key)

    if (!current || now > current.resetTime) {
      rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
    } else if (current.count >= maxRequests) {
      return NextResponse.json({ error: "Trop de tentatives. Réessayez dans 15 minutes." }, { status: 429 })
    } else {
      current.count++
    }
  }

  // Security headers
  const response = NextResponse.next()

  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("X-XSS-Protection", "1; mode=block")

  return response
}

export const config = {
  matcher: ["/api/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
}

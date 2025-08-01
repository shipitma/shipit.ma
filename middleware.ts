import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Auth pages that should redirect authenticated users to dashboard
const authPages = ["/login", "/register", "/verify", "/register/complete"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if user is accessing an auth page
  const isAuthPage = authPages.some(page => pathname === page)
  
  if (isAuthPage) {
    // Check for authentication tokens
    const authToken = request.cookies.get("authToken")?.value
    const accessToken = request.cookies.get("accessToken")?.value
    
    // If user has valid tokens, redirect to dashboard
    if (authToken || accessToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  // Rate limiting removed for now - will be added back later
  // TODO: When adding rate limiting back, use translated error messages:
  // const language = getLanguageFromRequest(request)
  // const errorMessage = await serverTranslate('errors.rateLimitExceeded', language, 'Too many attempts')
  // return NextResponse.json({ error: errorMessage }, { status: 429 })

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

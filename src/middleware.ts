import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getSecurityHeaders } from "@/lib/middleware/security-headers"
import { rateLimit } from "@/lib/rate-limit"

// Initialize rate limiter (100 requests per minute per IP)
const limiter = rateLimit({
    interval: 60 * 1000, // 60 seconds
    uniqueTokenPerInterval: 500, // Max 500 users per second
})

export async function middleware(request: NextRequest) {
    const session = await auth()
    const { pathname } = request.nextUrl
    const isLoggedIn = !!session?.user

    // 1. Protect /client routes (formerly /dashboard)
    // Admins should not access client routes - redirect them to admin
    if (pathname.startsWith('/client')) {
        if (!isLoggedIn) {
            const url = new URL('/login', request.url)
            url.searchParams.set('callbackUrl', pathname)
            return NextResponse.redirect(url)
        }
        // Redirect admins away from client routes
        if (session?.user?.role === 'ADMIN') {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url))
        }
    }

    // Redirect legacy /dashboard based on role
    if (pathname.startsWith('/dashboard')) {
        if (isLoggedIn && session?.user?.role === 'ADMIN') {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url))
        }
        return NextResponse.redirect(new URL('/client', request.url))
    }

    // 2. Protect /admin routes
    if (pathname.startsWith('/admin')) {
        // Check if user is logged in
        if (!isLoggedIn) {
            // If trying to access admin login page, let them through
            if (pathname === '/admin/login') {
                return NextResponse.next()
            }
            const url = new URL('/admin/login', request.url)
            url.searchParams.set('callbackUrl', pathname)
            return NextResponse.redirect(url)
        }

        // Check if user has admin role
        if (session?.user?.role !== 'ADMIN') {
            // Redirect to client dashboard if logged in but not admin
            return NextResponse.redirect(new URL('/client', request.url))
        }
    }

    // 3. Redirect logged-in users away from auth pages
    if (isLoggedIn) {
        if (pathname === '/login' || pathname === '/register') {
            // Redirect based on role
            if (session?.user?.role === 'ADMIN') {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url))
            } else {
                return NextResponse.redirect(new URL('/client', request.url))
            }
        }
        if (pathname === '/admin/login') {
            if (session?.user?.role === 'ADMIN') {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url))
            } else {
                // Non-admins trying to access admin login should go to client dashboard
                return NextResponse.redirect(new URL('/client', request.url))
            }
        }
    }

    // 4. Rate Limiting for API routes
    if (pathname.startsWith('/api')) {
        const hostname = request.nextUrl.hostname
        const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1'
        const bypassRateLimit = isLocalhost || process.env.NODE_ENV !== 'production' || process.env.DISABLE_RATE_LIMIT === 'true'

        if (!bypassRateLimit) {
            const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1'
            const limit = pathname.startsWith('/api/auth') ? 30 : 100
            try {
                await limiter.check(limit, ip)
            } catch {
                return NextResponse.json(
                    { error: 'Rate limit exceeded' },
                    { status: 429 }
                )
            }
        }
    }

    // 5. Apply security headers to all responses
    const response = NextResponse.next()
    const securityHeaders = getSecurityHeaders()

    Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
    })

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files (images, etc)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|gif|png|svg|webp)).*)',
    ],
}

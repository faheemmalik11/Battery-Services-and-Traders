import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('firebaseAuthToken')?.value
    const isLoggedIn = !!token

    const isCMSPath = request.nextUrl.pathname.startsWith('/cms')
    const isLoginPath = request.nextUrl.pathname === '/cms/login'

    // Redirect to login if accessing CMS without auth
    if (isCMSPath && !isLoggedIn && !isLoginPath) {
        return NextResponse.redirect(new URL('/cms/login', request.url))
    }

    // Redirect to dashboard if already logged in and trying to access login
    if (isLoginPath && isLoggedIn) {
        return NextResponse.redirect(new URL('/cms/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/cms/:path*']
}
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { UserUnsafeMetadata } from '@/types/user-metadata'

type PermissionKey = keyof Pick<
  UserUnsafeMetadata, 
  'canAccessResearch' | 'canAccessSignals'
>

// Type for the session with our custom metadata
type SessionWithCustomClaims = {
  userId?: string
  sessionClaims?: {
    publicMetadata?: Partial<UserUnsafeMetadata>
    unsafeMetadata?: UserUnsafeMetadata
  }
}

// Define route matchers for protected routes
const isResearchRoute = createRouteMatcher(['/research(.*)'])
const isSignalsRoute = createRouteMatcher(['/signals(.*)'])
const isAuthRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)'])
const isPublicRoute = createRouteMatcher([
  '/',
  '/api(.*)',
  '/_next(.*)',
  '/favicon.ico',
  '/unauthorized',
])

export default clerkMiddleware(async (auth, req) => {
  const session = (await auth()) as SessionWithCustomClaims
  const userId = session?.userId
  const sessionClaims = session?.sessionClaims
  const url = new URL(req.url)
  const path = url.pathname

  // Handle public routes - allow access to everyone
  if (isPublicRoute(req)) {
    return NextResponse.next()
  }

  // Handle authentication routes
  if (isAuthRoute(req)) {
    // If user is already signed in and hits auth routes, redirect to home
    if (userId) {
      return NextResponse.redirect(new URL('/', req.url))
    }
    return NextResponse.next()
  }

  // Handle unauthorized access - must be after public and auth routes
  if (!userId) {
    const signInUrl = new URL('/sign-in', req.url)
    signInUrl.searchParams.set('redirect_url', path)
    return NextResponse.redirect(signInUrl)
  }

  // Check route-specific permissions
  if (isResearchRoute(req) || isSignalsRoute(req)) {
    const requiredPermission: PermissionKey = isResearchRoute(req) ? 'canAccessResearch' : 'canAccessSignals'
    const hasPermission = 
      sessionClaims?.publicMetadata?.[requiredPermission] === true ||
      sessionClaims?.unsafeMetadata?.[requiredPermission] === true
    
    if (!hasPermission) {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|json|woff|woff2|ttf|eot)$).*)',
  ],
}
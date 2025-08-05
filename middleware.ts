import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = ['/sign-in(.*)', '/sign-up(.*)', '/api(.*)'];
const isPublicRoute = createRouteMatcher(publicRoutes);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  // Handle public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Get user session
  const { userId, sessionClaims } = await auth();
  
  // Redirect to sign-in if not authenticated
  if (!userId) {
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Handle role-based access control
  const metadata = (sessionClaims?.publicMetadata as {
    canAccessProducts?: boolean;
    canAccessResearch?: boolean;
  }) || {};

  // Product page access control
  if (req.nextUrl.pathname.startsWith('/products') && !metadata.canAccessProducts) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Research page access control
  if (req.nextUrl.pathname.startsWith('/research') && !metadata.canAccessResearch) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!.*\\.|_next).*)', // Match all routes except static files and _next
    '/',
    '/(api|trpc)(.*)'
  ],
};
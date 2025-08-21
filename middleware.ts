import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = ['/sign-in(.*)', '/sign-up(.*)', '/api(.*)', '/', '/payment-required', '/studio(.*)'];
const isPublicRoute = createRouteMatcher(publicRoutes);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  const { userId, sessionClaims } = await auth();
  
  if (!userId) {
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
  }

  const metadata = (sessionClaims?.publicMetadata as {
    canAccessProducts?: boolean;
    canAccessResearch?: boolean;
    isPremium?: boolean;
  }) || {};

  // Only check Clerk metadata - no database calls in middleware
  if (req.nextUrl.pathname.startsWith('/products') || 
      req.nextUrl.pathname.startsWith('/research')) {
    
        if (!metadata.isPremium) {
          return NextResponse.redirect(new URL('/payment-required', req.url));
        }
      }

  if (req.nextUrl.pathname.startsWith('/products') && !metadata.canAccessProducts) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (req.nextUrl.pathname.startsWith('/research') && !metadata.canAccessResearch) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!.*\\.|_next).*)',
    '/',
    '/(api|trpc)(.*)'
  ],
};
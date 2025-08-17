import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import rateLimit from '@/lib/rate-limit';
import { getUserSuccessfulPayments } from '@/lib/boomfi';
import prisma from '@/lib/prisma'; // Import the shared instance

// Rate limiting: 10 requests per minute per IP
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500, // Max 500 users per interval
});

interface UserProfileResult {
  id: string;
  isPremium: boolean;
  paymentStatus: string | null;
  lastPaymentDate: Date | null;
  boomFiCustomerId?: string | null;
}

export async function GET(req: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    
    // Apply rate limiting with a mock response
    const mockRes = new NextResponse();
    const rateLimitResult = await limiter.check(mockRes, 10, ip); // 10 requests per minute
    
    if (rateLimitResult.isRateLimited) {
      return new NextResponse(
        JSON.stringify({
          error: 'Too many requests',
          message: 'Rate limit exceeded',
          retryAfter: 60,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'Retry-After': '60',
          },
        }
      );
    }

    // Get user ID from Clerk
    const { userId } = getAuth(req);
    if (!userId) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get query parameters
    const searchParams = new URL(req.url).searchParams;
    let customerId = searchParams.get('customerId');
    const since = searchParams.get('since');

    if (!customerId) {
      return new NextResponse(
        JSON.stringify({ error: 'Customer ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Find user in database
    let user: UserProfileResult | null = await prisma.user.findUnique({
      where: { 
        boomFiCustomerId: customerId
      },
      select: { 
        id: true,
        isPremium: true,
        paymentStatus: true,
        lastPaymentDate: true
      }
    });

    // If not found, try clerkUserId
    if (!user) {
      const userByClerkId = await prisma.user.findUnique({
        where: { 
          clerkUserId: customerId
        },
        select: { 
          id: true,
          isPremium: true,
          paymentStatus: true,
          lastPaymentDate: true,
          boomFiCustomerId: true
        }
      });
      
      if (userByClerkId) {
        user = userByClerkId;
        // If we found by clerkUserId but not boomFiCustomerId, use the boomFiCustomerId if available
        if (userByClerkId.boomFiCustomerId) {
          customerId = userByClerkId.boomFiCustomerId;
        }
      }
    }

    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // If user is already premium, no need to check BoomFi
    // Prepare success response with rate limit headers
    if (user.isPremium) {
      return new NextResponse(
        JSON.stringify({
          hasRecentPayments: true,
          isPremium: true,
          lastPaymentDate: user.lastPaymentDate?.toISOString()
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        }
      );
    }

    // Check BoomFi for recent payments (last 5 minutes by default)
    const sinceDate = new Date(since || 0);
    let hasRecentPayments = false;
    
    try {
      const payments = await getUserSuccessfulPayments(customerId);
      const recentPayments = payments.filter((payment: any) => 
        new Date(payment.createdAt) > sinceDate
      );
      hasRecentPayments = recentPayments.length > 0;
    } catch (error) {
      console.error('Error checking BoomFi payments:', error);
      // Continue with hasRecentPayments = false
    }
    
    // Update user status if payment is found
    if (hasRecentPayments && user) {
      await prisma.user.update({
        where: { 
          id: user.id
        },
        data: { 
          isPremium: true,
          paymentStatus: 'active',
          lastPaymentDate: new Date()
        }
      });
    }

    return new NextResponse(
      JSON.stringify({ 
        hasRecentPayments,
        isPremium: hasRecentPayments || user.isPremium,
        lastPaymentDate: hasRecentPayments ? new Date().toISOString() : user.lastPaymentDate?.toISOString()
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
    
  } catch (error: any) {
    if (error.message === 'Rate limit exceeded') {
      return new NextResponse(
        JSON.stringify({ 
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.'
        }), 
        { 
          status: 429,
          headers: { 
            'Content-Type': 'application/json',
            'Retry-After': '60'
          }
        }
      );
    }
    
    console.error('Payment check failed:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Payment check failed',
        message: error.message || 'An unexpected error occurred'
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
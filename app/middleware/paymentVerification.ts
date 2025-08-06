import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { getUserActiveSubscription } from '@/lib/boomfi';

export async function paymentMiddleware(req: NextRequest) {
  const { userId } = getAuth(req);
  
  if (!userId) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  // Get user from Prisma
  const userProfile = await prisma.userProfile.findUnique({
    where: { clerkUserId: userId }
  });

  // Skip verification if user is already premium
  if (userProfile?.isPremium) return NextResponse.next();

  // Verify payment status if BoomFi customer exists
  if (userProfile?.boomFiCustomerId) {
    try {
      // Check for active subscription
      const activeSubscription = await getUserActiveSubscription(userProfile.boomFiCustomerId);
      
      // Check for successful one-time payments
      const successfulPayments = await getUserSuccessfulPayments(userProfile.boomFiCustomerId);
      const hasSuccessfulPayment = successfulPayments.length > 0;

      if (activeSubscription || hasSuccessfulPayment) {
        // Update user status
        await prisma.userProfile.update({
          where: { id: userProfile.id },
          data: {
            isPremium: true,
            lastPaymentDate: new Date(),
            subscriptionId: activeSubscription?.id || null,
            paymentStatus: 'active'
          }
        });
        
        return NextResponse.next();
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
    }
  }

  // Redirect to payment page if no valid payment found
  return NextResponse.redirect(new URL('/payment-required', req.url));
}

export const config = {
  matcher: ['/products', '/research', '/premium-content'],
};
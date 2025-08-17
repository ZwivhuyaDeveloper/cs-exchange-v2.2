import prisma from '@/lib/prisma';
import { 
  getUserActiveSubscription, 
  getUserSuccessfulPayments 
} from '@/lib/boomfi';

export async function checkUserPaymentStatus(clerkUserId: string) {
  // Fetch only necessary fields to ensure type safety
  const userProfile = await prisma.user.findUnique({
    where: { clerkUserId },
    select: {
      id: true,
      isPremium: true,
      boomFiCustomerId: true
    }
  });

  if (!userProfile) return false;
  if (userProfile.isPremium) return true;

  try {
    // Check BoomFi directly for payment status
    if (userProfile.boomFiCustomerId) {
      const activeSubscription = await getUserActiveSubscription(userProfile.boomFiCustomerId);
      const payments = await getUserSuccessfulPayments(userProfile.boomFiCustomerId);
      
      if (activeSubscription || (payments && payments.length > 0)) {
        // Update local status
        await prisma.user.update({
          where: { id: userProfile.id },
          data: { isPremium: true }
        });
        return true;
      }
    }
  } catch (error) {
    console.error('Payment status check failed:', error);
  }
  
  return false;
}
import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { clerkClient } from '@clerk/nextjs/server'
import { verifyBoomFiWebhook } from '@/lib/boomfi'

export async function POST(req: NextRequest) {
  const isValid = await verifyBoomFiWebhook(req)
  if (!isValid) {
    return new Response('Invalid signature', { status: 401 })
  }

  const event = await req.json()

  // Handle payment success
  if (event.type === 'payment.succeeded') {
    const { customer, amount, currency, id: paymentId } = event.data
    
    // Find user by BoomFi customer ID
    const userProfile = await prisma.userProfile.findUnique({
      where: { boomFiCustomerId: customer }
    })

    if (userProfile) {
      // Update user status - fixed type safety
      await prisma.userProfile.update({
        where: { id: userProfile.id },
        data: {
          isPremium: true,
          lastPaymentDate: new Date(),
          paymentStatus: 'active'
        }
      })

      // Update Clerk metadata
      await clerkClient.users.updateUserMetadata(userProfile.clerkUserId, {
        publicMetadata: { 
          ...userProfile.publicMetadata,
          isPremium: true 
        }
      })
    }
  }

  // Handle subscription events
  if (event.type === 'subscription.created' || event.type === 'subscription.updated') {
    const { customer, id: subscriptionId, status } = event.data
    
    const userProfile = await prisma.userProfile.findUnique({
      where: { boomFiCustomerId: customer }
    })

    if (userProfile) {
      const isActive = status === 'active'
      
      // Fixed type-safe update
      await prisma.userProfile.update({
        where: { id: userProfile.id },
        data: {
          isPremium: isActive,
          subscriptionId: subscriptionId,
          paymentStatus: status
        }
      })

      await clerkClient.users.updateUserMetadata(userProfile.clerkUserId, {
        publicMetadata: { 
          ...userProfile.publicMetadata,
          isPremium: isActive 
        }
      })
    }
  }

  return new Response('Webhook received', { status: 200 })
}


import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { createBoomFiCustomer } from '@/lib/boomfi'
import { clerkClient } from '@clerk/nextjs/server'

export async function POST(req: Request) {
  const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
  
  if (!CLERK_WEBHOOK_SECRET) {
    return new Response('CLERK_WEBHOOK_SECRET not configured', { status: 500 })
  }

  const headerPayload = await headers()
  const svixId = headerPayload.get('svix-id')
  const svixTimestamp = headerPayload.get('svix-timestamp')
  const svixSignature = headerPayload.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response('Missing required headers', { status: 400 })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)

  const wh = new Webhook(CLERK_WEBHOOK_SECRET)
  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent
  } catch (err) {
    return new Response('Invalid signature', { status: 400 })
  }

  // Handle user creation event
  if (evt.type === 'user.created') {
    try {
      // Extract user data
      const userId = evt.data.id
      const email = evt.data.email_addresses?.[0]?.email_address || ''
      const firstName = (evt.data as any).first_name || ''
      const lastName = (evt.data as any).last_name || ''
      
      // Create user in Prisma
      const userProfile = await prisma.userProfile.create({
        data: {
          clerkUserId: userId,
          email: email,
          role: 'user',
          isPremium: false,
          paymentStatus: 'inactive'
        }
      });
      
      // Create customer in BoomFi
      try {
        const customer = await createBoomFiCustomer({
          email: email,
          name: `${firstName} ${lastName}`.trim(),
          metadata: { clerkUserId: userId }
        });
        
        // Update user with BoomFi customer ID
        await prisma.userProfile.update({
          where: { id: userProfile.id },
          data: { boomFiCustomerId: customer.id }
        });
      } catch (error: any) {
        console.error('Failed to create BoomFi customer:', error);
        // Continue even if BoomFi customer creation fails
      }

      console.log('User created with BoomFi ID:', userProfile.boomFiCustomerId);
      
      // Update Clerk metadata with user's premium status
      try {
        const clerkClientInstance = await clerkClient();
        await clerkClientInstance.users.updateUserMetadata(userId, {
          publicMetadata: {
            isPremium: true,
            lastUpdated: new Date().toISOString()
          }
        });
      } catch (error) {
        console.error('Failed to update Clerk metadata:', error);
        // Continue even if Clerk update fails
      }

      // Update Clerk metadata with default values
      await clerkClient.users.updateUser(userId, {
        publicMetadata: {
          ...(userProfile.publicMetadata || {}),
          boomFiCustomerId: userProfile.boomFiCustomerId,
          canAccessProducts: false,
          canAccessResearch: false,
          isPremium: false
        }
      })
    } catch (error: any) {
      console.error('User creation failed:', error);
      return new Response(`User creation failed: ${error.message}`, { status: 500 });
    }
  }

  return new Response('', { status: 200 })
}
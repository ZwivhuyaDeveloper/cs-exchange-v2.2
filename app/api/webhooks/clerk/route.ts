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
      
      // Create user in Prisma and BoomFi
      const userProfile = await (prisma.userProfile as any).createWithBoomFi({
        clerkUserId: userId,
        email,
        firstName,
        lastName
      });

      console.log('User created with BoomFi ID:', userProfile.boomFiCustomerId);
      
      // Update Clerk metadata with default values
      await clerkClient.users.updateUser(userId, {
        publicMetadata: {
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
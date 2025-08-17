'use server'

import { clerkClient } from '@clerk/nextjs/server' // Fixed import path
import prisma from '@/lib/prisma'

export async function updateUserRole(userId: string, role: string) {
  const clerk = await clerkClient();
  // Update Clerk metadata
  await clerk.users.updateUserMetadata(userId, {
    publicMetadata: { role }
  })
  
  // Update role in our database if needed
  await prisma.user.update({
    where: { clerkUserId: userId },
    data: { 
      role: role // Make sure your Prisma schema has a role field
    }
  })
}

export async function getPremiumStatus(userId: string) {

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      isPremium: true // Explicitly select the field
    }
  })
  
  return user?.isPremium || false
}
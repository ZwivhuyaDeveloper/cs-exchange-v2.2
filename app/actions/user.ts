'use server'

import { clerkClient } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

export async function updateUserRole(userId: string, role: string) {
  try {
    // Update Clerk metadata - CORRECTED API USAGE
    await clerkClient.users.updateUser(userId, {
      publicMetadata: { role }
    })
    
    // Update role in our database
    await prisma.userProfile.update({
      where: { clerkUserId: userId },
      data: { 
        role: role
      }
    })
    
    return { success: true, message: 'User role updated successfully' }
  } catch (error) {
    console.error('Error updating user role:', error)
    return { 
      success: false, 
      message: 'Failed to update user role', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

export async function getPremiumStatus(userId: string) {
  try {
    const user = await prisma.userProfile.findUnique({
      where: { clerkUserId: userId },
      select: {
        isPremium: true
      }
    })
    
    return user?.isPremium || false
  } catch (error) {
    console.error('Error getting premium status:', error)
    return false
  }
}
'use server';

import { clerkClient } from '@clerk/nextjs/server';

export async function updateUserMetadata(userId: string, metadata: any) {
  try {
    await (await clerkClient()).users.updateUser(userId, {
      publicMetadata: metadata
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating user metadata:', error);
    return { error: 'Failed to update permissions' };
  }
}
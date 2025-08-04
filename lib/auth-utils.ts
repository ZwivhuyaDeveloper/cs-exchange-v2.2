import type { UserUnsafeMetadata, UserRole, SubscriptionTier } from '@/types/user-metadata'
import { currentUser } from '@clerk/nextjs/server'

type UserWithMetadata = {
  id: string
  unsafeMetadata?: UserUnsafeMetadata | null
}

/**
 * Checks if the current user has the specified permission
 * @param permission - The permission to check (e.g., 'canAccessResearch')
 * @returns Promise<boolean>
 */
export async function hasPermission(permission: keyof UserUnsafeMetadata): Promise<boolean> {
  const user = await currentUser()
  if (!user) return false
  
  return user.unsafeMetadata?.[permission] === true
}

/**
 * Checks if the current user has the specified role
 * @param role - The role to check
 * @returns Promise<boolean>
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  const user = await currentUser()
  if (!user) return false
  
  return user.unsafeMetadata?.role === role
}

/**
 * Checks if the current user has the specified subscription tier or higher
 * @param tier - The minimum required subscription tier
 * @returns Promise<boolean>
 */
export async function hasSubscriptionTier(tier: SubscriptionTier): Promise<boolean> {
  const tierOrder: Record<SubscriptionTier, number> = {
    'free': 0,
    'basic': 1,
    'premium': 2,
    'enterprise': 3
  }
  
  const user = await currentUser()
  if (!user) return false
  
  const unsafeMetadata = (user.unsafeMetadata || {}) as Partial<UserUnsafeMetadata>;
  const userTier = unsafeMetadata.subscriptionTier || 'free'
  return tierOrder[userTier] >= tierOrder[tier]
}

/**
 * Get the user's unsafe metadata with proper typing
 * @param user - The user object from Clerk
 * @returns UserUnsafeMetadata with default values for required fields
 */
export function getUserMetadata(user: UserWithMetadata): UserUnsafeMetadata {
  const defaultMetadata: UserUnsafeMetadata = {
    role: 'user',
    createdAt: new Date().toISOString(),
    onboardingData: {
      timezone: 'UTC',
      riskTolerance: 'moderate',
      investmentGoals: [],
      tradingExperience: '',
      notificationPreferences: {
        sms: false,
        push: true,
        email: true
      },
      preferredCryptocurrencies: []
    },
    canAccessResearch: false,
    canAccessSignals: false,
    subscriptionTier: 'free',
    onboardingCompleted: false
  }
  
  return { ...defaultMetadata, ...user.unsafeMetadata }
}

/**
 * Client-side hook to check if a user has a specific permission
 * Must be used in a client component with the UserButton from Clerk
 */
export function useUserPermissions() {
  const checkPermission = async (permission: keyof UserUnsafeMetadata) => {
    try {
      const response = await fetch('/api/auth/check-permission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ permission }),
      })
      
      if (!response.ok) return false
      const res = await response.json()
      return res.hasPermission === true
    } catch (error) {
      console.error('Error checking permission:', error)
      return false
    }
  }

  return { hasAccess: checkPermission }
}

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface UserAccess {
  userId: string | null;
  role: 'user' | 'premium' | 'analyst' | 'admin';
  subscription: {
    tier: string;
    premiumAccess: boolean;
    features: string[];
  } | null;
  canAccess: {
    research: boolean;
    analysis: boolean;
    signals: boolean;
    premiumContent: boolean;
    analystContent: boolean;
    adminContent: boolean;
  };
}

export interface ContentAccess {
  accessLevel: 'public' | 'premium' | 'pro' | 'analyst' | 'admin';
  requiresSubscription: boolean;
  allowedRoles: string[];
}

export async function getUserAccess(userId: string | null): Promise<UserAccess> {

  if (!userId) {
    return {
      userId: null,
      role: 'user',
      subscription: null,
      canAccess: {
        research: true, // Public research is available
        analysis: false, // Analysis requires login
        signals: false, // Signals require login
        premiumContent: false,
        analystContent: false,
        adminContent: false,
      }
    };
  }

  try {
    // Get user role and subscription in parallel
    const [userRole, userSubscription] = await Promise.all([
      prisma.userRole.findUnique({
        where: { userId }
      }),
      prisma.userSubscription.findFirst({
        where: { userId, status: 'active' },
        include: { tier: true }
      })
    ]);

    const role = userRole?.role || 'user';
    const tier = userSubscription?.tier;

    return {
      userId,
      role: (role === 'admin' || role === 'analyst' || role === 'premium') ? role as 'user' | 'premium' | 'analyst' | 'admin' : 'user',
      subscription: tier ? {
        tier: tier.name,
        premiumAccess: tier.premiumAccess,
        features: tier.features,
      } : null,
      canAccess: {
        research: true, // All logged-in users can access research
        analysis: true, // All logged-in users can access analysis
        signals: true, // All logged-in users can access basic signals
        premiumContent: tier?.premiumAccess || role === 'admin' || role === 'analyst',
        analystContent: role === 'analyst' || role === 'admin',
        adminContent: role === 'admin',
      }
    };
  } catch (error) {
    console.error('Error getting user access:', error);
    // Return basic access on error
    return {
      userId,
      role: 'user',
      subscription: null,
      canAccess: {
        research: true,
        analysis: true,
        signals: true,
        premiumContent: false,
        analystContent: false,
        adminContent: false,
      }
    };
  }
}

export function canAccessContent(userAccess: UserAccess, contentAccess: ContentAccess): boolean {
  // Admin can access everything
  if (userAccess.role === 'admin') {
    return true;
  }

  // Check role-based access
  if (contentAccess.allowedRoles.includes(userAccess.role)) {
    return true;
  }

  // Check access level
  switch (contentAccess.accessLevel) {
    case 'public':
      return true;
    case 'premium':
      return userAccess.canAccess.premiumContent;
    case 'pro':
      return userAccess.canAccess.premiumContent && 
             (userAccess.subscription?.tier === 'Pro' || userAccess.role === 'analyst' || userAccess.role === 'admin');
    case 'analyst':
      return userAccess.canAccess.analystContent;
    case 'admin':
      return userAccess.canAccess.adminContent;
    default:
      return false;
  }
}

export function getContentAccessLevel(content: any): ContentAccess {
  // Default to public access
  let accessLevel: ContentAccess['accessLevel'] = 'public';
  let requiresSubscription = false;
  let allowedRoles: string[] = ['user', 'premium', 'analyst', 'admin'];

  // Check if content has premium flag or access level
  if (content.premium || content.accessLevel === 'premium') {
    accessLevel = 'premium';
    requiresSubscription = true;
    allowedRoles = ['premium', 'analyst', 'admin'];
  } else if (content.accessLevel === 'pro') {
    accessLevel = 'pro';
    requiresSubscription = true;
    allowedRoles = ['analyst', 'admin'];
  } else if (content.accessLevel === 'analyst') {
    accessLevel = 'analyst';
    requiresSubscription = false;
    allowedRoles = ['analyst', 'admin'];
  } else if (content.accessLevel === 'admin') {
    accessLevel = 'admin';
    requiresSubscription = false;
    allowedRoles = ['admin'];
  }

  return {
    accessLevel,
    requiresSubscription,
    allowedRoles,
  };
}

export interface AccessControlResult {
  hasAccess: boolean;
  reason?: string;
  upgradeRequired?: boolean;
  loginRequired?: boolean;
}

export function checkAccess(userAccess: UserAccess, contentAccess: ContentAccess): AccessControlResult {
  // Not logged in
  if (!userAccess.userId && contentAccess.accessLevel !== 'public') {
    return {
      hasAccess: false,
      reason: 'Login required to access this content',
      loginRequired: true,
    };
  }

  // Check if user can access content
  if (canAccessContent(userAccess, contentAccess)) {
    return { hasAccess: true };
  }

  // Determine why access was denied
  if (contentAccess.requiresSubscription && !userAccess.canAccess.premiumContent) {
    return {
      hasAccess: false,
      reason: 'Premium subscription required',
      upgradeRequired: true,
    };
  }

  if (contentAccess.accessLevel === 'analyst' && !userAccess.canAccess.analystContent) {
    return {
      hasAccess: false,
      reason: 'Analyst access required',
      upgradeRequired: true,
    };
  }

  if (contentAccess.accessLevel === 'admin' && !userAccess.canAccess.adminContent) {
    return {
      hasAccess: false,
      reason: 'Admin access required',
      upgradeRequired: false,
    };
  }

  return {
    hasAccess: false,
    reason: 'Insufficient permissions',
    upgradeRequired: false,
  };
}

// types/user-metadata.ts

// User roles in order of increasing privileges
export type UserRole = 'user' | 'researcher' | 'analyst' | 'admin';

// Subscription tiers
export type SubscriptionTier = 'free' | 'basic' | 'premium' | 'enterprise';

// Notification preferences
export type NotificationPreferences = {
  sms: boolean;
  push: boolean;
  email: boolean;
};

// Onboarding data
export type OnboardingData = {
  timezone: string;
  riskTolerance: 'low' | 'moderate' | 'high' | 'very high';
  investmentGoals: string[];
  tradingExperience: string;
  notificationPreferences: NotificationPreferences;
  preferredCryptocurrencies: string[];
  completed: boolean;
};

// Available permissions in the system
export type Permission = 
  // Dashboard
  | 'view_dashboard'
  // Research
  | 'view_research'
  | 'create_research'
  | 'edit_own_research'
  | 'edit_any_research'
  | 'delete_any_research'
  // Signals
  | 'view_signals'
  | 'create_signals'
  | 'edit_own_signals'
  | 'edit_any_signals'
  | 'delete_any_signals'
  // Administration
  | 'manage_users'
  | 'manage_roles'
  | 'manage_settings';

// User metadata stored in Clerk
export type UserUnsafeMetadata = {
  // Core identity
  role: UserRole;
  createdAt: string; // ISO date string
  updatedAt?: string; // ISO date string
  
  // Subscription
  subscriptionTier: SubscriptionTier;
  subscriptionExpiresAt?: string; // ISO date string
  
  // Features access
  features: {
    advancedCharting: boolean;
    apiAccess: boolean;
    prioritySupport: boolean;
    customAlerts: boolean;
  };
  
  // Onboarding
  onboarding: OnboardingData;
  
  // Additional metadata
  lastActiveAt?: string; // ISO date string
  loginCount?: number;
  
  // Deprecated fields (kept for backward compatibility)
  canAccessResearch?: boolean;
  canAccessSignals?: boolean;
  onboardingCompleted?: boolean;
  canAccessSpecialFeature?: boolean;
};

// Example usage
export const exampleUserMetadata: UserUnsafeMetadata = {
  role: 'user',
  createdAt: new Date().toISOString(),
  subscriptionTier: 'free',
  features: {
    advancedCharting: false,
    apiAccess: false,
    prioritySupport: false,
    customAlerts: false,
  },
  onboarding: {
    timezone: 'UTC',
    riskTolerance: 'moderate',
    investmentGoals: ['long_term_growth', 'portfolio_diversification'],
    tradingExperience: '1-3 years',
    notificationPreferences: {
      sms: false,
      push: true,
      email: true,
    },
    preferredCryptocurrencies: ['BTC', 'ETH'],
    completed: true,
  },
  lastActiveAt: new Date().toISOString(),
  loginCount: 1,
  canAccessResearch: true,
  canAccessSignals: true
};
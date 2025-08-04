// types/user-metadata.ts
export type NotificationPreferences = {
    sms: boolean
    push: boolean
    email: boolean
  }
  
  export type OnboardingData = {
    timezone: string
    riskTolerance: 'low' | 'moderate' | 'high' | 'very high'
    investmentGoals: string[]
    tradingExperience: string
    notificationPreferences: NotificationPreferences
    preferredCryptocurrencies: string[]
  }
  
  export type UserRole = 'user' | 'admin' | 'moderator' | 'analyst'
  export type SubscriptionTier = 'free' | 'basic' | 'premium' | 'enterprise'
  
  export type UserUnsafeMetadata = {
    role: UserRole
    createdAt: string // ISO date string
    onboardingData: OnboardingData
    canAccessResearch: boolean
    canAccessSignals: boolean
    subscriptionTier: SubscriptionTier
    onboardingCompleted: boolean
    canAccessSpecialFeature?: boolean
    // Add any additional fields as needed
  }
  
  // Example usage in your code:
  const exampleUserMetadata: UserUnsafeMetadata = {
    role: "user",
    createdAt: "2025-07-14T02:42:30.200Z",
    onboardingData: {
      timezone: "Africa/Johannesburg",
      riskTolerance: "moderate",
      investmentGoals: [
        "Portfolio diversification",
        "Short-term trading profits"
      ],
      tradingExperience: "",
      notificationPreferences: {
        sms: false,
        push: true,
        email: true
      },
      preferredCryptocurrencies: [
        "Bitcoin (BTC)",
        "Polkadot (DOT)",
        "Solana (SOL)",
        "Litecoin (LTC)",
        "Bitcoin Cash (BCH)"
      ]
    },
    canAccessResearch: true,
    canAccessSignals: true,
    subscriptionTier: "premium",
    onboardingCompleted: true,
    canAccessSpecialFeature: true
  }
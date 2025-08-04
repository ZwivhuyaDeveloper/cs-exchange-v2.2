# User Metadata Structure

This document outlines the structure of user metadata used in the CS Exchange v2.2 application. The metadata is stored in Clerk's `unsafeMetadata` field and is used for access control, user preferences, and feature flags.

## Overview

User metadata is stored in Clerk's `unsafeMetadata` field and follows the `UserUnsafeMetadata` TypeScript type. This metadata is used to control access to features, store user preferences, and manage user roles.

## Metadata Fields

### Core User Information

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `role` | `UserRole` | Yes | The user's role in the system. One of: `'user'`, `'admin'`, `'moderator'`, `'analyst'` |
| `createdAt` | `string` | Yes | ISO 8601 timestamp of when the user was created |
| `subscriptionTier` | `SubscriptionTier` | Yes | The user's subscription level. One of: `'free'`, `'basic'`, `'premium'`, `'enterprise'` |
| `onboardingCompleted` | `boolean` | Yes | Whether the user has completed the onboarding process |

### Feature Flags

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `canAccessResearch` | `boolean` | `false` | Whether the user can access Research features |
| `canAccessSignals` | `boolean` | `false` | Whether the user can access Trading Signals |
| `canAccessSpecialFeature` | `boolean` | `false` | Special feature flag |

### Onboarding Data

Stored in the `onboardingData` object:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `timezone` | `string` | Yes | User's timezone (e.g., 'Africa/Johannesburg') |
| `riskTolerance` | `string` | Yes | One of: `'low'`, `'moderate'`, `'high'`, `'very high'` |
| `investmentGoals` | `string[]` | Yes | Array of investment goals |
| `tradingExperience` | `string` | Yes | User's self-reported trading experience |
| `preferredCryptocurrencies` | `string[]` | Yes | Array of preferred cryptocurrencies |

#### Notification Preferences

Nested under `onboardingData.notificationPreferences`:

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `sms` | `boolean` | `false` | Whether to receive SMS notifications |
| `push` | `boolean` | `true` | Whether to receive push notifications |
| `email` | `boolean` | `true` | Whether to receive email notifications |

## Example Metadata

```json
{
  "role": "user",
  "createdAt": "2025-07-14T02:42:30.200Z",
  "onboardingData": {
    "timezone": "Africa/Johannesburg",
    "riskTolerance": "moderate",
    "investmentGoals": [
      "Portfolio diversification",
      "Short-term trading profits"
    ],
    "tradingExperience": "1-3 years",
    "notificationPreferences": {
      "sms": false,
      "push": true,
      "email": true
    },
    "preferredCryptocurrencies": [
      "Bitcoin (BTC)",
      "Ethereum (ETH)",
      "Solana (SOL)"
    ]
  },
  "canAccessResearch": true,
  "canAccessSignals": true,
  "subscriptionTier": "premium",
  "onboardingCompleted": true,
  "canAccessSpecialFeature": false
}
```

## Managing Metadata

### In Code

Use the `auth-utils.ts` helper functions to interact with user metadata:

```typescript
import { hasPermission, hasRole, hasSubscriptionTier } from '@/lib/auth-utils'

// Check if user has a specific permission
const canAccessResearch = await hasPermission('canAccessResearch')

// Check if user has a specific role
const isAdmin = await hasRole('admin')

// Check if user has at least premium subscription
const hasPremium = await hasSubscriptionTier('premium')
```

### In Clerk Dashboard

1. Go to the [Clerk Dashboard](https://dashboard.clerk.com/)
2. Navigate to "Users"
3. Select a user
4. Click on "Metadata" tab
5. Update the `unsafe_metadata` field with the desired values

### Using the API

You can also update metadata programmatically using the Clerk API:

```typescript
import { clerkClient } from '@clerk/nextjs/server'

// Update user metadata
await clerkClient.users.updateUser(userId, {
  unsafeMetadata: {
    canAccessResearch: true,
    subscriptionTier: 'premium',
    // ... other metadata
  },
})
```

## Best Practices

1. **Type Safety**: Always use the `UserUnsafeMetadata` type when working with metadata
2. **Default Values**: Provide sensible defaults in your code for all metadata fields
3. **Validation**: Validate metadata when updating it through your API
4. **Sensitive Data**: Never store sensitive information in metadata
5. **Performance**: Be mindful of metadata size as it's included in the user session

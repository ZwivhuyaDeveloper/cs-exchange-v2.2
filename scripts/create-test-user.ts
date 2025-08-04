#!/usr/bin/env node

/**
 * Script to create a test user with predefined metadata
 * Run with: npx tsx scripts/create-test-user.ts
 */

import { createClerkClient } from '@clerk/backend';
import dotenv from 'dotenv';

// Load environment variables
const envPath = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local';
dotenv.config({ path: envPath });

if (!process.env.CLERK_SECRET_KEY) {
  throw new Error('CLERK_SECRET_KEY is not set in environment variables');
}

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});
import type { UserUnsafeMetadata } from '@/types/user-metadata';

// Test user configuration
const TEST_USER = {
  email: 'test.user@example.com',
  // Using a more secure password with special characters and numbers
  password: 'CS-Exchange-2023!@#Secure$%^',
  unsafeMetadata: {
    role: 'user',
    createdAt: new Date().toISOString(),
    onboardingData: {
      timezone: 'Africa/Johannesburg',
      riskTolerance: 'moderate',
      investmentGoals: [
        'Portfolio diversification',
        'Short-term trading profits'
      ],
      tradingExperience: '1-3 years',
      notificationPreferences: {
        sms: false,
        push: true,
        email: true
      },
      preferredCryptocurrencies: [
        'Bitcoin (BTC)',
        'Ethereum (ETH)',
        'Solana (SOL)'
      ]
    },
    canAccessResearch: true,
    canAccessSignals: true,
    subscriptionTier: 'premium',
    onboardingCompleted: true,
    canAccessSpecialFeature: true
  } as UserUnsafeMetadata
};

async function createTestUser() {
  try {
    console.log('Creating test user...');
    
    // Check if user already exists
    const existingUsers = await clerk.users.getUserList({
      emailAddress: [TEST_USER.email]
    });

    // Get the first page of results
    const users = existingUsers.data || [];

    if (users.length > 0) {
      // Update existing user
      const user = users[0];
      console.log(`User ${TEST_USER.email} already exists. Updating metadata...`);
      
 await clerk.users.updateUser(user.id, {
        unsafeMetadata: {
          ...user.unsafeMetadata,
          ...TEST_USER.unsafeMetadata
        }
      });
      
      console.log(`✅ Updated user ${user.id} with test metadata`);
      return user;
    }

    // Create new user
    const user = await clerk.users.createUser({
      emailAddress: [TEST_USER.email],
      password: TEST_USER.password,
      unsafeMetadata: TEST_USER.unsafeMetadata
    });

    console.log(`✅ Created test user ${user.id}`);
    console.log(`📧 Email: ${TEST_USER.email}`);
    console.log('🔐 Password: TestPassword123!');
    console.log('You can now sign in with these credentials.');
    
    return user;
  } catch (error) {
    console.error('❌ Error creating test user:');
    console.error(error);
    process.exit(1);
  }
}

// Run the script
createTestUser();

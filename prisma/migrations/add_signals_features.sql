-- Migration to add token signals product features
-- This extends the existing schema with role-based access, subscriptions, and signal tracking

-- Add user roles and subscription management
CREATE TABLE IF NOT EXISTS "UserRole" (
  "id" SERIAL PRIMARY KEY,
  "userId" TEXT NOT NULL UNIQUE,
  "role" TEXT NOT NULL DEFAULT 'user',
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add subscription tiers
CREATE TABLE IF NOT EXISTS "SubscriptionTier" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL UNIQUE,
  "description" TEXT,
  "price" DECIMAL(10,2),
  "features" TEXT[],
  "maxSignalsPerDay" INTEGER,
  "premiumAccess" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add user subscriptions
CREATE TABLE IF NOT EXISTS "UserSubscription" (
  "id" SERIAL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "tierId" INTEGER NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'active',
  "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "endDate" TIMESTAMP(3),
  "autoRenew" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("tierId") REFERENCES "SubscriptionTier"("id")
);

-- Add signal performance tracking
CREATE TABLE IF NOT EXISTS "SignalPerformance" (
  "id" SERIAL PRIMARY KEY,
  "signalId" TEXT NOT NULL, -- References Sanity signal document ID
  "tokenSymbol" TEXT NOT NULL,
  "direction" TEXT NOT NULL,
  "entryPrice" DECIMAL(18,8) NOT NULL,
  "currentPrice" DECIMAL(18,8),
  "exitPrice" DECIMAL(18,8),
  "targetPrices" DECIMAL(18,8)[],
  "stopLoss" DECIMAL(18,8),
  "status" TEXT NOT NULL DEFAULT 'active',
  "pnlPercentage" DECIMAL(10,4),
  "pnlUsd" DECIMAL(18,8),
  "daysActive" INTEGER DEFAULT 0,
  "hitTargets" INTEGER DEFAULT 0,
  "totalTargets" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add signal analytics
CREATE TABLE IF NOT EXISTS "SignalAnalytics" (
  "id" SERIAL PRIMARY KEY,
  "signalId" TEXT NOT NULL,
  "views" INTEGER DEFAULT 0,
  "likes" INTEGER DEFAULT 0,
  "shares" INTEGER DEFAULT 0,
  "comments" INTEGER DEFAULT 0,
  "followers" INTEGER DEFAULT 0,
  "date" DATE NOT NULL DEFAULT CURRENT_DATE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("signalId", "date")
);

-- Add user signal interactions
CREATE TABLE IF NOT EXISTS "UserSignalInteraction" (
  "id" SERIAL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "signalId" TEXT NOT NULL,
  "interactionType" TEXT NOT NULL, -- 'view', 'like', 'share', 'follow', 'bookmark'
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("userId", "signalId", "interactionType")
);

-- Add signal alerts/notifications
CREATE TABLE IF NOT EXISTS "SignalAlert" (
  "id" SERIAL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "signalId" TEXT NOT NULL,
  "alertType" TEXT NOT NULL, -- 'price_target', 'stop_loss', 'status_change', 'new_signal'
  "triggerPrice" DECIMAL(18,8),
  "isTriggered" BOOLEAN NOT NULL DEFAULT false,
  "triggeredAt" TIMESTAMP(3),
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add analyst profiles (for signal creators)
CREATE TABLE IF NOT EXISTS "AnalystProfile" (
  "id" SERIAL PRIMARY KEY,
  "userId" TEXT NOT NULL UNIQUE,
  "displayName" TEXT NOT NULL,
  "bio" TEXT,
  "avatar" TEXT,
  "specializations" TEXT[],
  "totalSignals" INTEGER DEFAULT 0,
  "successRate" DECIMAL(5,2) DEFAULT 0,
  "avgReturn" DECIMAL(10,4) DEFAULT 0,
  "followers" INTEGER DEFAULT 0,
  "isVerified" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS "UserRole_userId_idx" ON "UserRole"("userId");
CREATE INDEX IF NOT EXISTS "UserSubscription_userId_idx" ON "UserSubscription"("userId");
CREATE INDEX IF NOT EXISTS "UserSubscription_status_idx" ON "UserSubscription"("status");
CREATE INDEX IF NOT EXISTS "SignalPerformance_signalId_idx" ON "SignalPerformance"("signalId");
CREATE INDEX IF NOT EXISTS "SignalPerformance_tokenSymbol_idx" ON "SignalPerformance"("tokenSymbol");
CREATE INDEX IF NOT EXISTS "SignalPerformance_status_idx" ON "SignalPerformance"("status");
CREATE INDEX IF NOT EXISTS "SignalAnalytics_signalId_idx" ON "SignalAnalytics"("signalId");
CREATE INDEX IF NOT EXISTS "SignalAnalytics_date_idx" ON "SignalAnalytics"("date");
CREATE INDEX IF NOT EXISTS "UserSignalInteraction_userId_idx" ON "UserSignalInteraction"("userId");
CREATE INDEX IF NOT EXISTS "UserSignalInteraction_signalId_idx" ON "UserSignalInteraction"("signalId");
CREATE INDEX IF NOT EXISTS "SignalAlert_userId_idx" ON "SignalAlert"("userId");
CREATE INDEX IF NOT EXISTS "SignalAlert_signalId_idx" ON "SignalAlert"("signalId");
CREATE INDEX IF NOT EXISTS "SignalAlert_isActive_idx" ON "SignalAlert"("isActive");
CREATE INDEX IF NOT EXISTS "AnalystProfile_userId_idx" ON "AnalystProfile"("userId");

-- Insert default subscription tiers
INSERT INTO "SubscriptionTier" ("name", "description", "price", "features", "maxSignalsPerDay", "premiumAccess") VALUES
('Free', 'Basic access to public signals', 0.00, ARRAY['View public signals', 'Basic filtering', 'Signal history'], 5, false),
('Premium', 'Full access to all signals and features', 29.99, ARRAY['All public signals', 'Premium signals', 'Advanced filtering', 'Price alerts', 'Performance analytics'], 50, true),
('Pro', 'Professional trader access with advanced features', 99.99, ARRAY['All Premium features', 'Real-time alerts', 'API access', 'Custom watchlists', 'Priority support'], 200, true),
('Analyst', 'For signal creators and analysts', 199.99, ARRAY['All Pro features', 'Signal creation tools', 'Analytics dashboard', 'Revenue sharing', 'Verified badge'], 1000, true);

-- Insert default user roles
INSERT INTO "UserRole" ("userId", "role") VALUES 
('system', 'admin') -- Placeholder for system admin
ON CONFLICT ("userId") DO NOTHING;

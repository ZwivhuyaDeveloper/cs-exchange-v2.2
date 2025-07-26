-- CreateEnum
CREATE TYPE "UserRoleType" AS ENUM ('USER', 'PREMIUM', 'ANALYST', 'ADMIN');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'CANCELLED', 'EXPIRED', 'TRIAL');

-- CreateEnum
CREATE TYPE "SignalStatus" AS ENUM ('ACTIVE', 'FILLED', 'TARGET_HIT', 'STOP_LOSS', 'COMPLETED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "InteractionType" AS ENUM ('VIEW', 'LIKE', 'SHARE', 'FOLLOW', 'BOOKMARK', 'COMMENT');

-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('PRICE_TARGET', 'STOP_LOSS', 'STATUS_CHANGE', 'NEW_SIGNAL', 'ANALYST_UPDATE');

-- CreateTable
CREATE TABLE "UserRole" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionTier" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "features" TEXT[],
    "maxSignalsPerDay" INTEGER,
    "premiumAccess" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSubscription" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "tierId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "autoRenew" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SignalPerformance" (
    "id" SERIAL NOT NULL,
    "signalId" TEXT NOT NULL,
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
    "daysActive" INTEGER NOT NULL DEFAULT 0,
    "hitTargets" INTEGER NOT NULL DEFAULT 0,
    "totalTargets" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SignalPerformance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SignalAnalytics" (
    "id" SERIAL NOT NULL,
    "signalId" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "shares" INTEGER NOT NULL DEFAULT 0,
    "comments" INTEGER NOT NULL DEFAULT 0,
    "followers" INTEGER NOT NULL DEFAULT 0,
    "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SignalAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSignalInteraction" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "signalId" TEXT NOT NULL,
    "interactionType" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSignalInteraction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SignalAlert" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "signalId" TEXT NOT NULL,
    "alertType" TEXT NOT NULL,
    "triggerPrice" DECIMAL(18,8),
    "isTriggered" BOOLEAN NOT NULL DEFAULT false,
    "triggeredAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SignalAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalystProfile" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "bio" TEXT,
    "avatar" TEXT,
    "specializations" TEXT[],
    "totalSignals" INTEGER NOT NULL DEFAULT 0,
    "successRate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "avgReturn" DECIMAL(10,4) NOT NULL DEFAULT 0,
    "followers" INTEGER NOT NULL DEFAULT 0,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnalystProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_userId_key" ON "UserRole"("userId");

-- CreateIndex
CREATE INDEX "UserRole_userId_idx" ON "UserRole"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionTier_name_key" ON "SubscriptionTier"("name");

-- CreateIndex
CREATE INDEX "UserSubscription_userId_idx" ON "UserSubscription"("userId");

-- CreateIndex
CREATE INDEX "UserSubscription_status_idx" ON "UserSubscription"("status");

-- CreateIndex
CREATE INDEX "SignalPerformance_signalId_idx" ON "SignalPerformance"("signalId");

-- CreateIndex
CREATE INDEX "SignalPerformance_tokenSymbol_idx" ON "SignalPerformance"("tokenSymbol");

-- CreateIndex
CREATE INDEX "SignalPerformance_status_idx" ON "SignalPerformance"("status");

-- CreateIndex
CREATE INDEX "SignalAnalytics_signalId_idx" ON "SignalAnalytics"("signalId");

-- CreateIndex
CREATE INDEX "SignalAnalytics_date_idx" ON "SignalAnalytics"("date");

-- CreateIndex
CREATE UNIQUE INDEX "SignalAnalytics_signalId_date_key" ON "SignalAnalytics"("signalId", "date");

-- CreateIndex
CREATE INDEX "UserSignalInteraction_userId_idx" ON "UserSignalInteraction"("userId");

-- CreateIndex
CREATE INDEX "UserSignalInteraction_signalId_idx" ON "UserSignalInteraction"("signalId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSignalInteraction_userId_signalId_interactionType_key" ON "UserSignalInteraction"("userId", "signalId", "interactionType");

-- CreateIndex
CREATE INDEX "SignalAlert_userId_idx" ON "SignalAlert"("userId");

-- CreateIndex
CREATE INDEX "SignalAlert_signalId_idx" ON "SignalAlert"("signalId");

-- CreateIndex
CREATE INDEX "SignalAlert_isActive_idx" ON "SignalAlert"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "AnalystProfile_userId_key" ON "AnalystProfile"("userId");

-- CreateIndex
CREATE INDEX "AnalystProfile_userId_idx" ON "AnalystProfile"("userId");

-- AddForeignKey
ALTER TABLE "UserSubscription" ADD CONSTRAINT "UserSubscription_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "SubscriptionTier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `logoURI` on the `Token` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Exchange" ADD VALUE 'BITSTAMP';
ALTER TYPE "Exchange" ADD VALUE 'CRYPTO';
ALTER TYPE "Exchange" ADD VALUE 'GEMINI';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TokenType" ADD VALUE 'MEMECOIN';
ALTER TYPE "TokenType" ADD VALUE 'ETHEREUM';
ALTER TYPE "TokenType" ADD VALUE 'POLYGON';

-- AlterTable
ALTER TABLE "Token" DROP COLUMN "logoURI",
ADD COLUMN     "logoURL" TEXT;

-- CreateIndex
CREATE INDEX "Token_address_idx" ON "Token"("address");

-- CreateIndex
CREATE INDEX "Token_coingeckoId_idx" ON "Token"("coingeckoId");

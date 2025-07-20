-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('CRYPTO', 'STOCK', 'FOREX', 'INDEX', 'COMMODITY');

-- CreateEnum
CREATE TYPE "Exchange" AS ENUM ('NASDAQ', 'NYSE', 'COINBASE', 'BINANCE', 'FOREXCOM', 'TRADENATION');

-- CreateTable
CREATE TABLE "Chain" (
    "id" SERIAL NOT NULL,
    "chainId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "nativeToken" TEXT NOT NULL,
    "rpcUrl" TEXT NOT NULL,
    "explorerUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "chainId" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "decimals" INTEGER NOT NULL,
    "logoURI" TEXT,
    "coingeckoId" TEXT,
    "tradingViewSymbol" TEXT,
    "type" "TokenType" DEFAULT 'CRYPTO',
    "exchange" "Exchange",
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenList" (
    "id" SERIAL NOT NULL,
    "listId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TokenList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TokenToTokenList" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_TokenToTokenList_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Chain_chainId_key" ON "Chain"("chainId");

-- CreateIndex
CREATE INDEX "Token_symbol_idx" ON "Token"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "Token_chainId_address_key" ON "Token"("chainId", "address");

-- CreateIndex
CREATE UNIQUE INDEX "Token_chainId_symbol_key" ON "Token"("chainId", "symbol");

-- CreateIndex
CREATE UNIQUE INDEX "TokenList_listId_key" ON "TokenList"("listId");

-- CreateIndex
CREATE INDEX "_TokenToTokenList_B_index" ON "_TokenToTokenList"("B");

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_chainId_fkey" FOREIGN KEY ("chainId") REFERENCES "Chain"("chainId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TokenToTokenList" ADD CONSTRAINT "_TokenToTokenList_A_fkey" FOREIGN KEY ("A") REFERENCES "Token"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TokenToTokenList" ADD CONSTRAINT "_TokenToTokenList_B_fkey" FOREIGN KEY ("B") REFERENCES "TokenList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

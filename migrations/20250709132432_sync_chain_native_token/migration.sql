-- CreateTable
CREATE TABLE "Chain" (
    "id" SERIAL NOT NULL,
    "chainId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "network" TEXT,

    CONSTRAINT "Chain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "exchange" TEXT,
    "icon" TEXT,
    "address" TEXT,
    "decimals" INTEGER,
    "logoURL" TEXT,
    "chainId" INTEGER NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Chain_chainId_key" ON "Chain"("chainId");

-- CreateIndex
CREATE UNIQUE INDEX "Token_symbol_chainId_key" ON "Token"("symbol", "chainId");

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_chainId_fkey" FOREIGN KEY ("chainId") REFERENCES "Chain"("chainId") ON DELETE RESTRICT ON UPDATE CASCADE;

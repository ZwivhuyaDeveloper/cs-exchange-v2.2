const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const prisma = new PrismaClient();

async function fetchUniswapTokens(limit = 1000) {
  const url = 'https://tokens.uniswap.org/';
  const { data } = await axios.get(url);
  // Only Ethereum mainnet tokens
  const ethTokens = data.tokens.filter(t => t.chainId === 1);
  return ethTokens.slice(0, limit);
}

async function main() {
  const filePath = path.join(__dirname, 'tokens-eth-top200.json');
  let tokens = [];
  if (fs.existsSync(filePath)) {
    tokens = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  // Fetch 500 new tokens from Uniswap list not already in local file
  const existingSymbols = new Set(tokens.map(t => t.symbol));
  const uniswapTokens = await fetchUniswapTokens(1000); // get more than 500 to filter
  let added = 0;
  for (const t of uniswapTokens) {
    if (added >= 500) break;
    if (!existingSymbols.has(t.symbol)) {
      tokens.push({
        name: t.name,
        symbol: t.symbol,
        address: t.address,
        decimals: t.decimals,
        logoURI: t.logoURI || null
      });
      existingSymbols.add(t.symbol);
      added++;
    }
  }
  fs.writeFileSync(filePath, JSON.stringify(tokens, null, 2));

  let count = 0;
  for (const token of tokens) {
    if (!token.address || !token.symbol || !token.name || !token.decimals) {
      console.log(`Skipping incomplete token: ${JSON.stringify(token)}`);
      continue;
    }
    // Check for duplicate symbol on chainId 1
    const existingBySymbol = await prisma.token.findUnique({
      where: {
        chainId_symbol: {
          chainId: 1,
          symbol: token.symbol,
        },
      },
    });
    if (existingBySymbol) {
      console.warn(`Duplicate symbol for chainId 1: ${token.symbol} (${token.address}) - Skipping.`);
      continue;
    }
    try {
      await prisma.token.upsert({
        where: {
          chainId_address: {
            chainId: 1,
            address: token.address.toLowerCase(),
          },
        },
        update: {
          name: token.name,
          symbol: token.symbol,
          decimals: token.decimals,
          address: token.address.toLowerCase(),
          logoURL: token.logoURI || null,
          coingeckoId: null,
          tradingViewSymbol: null,
          type: 'CRYPTO',
          exchange: 'CRYPTO',
          isDefault: false,
        },
        create: {
          name: token.name,
          symbol: token.symbol,
          decimals: token.decimals,
          address: token.address.toLowerCase(),
          logoURL: token.logoURI || null,
          coingeckoId: null,
          tradingViewSymbol: null,
          type: 'CRYPTO',
          exchange: 'CRYPTO',
          isDefault: false,
          chainId: 1,
        },
      });
      count++;
      console.log(`Ingested: ${token.symbol} (${token.address})`);
    } catch (e) {
      if (e.code === 'P2002' && e.meta && e.meta.target && e.meta.target.includes('chainId_address')) {
        console.warn(`Duplicate address for chainId 1: ${token.symbol} (${token.address}) - Skipping.`);
        continue;
      }
      console.error(`Error processing ${token.symbol}:`, e.message);
    }
  }
  console.log(`✅ Ingested ${count} Ethereum tokens.`);
}

main().finally(() => prisma.$disconnect()); 
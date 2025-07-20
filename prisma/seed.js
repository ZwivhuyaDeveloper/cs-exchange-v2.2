// prisma/seed.ts
const { PrismaClient } = require('@prisma/client');
const { 
  MAINNET_TOKENS, 
  POLYGON_TOKENS,
  COINGECKO_IDS,
  TOKEN_TO_TRADINGVIEW
} = require('@/src/constants');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  // Create chains using upsert
  await prisma.chain.upsert({
    where: { chainId: 1 },
    update: {},
    create: {
      chainId: 1,
      name: 'Ethereum',
      nativeToken: 'ETH',
      rpcUrl: 'https://mainnet.infura.io/v3/YOUR_KEY',
      explorerUrl: 'https://etherscan.io'
    }
  });

  await prisma.chain.upsert({
    where: { chainId: 137 },
    update: {},
    create: {
      chainId: 137,
      name: 'Polygon',
      nativeToken: 'MATIC',
      rpcUrl: 'https://polygon-rpc.com',
      explorerUrl: 'https://polygonscan.com'
    }
  });

  // Create tokens
  const allTokens = [...MAINNET_TOKENS, ...POLYGON_TOKENS];
  
  for (const token of allTokens) {
    const symbol = token.symbol.toLowerCase();
    const coingeckoId = COINGECKO_IDS[symbol];
    const tradingViewSymbol = TOKEN_TO_TRADINGVIEW[token.symbol] || token.symbol;

    await prisma.token.upsert({
      where: { 
        chainId_address: {
          chainId: token.chainId,
          address: token.address ? token.address.toLowerCase() : ''
        }
      },
      update: {
        symbol: token.symbol,
        name: token.name,
        decimals: token.decimals,
        logoURI: token.logoURI,
        coingeckoId,
        tradingViewSymbol
      },
      create: {
        chainId: token.chainId,
        address: token.address ? token.address.toLowerCase() : '',
        symbol: token.symbol,
        name: token.name,
        decimals: token.decimals,
        logoURI: token.logoURI,
        coingeckoId,
        tradingViewSymbol,
        type: token.type || 'CRYPTO',
        exchange: token.exchange,
      }
    });
  }

  console.log(`Seeded ${allTokens.length} tokens`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
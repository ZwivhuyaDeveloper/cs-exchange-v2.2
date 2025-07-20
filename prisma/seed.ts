// seed.ts
import { PrismaClient } from '@prisma/client';
import {
  POLYGON_TOKENS,
  MAINNET_TOKENS,
  COINGECKO_IDS,
  TOKEN_TO_TRADINGVIEW
} from '../src/constants';

const prisma = new PrismaClient();

async function main() {
  // Seed Chains
  await prisma.chain.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Ethereum',
      network: 'ethereum',
      nativeToken: 'ETH',
      rpcUrl: 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID',
      explorerUrl: 'https://etherscan.io',
      icon: 'https://cdn.worldvectorlogo.com/logos/ethereum-eth.svg',
    }
  });

  await prisma.chain.upsert({
    where: { id: 137 },
    update: {},
    create: {
      id: 137,
      name: 'Polygon',
      network: 'polygon',
      nativeToken: 'MATIC',
      rpcUrl: 'https://polygon-rpc.com',
      explorerUrl: 'https://polygonscan.com',
      icon: 'https://cryptologos.cc/logos/polygon-matic-logo.svg',
    }
  });

  // Seed Tokens
  const allTokens = [...MAINNET_TOKENS, ...POLYGON_TOKENS];
  
  for (const token of allTokens) {
    const coingeckoId = COINGECKO_IDS[token.symbol.toLowerCase()];
    const tradingViewSymbol = TOKEN_TO_TRADINGVIEW[token.symbol.toLowerCase()];
    
    await prisma.token.upsert({
      where: {
        token_chain_symbol_unique: {
          chainId: token.chainId!,
          symbol: token.symbol
        }
      },
      update: {
        name: token.name,
        type: token.type as any, // Cast to enum type
        exchange: token.exchange as any,
        icon: token.icon,
        address: token.address,
        coingeckoId,
        decimals: token.decimals,
        logoURL: token.logoURL,
        tradingViewSymbol,
        isDefault: token.isDefault
      },
      create: {
        symbol: token.symbol,
        name: token.name,
        type: token.type as any,
        exchange: token.exchange as any,
        icon: token.icon,
        address: token.address,
        coingeckoId,
        chainId: token.chainId!,
        decimals: token.decimals,
        logoURL: token.logoURL,
        tradingViewSymbol,
        isDefault: token.isDefault
      }
    });
  }

  // Token list operations removed - TokenList model doesn't exist in current schema

  console.log('Database seeded successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
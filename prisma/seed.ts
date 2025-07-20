#!/usr/bin/env ts-node
import { PrismaClient, TokenType } from '@prisma/client';
import {
  MAINNET_TOKENS,
  MAINNET_TOKENS_BY_SYMBOL,
  POLYGON_TOKENS,
  POLYGON_TOKENS_BY_SYMBOL,
  TRADINGVIEW_TOKEN_LISTS,
  COINGECKO_IDS,
  TOKEN_TO_TRADINGVIEW,
} from '../src/constants';


const prisma = new PrismaClient();

function getTokenType(type: string | undefined): TokenType {
  if (type && Object.prototype.hasOwnProperty.call(TokenType, type.toUpperCase())) {
    return TokenType[type.toUpperCase() as keyof typeof TokenType];
  }
  return TokenType.CRYPTO;
}

async function main() {
  // Seed Chains
  const chains = [
    {
      chainId: 1,
      name: 'Ethereum Mainnet',
      nativeToken: 'ETH',
      rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
      explorerUrl: 'https://etherscan.io',
    },
    {
      chainId: 137,
      name: 'Polygon',
      nativeToken: 'MATIC',
      rpcUrl: 'https://polygon-rpc.com',
      explorerUrl: 'https://polygonscan.com',
    },
    // Add more chains as needed
  ];

  for (const chain of chains) {
    await prisma.chain.upsert({
      where: { chainId: chain.chainId },
      update: chain,
      create: chain,
    });
  }

  // Helper to get tradingViewSymbol
  const getTradingViewSymbol = (symbol: string) => {
    return TOKEN_TO_TRADINGVIEW[symbol.toLowerCase()] || symbol;
  };

  // Seed Tokens (Ethereum Mainnet)
  for (const token of MAINNET_TOKENS) {
    await prisma.token.upsert({
      where: {
        chainId_address: {
          chainId: 1,
          address: token.address?.toLowerCase() || '',
        },
      },
      update: {
        ...token,
        address: token.address?.toLowerCase() || '',
        logoURL: token.logoURL,
        coingeckoId: COINGECKO_IDS[token.symbol.toLowerCase()] || null,
        tradingViewSymbol: getTradingViewSymbol(token.symbol),
        type: getTokenType(token.type),
        decimals: token.decimals ?? 18,
        exchange: token.exchange || null,
      },
      create: {
        ...token,
        chainId: 1,
        address: token.address?.toLowerCase() || '',
        logoURL: token.logoURL,
        coingeckoId: COINGECKO_IDS[token.symbol.toLowerCase()] || null,
        tradingViewSymbol: getTradingViewSymbol(token.symbol),
        type: getTokenType(token.type),
        decimals: token.decimals ?? 18,
        exchange: token.exchange || null,
      },
    });
  }

  // Seed Tokens (Polygon)
  for (const token of POLYGON_TOKENS) {
    await prisma.token.upsert({
      where: {
        chainId_address: {
          chainId: 137,
          address: token.address?.toLowerCase() || '',
        },
      },
      update: {
        ...token,
        address: token.address?.toLowerCase() || '',
        logoURL: token.logoURL,
        coingeckoId: COINGECKO_IDS[token.symbol.toLowerCase()] || null,
        tradingViewSymbol: getTradingViewSymbol(token.symbol),
        type: getTokenType(token.type),
        decimals: token.decimals ?? 18,
        exchange: token.exchange || null,
      },
      create: {
        ...token,
        chainId: 137,
        address: token.address?.toLowerCase() || '',
        logoURL: token.logoURL,
        coingeckoId: COINGECKO_IDS[token.symbol.toLowerCase()] || null,
        tradingViewSymbol: getTradingViewSymbol(token.symbol),
        type: getTokenType(token.type),
        decimals: token.decimals ?? 18,
        exchange: token.exchange || null,
      },
    });
  }

  // Seed Token Lists
  for (const list of TRADINGVIEW_TOKEN_LISTS) {
    const tokenList = await prisma.tokenList.upsert({
      where: { listId: list.id },
      update: {
        name: list.name,
        description: list.description,
        isDefault: !!list.isDefault,
      },
      create: {
        listId: list.id,
        name: list.name,
        description: list.description,
        isDefault: !!list.isDefault,
      },
    });

    // Link tokens to token list
    for (const token of list.tokens) {
      // Try to find the token in the DB (by symbol, on mainnet)
      const dbToken = await prisma.token.findFirst({
        where: {
          symbol: token.symbol,
          chainId: 1,
        },
      });
      if (dbToken) {
        await prisma.token.update({
          where: { id: dbToken.id },
          data: {
            TokenList: {
              connect: { id: tokenList.id },
            },
          },
        });
      }
    }
  }

  console.log('Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
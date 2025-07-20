import prisma from '@/lib/prisma';
import { cache } from '@/lib/redis';

const CACHE_PREFIX = 'tokens:';

export const getTokensByChain = async (chainId: number) => {
  const cacheKey = `${CACHE_PREFIX}chain_${chainId}`;
  
  try {
    const cached = await cache.get(cacheKey);
    if (cached) return cached;
    
    const tokens = await prisma.token.findMany({
      where: { chainId },
      orderBy: { isDefault: 'desc' }
    });
    
    await cache.set(cacheKey, tokens);
    return tokens;
  } catch (error) {
    console.error('Error fetching tokens by chain:', error);
    throw new Error('Failed to fetch tokens');
  }
};

export const getTokenBySymbol = async (chainId: number, symbol: string) => {
  const cacheKey = `${CACHE_PREFIX}symbol_${chainId}_${symbol.toLowerCase()}`;
  
  try {
    const cached = await cache.get(cacheKey);
    if (cached) return cached;
    
    const token = await prisma.token.findFirst({
      where: {
        chainId,
        symbol: {
          equals: symbol,
          mode: 'insensitive'
        }
      }
    });
    
    if (token) await cache.set(cacheKey, token);
    return token;
  } catch (error) {
    console.error('Error fetching token by symbol:', error);
    throw new Error('Failed to fetch token');
  }
};

export const getTokenByAddress = async (chainId: number, address: string) => {
  const cacheKey = `${CACHE_PREFIX}address_${chainId}_${address.toLowerCase()}`;
  
  try {
    const cached = await cache.get(cacheKey);
    if (cached) return cached;
    
    const token = await prisma.token.findFirst({
      where: {
        chainId,
        address: {
          equals: address,
          mode: 'insensitive'
        }
      }
    });
    
    if (token) await cache.set(cacheKey, token);
    return token;
  } catch (error) {
    console.error('Error fetching token by address:', error);
    throw new Error('Failed to fetch token');
  }
};

export const getDefaultBuyToken = async (chainId: number) => {
  const cacheKey = `${CACHE_PREFIX}default_buy_${chainId}`;
  
  try {
    const cached = await cache.get(cacheKey);
    if (cached) return cached;
    
    const token = await prisma.token.findFirst({
      where: {
        chainId,
        symbol: chainId === 1 ? 'WETH' : 'USDC'
      }
    });
    
    if (token) await cache.set(cacheKey, token);
    return token;
  } catch (error) {
    console.error('Error fetching default buy token:', error);
    throw new Error('Failed to fetch default token');
  }
};

export const getTradingViewSymbol = async (tokenSymbol: string): Promise<string> => {
  const cacheKey = `${CACHE_PREFIX}tradingview_${tokenSymbol.toLowerCase()}`;
  
  try {
    const cached = await cache.get(cacheKey);
    if (cached) return cached;
    
    const token = await prisma.token.findFirst({
      where: {
        symbol: {
          equals: tokenSymbol,
          mode: 'insensitive'
        }
      },
      select: { tradingViewSymbol: true }
    });
    
    const result = token?.tradingViewSymbol || tokenSymbol;
    await cache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error fetching TradingView symbol:', error);
    return tokenSymbol;
  }
};

export const refreshTokenCache = async () => {
  await cache.clearPattern(`${CACHE_PREFIX}*`);
};
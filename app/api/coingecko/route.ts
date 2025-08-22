import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

// Cache configuration
const CACHE_TTL = 5 * 60; // 5 minutes in seconds
const RATE_LIMIT_WINDOW = 60; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 50; // CoinGecko free tier limit

// In-memory cache and rate limiting
const dataCache = new Map<string, { timestamp: number; data: any }>();
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Environment variables
const COINGECKO_API_KEY = process.env.NEXT_PUBLIC_COINGECKO_API_KEY || process.env.COINGECKO_API_KEY || '';
const COINGECKO_API_URL = COINGECKO_API_KEY ? 'https://pro-api.coingecko.com/api/v3' : 'https://api.coingecko.com/api/v3';

// Rate limiting function
function checkRateLimit(identifier: string): boolean {
  const now = Math.floor(Date.now() / 1000);
  const limit = rateLimitMap.get(identifier);
  
  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (limit.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  
  limit.count++;
  return true;
}

// Unified response interface
interface CoinGeckoResponse {
  success: boolean;
  data?: any;
  error?: string;
  timestamp: number;
}

// Fetch function with error handling
async function fetchFromCoinGecko(endpoint: string, params: Record<string, string> = {}): Promise<any> {
  const url = new URL(`${COINGECKO_API_URL}${endpoint}`);
  
  // Add parameters
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  
  // Add API key if available
  const headers: HeadersInit = {};
  if (COINGECKO_API_KEY) {
    headers["x-cg-demo-api-key"] = COINGECKO_API_KEY;
  }
  
  const response = await fetch(url.toString(), { headers });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`CoinGecko API error: ${response.status} ${response.statusText} - ${errorText}`);
  }
  
  return response.json();
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const coingeckoId = searchParams.get('id');
    const symbol = searchParams.get('symbol');
    
    // Rate limiting check
    if (!checkRateLimit('global')) {
      return NextResponse.json({
        success: false,
        error: 'Rate limit exceeded. Please try again later.',
        timestamp: Date.now()
      } as CoinGeckoResponse, { status: 429 });
    }
    
    // Validate required parameters
    if (!action) {
      return NextResponse.json({
        success: false,
        error: 'Missing required parameter: action',
        timestamp: Date.now()
      } as CoinGeckoResponse, { status: 400 });
    }
    
    // Check cache first
    const cacheKey = `${action}-${coingeckoId || symbol}`;
    const cached = dataCache.get(cacheKey);
    const now = Math.floor(Date.now() / 1000);
    
    if (cached && now - cached.timestamp < CACHE_TTL) {
      return NextResponse.json({
        success: true,
        data: cached.data,
        timestamp: cached.timestamp
      } as CoinGeckoResponse);
    }
    
    let data: any;
    
    switch (action) {
      case 'market-data':
        if (!coingeckoId) {
          throw new Error('Market data requires coingeckoId');
        }
        data = await fetchFromCoinGecko(`/coins/${coingeckoId}`);
        break;
        
      case 'tickers':
        if (!coingeckoId) {
          throw new Error('Tickers data requires coingeckoId');
        }
        data = await fetchFromCoinGecko(`/coins/${coingeckoId}/tickers`);
        break;
        
      case 'volume-data':
        if (!coingeckoId) {
          throw new Error('Volume data requires coingeckoId');
        }
        const tickersData = await fetchFromCoinGecko(`/coins/${coingeckoId}/tickers`);
        // Process tickers to extract volume data
        data = processVolumeData(tickersData);
        break;
        
      case 'liquidity-data':
        if (!coingeckoId) {
          throw new Error('Liquidity data requires coingeckoId');
        }
        const liquidityTickers = await fetchFromCoinGecko(`/coins/${coingeckoId}/tickers`);
        // Process tickers to extract liquidity data
        data = processLiquidityData(liquidityTickers);
        break;
        
      case 'technical-specs':
        if (!coingeckoId) {
          throw new Error('Technical specs requires coingeckoId');
        }
        const techData = await fetchFromCoinGecko(`/coins/${coingeckoId}`);
        data = processTechnicalSpecs(techData);
        break;
        
      default:
        throw new Error(`Unknown action: ${action}`);
    }
    
    // Update cache
    dataCache.set(cacheKey, {
      timestamp: now,
      data,
    });
    
    return NextResponse.json({
      success: true,
      data,
      timestamp: now
    } as CoinGeckoResponse);
    
  } catch (error) {
    console.error('Error in CoinGecko API:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
      timestamp: Date.now()
    } as CoinGeckoResponse, { status: 500 });
  }
}

// Data processing functions
function processVolumeData(tickersData: any) {
  const exchanges = tickersData.tickers || [];
  const exchangeMap = new Map<string, { name: string; volume_24h: number }>();
  
  exchanges.forEach((ticker: any) => {
    const exchange = ticker.market?.name || 'Unknown';
    const volume = ticker.converted_volume?.usd || 0;
    
    if (exchangeMap.has(exchange)) {
      exchangeMap.get(exchange)!.volume_24h += volume;
    } else {
      exchangeMap.set(exchange, {
        name: exchange,
        volume_24h: volume
      });
    }
  });
  
  const totalVolume = Array.from(exchangeMap.values()).reduce((sum, ex) => sum + ex.volume_24h, 0);
  
  return Array.from(exchangeMap.values())
    .filter(ex => ex.volume_24h > 0)
    .sort((a, b) => b.volume_24h - a.volume_24h)
    .slice(0, 6)
    .map(ex => ({
      exchange: ex.name,
      volume24h: ex.volume_24h,
      marketShare: totalVolume > 0 ? (ex.volume_24h / totalVolume) * 100 : 0
    }));
}

function processLiquidityData(tickersData: any) {
  const exchanges = tickersData.tickers || [];
  const exchangeMap = new Map<string, { name: string; liquidity: number; volume_24h: number }>();
  
  exchanges.forEach((ticker: any) => {
    const exchange = ticker.market?.name || 'Unknown';
    const volume = ticker.converted_volume?.usd || 0;
    const liquidity = ticker.converted_volume?.usd || 0; // Using volume as proxy for liquidity
    
    if (exchangeMap.has(exchange)) {
      exchangeMap.get(exchange)!.liquidity += liquidity;
      exchangeMap.get(exchange)!.volume_24h += volume;
    } else {
      exchangeMap.set(exchange, {
        name: exchange,
        liquidity,
        volume_24h: volume
      });
    }
  });
  
  const totalLiquidity = Array.from(exchangeMap.values()).reduce((sum, ex) => sum + ex.liquidity, 0);
  
  return Array.from(exchangeMap.values())
    .filter(ex => ex.liquidity > 0)
    .sort((a, b) => b.liquidity - a.liquidity)
    .slice(0, 8)
    .map(ex => ({
      exchange: ex.name,
      liquidity: ex.liquidity,
      volume24h: ex.volume_24h,
      marketShare: totalLiquidity > 0 ? (ex.liquidity / totalLiquidity) * 100 : 0
    }));
}

function processTechnicalSpecs(coinData: any) {
  const platforms = coinData.platforms ? Object.entries(coinData.platforms) : [];
  const foundAddress = platforms.find(([_, addr]) => typeof addr === "string" && addr);
  const tokenAddress = typeof foundAddress?.[1] === "string" ? foundAddress[1] : 'N/A';
  
  return {
    marketCapRank: coinData.market_cap_rank,
    hashingAlgorithm: coinData.hashing_algorithm || 'N/A',
    blockTime: coinData.block_time_in_minutes,
    genesisDate: coinData.genesis_date ? new Date(coinData.genesis_date).toLocaleDateString() : 'N/A',
    tokenAddress,
    categories: coinData.categories || [],
    description: coinData.description?.en || 'No description available'
  };
}

// Set revalidation time for ISR
export const revalidate = 300; // 5 minutes

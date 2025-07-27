import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

// 15 minutes in seconds
const CACHE_TTL = 15 * 60;

// In-memory cache
const priceCache = new Map<string, { timestamp: number; data: any }>();

// Environment variables
const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY || '';
const COINGECKO_API_URL = 'https://pro-api.coingecko.com/api/v3';

interface PriceResponse {
  [key: string]: {
    usd: number;
    usd_24h_change?: number;
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get('ids');
    const vsCurrencies = searchParams.get('vs_currencies') || 'usd';
    const include24hChange = searchParams.get('include_24hr_change') === 'true';

    if (!ids) {
      return NextResponse.json(
        { error: 'Missing required parameter: ids' },
        { status: 400 }
      );
    }

    // Check cache first
    const cacheKey = `${ids}-${vsCurrencies}-${include24hChange}`;
    const cached = priceCache.get(cacheKey);
    const now = Math.floor(Date.now() / 1000);

    if (cached && now - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data);
    }

    // Build the URL for the CoinGecko API
    const url = new URL(`${COINGECKO_API_URL}/simple/price`);
    url.searchParams.append('ids', ids);
    url.searchParams.append('vs_currencies', vsCurrencies);
    
    if (include24hChange) {
      url.searchParams.append('include_24hr_change', 'true');
    }

    // Add API key if available
    if (COINGECKO_API_KEY) {
      url.searchParams.append('x_cg_pro_api_key', COINGECKO_API_KEY);
    }

    // Fetch from CoinGecko
    const response = await fetch(url.toString());

    if (!response.ok) {
      const errorText = await response.text();
      console.error('CoinGecko API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to fetch from CoinGecko API', details: errorText },
        { status: response.status }
      );
    }

    const data: PriceResponse = await response.json();

    // Update cache
    priceCache.set(cacheKey, {
      timestamp: now,
      data,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in CoinGecko price API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Set revalidation time for ISR (Incremental Static Regeneration)
export const revalidate = 300; // 5 minutes

import { cache } from 'react';

interface TokenData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  sparkline_in_7d?: {
    price: number[];
  };
}

export const fetchTokenData = cache(async (coingeckoId: string): Promise<TokenData | null> => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;
    const headers: HeadersInit = {};
    if (apiKey) headers["x-cg-demo-api-key"] = apiKey;

    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coingeckoId}&sparkline=true&price_change_percentage=24h`,
      { headers, next: { revalidate: 60 } } // Cache for 60 seconds
    );

    if (!response.ok) {
      throw new Error('Failed to fetch token data');
    }

    const data = await response.json();
    return data[0] || null;
  } catch (error) {
    console.error('Error fetching token data:', error);
    return null;
  }
});

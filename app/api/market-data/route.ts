// app/api/market-data/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch from CoinGecko API or your preferred data source
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=chainlink,binance-usd', // Add your token IDs
      {
        headers: {
          'x-cg-demo-api-key': process.env.COINGECKO_API_KEY!,
        }
      }
    );
    
    const data = await response.json();
    
    // Transform to match TokenMarketData interface
    const transformed = data.map((token: any) => ({
      symbol: token.symbol.toUpperCase(),
      price: token.current_price,
      priceChange24h: token.price_change_percentage_24h,
      volume24h: token.total_volume
    }));

    return NextResponse.json(transformed);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch market data' },
      { status: 500 }
    );
  }
}
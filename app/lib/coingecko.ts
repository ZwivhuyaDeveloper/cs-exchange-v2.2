const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export async function fetchTokenPrice(coingeckoId: string): Promise<number | null> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;
    if (!apiKey) {
      throw new Error('CoinGecko API key is missing');
    }
    
    const response = await fetch(
      `${COINGECKO_API}/simple/price?ids=${encodeURIComponent(coingeckoId)}&vs_currencies=usd&x_cg_demo_api_key=${apiKey}`,
      { next: { revalidate: 30 } }
    );
    
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data[coingeckoId]?.usd || null;
  } catch (error) {
    console.error('Failed to fetch token price:', error);
    return null;
  }
}

export async function fetchTokenPrices(coingeckoIds: string[]): Promise<Record<string, number>> {
  const uniqueIds = [...new Set(coingeckoIds.filter(Boolean))];
  if (uniqueIds.length === 0) return {};

  try {
    const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;
    if (!apiKey) {
      throw new Error('CoinGecko API key is missing');
    }
    
    const response = await fetch(
      `${COINGECKO_API}/simple/price?ids=${uniqueIds.join(',')}&vs_currencies=usd&x_cg_demo_api_key=${apiKey}`,
      { next: { revalidate: 30 } }
    );
    
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    const prices: Record<string, number> = {};
    
    uniqueIds.forEach(id => {
      if (data[id]?.usd) {
        prices[id] = data[id].usd;
      }
    });
    
    return prices;
  } catch (error) {
    console.error('Failed to fetch token prices:', error);
    return {};
  }
}

export const COINGECKO_ID_MAP: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  MATIC: 'matic-network',
  SOL: 'solana',
  USDT: 'tether',
  BNB: 'binancecoin',
  XRP: 'ripple',
  ADA: 'cardano',
  DOGE: 'dogecoin',
  DOT: 'polkadot',
  AVAX: 'avalanche-2',
};

export function getCoingeckoId(tokenSymbol: string): string {
  return COINGECKO_ID_MAP[tokenSymbol] || tokenSymbol.toLowerCase();
}
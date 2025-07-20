// pages/api/chart-data.ts
import { NextApiRequest, NextApiResponse } from 'next';
import CoinGecko from 'coingecko-api';

const client = new CoinGecko();

interface ChartData {
  candles: Array<{ time: number; open: number; high: number; low: number; close: number }>;
  volume: Array<{ time: number; value: number; color: string }>;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChartData | { error: string }>
) {
  const { from, to } = req.query;

  try {
    const { data } = await client.coins.fetchMarketChart(
      from as string,
      {
        vs_currency: to as string,
        days: '90',
      }
    );

    const candles = data.prices.map(([timestamp, price], index) => {
      const [_, high] = data.prices[index];
      const [__, low] = data.prices[index];
      return {
        time: Math.floor(timestamp / 1000),
        open: data.prices[index][1],
        high,
        low,
        close: data.prices[index][1],
      };
    });

    const volume = data.total_volumes.map(([timestamp, vol], index) => ({
      time: Math.floor(timestamp / 1000),
      value: vol,
      color: data.prices[index][1] > data.prices[index][1] ? '#22C55E80' : '#EF444480',
    }));

    res.status(200).json({ candles, volume });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
}
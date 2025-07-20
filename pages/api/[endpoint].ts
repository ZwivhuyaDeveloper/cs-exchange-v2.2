import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { endpoint } = req.query;
  const apiKey = process.env.COINGECKO_API_KEY; // Store in .env.local without NEXT_PUBLIC_
  const url = `https://api.coingecko.com/api/v3/${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: apiKey ? { "x-cg-demo-api-key": apiKey } : undefined,
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
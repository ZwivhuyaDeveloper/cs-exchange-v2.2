import React, { useState, useEffect } from 'react';
import { Card, CardDescription, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface OrderDataProps {
  tokenSymbol: string;
  chainId?: number;
}

interface OrderData {
  buys: number;
  sells: number;
  buyVolume: number;
  sellVolume: number;
  buyers: number;
  sellers: number;
}

const VALID_TRADING_PAIRS = [
  'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'SOLUSDT', 'DOTUSDT', 'DOGEUSDT', 
  'AVAXUSDT', 'MATICUSDT', 'LINKUSDT', 'UNIUSDT', 'LTCUSDT', 'BCHUSDT', 'XRPUSDT',
  'ATOMUSDT', 'FTMUSDT', 'NEARUSDT', 'ALGOUSDT', 'VETUSDT', 'ICPUSDT', 'FILUSDT',
  'TRXUSDT', 'ETCUSDT', 'XLMUSDT', 'HBARUSDT', 'THETAUSDT', 'XTZUSDT', 'EOSUSDT'
];

export default function OrderData({ tokenSymbol, chainId = 1 }: OrderDataProps) {
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch token metadata
  useEffect(() => {
    setTokenInfo(null);
    setTokenError(null);
    setOrderData(null);
    setOrderError(null);
    setIsLoading(true);
    fetch(`/api/token-metadata?symbols=${tokenSymbol}&chainId=${chainId}`)
      .then(res => res.json())
      .then(tokens => {
        if (!tokens[0]) throw new Error('Token not found');
        setTokenInfo(tokens[0]);
      })
      .catch(() => setTokenError('Failed to load token info'));
  }, [tokenSymbol, chainId]);

  // Fetch order data from CoinGecko or Binance
  useEffect(() => {
    if (!tokenInfo) return;
    const fetchOrderData = async () => {
      setIsLoading(true);
      setOrderError(null);
      setOrderData(null);
      try {
        // Try CoinGecko first if coingeckoId is available
        if (tokenInfo.coingeckoId) {
          const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;
          const headers: HeadersInit = {};
          if (apiKey) headers["x-cg-demo-api-key"] = apiKey;
          // Fetch tickers for the token
          const res = await fetch(`https://api.coingecko.com/api/v3/coins/${tokenInfo.coingeckoId}/tickers`, { headers });
          if (!res.ok) throw new Error(`Failed to fetch trade data: ${res.status} ${res.statusText}`);
          const data = await res.json();
          const tickers = data.tickers || [];
          // Aggregate buy/sell volume by order type if available
          let buys = 0, sells = 0, buyVolume = 0, sellVolume = 0;
          tickers.forEach((ticker: any) => {
            // CoinGecko does not provide explicit buy/sell order counts, so we use volume as proxy
            // If 'bid_ask_spread_percentage' is available, we can use it to estimate activity
            // We'll treat all as 'buys' for simplicity, or split by base/target if possible
            if (ticker.target && ticker.target.toUpperCase() === 'USDT') {
              buyVolume += ticker.converted_volume?.usd || 0;
              buys++;
            } else {
              sellVolume += ticker.converted_volume?.usd || 0;
              sells++;
            }
          });
          // If no tickers found, fallback to Binance if possible
          if (buys + sells === 0 && tokenInfo.symbol) {
            const symbol = `${tokenInfo.symbol.toUpperCase()}USDT`;
            if (VALID_TRADING_PAIRS.includes(symbol)) {
              const response = await fetch(`https://api.binance.com/api/v3/trades?symbol=${symbol}&limit=1000`);
              if (response.status === 400) {
                throw new Error(`${tokenInfo.symbol.toUpperCase()}/USDT trading pair not found on Binance`);
              }
              if (!response.ok) {
                throw new Error(`Failed to fetch trade history: ${response.status} ${response.statusText}`);
              }
              const trades = await response.json();
              if (!Array.isArray(trades) || trades.length === 0) {
                throw new Error('No trade data available for this pair');
              }
              buys = 0; sells = 0; buyVolume = 0; sellVolume = 0;
              trades.forEach((trade: { isBuyerMaker: boolean; qty: string }) => {
                if (trade.isBuyerMaker) {
                  sells++;
                  sellVolume += parseFloat(trade.qty);
                } else {
                  buys++;
                  buyVolume += parseFloat(trade.qty);
                }
              });
            } else {
              throw new Error('No trade/order data available for this token');
            }
          }
          setOrderData({
            buys,
            sells,
            buyVolume,
            sellVolume,
            buyers: buys,
            sellers: sells
          });
        } else {
          // Fallback to Binance for legacy tokens
          const symbol = `${tokenInfo.symbol.toUpperCase()}USDT`;
          if (!VALID_TRADING_PAIRS.includes(symbol)) {
            throw new Error(`${tokenInfo.symbol.toUpperCase()}/USDT trading pair not available on Binance`);
          }
          const response = await fetch(`https://api.binance.com/api/v3/trades?symbol=${symbol}&limit=1000`);
          if (response.status === 400) {
            throw new Error(`${tokenInfo.symbol.toUpperCase()}/USDT trading pair not found on Binance`);
          }
          if (!response.ok) {
            throw new Error(`Failed to fetch trade history: ${response.status} ${response.statusText}`);
          }
          const trades = await response.json();
          if (!Array.isArray(trades) || trades.length === 0) {
            throw new Error('No trade data available for this pair');
          }
          let buys = 0, sells = 0, buyVolume = 0, sellVolume = 0;
          trades.forEach((trade: { isBuyerMaker: boolean; qty: string }) => {
            if (trade.isBuyerMaker) {
              sells++;
              sellVolume += parseFloat(trade.qty);
            } else {
              buys++;
              buyVolume += parseFloat(trade.qty);
            }
          });
          setOrderData({
            buys,
            sells,
            buyVolume,
            sellVolume,
            buyers: buys,
            sellers: sells
          });
        }
      } catch (err) {
        setOrderError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrderData();
  }, [tokenInfo]);

  const renderSection = (label1: string, label2: string, value1: number, value2: number) => {
    const total = value1 + value2 || 1;
    const width1 = (value1 / total) * 100;
    const width2 = (value2 / total) * 100;
    return (
      <Card className="h-fit gap-2 mx-4 px-0 py-3 border-none dark:bg-zinc-900/80 bg-zinc-100 shadow-none">
        <CardDescription className="flex justify-between text-xs font-medium px-5 text-zinc-400">
          <p>{label1}</p>
          <p>{label2}</p>
        </CardDescription>
        <CardDescription className="flex justify-between px-5 text-md font-semibold dark:text-white text-black">
          <p>{value1.toLocaleString()}</p>
          <p>{value2.toLocaleString()}</p>
        </CardDescription>
        <CardContent className="flex flex-row gap-1 p-0">
          <div className="flex w-full h-2 gap-1 px-5">
            <div className="bg-[#00FFC2]  rounded-3xl" style={{ width: `${width1}%` }} />
            <div className="bg-[#0E76FD] rounded-3xl" style={{ width: `${width2}%` }} />
          </div>
        </CardContent>
      </Card>
    );
  };

  // Loading skeleton (token info or order data)
  if (isLoading) {
    return (
      <Card className="h-full w-full rounded-none bg-transparent flex flex-col gap-2">
        <CardTitle className="px-5">
          <div className="flex flex-row gap-5">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        </CardTitle>
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <CardDescription className="flex justify-between px-5">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </CardDescription>
            <CardDescription className="flex justify-between px-5">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-12" />
            </CardDescription>
            <CardContent className="flex flex-row gap-1 p-0">
              <Skeleton className="h-4 w-full bg-emerald-600 rounded-sm" />
              <Skeleton className="h-4 w-full bg-rose-600 rounded-sm" />
            </CardContent>
          </div>
        ))}
      </Card>
    );
  }

  // Token info error
  if (tokenError) {
    return (
      <Card className="h-full w-full rounded-none bg-transparent flex flex-col gap-3">
        <CardTitle className="px-5">
          <div className="flex flex-row gap-3 items-center mb-3">
            <div className="h-6 w-6 bg-[#00FFC2]/20 rounded-full flex items-center justify-center">
              <span className="text-[#00FFC2] text-[8px] font-bold">
                <Scale width={17} height={17} />
              </span>
            </div>
            <h1 className="dark:text-white text-black font-semibold text-md sm:text-md">Strength Index</h1>
          </div>
        </CardTitle>
        <div className="px-5 flex flex-col gap-2">
          <h2 className="text-red-500 font-medium text-sm">Unable to load order data</h2>
          <p className="text-zinc-500 text-xs">{tokenError}</p>
          <Button onClick={() => window.location.reload()} size="sm" variant="outline" className="w-fit mt-2">Retry</Button>
        </div>
      </Card>
    );
  }

  // Order data error
  if (orderError) {
    return (
      <Card className="h-full w-full rounded-none bg-transparent flex flex-col gap-3">
        <CardTitle className="px-5">
          <div className="flex flex-row gap-3 items-center mb-3">
            <div className="h-6 w-6 bg-[#00FFC2]/20 rounded-full flex items-center justify-center">
              <span className="text-[#00FFC2] text-[8px] font-bold">
                <Scale width={17} height={17} />
              </span>
            </div>
            <h1 className="dark:text-white text-black font-semibold text-md sm:text-md">Strength Index</h1>
          </div>
        </CardTitle>
        <div className="px-5 flex flex-col gap-2">
          <h2 className="text-red-500 font-medium text-sm">Unable to load order data</h2>
          <p className="text-zinc-500 text-xs">{orderError}</p>
          <div className="text-zinc-400 text-xs mt-2">
            <p>Supported pairs: {VALID_TRADING_PAIRS.slice(0, 10).join(', ')}...</p>
          </div>
          <Button onClick={() => window.location.reload()} size="sm" variant="outline" className="w-fit mt-2">Retry</Button>
        </div>
      </Card>
    );
  }

  if (!orderData) {
    return null;
  }

  return (
    <Card className="h-full w-full rounded-none border-none dark:bg-[#0F0F0F] bg-white flex flex-col gap-2 ">
      <CardTitle className="px-5 gap-3 flex">
        <div className="flex flex-row gap-3 items-center mb-3">
          <div className="h-8 w-8 dark:bg-[#00FFC2]/20 bg-[#0E76FD]/20 rounded-full flex items-center justify-center">
            <Image 
              src={tokenInfo.logoURL || ""}
              alt={tokenInfo.name}
              className="h-8 w-8  rounded-full dark:bg-zinc-800 bg-white"
              width={40}
              height={40}
            />
          </div>
          <h1 className="dark:text-white text-black font-semibold text-md sm:text-md gap-1 flex">Strength Index 
            <span className="dark:text-[#00FFC2] text-[#0E76FD]">{tokenSymbol.toUpperCase()}</span>
          </h1>
        </div>
      </CardTitle>
      {renderSection('Buy orders', 'Sell orders', orderData.buys, orderData.sells)}
      {renderSection('Buy vol', 'Sell vol', orderData.buyVolume, orderData.sellVolume)}
      {renderSection('Buyers', 'Sellers', orderData.buyers, orderData.sellers)}
    </Card>
  );
}
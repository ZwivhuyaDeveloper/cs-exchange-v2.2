import React, { useState, useEffect } from 'react';
import { Card, CardDescription, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

// Common trading pairs on Binance
const VALID_TRADING_PAIRS = [
  'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'SOLUSDT', 'DOTUSDT', 'DOGEUSDT', 
  'AVAXUSDT', 'MATICUSDT', 'LINKUSDT', 'UNIUSDT', 'LTCUSDT', 'BCHUSDT', 'XRPUSDT',
  'ATOMUSDT', 'FTMUSDT', 'NEARUSDT', 'ALGOUSDT', 'VETUSDT', 'ICPUSDT', 'FILUSDT',
  'TRXUSDT', 'ETCUSDT', 'XLMUSDT', 'HBARUSDT', 'THETAUSDT', 'XTZUSDT', 'EOSUSDT'
];

export default function OrderData({ tokenSymbol, chainId = 1 }: OrderDataProps) {
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);

  useEffect(() => {
    setTokenInfo(null);
    setTokenError(null);
    fetch(`/api/token-metadata?symbols=${tokenSymbol}&chainId=${chainId}`)
      .then(res => res.json())
      .then(tokens => setTokenInfo(tokens[0]))
      .catch(() => setTokenError('Failed to load token info'));
  }, [tokenSymbol, chainId]);

  useEffect(() => {
    const fetchOrderData = async () => {
      setIsLoading(true);
      setError(null);
      setOrderData(null);
      try {
        if (!tokenInfo) return;
        const symbol = `${tokenInfo.symbol.toUpperCase()}USDT`;
        // Check if the trading pair is valid
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
        let buys = 0;
        let sells = 0;
        let buyVolume = 0;
        let sellVolume = 0;
        trades.forEach((trade: { isBuyerMaker: boolean; qty: string }) => {
          if (trade.isBuyerMaker) {
            sells++;
            sellVolume += parseFloat(trade.qty);
          } else {
            buys++;
            buyVolume += parseFloat(trade.qty);
          }
        });
        // Approximate buyers and sellers with buys and sells due to lack of unique participant data
        const buyers = buys;
        const sellers = sells;
        setOrderData({ buys, sells, buyVolume, sellVolume, buyers, sellers });
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };
    if (tokenInfo) fetchOrderData();
  }, [tokenInfo]);

  const renderSection = (label1: string, label2: string, value1: number, value2: number) => {
    const total = value1 + value2 || 1; // Avoid division by zero
    const width1 = (value1 / total) * 100;
    const width2 = (value2 / total) * 100;
    return (
      <>
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
            <div className="bg-emerald-600  rounded-3xl" style={{ width: `${width1}%` }} />
            <div className="bg-rose-600 dark:bg-blue-600 rounded-3xl" style={{ width: `${width2}%` }} />
          </div>
        </CardContent>
      </Card>
      </>
    );
  };

  if (!tokenInfo && !tokenError) {
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

  if (tokenError) {
    return (
      <Card className="h-full w-full rounded-none bg-transparent flex flex-col gap-3">
        <CardTitle className="px-5">
          <div className="flex flex-row gap-3 items-center mb-3">
            <div className="h-6 w-6 bg-[#0E76FD]/20 rounded-full flex items-center justify-center">
              <span className="text-[#0E76FD] text-[8px] font-bold">
                <Scale width={17} height={17} />
              </span>
            </div>
            <h1 className="dark:text-white text-black font-semibold text-md sm:text-md">Strength Index</h1>
          </div>
        </CardTitle>
        <div className="px-5 flex flex-col gap-2">
          <h2 className="text-red-500 font-medium text-sm">Unable to load order data</h2>
          <p className="text-zinc-500 text-xs">{tokenError}</p>
        </div>
      </Card>
    );
  }

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

  if (error) {
    return (
      <Card className="h-full w-full rounded-none bg-transparent flex flex-col gap-3">
        <CardTitle className="px-5">
          <div className="flex flex-row gap-3 items-center mb-3">
            <div className="h-6 w-6 bg-[#0E76FD]/20 rounded-full flex items-center justify-center">
              <span className="text-[#0E76FD] text-[8px] font-bold">
                <Scale width={17} height={17} />
              </span>
            </div>
            <h1 className="dark:text-white text-black font-semibold text-md sm:text-md">Strength Index</h1>
          </div>
        </CardTitle>
        <div className="px-5 flex flex-col gap-2">
          <h2 className="text-red-500 font-medium text-sm">Unable to load order data</h2>
          <p className="text-zinc-500 text-xs">{error}</p>
          <div className="text-zinc-400 text-xs mt-2">
            <p>Supported pairs: {VALID_TRADING_PAIRS.slice(0, 10).join(', ')}...</p>
          </div>
        </div>
      </Card>
    );
  }

  if (!orderData) {
    return null; // Fallback for unexpected state
  }

  return (
    <Card className="h-full w-full rounded-none border-none dark:bg-[#0F0F0F] bg-white flex flex-col gap-2 ">
      <CardTitle className="px-5 gap-3 flex">
        <div className="flex flex-row gap-3 items-center mb-3">
          <div className="h-6 w-6 bg-[#0E76FD]/20 rounded-full flex items-center justify-center">
            <span className="text-[#0E76FD] text-[8px] font-bold">
              <Scale width={17} height={17} />
            </span>
          </div>
          <h1 className="dark:text-white text-black font-semibold text-md sm:text-md">Strength Index</h1>
        </div>
      </CardTitle>
      {renderSection('Buy orders', 'Sell orders', orderData.buys, orderData.sells)}
      {renderSection('Buy vol', 'Sell vol', orderData.buyVolume, orderData.sellVolume)}
      {renderSection('Buyers', 'Sellers', orderData.buyers, orderData.sellers)}
    </Card>
  );
}
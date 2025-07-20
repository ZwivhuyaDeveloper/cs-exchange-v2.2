// components/CryptoGlobalData.tsx
'use client';

import { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { PercentDiamond } from 'lucide-react';

interface GlobalData {
  active_cryptocurrencies: number;
  markets: number;
  total_market_cap: { usd: number };
  total_volume: { usd: number };
  market_cap_percentage: { btc: number; eth: number };
  market_cap_change_percentage_24h_usd: number;
}

interface DefiData {
  defi_market_cap: string;
  eth_market_cap: string;
  defi_to_eth_ratio: string;
  trading_volume_24h: string;
  defi_dominance: string;
}

// Cache key and expiry time (1 minute)
const CACHE_KEY = 'cryptoGlobalDataCache';
const CACHE_EXPIRY_MS = 60 * 1000; // 1 minute

export default function GlobalIndicator() {
  const [globalData, setGlobalData] = useState<GlobalData | null>(null);
  const [defiData, setDefiData] = useState<DefiData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGlobalData = async () => {
    try {
      // Check if we have a valid cache
      const cachedData = localStorage.getItem(CACHE_KEY);
      const now = Date.now();
      
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        if (now - timestamp < CACHE_EXPIRY_MS) {
          // Use cached data if it's still valid
          setGlobalData(data.globalData);
          setDefiData(data.defiData);
          setError(null);
          setIsLoading(false);
          return;
        }
      }

      // No valid cache - fetch fresh data
      const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;
      const headers: HeadersInit = {};
      if (apiKey) headers["x-cg-demo-api-key"] = apiKey;
      
      const [globalRes, defiRes] = await Promise.all([
        fetch('https://api.coingecko.com/api/v3/global', { headers }),
        fetch('https://api.coingecko.com/api/v3/global/decentralized_finance_defi', { headers })
      ]);

      if (!globalRes.ok || !defiRes.ok) {
        throw new Error('Failed to fetch market data');
      }

      const globalJson = await globalRes.json();
      const defiJson = await defiRes.json();

      // Update state
      setGlobalData(globalJson.data);
      setDefiData(defiJson.data);
      setError(null);

      // Update cache with timestamp
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: {
          globalData: globalJson.data,
          defiData: defiJson.data
        },
        timestamp: now
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Try to load from cache first
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      try {
        const { data } = JSON.parse(cachedData);
        setGlobalData(data.globalData);
        setDefiData(data.defiData);
        setIsLoading(false);
      } catch (e) {
        console.error('Failed to parse cache', e);
      }
    }

    // Fetch fresh data regardless (will use cache if valid)
    fetchGlobalData();
    
    const interval = setInterval(fetchGlobalData, 60000);
    return () => clearInterval(interval);
  }, []);

  // Format large numbers
  const formatNumber = (value: number, isCurrency = true) => {
    if (value > 1_000_000_000) {
      return isCurrency 
        ? `$${(value / 1_000_000_000).toFixed(1)}B` 
        : `${(value / 1_000_000_000).toFixed(1)}B`;
    }
    if (value > 1_000_000) {
      return isCurrency 
        ? `$${(value / 1_000_000).toFixed(1)}M` 
        : `${(value / 1_000_000).toFixed(1)}M`;
    }
    return isCurrency 
      ? `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}` 
      : value.toLocaleString(undefined, { maximumFractionDigits: 0 });
  };

  // Format percentages
  const formatPercent = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 p-4 w-full rounded-none dark:bg-[#0F0F0F] bg-white">
        <div className="items-center w-full flex flex-row gap-3">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-40" /> 
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-full h-20 p-3 rounded-2xl dark:bg-zinc-900/90 bg-zinc-100 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>
              <Skeleton className="h-5 w-24 mt-2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !globalData || !defiData) {
    return (
      <div className="flex flex-col gap-3 p-4 w-full rounded-none dark:bg-[#0F0F0F] bg-white">
        <div className="items-center w-full flex flex-row gap-3">
          <div className="h-6 w-6 bg-red-500/20 rounded-full flex items-center justify-center">
            <PercentDiamond className="text-red-500" size={16} />
          </div>
          <h1 className="dark:text-white text-black font-semibold text-md">
            Crypto Market Stats
          </h1>
        </div>
        
        <div className="text-center py-4 text-red-400 text-sm">
          Failed to load market data: {error || 'Unknown error'}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-full h-20 p-3 rounded-2xl dark:bg-zinc-900/80 bg-zinc-100 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>
              <Skeleton className="h-5 w-24 mt-2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-4 w-full rounded-none dark:bg-[#0F0F0F] bg-white">
      <div className="items-center w-full flex flex-row gap-3">
        <div className="h-6 w-6 bg-blue-500/20 rounded-full flex items-center justify-center">
          <PercentDiamond className="text-blue-500" size={16} />
        </div>
        <h1 className="dark:text-white text-black font-bold text-md">
          Global Crypto Market Stats
        </h1>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-bold">
        <StatItem 
          title="Total Market Cap" 
          value={formatNumber(globalData.total_market_cap.usd)} 
          change={globalData.market_cap_change_percentage_24h_usd}
        />
        <StatItem 
          title="24h Volume" 
          value={formatNumber(globalData.total_volume.usd)} 
        />
        <StatItem 
          title="Active Tokens" 
          value={globalData.active_cryptocurrencies.toLocaleString()} 
        />
        <StatItem 
          title="Active Markets" 
          value={globalData.markets.toLocaleString()} 
        />
        <StatItem 
          title="BTC Dominance" 
          value={`${globalData.market_cap_percentage.btc.toFixed(1)}%`} 
        />
        <StatItem 
          title="ETH Dominance" 
          value={`${globalData.market_cap_percentage.eth.toFixed(1)}%`} 
        />
        <StatItem 
          title="DeFi Market Cap" 
          value={formatNumber(parseFloat(defiData.defi_market_cap))} 
        />
        <StatItem 
          title="DeFi Dominance" 
          value={`${parseFloat(defiData.defi_dominance).toFixed(1)}%`} 
        />
      </div>
    </div>
  );
}

function StatItem({ 
  title, 
  value, 
  change,
}: { 
  title: string; 
  value: string | number; 
  change?: number;
}) {
  return (
    <div className="w-full h-20 p-3 rounded-2xl dark:bg-zinc-900/80 bg-zinc-100 backdrop-blur-sm">
      <div className="flex  items-center justify-between gap-2 ">
        <h1 className="text-xs font-medium text-zinc-400">{title}</h1>
        {/* percentage display works*/}
        {/*{change !== undefined && (
          <span className={`text-xs px-2 py-1 flex flex-row items-center w-22 rounded-full ${
            change >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {change >= 0 ? '↑' : '↓'} {Math.abs(change).toFixed(2)}%
          </span>
        )} */}
      </div>
      <h2 className="text-md font-semibold mt-1 truncate">
        {value}
      </h2>
    </div>
  );
}
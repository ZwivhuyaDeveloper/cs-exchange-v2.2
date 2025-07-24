// app/components/VolumeChart.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface VolumeChartProps {
  tokenSymbol: string;
  chainId?: number;
}

interface TokenMetadata {
  coingeckoId: string;
  symbol: string;
  name: string;
}

interface CoinGeckoMarketChartResponse {
  total_volumes: [number, number][]; // Tuple of [timestamp, volume]
}

interface TokenVolumeData {
  timePeriod: string;
  buyVolume: number;
  sellVolume: number;
}

export default function VolumeChart({ tokenSymbol, chainId = 1 }: VolumeChartProps) {
  const [tokenInfo, setTokenInfo] = useState<TokenMetadata | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);

  useEffect(() => {
    setTokenInfo(null);
    setTokenError(null);
    fetch(`/api/token-metadata?symbols=${tokenSymbol}&chainId=${chainId}`)
      .then(res => res.json())
      .then((tokens: TokenMetadata[]) => setTokenInfo(tokens[0]))
      .catch(() => setTokenError('Failed to load token info'));
  }, [tokenSymbol, chainId]);

  const coingeckoId = tokenInfo?.coingeckoId;

  // Fetch function for volume data
  const fetchVolumeData = async (): Promise<TokenVolumeData[]> => {
    if (!coingeckoId) throw new Error('Token not supported');
    
    const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;
    const headers: HeadersInit = {};
    if (apiKey) headers["x-cg-demo-api-key"] = apiKey;
    
    // Fetch hourly volume data for the last 7 days
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coingeckoId}/market_chart?vs_currency=usd&days=7&interval=hourly`,
      { headers }
    );
    
    if (!res.ok) {
      throw new Error(`Failed to fetch volume data: ${res.status} ${res.statusText}`);
    }
    
    const data: CoinGeckoMarketChartResponse = await res.json();
    const volumeData = data.total_volumes;
    
    // Calculate time period volumes
    const now = Date.now();
    const periods = [
      { label: "1h", hours: 1 },
      { label: "4h", hours: 4 },
      { label: "12h", hours: 12 },
      { label: "24h", hours: 24 },
      { label: "3d", hours: 72 },
      { label: "7d", hours: 168 },
    ];
    
    return periods.map(period => {
      const cutoff = now - period.hours * 60 * 60 * 1000;
      const periodData = volumeData.filter(point => point[0] >= cutoff);
      
      if (periodData.length === 0) {
        return {
          timePeriod: period.label,
          buyVolume: 0,
          sellVolume: 0
        };
      }
      
      const totalVolume = periodData.reduce((sum, point) => sum + point[1], 0);
      
      // Simulate buy/sell ratio (60/40 split for demonstration)
      // In a real production system, this would come from order book data
      const buyRatio = 0.6;
      const sellRatio = 0.4;
      
      return {
        timePeriod: period.label,
        buyVolume: totalVolume * buyRatio,
        sellVolume: totalVolume * sellRatio
      };
    });
  };

  const {
    data: volumeData,
    isLoading,
    error,
    isError,
    refetch
  } = useQuery({
    queryKey: ['volumeData', coingeckoId],
    queryFn: fetchVolumeData,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    enabled: !!coingeckoId,
  });

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const buyVolume = payload[0].value;
      const sellVolume = payload[1].value;
      const netVolume = buyVolume - sellVolume;
      const netPercentage = Math.round((Math.abs(netVolume) / (buyVolume + sellVolume)) * 100);
      
      return (
        <div className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg">
          <p className="font-medium text-sm">{label}</p>
          <div className="flex items-center mt-1">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm">
              Buy: ${buyVolume.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="flex items-center mt-1">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm">
              Sell: ${sellVolume.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <span className={`text-sm font-medium ${netVolume >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              Net: {netVolume >= 0 ? 'Buy' : 'Sell'} Dominance ({netPercentage}%)
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  if (!tokenInfo && !tokenError) {
    return (
      <div className="w-full p-4 rounded-2xl dark:bg-[#0F0F0F] bg-white border border-zinc-200 dark:border-zinc-800">
        <Skeleton className="w-40 h-6 mb-4" />
        <Skeleton className="w-full h-[200px]" />
      </div>
    );
  }

  if (tokenError) {
    return (
      <div className="w-full p-4 rounded-2xl dark:bg-[#0F0F0F] bg-white border border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-row justify-between items-center mb-4">
          <Skeleton className="w-40 h-6" />
          <Skeleton className="w-10 h-3" />
        </div>
        <div className="flex flex-col items-center justify-center p-6 gap-3">
          <h1 className="text-red-500 font-medium text-sm">Error loading token info</h1>
          <p className="text-zinc-500 text-xs text-center">{tokenError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="text-sm px-3 py-1.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 w-fit"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full p-4 rounded-2xl dark:bg-[#0F0F0F] bg-white border border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-row justify-between items-center mb-4">
          <Skeleton className="w-40 h-6" />
          <Skeleton className="w-10 h-3" />
        </div>
        <Skeleton className="w-full h-[200px]" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full p-4 rounded-2xl dark:bg-[#0F0F0F] bg-white border border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-row justify-between items-center mb-4">
          <Skeleton className="w-40 h-6" />
          <Skeleton className="w-10 h-3" />
        </div>
        <div className="flex flex-col items-center justify-center p-6 gap-3">
          <h1 className="text-red-500 font-medium text-sm">Error loading volume data</h1>
          <p className="text-zinc-500 text-xs text-center">{error?.message}</p>
          <button 
            onClick={() => refetch()} 
            className="text-sm px-3 py-1.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 w-fit"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 rounded-2xl dark:bg-[#0F0F0F] bg-white border border-zinc-200 dark:border-zinc-800">
      <div className='flex flex-row justify-between items-center mb-4'>
        <div className="items-center flex flex-row gap-3">
          <div className="h-6 w-6 bg-[#0E76FD]/20 rounded-full flex items-center justify-center">
            <span className="text-[#0E76FD] text-[8px] font-bold"><BarChart2 width={16} height={16}/></span>
          </div>
          <h1 className="dark:text-white text-black font-semibold text-md">
            Volume Index for <span className="dark:text-[#0E76FD] text-[#0E76FD]">{tokenSymbol.toUpperCase()}</span>
          </h1>
        </div>

        <div className='flex flex-row items-center justify-center h-fit w-fit'>
          <div className='w-3 h-3 bg-green-300 rounded-full translate-x-3'/>
          <div className='w-3 h-3 bg-green-500 rounded-full translate-x-2'/>
          <div className='w-3 h-3 bg-green-700 rounded-full translate-x-1'/>
        </div>
      </div>
      
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={volumeData}
            margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
            barCategoryGap={15}
            barGap={2}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis 
              dataKey="timePeriod" 
              axisLine={false} 
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
                if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
                return `$${value}`;
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="buyVolume" 
              name="Buy Volume" 
              fill="#4CAF50" 
              radius={[4, 4, 0, 0]} 
              barSize={20}
            />
            <Bar 
              dataKey="sellVolume" 
              name="Sell Volume" 
              fill="#F44336" 
              radius={[4, 4, 0, 0]} 
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-center gap-4 mt-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-sm">Buy Volume</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
          <span className="text-sm">Sell Volume</span>
        </div>
      </div>
    </div>
  );
}
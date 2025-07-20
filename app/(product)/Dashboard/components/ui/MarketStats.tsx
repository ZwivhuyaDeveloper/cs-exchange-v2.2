'use client';

import { useQuery } from '@tanstack/react-query';
import { Skeleton } from "@/components/ui/skeleton";
import { COINGECKO_IDS } from "@/src/constants";
import { PercentDiamond } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MarketStatsProps {
  tokenSymbol: string;
  chainId?: number;
}

interface MarketData {
  volume24h: number;
  volume24hChange: number;
  marketCap: number;
  marketCapChange: number;
  fdv: number;
  fdvChange: number;
  circulatingSupply: number;
  circulatingSupplyChange: number;
}

// Fetch function for market data
const fetchMarketData = async (tokenSymbol: string): Promise<MarketData> => {
      const coingeckoId = COINGECKO_IDS[tokenSymbol.toLowerCase()];
      if (!coingeckoId) {
    throw new Error('Token not supported');
      }

        const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;
        const headers: HeadersInit = {};
        if (apiKey) headers["x-cg-demo-api-key"] = apiKey;

        const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coingeckoId}`, { headers });
  if (!res.ok) {
    throw new Error(`Failed to fetch market data: ${res.status} ${res.statusText}`);
  }

        const data = await res.json();
  
  return {
          volume24h: data.market_data.total_volume.usd,
          volume24hChange: data.market_data.price_change_percentage_24h,
          marketCap: data.market_data.market_cap.usd,
          marketCapChange: data.market_data.market_cap_change_percentage_24h,
          fdv: data.market_data.current_price.usd * data.market_data.total_supply,
          fdvChange: data.market_data.price_change_percentage_24h,
          circulatingSupply: data.market_data.circulating_supply,
          circulatingSupplyChange: data.market_data.circulating_supply_change_24h || 0
  };
}

export default function MarketStats({ tokenSymbol }: MarketStatsProps) {
  const {
    data: marketData,
    isLoading,
    error,
    refetch,
    isError
  } = useQuery({
    queryKey: ['marketStats', tokenSymbol.toLowerCase()],
    queryFn: () => fetchMarketData(tokenSymbol),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !!tokenSymbol,
  });

  if (isLoading) {
    return (
      <div className="grid grid-rows-2 gap-2 p-4 w-full bg-transparent rounded-2xl">
        <div className="w-full flex justify-between items-center">
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 w-full dark:bg-zinc-950 bg-white rounded gap-5 h-fit">
        <div className='grid grid-col-2 gap-3 w-full'>
          <div className='grid grid-cols-2 gap-3 w-full'>
            <div className='gap-2 flex flex-col'>
              <Skeleton className='w-full  rounded-3xl h-6'/>
              <Skeleton className='w-full  rounded-3xl h-8'/>
            </div>
            <div className='gap-2 flex flex-col'>
              <Skeleton className='w-full  rounded-3xl h-6'/>
              <Skeleton className='w-full  rounded-3xl h-8'/>
            </div>
            <div className='gap-2 flex flex-col'>
              <Skeleton className='w-full  rounded-3xl h-6'/>
              <Skeleton className='w-full  rounded-3xl h-8'/>
            </div>
            <div className='gap-2 flex flex-col'>
              <Skeleton className='w-full  rounded-3xl h-6'/>
              <Skeleton className='w-full  rounded-3xl h-8'/>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-red-500 font-medium text-sm">Error loading market data</h1>
          <p className="text-zinc-500 text-xs">{error?.message}</p>
          <Button 
            onClick={() => refetch()} 
            size="sm" 
            variant="outline"
            className="w-fit"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-4 w-full  rounded-none dark:bg-[#0F0F0F] bg-white">

      <div className='flex flex-row justify-between items-center'>
        <div className="items-center w-full flex flex-row gap-3">
          <div className="h-6 w-6 bg-[#0E76FD]/20 rounded-full flex items-center justify-center">
            <span className="text-[#0E76FD] text-[8px] font-bold"><PercentDiamond width={16} height={16}/></span>
          </div>
          <h1 className="dark:text-white text-black font-semibold text-md sm:text-md">
            Market stats for <span className="dark:text-[#0E76FD] text-[#0E76FD]">{tokenSymbol.toUpperCase()}</span>
          </h1>
        </div>

        <div className='flex flex-row items-center justify-center h-fit w-fit'>
          <div className=' w-3 h-3 bg-green-300 rounded-full translate-x-3 '/>
          <div className=' w-3 h-3 bg-green-500 rounded-full translate-x-2 '/>
          <div className=' w-3 h-3 bg-green-700 rounded-full translate-x-1 '/>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="flex flex-col gap-2">
          <StatItem 
            title="Volume (24h)" 
            value={marketData?.volume24h} 
            change={marketData?.volume24hChange}
            isCurrency={true} 
          />
          <StatItem 
            title="Market Cap" 
            value={marketData?.marketCap} 
            change={marketData?.marketCapChange}
            isCurrency={true} 
          />
        </div>
        <div className="flex flex-col gap-2">
          <StatItem 
            title="FDV" 
            value={marketData?.fdv} 
            change={marketData?.fdvChange}
            isCurrency={true} 
          />
          <StatItem 
            title="Circulating Supply" 
            value={marketData?.circulatingSupply} 
            change={marketData?.circulatingSupplyChange}
            isCurrency={false} 
          />
        </div>
      </div>
    </div>
  );
}

function StatItem({ title, value, change = 0, isCurrency }: { 
  title: string; 
  value: number | undefined; 
  change?: number;
  isCurrency: boolean; 
}) {
  const formattedChange = Math.abs(change) > 0.01 ? change.toFixed(2) : change?.toFixed(2);
  const formattedValue = value ? 
    isCurrency
      ? `$${value.toLocaleString(undefined, { 
          maximumFractionDigits: value > 1000 ? 0 : 2,
          notation: value > 1e6 ? 'compact' : 'standard'
        })}`
      : value.toLocaleString(undefined, {
          notation: value > 1e6 ? 'compact' : 'standard',
          maximumFractionDigits: 0
        })
    : 'N/A';

  return (
    <div className="w-full h-23 p-3 rounded-2xl dark:bg-zinc-900/80 bg-zinc-100 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-sm sm:text-xs md:text-xs lg:text-xs font-semibold text-zinc-400">{title}</h1>
        {change !== undefined && (
          <span className={`text-xs font-medium text-[11px] px-2 py-1 rounded-full flex flex-row ${
            change >= 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
          }`}>
            {change >= 0 ? '' : ''} {formattedChange}%
          </span>
        )}
      </div>
      <h2 className="text-md font-semibold mt-1 truncate">
        {formattedValue}
      </h2>
    </div>
  );
}
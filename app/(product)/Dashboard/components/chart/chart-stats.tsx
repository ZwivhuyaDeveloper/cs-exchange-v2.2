'use client';

import { useQuery } from '@tanstack/react-query';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from '@/components/ui/button';
import { useTokenMetadata } from '../../services/dashboardService';
import { useEffect, useState } from 'react';

interface MarketStatsProps {
  tokenSymbol: string;
  chainId?: number;
}

interface MarketData {
  volume24h: number;
  marketCap: number;
  fdv: number;
  circulatingSupply: number;
  holders?: number;
  liquidity?: number;
}

export default function ChartStats({ tokenSymbol, chainId = 1 }: MarketStatsProps) {
  const { token: tokenInfo, isLoading: isTokenLoading, error: tokenError } = useTokenMetadata(tokenSymbol, chainId);
  const coingeckoId = tokenInfo?.coingeckoId || '';

  // Fetch function for market data
  const fetchMarketData = async (): Promise<MarketData> => {
    if (!coingeckoId) throw new Error('Token not supported');
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
      marketCap: data.market_data.market_cap.usd,
      fdv: data.market_data.current_price.usd * data.market_data.total_supply,
      circulatingSupply: data.market_data.circulating_supply,
    };
  };

  const {
    data: marketData,
    isLoading,
    error,
    refetch,
    isError
  } = useQuery({
    queryKey: ['chartStats', coingeckoId],
    queryFn: fetchMarketData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !!coingeckoId,
  });

  if (isTokenLoading) {
    return (
      <div className="hidden lg:flex sm:grid-row-2 gap-1 w-full h-22 overflow-hidden rounded-2xl items-center">
        <div className="w-full h-full rounded-2xl gap-1 flex flex-row justify-between items-center">
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="w-full gap-1 h-full justify-center items-center flex flex-row">
          <div className="flex flex-col gap-1 w-full h-full">
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
          </div>
          <div className="flex flex-col gap-1 w-full h-full">
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
          </div>
          <div className="flex flex-col gap-1 w-full h-full">
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (tokenError) {
    const errorMessage = tokenError && typeof tokenError === 'object' && 'message' in tokenError 
      ? String((tokenError as Error).message) 
      : 'Failed to load token info';
      
    return (
      <div className="p-4 w-full hidden lg:flex sm:flex dark:bg-zinc-950 bg-white rounded gap-5 h-22">
        <div className='grid grid-col-2 gap-3 w-full'>
          <div className='grid grid-cols-2 gap-3 w-full'>
            <div className='gap-2 flex flex-col'>
              <Skeleton className='w-full rounded-3xl h-6'/>
              <Skeleton className='w-full rounded-3xl h-8'/>
            </div>
            <div className='gap-2 flex flex-col'>
              <Skeleton className='w-full rounded-3xl h-6'/>
              <Skeleton className='w-full rounded-3xl h-8'/>
            </div>
            <div className='gap-2 flex flex-col'>
              <Skeleton className='w-full rounded-3xl h-6'/>
              <Skeleton className='w-full rounded-3xl h-8'/>
            </div>
            <div className='gap-2 flex flex-col'>
              <Skeleton className='w-full rounded-3xl h-6'/>
              <Skeleton className='w-full rounded-3xl h-8'/>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-red-500 font-medium text-sm">Error loading token info</h1>
          <p className="text-zinc-500 text-xs">{errorMessage}</p>
          <Button 
            onClick={() => window.location.reload()} 
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

  if (isLoading) {
    return (
      <div className="hidden lg:flex sm:grid-row-2 gap-1 w-full h-22 overflow-hidden rounded-2xl items-center">
        <div className="w-full h-full rounded-2xl gap-1 flex flex-row justify-between items-center">
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="w-full gap-1 h-60 justify-center items-center flex flex-row">
          <div className="flex flex-col gap-1 w-full h-full">
            <Skeleton className="h-full w-full rounded-2xl" />
            <Skeleton className="h-full w-full rounded-2xl" />
          </div>
          <div className="flex flex-col gap-1 w-full h-full">
            <Skeleton className="h-full w-full rounded-2xl" />
            <Skeleton className="h-full w-full rounded-2xl" />
          </div>
          <div className="flex flex-col gap-1 w-full h-full">
            <Skeleton className="h-full w-full rounded-2xl" />
            <Skeleton className="h-full w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    const errorMessage = error && typeof error === 'object' && 'message' in error 
      ? String((error as Error).message) 
      : 'An error occurred';
      
    return (
      <div className="p-4 w-full hidden lg:flex sm:grid-row-2 dark:bg-zinc-950 bg-white rounded gap-5 h-22">
        <div className='grid grid-col-2 gap-3 w-full'>
          <div className='grid grid-cols-2 gap-3 w-full'>
            <div className='gap-2 flex flex-col'>
              <Skeleton className='w-full rounded-3xl h-6'/>
              <Skeleton className='w-full rounded-3xl h-8'/>
            </div>
            <div className='gap-2 flex flex-col'>
              <Skeleton className='w-full rounded-3xl h-6'/>
              <Skeleton className='w-full rounded-3xl h-8'/>
            </div>
            <div className='gap-2 flex flex-col'>
              <Skeleton className='w-full rounded-3xl h-6'/>
              <Skeleton className='w-full rounded-3xl h-8'/>
            </div>
            <div className='gap-2 flex flex-col'>
              <Skeleton className='w-full rounded-3xl h-6'/>
              <Skeleton className='w-full rounded-3xl h-8'/>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-red-500 font-medium text-sm">Error loading market data</h1>
          <p className="text-zinc-500 text-xs">{errorMessage}</p>
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

  if (!marketData) {
    return (
      <div className="hidden lg:flex sm:grid-row-2 gap-1 p-3 px-5 py-5 w-full h-full overflow-hidden dark:bg-[#0E76FD] bg-zinc-100 rounded-2xl">
        <p className="text-zinc-500 text-sm">No market data available for {tokenSymbol.toUpperCase()}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-fit items-center justify-center">
      <div className="w-full gap-2 h-fit justify-between items-center flex container text-md font-semibold">
        <StatItem title="Volume (24h)" value={marketData.volume24h} isCurrency={true} />
        <StatItem title="Market Cap" value={marketData.marketCap} isCurrency={true} />
        <StatItem title="FDV" value={marketData.fdv} isCurrency={true} />
        <StatItem title="Circulating Supply" value={marketData.circulatingSupply} isCurrency={false} />
      </div>
    </div>
  );
}

function StatItem({ title, value, isCurrency }: { title: string; value: number | undefined; isCurrency: boolean }) {
  return (
    <div className="w-full h-12 rounded-2xl justify-between hidden md:flex lg:flex-col text-start items-center">
      <h1 className="text-xs md:text-sm lg:text-sm w-full font-medium text-zinc-400">{title}</h1>
      <h2 className="text-xs  md:text-sm lg:text-[15px] text-start font-semibold w-full">
        {value !== undefined
          ? isCurrency
            ? `$${value.toLocaleString()}`
            : value.toLocaleString()
          : 'N/A'}
      </h2>
    </div>
  );
}
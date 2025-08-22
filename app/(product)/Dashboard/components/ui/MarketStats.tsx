'use client';

import { useQuery } from '@tanstack/react-query';
import { Skeleton } from "@/components/ui/skeleton";
import { PercentDiamond, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTokenMetadata } from '../../services/dashboardService';
import Image from 'next/image';
import { InfoCard } from './InfoCard';
import { getMarketStatsInfo } from './componentData';

import { useMarketData } from '../../services/dashboardService';


interface MarketStatsProps {
  tokenSymbol: string;
  chainId?: number;
}

type ErrorType = string | { message: string } | null | undefined;

interface MarketData {
  volume24h: number;
  volume24hChange: number;
  marketCap: number;
  marketCapChange: number;
  fdv: number;
  fdvChange: number;
  circulatingSupply: number;
  circulatingSupplyChange: number;
  price: number;
  priceChange: number;
}

export default function MarketStats({ tokenSymbol, chainId = 1 }: MarketStatsProps) {
  const { token: tokenInfo, error: tokenError, isLoading } = useTokenMetadata(tokenSymbol, chainId);
  const { marketData, isLoading: marketLoading, error: marketError } = useMarketData(tokenSymbol, chainId);

  console.log('MarketStats render:', {
    tokenInfo,
    tokenError,
    isLoading,
    marketData,
    marketLoading,
    marketError,
    hasMarketData: !!marketData
  });

  // Derive the coingeckoId if needed
  const coingeckoId = tokenInfo?.coingeckoId;

  // Show loading state if either query is still loading
  if (isLoading || marketLoading) {
    return (
      <div className="p-4 w-full bg-transparent rounded-2xl">
        <div className="w-full flex justify-between items-center mb-4">
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-4 rounded-xl border border-border">
              <Skeleton className="h-5 w-24 mb-2" />
              <Skeleton className="h-7 w-32" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Show error state if either query has an error
  if (tokenError || marketError) {
    const getErrorMessage = (error: ErrorType): string => {
      if (!error) return 'Unknown error';
      if (typeof error === 'string') return error;
      return error.message || 'Unknown error';
    };
    
    const errorMessage = tokenError ? getErrorMessage(tokenError) : 
                        marketError ? getErrorMessage(marketError) : 
                        'Unknown error';
    console.error('Error in MarketStats:', { tokenError, marketError });
    return (
      <div className="p-4 w-full bg-destructive/10 border border-destructive rounded-2xl">
        <p className="text-destructive">Error loading market data: {errorMessage}</p>
      </div>
    );
  }

  // If we don't have token info but also no error, show a more specific message
  if (!tokenInfo) {
    return (
      <div className="p-4 w-full bg-muted/50 rounded-2xl">
        <p>No token information available for {tokenSymbol}</p>
      </div>
    );
  }

  // Main content rendering
  if (!marketData) {
    return (
      <div className="p-4 w-full bg-muted/50 rounded-2xl">
        <p>No market data available for {tokenSymbol}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-4 w-full rounded-none dark:bg-[#0F0F0F] bg-white">
      <div className='flex flex-row justify-between items-center mb-2'>
        <div className="items-center w-full flex flex-row gap-3">
          <div className="sm:h-6 sm:w-6 h-8 w-8 dark:bg-zinc-800 bg-zinc-300 rounded-full flex items-center justify-center">
            {tokenInfo && (
              <Image 
                src={tokenInfo.logoURI || tokenInfo.logoURL || "/placeholder-token.png"}
                alt={tokenInfo.name}
                className="sm:h-6 sm:w-6 h-8 w-8 rounded-full dark:bg-zinc-800 bg-white"
                width={24}
                height={24}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder-token.png";
                }}
              />
            )}
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold">{tokenInfo?.name || tokenSymbol}</h2>
            <p className="text-sm text-muted-foreground">{tokenInfo?.symbol || tokenSymbol}</p>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <InfoCard {...getMarketStatsInfo()} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">
        <StatItem 
          title="Volume (24h)" 
          value={marketData.volume24h} 
          change={marketData.volume24hChange} 
          isCurrency={true} 
        />
        <StatItem 
          title="Market Cap" 
          value={marketData.marketCap} 
          change={marketData.marketCapChange} 
          isCurrency={true} 
        />
        <StatItem 
          title="FDV" 
          value={marketData.fdv} 
          change={marketData.fdvChange} 
          isCurrency={true} 
        />
        <StatItem 
          title="Circulating Supply" 
          value={marketData.circulatingSupply} 
          change={marketData.circulatingSupplyChange} 
          isCurrency={false} 
          showPlusSign={false}
        />
      </div>
    </div>
  );
}

function StatItem({ title, value, change = 0, isCurrency, showPlusSign = true }: { 
  title: string; 
  value: number | undefined; 
  change?: number;
  isCurrency: boolean;
  showPlusSign?: boolean;
}) {
  const formattedChange = Math.abs(change) > 0.01 ? change.toFixed(2) : change?.toFixed(2);
  const formattedValue = value ? (
    <span>
      {isCurrency 
        ? `$${value.toLocaleString(undefined, { 
            minimumFractionDigits: 0,
            maximumFractionDigits: value >= 1e9 ? 2 : 0,
            notation: 'compact',
            compactDisplay: 'short'
          })}`
        : value.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
            notation: 'compact',
            compactDisplay: 'short'
          })}
    </span>
  ) : 'N/A';

  return (
    <div className="w-full h-23 p-4 sm:p-3 rounded-2xl dark:bg-zinc-900 bg-zinc-200/50 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-sm sm:text-xs md:text-xs lg:text-xs font-medium text-zinc-400">{title}</h1>
        {change !== undefined && (
          <span className={`text-xs font-medium sm:text-[11px] text-[12px]  px-2 py-1 rounded-full flex flex-row ${
            change >= 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
          }`}>
            {change >= 0 && showPlusSign ? '+' : ''}{formattedChange}%
          </span>
        )}
      </div>
      <h2 className="sm:text-sm text-md font-semibold mt-1 truncate">
        {formattedValue}
      </h2>
    </div>
  );
}
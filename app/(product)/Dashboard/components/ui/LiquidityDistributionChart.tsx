'use client';

import { useQuery } from '@tanstack/react-query';
import { BarChart3, RefreshCw } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from '@/components/ui/button';
import { useTokenMetadata } from '../../services/dashboardService';
import { formatNumber, formatCurrency } from '@/lib/utils';
import { InfoCard } from './InfoCard';
import { getLiquidityDistributionInfo } from './componentData';
import Image from 'next/image';
// Token type is inferred from useTokenMetadata

interface LiquidityDistributionProps {
  tokenSymbol: string;
  chainId?: number;
}

interface LiquidityData {
  exchange: string;
  liquidity: number;
  volume24h: number;
  marketShare: number;
}

interface ExchangeData {
  name: string;
  liquidity: number;
  volume_24h: number;
}

const fetchLiquidityData = async (coingeckoId: string): Promise<LiquidityData[]> => {
  if (!coingeckoId) throw new Error('Token not supported');
  const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;
  const headers: HeadersInit = {};
  if (apiKey) headers["x-cg-demo-api-key"] = apiKey;
  
  const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coingeckoId}/tickers`, { 
    headers,
    next: { revalidate: 300 } // 5 minute cache
  });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch liquidity data: ${res.status} ${res.statusText}`);
  }
  
  const data = await res.json();
  const exchanges = data.tickers || [];
  const exchangeMap = new Map<string, ExchangeData>();
  
  exchanges.forEach((ticker: any) => {
    const exchange = ticker.market?.name || 'Unknown';
    const volume = ticker.converted_volume?.usd || 0;
    const liquidity = ticker.converted_volume?.usd || 0;
    
    if (exchangeMap.has(exchange)) {
      exchangeMap.get(exchange)!.liquidity += liquidity;
      exchangeMap.get(exchange)!.volume_24h += volume;
    } else {
      exchangeMap.set(exchange, {
        name: exchange,
        liquidity,
        volume_24h: volume
      });
    }
  });
  
  const totalLiquidity = Array.from(exchangeMap.values()).reduce((sum, ex) => sum + ex.liquidity, 0);
  const liquidityData = Array.from(exchangeMap.values())
    .filter(ex => ex.liquidity > 0)
    .sort((a, b) => b.liquidity - a.liquidity)
    .slice(0, 8)
    .map(ex => ({
      exchange: ex.name,
      liquidity: ex.liquidity,
      volume24h: ex.volume_24h,
      marketShare: totalLiquidity > 0 ? (ex.liquidity / totalLiquidity) * 100 : 0
    }));
    
  return liquidityData;
};

interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

const chartConfig: ChartConfig = {
  liquidity: {
    label: "Liquidity",
    color: "var(--chart-1)",
  },
};

export default function LiquidityDistributionChart({ tokenSymbol, chainId = 1 }: LiquidityDistributionProps) {
  const { token: tokenInfo, isLoading: isTokenLoading, error: tokenError } = useTokenMetadata(tokenSymbol, chainId);
  const coingeckoId = tokenInfo?.coingeckoId || '';

  const {
    data: liquidityData,
    isLoading,
    error,
    refetch,
    isError
  } = useQuery<LiquidityData[], Error>({
    queryKey: ['liquidityDistribution', coingeckoId],
    queryFn: () => fetchLiquidityData(coingeckoId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !!coingeckoId,
  });

  if (isTokenLoading || !tokenInfo) {
    return (
      <Card className="h-full w-full rounded-none border-none dark:bg-[#0F0F0F] bg-white flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (tokenError) {
    const errorMessage = typeof tokenError === 'object' && tokenError !== null && 'message' in tokenError 
      ? String(tokenError.message) 
      : 'An error occurred';
    return (
      <Card className="h-full w-full rounded-none border-none dark:bg-[#0F0F0F] bg-white flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-red-500" />
              </div>
              <h2 className="text-lg font-semibold">Liquidity Distribution</h2>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <p className="text-red-500 font-medium mb-2">Failed to load token data</p>
          <p className="text-sm text-muted-foreground mb-4">{errorMessage}</p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.reload()}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="h-full w-full rounded-none border-none dark:bg-[#0F0F0F] bg-white flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-amber-500" />
              </div>
              <h2 className="text-lg font-semibold">Liquidity Distribution</h2>
            </div>
            <InfoCard {...getLiquidityDistributionInfo()} />
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <p className="text-amber-500 font-medium mb-2">Failed to load liquidity data</p>
          <p className="text-sm text-muted-foreground mb-4">
            {error instanceof Error ? error.message : 'An unknown error occurred'}
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => refetch()}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!liquidityData || liquidityData.length === 0) {
    return (
      <Card className="rounded-none border-none bg-white dark:bg-[#0F0F0F]">
        <CardHeader className="px-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-full p-1 bg-[#00FFC2]/30 text-[#00FFC2]">
                <BarChart3 strokeWidth={3} width={18} height={18}/>
              </div>
              <CardTitle>Liquidity Distribution</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-500 text-sm">No liquidity data available for {tokenSymbol.toUpperCase()}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-none border-none bg-white dark:bg-[#0F0F0F]">
      <CardHeader className="px-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {tokenInfo?.logoURL ? (
              <div className="h-6 w-6 rounded-full overflow-hidden">
                <Image 
                  src={tokenInfo.logoURL}
                  alt={tokenInfo.name || 'Token'}
                  width={24}
                  height={24}
                  className="h-6 w-6 object-cover"
                />
              </div>
            ) : (
              <div className="rounded-full p-1 bg-[#00FFC2]/30 text-[#00FFC2]">
                <BarChart3 strokeWidth={3} width={18} height={18}/>
              </div>
            )}
            <CardTitle className="flex items-center gap-2">
              Liquidity Distribution
              {tokenInfo && <span className="text-[#00FFC2] font-medium">{tokenSymbol.toUpperCase()}</span>}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <InfoCard {...getLiquidityDistributionInfo()} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {liquidityData.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{item.exchange}</span>
                <span className="dark:text-white text-black">{formatCurrency(item.liquidity)}</span>
              </div>
              <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#00FFC2] rounded-full" 
                  style={{ width: `${item.marketShare}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Market Share: {item.marketShare.toFixed(2)}%</span>
                <span>24h Vol: {formatCurrency(item.volume24h)}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
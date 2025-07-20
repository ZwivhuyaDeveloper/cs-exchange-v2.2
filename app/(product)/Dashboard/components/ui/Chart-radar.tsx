"use client"

import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Activity } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

interface VolumeRadarProps {
  tokenSymbol: string;
  chainId?: number;
}

interface VolumeData {
  exchange: string;
  volume24h: number;
  marketShare: number;
  actualMarketShare: number;
}

interface ExchangeData {
  name: string;
  volume_24h: number;
}

const fetchVolumeData = async (coingeckoId: string): Promise<VolumeData[]> => {
  if (!coingeckoId) throw new Error('Token not supported');
  const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;
  const headers: HeadersInit = {};
  if (apiKey) headers["x-cg-demo-api-key"] = apiKey;
  const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coingeckoId}/tickers`, { headers });
  if (!res.ok) {
    throw new Error(`Failed to fetch volume data: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  const exchanges = data.tickers || [];
  const exchangeMap = new Map<string, ExchangeData>();
  exchanges.forEach((ticker: any) => {
    const exchange = ticker.market?.name || 'Unknown';
    const volume = ticker.converted_volume?.usd || 0;
    if (exchangeMap.has(exchange)) {
      exchangeMap.get(exchange)!.volume_24h += volume;
    } else {
      exchangeMap.set(exchange, {
        name: exchange,
        volume_24h: volume
      });
    }
  });
  const totalVolume = Array.from(exchangeMap.values()).reduce((sum, ex) => sum + ex.volume_24h, 0);
  const volumeData = Array.from(exchangeMap.values())
    .filter(ex => ex.volume_24h > 0)
    .sort((a, b) => b.volume_24h - a.volume_24h)
    .slice(0, 6)
    .map(ex => {
      const marketShare = totalVolume > 0 ? (ex.volume_24h / totalVolume) * 100 : 0;
      const scaledMarketShare = marketShare * 3;
      return {
        exchange: ex.name,
        volume24h: ex.volume_24h,
        marketShare: scaledMarketShare,
        actualMarketShare: marketShare
      };
    });
  return volumeData;
};

const chartConfig = {
  volume24h: {
    label: "24h Volume",
    color: "var(--chart-1)",
  },
  marketShare: {
    label: "Market Share",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartRadarMultiple({ tokenSymbol, chainId = 1 }: VolumeRadarProps) {
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

  const coingeckoId = tokenInfo?.coingeckoId;

  const {
    data: volumeData,
    isLoading,
    error,
    refetch,
    isError
  } = useQuery({
    queryKey: ['volumeRadar', coingeckoId],
    queryFn: () => fetchVolumeData(coingeckoId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !!coingeckoId,
  });

  if (!tokenInfo && !tokenError) {
    return (
      <Card className="rounded-none shadow-none bg-white dark:bg-[#0F0F0F]">
        <CardHeader className="items-center">
          <div className="flex flex-row items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
        </CardHeader>
        <CardContent className="pb-0">
          <Skeleton className="mx-auto aspect-square max-h-[250px] w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  if (tokenError) {
    return (
      <Card className="rounded-none shadow-none bg-white dark:bg-[#0F0F0F]">
        <CardHeader className="items-center">
          <div className="flex flex-row items-center gap-2">
            <div className="rounded-full p-1 bg-[#0E76FD]/30 text-[#0E76FD]">
              <Activity strokeWidth={3} width={18} height={18}/>
            </div>
            <CardTitle>24h Volume Distribution</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pb-0">
          <div className="flex flex-col gap-2 items-center">
            <h2 className="text-red-500 font-medium text-sm">Error loading token info</h2>
            <p className="text-zinc-500 text-xs">{tokenError}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="rounded-none shadow-none bg-white dark:bg-[#0F0F0F]">
        <CardHeader className="items-center">
          <div className="flex flex-row items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
        </CardHeader>
        <CardContent className="pb-0">
          <Skeleton className="mx-auto aspect-square max-h-[250px] w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="rounded-none shadow-none bg-white dark:bg-[#0F0F0F]">
        <CardHeader className="items-center">
          <div className="flex flex-row items-center gap-2">
            <div className="rounded-full p-1 bg-[#0E76FD]/30 text-[#0E76FD]">
              <Activity strokeWidth={3} width={18} height={18}/>
            </div>
            <CardTitle>24h Volume Distribution</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pb-0">
          <div className="flex flex-col gap-2 items-center">
            <h2 className="text-red-500 font-medium text-sm">Error loading volume data</h2>
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
        </CardContent>
      </Card>
    );
  }

  if (!volumeData || volumeData.length === 0) {
    return (
      <Card className="rounded-none shadow-none bg-white dark:bg-[#0F0F0F]">
        <CardHeader className="items-center">
          <div className="flex flex-row items-center gap-2">
            <div className="rounded-full p-1 bg-[#0E76FD]/30 text-[#0E76FD]">
              <Activity strokeWidth={3} width={18} height={18}/>
            </div>
            <CardTitle>24h Volume Distribution</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pb-0">
          <p className="text-zinc-500 text-sm text-center">No volume data available for {tokenSymbol.toUpperCase()}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-none shadow-none bg-white dark:bg-[#0F0F0F]">
      <CardHeader className="items-center">
        <div className="flex flex-row items-center gap-2">
          <div className="rounded-full p-1 bg-[#0E76FD]/30 text-[#0E76FD]">
            <Activity strokeWidth={3} width={18} height={18}/>
          </div>
          <CardTitle>24h Volume - {tokenSymbol.toUpperCase()}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={volumeData}>
            <ChartTooltip
              cursor={false}
                             content={({ active, payload }) => {
                 if (active && payload && payload.length) {
                   const data = payload[0].payload as VolumeData;
                   return (
                     <div className="bg-white dark:bg-zinc-800 p-3 rounded-lg border shadow-lg">
                       <p className="font-semibold">{data.exchange}</p>
                       <p className="text-sm text-zinc-600 dark:text-zinc-400">
                         24h Volume: ${data.volume24h.toLocaleString()}
                       </p>
                       <p className="text-sm text-zinc-600 dark:text-zinc-400">
                         Market Share: {data.actualMarketShare.toFixed(1)}%
                       </p>
                       <div className="flex gap-2 mt-2">
                         <div className="flex items-center gap-1">
                           <div className="w-3 h-3 rounded-full bg-[var(--chart-1)]"></div>
                           <span className="text-xs">Volume</span>
                         </div>
                         <div className="flex items-center gap-1">
                           <div className="w-3 h-3 rounded-full bg-[var(--chart-2)]"></div>
                           <span className="text-xs">Market Share</span>
                         </div>
                       </div>
                     </div>
                   );
                 }
                 return null;
               }}
            />
            <PolarAngleAxis 
              dataKey="exchange" 
              tickFormatter={(value) => value.length > 8 ? value.slice(0, 8) + '...' : value}
            />
            <PolarGrid strokeWidth={2} />
            <ChartLegend content={<ChartLegendContent />} />
            <Radar
              dataKey="volume24h"
              fill="var(--color-volume24h)"
              fillOpacity={0.6}
            />
            <Radar 
              dataKey="marketShare" 
              fill="var(--color-marketShare)" 
              fillOpacity={0.4}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

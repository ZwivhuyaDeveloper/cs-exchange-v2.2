'use client';

import { useQuery } from '@tanstack/react-query';
import { TrendingUp, BarChart3 } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

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
  const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coingeckoId}/tickers`, { headers });
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

const chartConfig = {
  liquidity: {
    label: "Liquidity",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function LiquidityDistributionChart({ tokenSymbol, chainId = 1 }: LiquidityDistributionProps) {
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
    data: liquidityData,
    isLoading,
    error,
    refetch,
    isError
  } = useQuery({
    queryKey: ['liquidityDistribution', coingeckoId],
    queryFn: () => fetchLiquidityData(coingeckoId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !!coingeckoId,
  });

  if (!tokenInfo && !tokenError) {
    return (
      <Card className="rounded-none border-none bg-white dark:bg-[#0F0F0F]">
        <CardHeader className="flex flex-row items-center px-3 gap-2 justify-between">
          <div className="flex flex-row items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (tokenError) {
    return (
      <Card className="rounded-none border-none bg-white dark:bg-[#0F0F0F]">
        <CardHeader className="flex flex-row items-center px-3 gap-2 justify-between">
          <div className="flex flex-row items-center gap-2">
            <div className="rounded-full p-1 bg-[#0E76FD]/30 text-[#0E76FD]">
              <BarChart3 strokeWidth={3} width={18} height={18}/>
            </div>
            <CardTitle>Liquidity Distribution</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <h2 className="text-red-500 font-medium text-sm">Error loading token info</h2>
            <p className="text-zinc-500 text-xs">{tokenError}</p>
            <Button 
              onClick={() => window.location.reload()} 
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

  if (isLoading) {
    return (
      <Card className="rounded-none border-none bg-white dark:bg-[#0F0F0F]">
        <CardHeader className="flex flex-row items-center px-3 gap-2 justify-between">
          <div className="flex flex-row items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="rounded-none border-none bg-white dark:bg-[#0F0F0F]">
        <CardHeader className="flex flex-row items-center px-3 gap-2 justify-between">
          <div className="flex flex-row items-center gap-2">
            <div className="rounded-full p-1 bg-[#0E76FD]/30 text-[#00FFC2]">
              <BarChart3 strokeWidth={3} width={18} height={18}/>
            </div>
            <CardTitle>Liquidity Distribution</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <h2 className="text-red-500 font-medium text-sm">Error loading liquidity data</h2>
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

  if (!liquidityData || liquidityData.length === 0) {
    return (
      <Card className="rounded-none border-none bg-white dark:bg-[#0F0F0F]">
        <CardHeader className="flex flex-row items-center px-3 gap-2 justify-between">
          <div className="flex flex-row items-center gap-2">
            <div className="rounded-full p-1 bg-[#00FFC2]/30 text-[#00FFC2]">
              <BarChart3 strokeWidth={3} width={18} height={18}/>
            </div>
            <CardTitle>Liquidity Distribution</CardTitle>
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
      <CardHeader className="flex flex-row items-center px-3 gap-2 justify-between">
        <div className="flex flex-row items-center gap-2">
          <div className="rounded-full p-1 bg-[#00FFC2]/30 text-[#00FFC2]">
            <BarChart3 strokeWidth={3} width={18} height={18}/>
          </div>
          <CardTitle>Liquidity Distribution - {tokenSymbol.toUpperCase()}</CardTitle>
        </div>
        <div className='flex flex-row items-center justify-center h-fit w-fit'>
          <div className=' w-3 h-3 bg-green-300 rounded-full translate-x-3 '/>
          <div className=' w-3 h-3 bg-green-500 rounded-full translate-x-2 '/>
          <div className=' w-3 h-3 bg-green-700 rounded-full translate-x-1 '/>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={liquidityData}
            layout="vertical"
            margin={{
              left: 20,
              right: 20,
              top: 10,
              bottom: 10
            }}
            barCategoryGap={4}
            barGap={2}
            height={300}
            width={500}
          >
            <XAxis 
              type="number" 
              dataKey="liquidity" 
              hide 
              tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
            />
            <YAxis
              dataKey="exchange"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={120}
              tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
              tickFormatter={(value) => value}
              interval={0}
            />
            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as LiquidityData;
                  return (
                    <div className="bg-white dark:bg-zinc-800 p-3 rounded-lg border shadow-lg">
                      <p className="font-semibold">{data.exchange}</p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Liquidity: ${data.liquidity.toLocaleString()}
                      </p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Market Share: {data.marketShare.toFixed(1)}%
                      </p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        24h Volume: ${data.volume24h.toLocaleString()}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar 
              dataKey="liquidity" 
              fill="#00FFC2" 
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
} 
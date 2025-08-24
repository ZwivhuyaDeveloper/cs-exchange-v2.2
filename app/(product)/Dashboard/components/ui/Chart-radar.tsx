"use client"

import { Activity, RefreshCw } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { InfoCard } from './InfoCard';
import { getRadarChartInfo } from './componentData';
import { useVolumeData } from '../../services/dashboardService';
import { formatCurrency } from '@/lib/utils';

interface VolumeData {
  exchange: string;
  volume24h: number;
  marketShare: number;
  actualMarketShare: number;
}

interface VolumeRadarProps {
  tokenSymbol: string;
  chainId?: number;
}

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
  const { 
    volumeData = [], 
    token, 
    isLoading, 
    error, 
    refetch 
  } = useVolumeData(tokenSymbol, chainId);

  if (isLoading || !token) {
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

  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return (
      <Card className="rounded-none shadow-none bg-white dark:bg-[#0F0F0F]">
        <CardHeader className="items-center">
          <div className="flex flex-row items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div className="rounded-full p-1 bg-amber-100 dark:bg-amber-900/30">
                <Activity className="h-4 w-4 text-amber-500" />
              </div>
              <CardTitle>24h Volume Distribution</CardTitle>
            </div>
            <InfoCard {...getRadarChartInfo()} />
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <p className="text-amber-500 font-medium mb-2">Failed to load volume data</p>
          <p className="text-sm text-muted-foreground mb-4">{errorMessage}</p>
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

  if (volumeData.length === 0) {
    return (
      <Card className="rounded-none shadow-none bg-white dark:bg-[#0F0F0F]">
        <CardHeader className="items-center">
          <div className="flex flex-row items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 dark:bg-[#00FFC2]/20 bg-[#0E76FD]/20 rounded-full flex items-center justify-center">
                <Image 
                  src={token?.logoURL || "/placeholder-token.png"}
                  alt={token?.name || 'Token'}
                  className="h-8 w-8 rounded-full dark:bg-zinc-800 bg-white"
                  width={40}
                  height={40}
                />
              </div>
              <CardTitle className="flex items-center gap-2">
                Volume Distribution <span className="dark:text-[#00FFC2] font-black text-[#0E76FD]">{tokenSymbol.toUpperCase()}</span>
              </CardTitle>
            </div>
            <InfoCard {...getRadarChartInfo()} />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-500 text-sm text-center py-4">No volume data available for {tokenSymbol.toUpperCase()}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-none shadow-none bg-white dark:bg-[#0F0F0F]">
      <CardHeader className="items-center">
        <div className="flex flex-row items-center justify-between w-full">
          <div className="flex flex-row items-center gap-2">
            <div className="h-8 w-8 dark:bg-[#00FFC2]/20 bg-[#0E76FD]/20 rounded-full flex items-center justify-center">
              <Image 
                src={token?.logoURL || "/placeholder-token.png"}
                alt={token?.name || 'Token'}
                className="h-8 w-8 rounded-full dark:bg-zinc-800 bg-white"
                width={40}
                height={40}
              />
            </div>
            <CardTitle className="flex items-center gap-2">
              Volume Distribution <span className="dark:text-[#00FFC2] font-black text-[#0E76FD]">{tokenSymbol.toUpperCase()}</span>
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <InfoCard {...getRadarChartInfo()} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[350px]"
        >
          <RadarChart data={volumeData}>
            <ChartTooltip
              cursor={false}
                             content={({ active, payload }) => {
                 if (active && payload && payload.length) {
                   const data = payload[0].payload;
                   return (
                     <div className="bg-white dark:bg-zinc-800 p-3 rounded-lg border shadow-lg">
                       <p className="font-semibold">{data.exchange}</p>
                       <p className="text-sm text-zinc-600 dark:text-zinc-400">
                         24h Volume: {formatCurrency(data.volume24h)}
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
              name="24h Volume"
              dataKey="volume24h"
              stroke="#0E76FD"
              fill="#0E76FD"
              className="fill-[#0E76FD] dark:fill-[#00FFC2]"
              fillOpacity={0.6}
            />
            <Radar 
              name="Market Share"
              dataKey="marketShare"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.4}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

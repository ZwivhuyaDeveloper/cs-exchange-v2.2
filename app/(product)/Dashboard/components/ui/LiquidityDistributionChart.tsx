'use client';

import { BarChart3, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from '@/components/ui/button';
import { useLiquidityData } from '../../services/dashboardService';
import { formatCurrency } from '@/lib/utils';
import { InfoCard } from './InfoCard';
import { getLiquidityDistributionInfo } from './componentData';
import Image from 'next/image';

interface LiquidityDistributionProps {
  tokenSymbol: string;
  chainId?: number;
}

export default function LiquidityDistributionChart({ tokenSymbol, chainId = 1 }: LiquidityDistributionProps) {
  const { data: liquidityData, isLoading, error, refetch, token } = useLiquidityData(tokenSymbol, chainId);

  if (isLoading) {
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

  if (error) {
    const errorMessage = error?.message || 'An error occurred while loading liquidity data';
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
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => refetch()}
              disabled={isLoading}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <p className="text-red-500 font-medium mb-2">Failed to load liquidity data</p>
          <p className="text-sm text-muted-foreground mb-4">{errorMessage}</p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => refetch()}
            className="gap-2"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Retrying...' : 'Retry'}
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
              <div className="h-6 w-6 dark:bg-zinc-800 bg-zinc-300 rounded-full flex items-center justify-center">
                {token && (
                  <Image 
                    src={token.logoURL || token.logoURI || "/placeholder-token.png"}
                    alt={token.name || 'Token'}
                    className="h-6 w-6 rounded-full dark:bg-zinc-800 bg-white"
                    width={24}
                    height={24}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-token.png";
                    }}
                  />
                )}
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
            {token?.logoURL || token?.logoURI ? (
              <div className="h-6 w-6 rounded-full overflow-hidden">
                <Image 
                  src={token.logoURL || token.logoURI || ''}
                  alt={token.name || 'Token'}
                  width={24}
                  height={24}
                  className="h-6 w-6 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-token.png';
                  }}
                />
              </div>
            ) : (
              <div className="rounded-full p-1 bg-[#00FFC2]/30 text-[#00FFC2]">
                <BarChart3 strokeWidth={3} width={18} height={18}/>
              </div>
            )}
            <CardTitle className="flex items-center gap-2">
              Liquidity Distribution
              <span className="dark:text-[#00FFC2] text-blue-500 font-black">{tokenSymbol.toUpperCase()}</span>
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
                <span className="dark:text-white font-semibold text-black">{formatCurrency(item.liquidity)}</span>
              </div>
              <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full dark:bg-[#00FFC2] bg-blue-500 rounded-full" 
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
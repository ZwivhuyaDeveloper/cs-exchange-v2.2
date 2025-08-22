import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUpRight, ArrowDownRight, Activity, RefreshCw, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOrderData, useTokenMetadata } from '../../services/dashboardService';
import { formatNumber, formatCurrency } from '@/lib/utils';
import { InfoCard } from './InfoCard';
import { getOrderDataInfo } from './componentData';
import Image from 'next/image';

interface OrderDataProps {
  tokenSymbol: string;
  chainId?: number;
}

export default function OrderData({ tokenSymbol, chainId = 1 }: OrderDataProps) {
  const { orderData, isLoading, error, refetch } = useOrderData(tokenSymbol, chainId);
  const { token: tokenInfo } = useTokenMetadata(tokenSymbol, chainId);

  // Format the last updated time
  const lastUpdated = orderData?.lastUpdated ? new Date(orderData.lastUpdated).toLocaleString() : 'N/A';

  // Calculate percentages for the progress bars
  const totalTrades = (orderData?.buys || 0) + (orderData?.sells || 0);
  const buyPercentage = totalTrades > 0 ? Math.round((orderData?.buys || 0) / totalTrades * 100) : 0;
  const sellPercentage = 100 - buyPercentage;

  const totalVolume = orderData?.totalVolume || 0;
  const buyVolumePercentage = totalVolume > 0 ? Math.round((orderData?.buyVolume || 0) / totalVolume * 100) : 0;
  const sellVolumePercentage = 100 - buyVolumePercentage;

  const renderSection = (label1: string, label2: string, value1: number, value2: number, isCurrency: boolean = false) => {
    const total = value1 + value2 || 1;
    const width1 = (value1 / total) * 100;
    const width2 = (value2 / total) * 100;

    const formatValue = (val: number) => {
      return isCurrency ? formatCurrency(val) : formatNumber(val);
    };

    return (
      <Card className="h-fit gap-3 mx-4 px-0 py-4 border-none dark:bg-zinc-900 bg-zinc-200/50 shadow-none">
        <CardDescription className="flex justify-between text-sm sm:text-xs font-medium px-5 text-zinc-400">
          <p>{label1}</p>
          <p>{label2}</p>
        </CardDescription>
        <CardDescription className="flex justify-between px-5 text-md sm:text-sm/2 font-semibold dark:text-white text-black">
          <p>{formatValue(value1)}</p>
          <p>{formatValue(value2)}</p>
        </CardDescription>
        <CardContent className="flex flex-row gap-1 p-0">
          <div className="flex w-full h-1 gap-1 px-5">
            <div className="bg-[#00FFC2] rounded-3xl" style={{ width: `${width1}%` }} />
            <div className="bg-[#0E76FD] rounded-3xl" style={{ width: `${width2}%` }} />
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <Card className="h-full w-full rounded-none bg-transparent flex flex-col gap-3">
        <CardTitle className="px-5">
          <div className="flex flex-row gap-3 items-center mb-3">
            <div className="h-6 w-6 bg-[#00FFC2]/20 rounded-full flex items-center justify-center">
              <span className="text-[#00FFC2] text-[8px] font-bold">
                <Scale width={17} height={17} />
              </span>
            </div>
            <h1 className="dark:text-white text-black font-semibold text-md sm:text-md">Order Data</h1>
          </div>
        </CardTitle>
        <div className="px-5 flex flex-col gap-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full w-full rounded-none bg-transparent flex flex-col gap-3">
        <CardTitle className="px-5">
          <div className="flex flex-row gap-3 items-center mb-3">
            <div className="h-6 w-6 bg-[#00FFC2]/20 rounded-full flex items-center justify-center">
              <span className="text-[#00FFC2] text-[8px] font-bold">
                <Scale width={17} height={17} />
              </span>
            </div>
            <h1 className="dark:text-white text-black font-semibold text-md sm:text-md">Order Data</h1>
          </div>
        </CardTitle>
        <div className="px-5 flex flex-col gap-2">
          <h2 className="text-red-500 font-medium text-sm">Error loading order data</h2>
          <p className="text-zinc-500 text-xs">{error.message}</p>
          <Button 
            onClick={() => refetch()} 
            size="sm" 
            variant="outline"
            className="w-fit"
          >
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  if (!orderData) {
    return (
      <Card className="h-full w-full rounded-none bg-transparent flex flex-col gap-3">
        <CardTitle className="px-5">
          <div className="flex flex-row gap-3 items-center mb-3">
            <div className="h-6 w-6 bg-[#00FFC2]/20 rounded-full flex items-center justify-center">
              <span className="text-[#00FFC2] text-[8px] font-bold">
                <Scale width={17} height={17} />
              </span>
            </div>
            <h1 className="dark:text-white text-black font-semibold text-md sm:text-md">Order Data</h1>
          </div>
        </CardTitle>
        <div className="px-5">
          <p className="text-zinc-500 text-sm">No order data available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full w-full rounded-none border-none dark:bg-[#0F0F0F] bg-white flex flex-col gap-2">
      <CardTitle className="px-4 gap-3 flex justify-between items-center mb-3">
        <div className="flex flex-row items-center gap-2">
          <div className="sm:h-6 sm:w-6 h-8 w-8 dark:bg-zinc-800 bg-zinc-300 rounded-full flex items-center justify-center">
            {tokenInfo ? (
              <Image 
                src={tokenInfo.logoURI || tokenInfo.logoURL || "/placeholder-token.png"}
                alt={tokenInfo.name}
                className="sm:h-6 sm:w-6 h-8 w-8 rounded-full dark:bg-zinc-800 bg-white"
                width={24}
                height={24}
              />
            ) : (
              <Activity className="sm:h-4 sm:w-4 h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <h1 className="dark:text-white text-black font-semibold text-lg sm:text-md">
            Order Data for <span className="dark:text-[#00FFC2] font-black text-[#0E76FD]">{tokenSymbol.toUpperCase()}</span>
          </h1>
        </div>
        <div className='flex items-center gap-2'>
          <InfoCard {...getOrderDataInfo()} />
        </div>
      </CardTitle>
      
      {renderSection('Buy orders', 'Sell orders', orderData.buys, orderData.sells)}
      {renderSection('Buy vol', 'Sell vol', orderData.buyVolume, orderData.sellVolume, true)}
      {renderSection('Buyers', 'Sellers', orderData.buyers.size, orderData.sellers.size)}
      
      <div className="px-4 mt-2">
        <div className="flex justify-between text-xs text-zinc-500 mb-1">
          <span>Source: {orderData.source === 'coingecko' ? 'CoinGecko' : 'Binance'}</span>
          <span>Updated: {lastUpdated}</span>
        </div>
      </div>
    </Card>
  );
}
'use client';

import { useQuery } from '@tanstack/react-query';
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUp, ArrowDown } from 'lucide-react';
import { formatDollar } from '@/app/lib/format';


interface TokenPriceProps {
  coingeckoId: string;
  initialPrice?: number;
  initialChange?: number;
}

export function TokenPrice({ coingeckoId, initialPrice, initialChange }: TokenPriceProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['tokenPrice', coingeckoId],
    queryFn: async () => {
      const res = await fetch(`/api/token/price?id=${coingeckoId}`);
      if (!res.ok) throw new Error('Failed to fetch token price');
      return res.json();
    },
    initialData: initialPrice ? { 
      price: initialPrice, 
      priceChange24h: initialChange || 0 
    } : undefined,
    refetchInterval: 60000, // 1 minute
    staleTime: 30000, // 30 seconds
    retry: 3,
  });

  if (isLoading || !data) {
    return (
      <div className="flex items-center space-x-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-4 w-12" />
      </div>
    );
  }

  if (isError) {
    return initialPrice ? (
      <div className="text-sm text-gray-500">
        {formatDollar(initialPrice)} {initialChange !== undefined && (
          <span className={initialChange >= 0 ? 'text-green-500' : 'text-red-500'}>
            {initialChange >= 0 ? '↑' : '↓'} {Math.abs(initialChange).toFixed(2)}%
          </span>
        )}
      </div>
    ) : (
      <span className="text-sm text-gray-400">Price unavailable</span>
    );
  }

  const { price, priceChange24h } = data;
  const isPositive = priceChange24h >= 0;

  return (
    <div className="flex items-center space-x-2">
      <span className="font-medium">{formatDollar(price)}</span>
      <span 
        className={`text-sm flex items-center ${
          isPositive ? 'text-green-500' : 'text-red-500'
        }`}
      >
        {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
        {Math.abs(priceChange24h).toFixed(2)}%
      </span>
    </div>
  );
}
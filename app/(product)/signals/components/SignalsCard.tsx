'use client';

import { Signal } from '@/app/lib/types/signal';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowDown,
  ArrowUp,
  BarChart,
  CheckCircle,
  Clock,
  Info,
  TrendingUp,
} from 'lucide-react';
import { TokenPrice } from './TokenPrice';
import { formatDollar } from '@/app/lib/format';
import { formatDynamicDateTime } from '@/app/lib/dateUtils';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Sparkline } from './Sparkline';
import {
  getDirectionClasses,
  getStatusClasses,
  getRiskColor,
  formatRiskLevel,
} from '../utils/styling';


interface SignalCardProps {
  signal: Signal;
}

export function SignalCard({ signal }: SignalCardProps) {
  const {
    token,
    analyst,
    direction,
    status,
    entryPrice,
    targetPrices,
    stopLoss,
    riskLevel,
    confidence,
    timeframe,
    riskRewardRatio,
    publishedAt,
  } = signal;

  const directionClasses = getDirectionClasses(direction);
  const statusClasses = getStatusClasses(status);

  const tokenLogo = token?.logo || '';
  const tokenName = token?.name || 'Unknown Token';
  const tokenSymbol = token?.symbol || '';

  const analystAvatar = analyst?.avatar || '';
  const analystName = analyst?.name || 'N/A';

  // Mock data for sparkline - will be replaced with real data from token
  const sparklineData = token?.sparkline_in_7d?.price || [];
  const isPositiveTrend = sparklineData.length > 1 && sparklineData[sparklineData.length - 1] > sparklineData[0];

  return (
    <Link href={`/signals/${typeof signal.slug === 'object' ? signal.slug.current : signal.slug}`} className="block group">
      <Card className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden h-full flex flex-col">
        <CardHeader className="p-4 flex flex-row items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {tokenLogo ? (
              <Image
                src={tokenLogo}
                alt={`${tokenName} logo`}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
            )}
            <div>
              <CardTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {tokenName}
              </CardTitle>
              <div className="flex items-center gap-2">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{tokenSymbol}</p>
                <Badge variant="outline" className={`capitalize text-xs ${statusClasses.bg} ${statusClasses.text} ${statusClasses.border}`}>
                  {status.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-right">
             {analystAvatar ? (
                <Image
                  src={analystAvatar}
                  alt={analystName}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700" />
              )}
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Analyst</p>
              <div className="flex items-center gap-1">
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{analystName}</p>
                {analyst?.isVerified === true && (
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0 flex-grow">
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Price Info */}
            <div className="flex flex-col">
                {token?.coingeckoId ? (
                    <TokenPrice
                        coingeckoId={token.coingeckoId}
                        initialPrice={token.price}
                        initialChange={token.priceChange24h}
                    />
                ) : (
                    <div className="text-lg font-bold">
                        {formatDollar(token?.price || 0)}
                    </div>
                )}
            </div>
            {/* Sparkline */}
            <div className="h-16 -mb-4 -mr-4">
                 {sparklineData.length > 0 && <Sparkline data={sparklineData} positive={isPositiveTrend} />}
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 dark:text-zinc-400">Entry Price</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                {formatDollar(entryPrice)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 dark:text-zinc-400">Stop Loss</span>
              <span className="font-semibold text-red-500">
                {formatDollar(stopLoss || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 dark:text-zinc-400">Target 1</span>
              <span className="font-semibold text-green-500">
                {formatDollar(targetPrices?.[0] || 0)}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
          <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
            <BarChart className={`h-4 w-4 ${getRiskColor(riskLevel || '')}`} />
            <div>
              <p className="text-zinc-500 dark:text-zinc-500">Risk</p>
              <p className={`font-bold ${getRiskColor(riskLevel || '')}`}>
                {formatRiskLevel(riskLevel || '')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
            <TrendingUp className="h-4 w-4 text-blue-500" />
             <div>
              <p className="text-zinc-500 dark:text-zinc-500">Confidence</p>
              <p className="font-bold text-blue-500">{confidence}/10</p>
            </div>
          </div>
           <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
            <Clock className="h-4 w-4" />
             <div>
              <p className="text-zinc-500 dark:text-zinc-500">Timeframe</p>
              <p className="font-bold capitalize">{timeframe || 'N/A'}</p>
            </div>
          </div>
           <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
             <Info className="h-4 w-4" />
             <div>
              <p className="text-zinc-500 dark:text-zinc-500">R/R Ratio</p>
              <p className="font-bold">{riskRewardRatio?.toFixed(2) || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 col-span-2">
            <Clock className="h-4 w-4" />
            <div>
              <p className="text-zinc-500 dark:text-zinc-500">Published</p>
              <p className="font-bold capitalize">
                  {publishedAt ? formatDynamicDateTime(publishedAt) : 'N/A'}
                </p>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

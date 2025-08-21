'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Signal } from '@/app/lib/types/signal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TokenPrice } from './TokenPrice';
import { getDirectionClasses, getStatusClasses } from '@/app/(product)/signals/utils/styling';
import { ArrowUpRight, CheckCircle, Star } from 'lucide-react';
import { formatDollar } from '@/app/lib/format';
import { formatCompactNumber } from '@/app/lib/formatters';

interface SignalHeaderProps {
  signal: Signal;
}

export function SignalHeader({ signal }: SignalHeaderProps) {
  const { token, analyst, direction, status } = signal;
  const directionClasses = getDirectionClasses(direction);
  const statusClasses = getStatusClasses(status);

  return (
    <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 w-full">
        {/* Left Side: Token Info */}
        <div className="flex items-center gap-4">
          {token.logo ? (
            <Image
              src={token.logo}
              alt={`${token.name} logo`}
              width={56}
              height={56}
              className="rounded-full"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700" />
          )}
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              {token.name}
              <span className="text-xl font-medium text-zinc-400 dark:text-zinc-500">{token.symbol}</span>
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className={`capitalize ${directionClasses.bg} ${directionClasses.text} ${directionClasses.border}`}>
                {directionClasses.icon}
                <span className="ml-1">{direction}</span>
              </Badge>
              <Badge variant="outline" className={`capitalize ${statusClasses.bg} ${statusClasses.text} ${statusClasses.border}`}>
                {status.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        </div>

        {/* Right Side: Price and Trade Button */}
        <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto">
          {token.coingeckoId ? (
            <TokenPrice
              coingeckoId={token.coingeckoId}
              initialPrice={token.price}
              initialChange={token.priceChange24h}
            />
          ) : (
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {formatDollar(token.price || 0)}
            </div>
          )}
          <Button asChild>
            <Link href={`/swap?outputCurrency=${token.contractAddress || token.symbol}`}>
              Trade on Cyclespace
              <ArrowUpRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Analyst Information */}
      {analyst && (
        <div className="border-t border-zinc-200 dark:border-zinc-800 mt-6 pt-6">
          <div className="flex items-center gap-4">
            {analyst.avatar ? (
              <Image
                src={analyst.avatar}
                alt={analyst.displayName || analyst.name || 'Analyst'}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                  {analyst.displayName?.[0] || analyst.name?.[0] || 'A'}
                </span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  {analyst.displayName || analyst.name || 'CS-AI'}
                  {analyst.isVerified && (
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                  )}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Signal Analyst
                  {analyst.experience && ` • ${analyst.experience} years experience`}
                </p>
              </div>
              {analyst.tier && (
                <Badge variant="outline" className="ml-2">
                  <Star className="h-4 w-4 mr-1" />
                  {analyst.tier}
                </Badge>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Section: Market Data */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 mt-6 pt-6 grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Market Cap</p>
          <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            {token.marketCap ? `$${formatCompactNumber(token.marketCap)}` : 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">24h Volume</p>
          <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            {token.volume24h ? `$${formatCompactNumber(token.volume24h)}` : 'N/A'}
          </p>
        </div>
        <div className="col-span-2 md:col-span-1">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Circulating Supply</p>
          <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            N/A
          </p>
        </div>
      </div>
    </div>
  );
}

'use client';

import { Signal } from '@/app/lib/types/signal';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';

interface SignalCardProps {
  signal: Signal;
}

export function SignalCard({ signal }: SignalCardProps) {
  const getDirectionColor = () => {
    switch (signal.direction) {
      case 'buy':
      case 'long':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'sell':
      case 'short':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getStatusColor = () => {
    switch (signal.status) {
      case 'active':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'target_hit':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'stop_loss':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'completed':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <Link href={`/signals/${signal.slug}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
        {/* Header with token info */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            {signal.token.logo && (
              <div className="relative w-8 h-8">
                <Image
                  src={signal.token.logo}
                  alt={signal.token.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </div>
            )}
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                {signal.token.name} ({signal.token.symbol?.toUpperCase()})
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {signal.signalType && `${signal.signalType} • `}
                {format(new Date(signal.publishedAt), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${getDirectionColor()}`}
          >
            {signal.direction.toUpperCase()}
          </span>
        </div>

        {/* Signal details */}
        <div className="p-4">
          <div className="flex justify-between mb-3">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Entry</p>
              <p className="font-medium">${signal.entryPrice.toFixed(2)}</p>
            </div>
            {signal.targetPrices?.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Targets</p>
                <p className="font-medium">
                  {signal.targetPrices.map((t) => `$${t.toFixed(2)}`).join(' → ')}
                </p>
              </div>
            )}
            {signal.stopLoss && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Stop Loss</p>
                <p className="text-red-600 dark:text-red-400 font-medium">
                  ${signal.stopLoss.toFixed(2)}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor()}`}
            >
              {signal.status.replace('_', ' ').toUpperCase()}
            </span>
            {signal.riskRewardRatio && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                R:R {signal.riskRewardRatio.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

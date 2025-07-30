'use client';

import { Signal } from '@/app/lib/types/signal';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { FaChartLine, FaChartBar, FaChartPie, FaClock, FaExclamationTriangle, FaThumbsUp } from 'react-icons/fa';

// Helper function to get trend color
const getTrendColor = (trend: string) => {
  switch (trend?.toLowerCase()) {
    case 'bullish':
      return 'text-green-500';
    case 'bearish':
      return 'text-red-500';
    case 'sideways':
      return 'text-yellow-500';
    default:
      return 'text-gray-500';
  }
};

// Helper function to get risk level color
const getRiskColor = (level: string) => {
  switch (level?.toLowerCase()) {
    case 'very_low':
      return 'text-green-500';
    case 'low':
      return 'text-blue-500';
    case 'medium':
      return 'text-yellow-500';
    case 'high':
      return 'text-orange-500';
    case 'very_high':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

// Helper to format risk level text
const formatRiskLevel = (level: string) => {
  if (level === 'very_low') return 'Very Low';
  if (level === 'low') return 'Low';
  if (level === 'medium') return 'Medium';
  if (level === 'high') return 'High';
  if (level === 'very_high') return 'Very High';
  return level
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

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
    <Link href={`/signals/${typeof signal.slug === 'object' ? signal.slug.current : signal.slug}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
        {/* Header with token info */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="relative w-8 h-8 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
              {signal.token.logo ? (
                <Image
                  src={signal.token.logo}
                  alt={signal.token.name || 'Token'}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to showing the token symbol if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.parentNode?.querySelector('.token-fallback');
                    if (fallback) {
                      (fallback as HTMLElement).style.display = 'flex';
                    }
                  }}
                  onLoad={(e) => {
                    // Hide fallback when image loads successfully
                    const target = e.target as HTMLImageElement;
                    const fallback = target.parentNode?.querySelector('.token-fallback');
                    if (fallback) {
                      (fallback as HTMLElement).style.display = 'none';
                    }
                  }}
                />
              ) : null}
              <div className="token-fallback absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-500 dark:text-gray-400">
                {signal.token.symbol?.substring(0, 3) || 'TKN'}
              </div>
            </div>
            <div>
              <h3 className="font-medium text-sm text-gray-900 dark:text-white">
                {signal.token.name} ({signal.token.symbol?.toUpperCase()})
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
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

          <div className="flex justify-between items-center mb-4">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor()}`}
            >
              <p className='text-xs'>
                {signal.status.replace('_', ' ').toUpperCase()}
              </p>
            </span>
            {signal.riskRewardRatio && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                R:R {signal.riskRewardRatio.toFixed(2)}
              </span>
            )}
          </div>

          <div className="flex justify-between mb-5">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Entry</p>
              <p className="font-medium text-xs">${signal.entryPrice.toFixed(2)}</p>
            </div>
            {signal.targetPrices?.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Targets</p>
                <p className="font-medium text-xs">
                  {signal.targetPrices.map((t) => `$${t.toFixed(2)}`).join(' : ')}
                </p>
              </div>
            )}
            {signal.stopLoss && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Stop Loss</p>
                <p className="text-red-600 dark:text-red-400 font-medium text-xs">
                  ${signal.stopLoss.toFixed(2)}
                </p>
              </div>
            )}
          </div>

          {/* Market Data Row */}
          <div className="grid grid-cols-2 px-1 gap-2 mb-3 mt-4 text-xs">
            {/* Market Trend */}
            {signal.marketConditions?.trend && (
              <div className="flex items-center space-x-1">
                <FaChartLine className={`${getTrendColor(signal.marketConditions.trend)}`} />
                <span className="text-gray-500 text-xs dark:text-gray-400">Trend:</span>
                <span className={`font-medium text-xs ${getTrendColor(signal.marketConditions.trend)}`}>
                  {signal.marketConditions.trend?.charAt(0).toUpperCase() + signal.marketConditions.trend?.slice(1)}
                </span>
              </div>
            )}

            {/* Timeframe */}
            {signal.timeframe && (
              <div className="flex items-center space-x-1">
                <FaClock className="text-gray-500" />
                <span className="text-gray-500 dark:text-gray-400 text-xs">Timeframe:</span>
                <span className="font-medium text-xs">
                  {signal.timeframe?.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </span>
              </div>
            )}

            {/* Risk Level */}
            {signal.riskLevel && (
              <div className="flex items-center space-x-1">
                <FaExclamationTriangle className={getRiskColor(signal.riskLevel)} />
                <span className="text-gray-500 text-xs dark:text-gray-400">Risk:</span>
                <span className={`font-medium text-xs ${getRiskColor(signal.riskLevel)}`}>
                  {formatRiskLevel(signal.riskLevel)}
                </span>
              </div>
            )}

            {/* Confidence Level */}
            {signal.confidence && (
              <div className="flex items-center space-x-1">
                <FaThumbsUp className="text-blue-500" />
                <span className="text-gray-500 text-xs dark:text-gray-400">Confidence:</span>
                <div className="flex items-center">
                  <span className="font-medium text-xs">{signal.confidence}/10</span>
                  <div className="ml-1 w-6 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${signal.confidence >= 7 ? 'bg-green-500' : signal.confidence >= 4 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${signal.confidence * 10}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

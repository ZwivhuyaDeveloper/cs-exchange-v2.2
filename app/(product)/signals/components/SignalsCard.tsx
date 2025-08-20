'use client';

import { Signal } from '@/app/lib/types/signal';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { FaChartLine, FaChartBar, FaChartPie, FaClock, FaExclamationTriangle, FaThumbsUp, FaArrowUp, FaArrowDown, FaInfoCircle } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { fetchTokenData } from '../utils/tokenData';
import { TokenPrice } from './TokenPrice';
import { formatDollar } from '@/app/lib/format';

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

interface TokenData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  sparkline_in_7d?: {
    price: number[];
  };
}

interface SignalCardProps {
  signal: Signal;
}

export function SignalCard({ signal }: SignalCardProps) {
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token, direction, entryPrice, targetPrices, stopLoss, publishedAt, status } = signal;
  const isActive = status === 'active';
  const isBuy = direction === 'buy' || direction === 'long';
  const directionVariant = isBuy ? 'success' : 'destructive';

  useEffect(() => {
    const fetchData = async () => {
      if (!signal.token?.coingeckoId) {
        setError('No CoinGecko ID found for this token');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await fetchTokenData(signal.token.coingeckoId);
        setTokenData(data);
      } catch (err) {
        console.error('Error fetching token data:', err);
        setError('Failed to load token data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [signal.token?.coingeckoId]);

  // Format price with 4 decimal places or use token's actual decimals
  const formatPrice = (price: number) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    }).format(price);
  };

  // Format large numbers with K, M, B suffixes
  const formatLargeNumber = (num: number) => {
    if (!num) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 2,
    }).format(num);
  };

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
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
        <div className="p-4">
          {/* Token Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              {token?.logo ? (
                  <Image
                    src={token.logo}
                    alt={token.symbol}
                    width={32}
                    height={32}
                    className="rounded-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-token.png';
                    }}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-500">
                      {token?.symbol?.substring(0, 3) || 'TOK'}
                    </span>
                  </div>
                )}
              <div>
                <h3 className="font-semibold text-lg">{token?.name || 'Unknown Token'}</h3>
                <span className="text-sm text-gray-500">{token?.symbol || 'TOKEN'}</span>
              </div>
            </div>
            
            {/* Price and 24h Change */}
            <div className="text-right">
              {token?.coingeckoId ? (
                <TokenPrice 
                  coingeckoId={token.coingeckoId}
                  initialPrice={token.price}
                  initialChange={token.priceChange24h}
                />
              ) : (
                <div className="text-xs text-gray-500">No price data</div>
              )}
            </div>
          </div>

          {/* Signal Type and Direction */}
          <div className="flex items-center justify-between mb-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              isBuy 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {direction.toUpperCase()} {signal.signalType ? `• ${signal.signalType}` : ''}
            </span>
            <span className="text-xs text-gray-500">
              {publishedAt ? format(new Date(publishedAt), 'MMM d, yyyy') : 'N/A'}
            </span>
          </div>

          {/* Market Data */}
          {token?.coingeckoId && (
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                <div className="text-gray-500">Market Cap</div>
                <div>{token.marketCap ? `$${formatLargeNumber(token.marketCap)}` : 'N/A'}</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                <div className="text-gray-500">24h Volume</div>
                <div>{token.volume24h ? `$${formatLargeNumber(token.volume24h)}` : 'N/A'}</div>
              </div>
            </div>
          )}

          {/* Signal Details */}
          <div className="space-y-2 text-sm mb-3">
            {entryPrice && (
              <div className="flex justify-between">
                <span className="text-gray-500">Entry Price:</span>
                <span className="font-medium">{formatDollar(entryPrice)}</span>
              </div>
            )}
            
            {targetPrices?.length > 0 && (
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Targets:</span>
                  <span className="text-right">
                    {targetPrices.map((target, i) => (
                      <div key={i} className="font-medium">
                        {formatDollar(target)}
                        <span className="ml-2 text-green-500">
                          ({(target / entryPrice - 1) * 100 > 0 ? '+' : ''}
                          {((target / entryPrice - 1) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    ))}
                  </span>
                </div>
              </div>
            )}
            
            {stopLoss && (
              <div className="flex justify-between">
                <span className="text-gray-500">Stop Loss:</span>
                <span className="font-medium text-red-500">
                  {formatDollar(stopLoss)}
                  <span className="ml-2">
                    ({(stopLoss / entryPrice - 1) * 100 > 0 ? '+' : ''}
                    {((stopLoss / entryPrice - 1) * 100).toFixed(1)}%)
                  </span>
                </span>
              </div>
            )}
          </div>

          {/* Status */}
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

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <FaInfoCircle className="text-blue-500" />
            <span>View details</span>
          </div>
          {signal.premium && (
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
              Premium
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

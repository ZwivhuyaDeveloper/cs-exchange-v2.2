import { notFound } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { fetchSignalBySlug } from '@/app/actions/signals';
import { Signal } from '@/app/lib/types/signal';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { TokenLogo } from '../../components/TokenLogo';


interface SignalPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 60; // Revalidate every 60 seconds

export default async function SignalPage(props: SignalPageProps) {
  const params = await props.params;
  const signal = await fetchSignalBySlug(params.slug);

  if (!signal) {
    notFound();
  }

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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Link 
          href="/signals" 
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          ← Back to Signals
        </Link>
      </div>

      {/* Header with token info and direction */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            {signal.token?.logo && (
              <div className="relative w-12 h-12 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                  <TokenLogo
                  src={signal.token.logo}
                  alt={signal.token.name || 'Token'}
                  fallbackText={signal.token.symbol}
                  size={48}
                />
                
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {signal.token?.name} ({signal.token?.symbol?.toUpperCase()})
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getDirectionColor()}`}
                >
                  {signal.direction.toUpperCase()}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor()}`}>
                  {signal.status.replace('_', ' ').toUpperCase()}
                </span>
                {signal.signalType && (
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">
                    {signal.signalType}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {signal.token?.coingeckoId && (
              <a
                href={`https://www.coingecko.com/en/coins/${signal.token.coingeckoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                View on CoinGecko
                <ExternalLink className="ml-1 w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Price and targets */}
        <div className="lg:col-span-2 space-y-6">
          {/* Price Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Trade Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Entry Price</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  ${signal.entryPrice.toFixed(2)}
                </p>
              </div>
              
              {signal.stopLoss && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-sm text-red-500 dark:text-red-400">Stop Loss</p>
                  <p className="text-xl font-semibold text-red-600 dark:text-red-400">
                    ${signal.stopLoss.toFixed(2)}
                  </p>
                </div>
              )}
              
              {signal.riskRewardRatio && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-500 dark:text-blue-400">Risk/Reward</p>
                  <p className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                    1:{signal.riskRewardRatio.toFixed(2)}
                  </p>
                </div>
              )}
            </div>

            {/* Target Prices */}
            {signal.targetPrices?.length > 0 && (
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                  Target Prices
                </h3>
                <div className="space-y-2">
                  {signal.targetPrices.map((target: number, index: number) => (
                    <div key={index} className="flex items-center">
                      <div className="w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full mr-3">
                        {index + 1}
                      </div>
                      <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 dark:text-gray-300">
                            Target {index + 1}
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            ${target.toFixed(2)}
                          </span>
                        </div>
                        {index === 0 && signal.takeProfit1 && (
                          <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {signal.takeProfit1}
                          </div>
                        )}
                        {index === 1 && signal.takeProfit2 && (
                          <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {signal.takeProfit2}
                          </div>
                        )}
                        {index === 2 && signal.takeProfit3 && (
                          <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {signal.takeProfit3}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Analysis */}
          {signal.analysis && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Analysis
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                {signal.analysis}
              </div>
            </div>
          )}
        </div>

        {/* Right column - Metadata */}
        <div className="space-y-6">
          {/* Signal Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Signal Details
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Published</span>
                <span className="text-gray-900 dark:text-white">
                  {format(new Date(signal.publishedAt), 'MMM d, yyyy')}
                </span>
              </div>
              
              {signal.updatedAt && signal.updatedAt !== signal.publishedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Last Updated</span>
                  <span className="text-gray-900 dark:text-white">
                    {format(new Date(signal.updatedAt), 'MMM d, yyyy')}
                  </span>
                </div>
              )}
              
              {signal.validUntil && (
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Valid Until</span>
                  <span className="text-gray-900 dark:text-white">
                    {format(new Date(signal.validUntil), 'MMM d, yyyy')}
                  </span>
                </div>
              )}
              
              {signal.token?.blockchain && (
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Blockchain</span>
                  <span className="text-gray-900 dark:text-white">
                    {signal.token.blockchain}
                  </span>
                </div>
              )}
              
              {signal.token?.contractAddress && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400">Contract</span>
                  <a 
                    href={`https://etherscan.io/token/${signal.token.contractAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                  >
                    View on Etherscan
                    <ArrowUpRight className="ml-1 w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Analyst Info */}
          {signal.analyst && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Analyst
              </h2>
              <div className="flex items-center space-x-3">
                {signal.analyst.avatar && (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={signal.analyst.avatar}
                      alt={signal.analyst.name}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {signal.analyst.name}
                  </h3>
                  {signal.analyst.title && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {signal.analyst.title}
                    </p>
                  )}
                </div>
              </div>
              {signal.analyst.bio && (
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                  {signal.analyst.bio}
                </p>
              )}
            </div>
          )}

          {/* Risk Disclaimer */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
              ⚠️ Risk Disclaimer
            </h3>
            <p className="text-xs text-yellow-700 dark:text-yellow-300">
              Trading cryptocurrencies involves substantial risk of loss. This is not financial advice. 
              Always do your own research before making any investment decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Target, 
  Shield,
  Star,
  Eye,
  ThumbsUp,
  Share2,
  Lock
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface SignalsGridProps {
  searchParams: {
    page?: string;
    category?: string;
    token?: string;
    direction?: string;
    status?: string;
    analyst?: string;
    featured?: string;
  };
  userId?: string | null;
}

interface Signal {
  _id: string;
  name: string;
  slug: { current: string };
  token: {
    symbol: string;
    name: string;
    logoURL?: string;
  };
  analyst: {
    displayName: string;
    avatar?: { asset: { url: string } };
    isVerified: boolean;
    tier: string;
  };
  category?: {
    name: string;
    color: string;
    icon?: string;
  };
  direction: 'buy' | 'sell' | 'long' | 'short';
  signalType?: string;
  entryPrice: number;
  targetPrices: number[];
  stopLoss?: number;
  status: string;
  accessLevel: 'public' | 'premium' | 'pro' | 'analyst' | 'admin';
  priority: 'low' | 'medium' | 'high' | 'critical';
  featured: boolean;
  confidence?: number;
  riskLevel: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
  timeframe: string;
  publishedAt: string;
  performance?: {
    pnlPercentage: number;
    pnlUsd: number;
    daysActive: number;
    hitTargets: number;
    totalTargets: number;
  };
  analytics?: {
    views: number;
    likes: number;
    shares: number;
  };
}

interface SignalsResponse {
  signals: Signal[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  userAccess: {
    role: string;
    subscription: string;
    premiumAccess: boolean;
  };
}

async function fetchSignals(searchParams: any): Promise<SignalsResponse> {
  const params = new URLSearchParams();
  
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) params.append(key, value as string);
  });
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/signals?${params}`, {
    cache: 'no-store'
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch signals');
  }
  
  return response.json();
}

function getDirectionIcon(direction: string) {
  switch (direction) {
    case 'buy':
    case 'long':
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    case 'sell':
    case 'short':
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    default:
      return <TrendingUp className="h-4 w-4 text-gray-500" />;
  }
}

function getDirectionColor(direction: string) {
  switch (direction) {
    case 'buy':
    case 'long':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'sell':
    case 'short':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

function getRiskColor(riskLevel: string) {
  switch (riskLevel) {
    case 'very_low':
      return 'bg-blue-100 text-blue-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'high':
      return 'bg-orange-100 text-orange-800';
    case 'very_high':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'low':
      return 'bg-gray-100 text-gray-600';
    case 'medium':
      return 'bg-blue-100 text-blue-600';
    case 'high':
      return 'bg-orange-100 text-orange-600';
    case 'critical':
      return 'bg-red-100 text-red-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
}

function SignalCard({ signal, userAccess }: { signal: Signal; userAccess: any }) {
  const isAccessible = 
    signal.accessLevel === 'public' ||
    (signal.accessLevel === 'premium' && userAccess.premiumAccess) ||
    (signal.accessLevel === 'pro' && ['Pro', 'Analyst'].includes(userAccess.subscription)) ||
    (signal.accessLevel === 'analyst' && userAccess.subscription === 'Analyst') ||
    (signal.accessLevel === 'admin' && userAccess.role === 'admin');

  const potentialReturn = signal.targetPrices.length > 0 
    ? ((signal.targetPrices[0] - signal.entryPrice) / signal.entryPrice * 100).toFixed(1)
    : null;

  return (
    <Card className={`relative overflow-hidden transition-all hover:shadow-lg ${
      signal.featured ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
    }`}>
      {signal.featured && (
        <div className="absolute top-2 right-2">
          <Star className="h-4 w-4 text-yellow-500 fill-current" />
        </div>
      )}
      
      {!isAccessible && (
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="text-center">
            <Lock className="h-8 w-8 text-gray-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600">
              {signal.accessLevel.charAt(0).toUpperCase() + signal.accessLevel.slice(1)} Access Required
            </p>
          </div>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            {signal.token.logoURL && (
              <img 
                src={signal.token.logoURL} 
                alt={signal.token.symbol}
                className="w-6 h-6 rounded-full"
              />
            )}
            <div>
              <h3 className="font-semibold text-lg">{signal.token.symbol}</h3>
              <p className="text-sm text-gray-600">{signal.token.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {getDirectionIcon(signal.direction)}
            <Badge className={getDirectionColor(signal.direction)}>
              {signal.direction.toUpperCase()}
            </Badge>
          </div>
        </div>

        <div className="flex items-center space-x-2 mt-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={signal.analyst.avatar?.asset?.url} />
            <AvatarFallback className="text-xs">
              {signal.analyst.displayName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-600">{signal.analyst.displayName}</span>
          {signal.analyst.isVerified && (
            <Badge variant="secondary" className="text-xs">
              ✓ Verified
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Entry Price</p>
            <p className="font-semibold">${signal.entryPrice.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-500">Target</p>
            <p className="font-semibold">
              ${signal.targetPrices[0]?.toLocaleString() || 'N/A'}
            </p>
          </div>
        </div>

        {potentialReturn && (
          <div className="text-center">
            <p className="text-sm text-gray-500">Potential Return</p>
            <p className={`font-bold text-lg ${
              parseFloat(potentialReturn) > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {potentialReturn}%
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Badge className={getRiskColor(signal.riskLevel)}>
            <Shield className="h-3 w-3 mr-1" />
            {signal.riskLevel.replace('_', ' ').toUpperCase()}
          </Badge>
          <Badge className={getPriorityColor(signal.priority)}>
            {signal.priority.toUpperCase()}
          </Badge>
          {signal.category && (
            <Badge variant="outline">
              {signal.category.name}
            </Badge>
          )}
        </div>

        {signal.performance && (
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <p className="text-gray-500">P&L</p>
                <p className={`font-semibold ${
                  signal.performance.pnlPercentage > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {signal.performance.pnlPercentage.toFixed(1)}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-500">Targets Hit</p>
                <p className="font-semibold">
                  {signal.performance.hitTargets}/{signal.performance.totalTargets}
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-500">Days Active</p>
                <p className="font-semibold">{signal.performance.daysActive}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-3">
            {signal.analytics && (
              <>
                <div className="flex items-center space-x-1">
                  <Eye className="h-3 w-3" />
                  <span>{signal.analytics.views}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ThumbsUp className="h-3 w-3" />
                  <span>{signal.analytics.likes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Share2 className="h-3 w-3" />
                  <span>{signal.analytics.shares}</span>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{formatDistanceToNow(new Date(signal.publishedAt), { addSuffix: true })}</span>
          </div>
        </div>

        <Button 
          asChild 
          className="w-full" 
          disabled={!isAccessible}
        >
          <Link href={`/signals/${signal.slug.current}`}>
            {isAccessible ? 'View Signal' : 'Upgrade to View'}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default async function SignalsGrid({ searchParams, userId }: SignalsGridProps) {
  try {
    const data = await fetchSignals(searchParams);
    
    if (data.signals.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium">No signals found</h3>
            <p className="text-sm">Try adjusting your filters or check back later for new signals.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.signals.map((signal) => (
            <SignalCard 
              key={signal._id} 
              signal={signal} 
              userAccess={data.userAccess}
            />
          ))}
        </div>

        {/* Pagination */}
        {data.pagination.pages > 1 && (
          <div className="flex justify-center space-x-2">
            {Array.from({ length: data.pagination.pages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === data.pagination.page ? "default" : "outline"}
                size="sm"
                asChild
              >
                <Link 
                  href={{
                    pathname: '/signals',
                    query: { ...searchParams, page: page.toString() }
                  }}
                >
                  {page}
                </Link>
              </Button>
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error loading signals:', error);
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <h3 className="text-lg font-medium">Error loading signals</h3>
          <p className="text-sm">Please try again later.</p>
        </div>
      </div>
    );
  }
}

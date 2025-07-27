// types/signal.ts
export interface Token {
    _id: string;
    name: string;
    symbol: string;
    slug?: string;
    logo?: string;
    price?: number;
    priceChange24h?: number;
    marketCap?: number;
    volume24h?: number;
    coingeckoId?: string;
    blockchain?: string;
    contractAddress?: string;
  }
  
  export interface Analyst {
    _id: string;
    name: string;
    slug: string;
    image?: string;
    avatar?: string;
    title?: string;
    bio?: string;
    socialLinks?: Record<string, string>;
  }
  
  export interface Category {
    _id: string;
    name: string;
    slug: string;
    color: string;
    description?: string;
    count?: number;
  }

  export interface MarketConditions {
    trend?: 'bullish' | 'bearish' | 'sideways' | 'mixed';
    volatility?: 'low' | 'medium' | 'high' | 'extreme';
    volume?: 'low' | 'medium' | 'high';
    marketSentiment?: 'fearful' | 'neutral' | 'greedy' | 'extreme_greed' | 'extreme_fear';
  }
  
  export interface Signal {
    _id: string;
    name: string;
    slug: string | { current: string };
    token: Token;
    analyst: Analyst;
    category?: Category;
    direction: 'buy' | 'sell' | 'long' | 'short';
    signalType?: string;
    entryPrice: number;
    targetPrices: number[];
    stopLoss?: number;
    riskRewardRatio?: number;
    status: 'active' | 'filled' | 'target_hit' | 'stop_loss' | 'completed' | 'canceled' | 'expired';
    publishedAt: string;
    updatedAt?: string;
    validUntil?: string;
    exitPrice?: number;
    exitDate?: string;
    notes?: string;
    analysis?: string;
    takeProfit1?: string;
    takeProfit2?: string;
    takeProfit3?: string;
    technicalAnalysis?: {
      indicators?: string[];
      timeframes?: string[];
      chartPatterns?: string[];
    };
    timeframes?: string[];
    timeframe?: 'scalping' | 'short' | 'medium' | 'long' | 'swing';
    riskLevel?: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
    confidence?: number;
    marketConditions?: MarketConditions;
    volumeLevel?: 'low' | 'medium' | 'high';
    tags?: string[];
  }
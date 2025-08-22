// Dashboard Types - Unified interfaces for all dashboard components

// ============================================================================
// API Response Types
// ============================================================================

export interface BaseAPIResponse {
  success: boolean;
  error?: string;
  timestamp: number;
}

export interface CoinGeckoAPIResponse extends BaseAPIResponse {
  data?: any; // Will be specific based on action
}

export interface TradingDataAPIResponse extends BaseAPIResponse {
  data?: OrderData;
}

export interface TokenMetadataAPIResponse extends BaseAPIResponse {
  data?: TokenMetadata[];
}

// ============================================================================
// Token Metadata Types
// ============================================================================

export interface TokenMetadata {
  id: number;
  symbol: string;
  name: string;
  chainId: number;
  coingeckoId?: string;
  logoURL?: string;
  decimals: number;
  totalSupply?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Market Data Types
// ============================================================================

export interface MarketData {
  volume24h: number;
  volume24hChange: number;
  marketCap: number;
  marketCapChange: number;
  fdv: number;
  fdvChange: number;
  circulatingSupply: number;
  circulatingSupplyChange: number;
  price: number;
  priceChange: number;
}

export interface CoinGeckoMarketData {
  market_data: {
    total_volume: { usd: number };
    current_price: { usd: number };
    price_change_percentage_24h: number;
    market_cap: { usd: number };
    market_cap_change_percentage_24h: number;
    current_price_change_percentage_24h: number;
    circulating_supply: number;
    circulating_supply_change_24h?: number;
    total_supply: number;
  };
}

// ============================================================================
// Order Data Types
// ============================================================================

export interface OrderData {
  buys: number;
  sells: number;
  buyVolume: number;
  sellVolume: number;
  buyers: Set<string>;
  sellers: Set<string>;
  source?: 'coingecko' | 'binance';
}

export interface BinanceTrade {
  isBuyerMaker: boolean;
  qty: string;
  id: number;
  price: string;
  time: number;
}

// ============================================================================
// Volume Data Types
// ============================================================================

export interface VolumeData {
  exchange: string;
  volume24h: number;
  marketShare: number;
  actualMarketShare: number;
}

export interface ExchangeData {
  name: string;
  volume_24h: number;
}

export interface CoinGeckoTicker {
  market?: {
    name: string;
  };
  converted_volume?: {
    usd: number;
  };
  target?: string;
}

// ============================================================================
// Liquidity Data Types
// ============================================================================

export interface LiquidityData {
  exchange: string;
  liquidity: number;
  volume24h: number;
  marketShare: number;
}

export interface LiquidityExchangeData {
  name: string;
  liquidity: number;
  volume_24h: number;
}

// ============================================================================
// Technical Specifications Types
// ============================================================================

export interface TechnicalSpecsData {
  marketCapRank: number;
  hashingAlgorithm: string;
  blockTime: number;
  genesisDate: string;
  tokenAddress: string;
  categories: string[];
  description: string;
}

export interface CoinGeckoTechnicalData {
  market_cap_rank: number;
  hashing_algorithm?: string;
  block_time_in_minutes?: number;
  genesis_date?: string;
  platforms?: Record<string, string>;
  categories?: string[];
  description?: {
    en?: string;
  };
}

// ============================================================================
// Component Prop Interfaces
// ============================================================================

export interface BaseComponentProps {
  tokenSymbol: string;
  chainId?: number;
}

export interface MarketStatsProps extends BaseComponentProps {
  marketData?: MarketData;
  isLoading?: boolean;
  error?: string;
}

export interface OrderDataProps extends BaseComponentProps {
  orderData?: OrderData;
  isLoading?: boolean;
  error?: string;
}

export interface ChartRadarProps extends BaseComponentProps {
  volumeData?: VolumeData[];
  isLoading?: boolean;
  error?: string;
}

export interface LiquidityDistributionProps extends BaseComponentProps {
  liquidityData?: LiquidityData[];
  isLoading?: boolean;
  error?: string;
}

export interface TechnicalSpecsProps extends BaseComponentProps {
  technicalSpecs?: TechnicalSpecsData;
  isLoading?: boolean;
  error?: string;
}

// ============================================================================
// Dashboard State Types
// ============================================================================

export interface DashboardState {
  currentToken: string;
  chainId: number;
  tokenMetadata?: TokenMetadata;
  marketData?: MarketData;
  orderData?: OrderData;
  volumeData?: VolumeData[];
  liquidityData?: LiquidityData[];
  technicalSpecs?: TechnicalSpecsData;
  isLoading: boolean;
  error?: string;
}

// ============================================================================
// API Request Types
// ============================================================================

export interface CoinGeckoRequest {
  action: 'market-data' | 'tickers' | 'volume-data' | 'liquidity-data' | 'technical-specs';
  id?: string;
  symbol?: string;
}

export interface TradingDataRequest {
  action: 'order-data' | 'trades';
  symbol: string;
  coingeckoId?: string;
}

export interface TokenMetadataRequest {
  symbols: string;
  chainId?: string;
}

// ============================================================================
// Utility Types
// ============================================================================

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface CacheEntry<T> {
  timestamp: number;
  data: T;
}

export interface RateLimitInfo {
  count: number;
  resetTime: number;
}

// ============================================================================
// Chart Configuration Types
// ============================================================================

export interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

export interface ChartDataPoint {
  [key: string]: string | number;
}

// ============================================================================
// Error Types
// ============================================================================

export interface APIError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

export interface ValidationError {
  field: string;
  message: string;
}

// ============================================================================
// Environment Configuration Types
// ============================================================================

export interface APIConfig {
  coingecko: {
    baseUrl: string;
    apiKey?: string;
    rateLimit: number;
    cacheTTL: number;
  };
  binance: {
    baseUrl: string;
    rateLimit: number;
    cacheTTL: number;
  };
  tokenMetadata: {
    cacheTTL: number;
  };
}

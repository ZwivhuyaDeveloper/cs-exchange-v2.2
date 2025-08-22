import { useQuery, useQueries, UseQueryResult } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import {
  TokenMetadata,
  MarketData,
  OrderData,
  VolumeData,
  LiquidityData,
  TechnicalSpecsData,
  DashboardState,
  LoadingState,
  APIError
} from '../types/dashboard';

// ============================================================================
// API Endpoints Configuration
// ============================================================================

const API_ENDPOINTS = {
  tokenMetadata: '/api/token-metadata',
  coingecko: '/api/coingecko',
  tradingData: '/api/trading-data'
} as const;

// ============================================================================
// Data Transformation Functions
// ============================================================================

function transformMarketData(rawData: any): MarketData {
  const marketData = rawData.market_data;
  return {
    volume24h: marketData.total_volume.usd || 0,
    volume24hChange: marketData.price_change_percentage_24h || 0,
    marketCap: marketData.market_cap.usd || 0,
    marketCapChange: marketData.market_cap_change_percentage_24h || 0,
    fdv: (marketData.current_price.usd || 0) * (marketData.total_supply || 0),
    fdvChange: marketData.price_change_percentage_24h || 0,
    circulatingSupply: marketData.circulating_supply || 0,
    circulatingSupplyChange: marketData.circulating_supply_change_24h || 0,
    price: marketData.current_price.usd || 0,
    priceChange: marketData.price_change_percentage_24h || 0
  };
}

function transformVolumeData(rawData: any): VolumeData[] {
  const exchanges = rawData.tickers || [];
  const exchangeMap = new Map<string, { name: string; volume_24h: number }>();
  
  exchanges.forEach((ticker: any) => {
    const exchange = ticker.market?.name || 'Unknown';
    const volume = ticker.converted_volume?.usd || 0;
    
    if (exchangeMap.has(exchange)) {
      exchangeMap.get(exchange)!.volume_24h += volume;
    } else {
      exchangeMap.set(exchange, {
        name: exchange,
        volume_24h: volume
      });
    }
  });
  
  const totalVolume = Array.from(exchangeMap.values()).reduce((sum, ex) => sum + ex.volume_24h, 0);
  
  return Array.from(exchangeMap.values())
    .filter(ex => ex.volume_24h > 0)
    .sort((a, b) => b.volume_24h - a.volume_24h)
    .slice(0, 6)
    .map(ex => ({
      exchange: ex.name,
      volume24h: ex.volume_24h,
      marketShare: totalVolume > 0 ? (ex.volume_24h / totalVolume) * 100 : 0,
      actualMarketShare: totalVolume > 0 ? (ex.volume_24h / totalVolume) * 100 : 0
    }));
}

function transformLiquidityData(rawData: any): LiquidityData[] {
  const exchanges = rawData.tickers || [];
  const exchangeMap = new Map<string, { name: string; liquidity: number; volume_24h: number }>();
  
  exchanges.forEach((ticker: any) => {
    const exchange = ticker.market?.name || 'Unknown';
    const volume = ticker.converted_volume?.usd || 0;
    const liquidity = ticker.converted_volume?.usd || 0; // Using volume as proxy for liquidity
    
    if (exchangeMap.has(exchange)) {
      exchangeMap.get(exchange)!.liquidity += liquidity;
      exchangeMap.get(exchange)!.volume_24h += volume;
    } else {
      exchangeMap.set(exchange, {
        name: exchange,
        liquidity,
        volume_24h: volume
      });
    }
  });
  
  const totalLiquidity = Array.from(exchangeMap.values()).reduce((sum, ex) => sum + ex.liquidity, 0);
  
  return Array.from(exchangeMap.values())
    .filter(ex => ex.liquidity > 0)
    .sort((a, b) => b.liquidity - a.liquidity)
    .slice(0, 8)
    .map(ex => ({
      exchange: ex.name,
      liquidity: ex.liquidity,
      volume24h: ex.volume_24h,
      marketShare: totalLiquidity > 0 ? (ex.liquidity / totalLiquidity) * 100 : 0
    }));
}

function transformTechnicalSpecs(rawData: any): TechnicalSpecsData {
  const platforms = rawData.platforms ? Object.entries(rawData.platforms) : [];
  const foundAddress = platforms.find(([_, addr]) => typeof addr === "string" && addr);
  const tokenAddress = typeof foundAddress?.[1] === "string" ? foundAddress[1] : 'N/A';
  
  return {
    marketCapRank: rawData.market_cap_rank || 0,
    hashingAlgorithm: rawData.hashing_algorithm || 'N/A',
    blockTime: rawData.block_time_in_minutes || 0,
    genesisDate: rawData.genesis_date ? new Date(rawData.genesis_date).toLocaleDateString() : 'N/A',
    tokenAddress,
    categories: rawData.categories || [],
    description: rawData.description?.en || 'No description available'
  };
}

// ============================================================================
// Individual API Query Functions
// ============================================================================

async function fetchTokenMetadata(symbol: string, chainId: number = 1): Promise<TokenMetadata[]> {
  const response = await fetch(`${API_ENDPOINTS.tokenMetadata}?symbols=${symbol}&chainId=${chainId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch token metadata: ${response.status}`);
  }
  return response.json();
}

async function fetchCoinGeckoData(action: string, coingeckoId: string): Promise<any> {
  try {
    const url = `${API_ENDPOINTS.coingecko}?action=${action}&id=${coingeckoId}`;
    console.log(`Fetching CoinGecko data from: ${url}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      let errorMessage = `Failed to fetch CoinGecko data: ${response.status} ${response.statusText}`;
      
      try {
        // Try to get error details from response
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (e) {
        // If we can't parse JSON, use the status text
        errorMessage = `${errorMessage} - ${await response.text()}`;
      }
      
      console.error('CoinGecko API error:', {
        action,
        coingeckoId,
        status: response.status,
        statusText: response.statusText,
        error: errorMessage
      });
      
      throw new Error(errorMessage);
    }
    
    const result = await response.json();
    
    if (!result.success) {
      const errorMessage = result.error || 'Unknown CoinGecko API error';
      console.error('CoinGecko API error response:', {
        action,
        coingeckoId,
        error: errorMessage,
        response: result
      });
      throw new Error(errorMessage);
    }
    
    return result.data;
  } catch (error) {
    console.error('Error in fetchCoinGeckoData:', {
      action,
      coingeckoId,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error; // Re-throw to be handled by the caller
  }
}

async function fetchTradingData(symbol: string, coingeckoId?: string): Promise<OrderData> {
  const params = new URLSearchParams({
    action: 'order-data',
    symbol,
    ...(coingeckoId && { coingeckoId })
  });
  
  const response = await fetch(`${API_ENDPOINTS.tradingData}?${params}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch trading data: ${response.status}`);
  }
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'Trading data API error');
  }
  return result.data;
}

// ============================================================================
// Main Dashboard Service Hook
// ============================================================================

export function useDashboardData(tokenSymbol: string, chainId: number = 1) {
  // First, fetch token metadata to get coingeckoId
  const tokenMetadataQuery = useQuery({
    queryKey: ['tokenMetadata', tokenSymbol, chainId],
    queryFn: () => fetchTokenMetadata(tokenSymbol, chainId),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const tokenInfo = tokenMetadataQuery.data?.[0];
  const coingeckoId = tokenInfo?.coingeckoId;

  // Fetch all dashboard data if we have a coingeckoId
  const marketDataQuery = useQuery({
    queryKey: ['marketData', coingeckoId],
    queryFn: () => fetchCoinGeckoData('market-data', coingeckoId!),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 3,
    enabled: !!coingeckoId,
    select: transformMarketData,
  });

  const volumeDataQuery = useQuery({
    queryKey: ['volumeData', coingeckoId],
    queryFn: () => fetchCoinGeckoData('volume-data', coingeckoId!),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 3,
    enabled: !!coingeckoId,
    select: transformVolumeData,
  });

  const liquidityDataQuery = useQuery({
    queryKey: ['liquidityData', coingeckoId],
    queryFn: () => fetchCoinGeckoData('liquidity-data', coingeckoId!),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 3,
    enabled: !!coingeckoId,
    select: transformLiquidityData,
  });

  const technicalSpecsQuery = useQuery({
    queryKey: ['technicalSpecs', coingeckoId],
    queryFn: () => fetchCoinGeckoData('technical-specs', coingeckoId!),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 3,
    enabled: !!coingeckoId,
    select: transformTechnicalSpecs,
  });

  const tradingDataQuery = useQuery({
    queryKey: ['tradingData', tokenSymbol, coingeckoId],
    queryFn: () => fetchTradingData(tokenSymbol, coingeckoId!),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    enabled: !!coingeckoId,
  });

  // Combine all data into unified dashboard state
  const dashboardState: DashboardState = {
    currentToken: tokenSymbol,
    chainId,
    tokenMetadata: tokenInfo,
    marketData: marketDataQuery.data,
    orderData: tradingDataQuery.data,
    volumeData: volumeDataQuery.data,
    liquidityData: liquidityDataQuery.data,
    technicalSpecs: technicalSpecsQuery.data,
    isLoading: tokenMetadataQuery.isLoading || marketDataQuery.isLoading || volumeDataQuery.isLoading || liquidityDataQuery.isLoading || technicalSpecsQuery.isLoading || tradingDataQuery.isLoading || false,
    error: tokenMetadataQuery.error?.message || marketDataQuery.error?.message || volumeDataQuery.error?.message || liquidityDataQuery.error?.message || technicalSpecsQuery.error?.message || tradingDataQuery.error?.message,
  };

  // Determine overall loading state
  const loadingState: LoadingState = (() => {
    if (tokenMetadataQuery.isError || marketDataQuery.isError || volumeDataQuery.isError || liquidityDataQuery.isError || technicalSpecsQuery.isError || tradingDataQuery.isError) return 'error';
    if (tokenMetadataQuery.isLoading || marketDataQuery.isLoading || volumeDataQuery.isLoading || liquidityDataQuery.isLoading || technicalSpecsQuery.isLoading || tradingDataQuery.isLoading) return 'loading';
    if (tokenMetadataQuery.isSuccess && marketDataQuery.isSuccess && volumeDataQuery.isSuccess && liquidityDataQuery.isSuccess && technicalSpecsQuery.isSuccess && tradingDataQuery.isSuccess) return 'success';
    return 'idle';
  })();

  return {
    ...dashboardState,
    loadingState,
    refetch: () => {
      tokenMetadataQuery.refetch();
      marketDataQuery.refetch();
      volumeDataQuery.refetch();
      liquidityDataQuery.refetch();
      technicalSpecsQuery.refetch();
      tradingDataQuery.refetch();
    },
    // Individual query states for granular control
    queries: {
      tokenMetadata: tokenMetadataQuery,
      marketData: marketDataQuery,
      volumeData: volumeDataQuery,
      liquidityData: liquidityDataQuery,
      technicalSpecs: technicalSpecsQuery,
      tradingData: tradingDataQuery,
    }
  };
}

// ============================================================================
// Token Metadata Hook
// ============================================================================

export function useTokenMetadata(symbol: string, chainId: number = 1) {
  const [token, setToken] = useState<TokenMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokenMetadata = async () => {
      if (!symbol) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/token-metadata?symbols=${symbol}&chainId=${chainId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch token metadata');
        }

        const tokens = await response.json();
        setToken(tokens[0] || null);
      } catch (err) {
        console.error('Error fetching token metadata:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch token metadata');
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokenMetadata();
  }, [symbol, chainId]);

  return { token, isLoading, error };
}

// ============================================================================
// Individual Data Hooks (for components that need specific data)
// ============================================================================

export function useMarketData(tokenSymbol: string, chainId: number = 1) {
  const { marketData, isLoading, error } = useDashboardData(tokenSymbol, chainId);
  return { marketData, isLoading, error };
}

export function useOrderData(tokenSymbol: string, chainId: number = 1) {
  const { orderData, isLoading, error } = useDashboardData(tokenSymbol, chainId);
  return { orderData, isLoading, error };
}

export function useVolumeData(tokenSymbol: string, chainId: number = 1) {
  const { volumeData, isLoading, error } = useDashboardData(tokenSymbol, chainId);
  return { volumeData, isLoading, error };
}

export function useLiquidityData(tokenSymbol: string, chainId: number = 1) {
  const { liquidityData, isLoading, error } = useDashboardData(tokenSymbol, chainId);
  return { liquidityData, isLoading, error };
}

export function useTechnicalSpecs(tokenSymbol: string, chainId: number = 1) {
  const { technicalSpecs, isLoading, error } = useDashboardData(tokenSymbol, chainId);
  return { technicalSpecs, isLoading, error };
}

// ============================================================================
// Utility Functions
// ============================================================================

export function isDataStale(timestamp: number, staleTime: number = 5 * 60 * 1000): boolean {
  return Date.now() - timestamp > staleTime;
}

export function getCacheKey(...parts: (string | number)[]): string {
  return parts.join(':');
}

// ============================================================================
// Error Handling Utilities
// ============================================================================

export function handleAPIError(error: unknown): APIError {
  if (error instanceof Error) {
    return {
      message: error.message,
      status: 500,
      code: 'UNKNOWN_ERROR'
    };
  }
  
  if (typeof error === 'string') {
    return {
      message: error,
      status: 500,
      code: 'STRING_ERROR'
    };
  }
  
  return {
    message: 'An unknown error occurred',
    status: 500,
    code: 'UNKNOWN_ERROR'
  };
}

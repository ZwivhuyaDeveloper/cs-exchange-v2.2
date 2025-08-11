import { useEffect, useState, useCallback } from 'react';
import { formatUnits, parseUnits } from 'ethers';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface TokenInfo {
  id: number;
  chainId: number;
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURL?: string;
  coingeckoId?: string;
  tradingViewSymbol?: string;
  type?: string;
  exchange?: string;
  isDefault: boolean;
}

interface TokenEquivalentValueProps {
  sellToken: string;
  buyToken: string;
  chainId: number;
  tokenMap: Record<string, TokenInfo>;
  className?: string;
}

interface PriceResponse {
  buyAmount?: string;
  validationErrors?: Array<{ description: string }>;
}

export const TokenEquivalentValue = ({
  sellToken,
  buyToken,
  chainId,
  tokenMap,
  className = '',
}: TokenEquivalentValueProps) => {
  const [rate, setRate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Get token info with fallbacks
  const getTokenInfo = useCallback(
    (symbol: string): TokenInfo | null => {
      if (!symbol) return null;
      return tokenMap?.[symbol.toLowerCase()] || null;
    },
    [tokenMap]
  );

  // Format token amount with correct decimals
  const formatTokenAmount = useCallback((amount: string, decimals: number): string => {
    try {
      const value = parseFloat(amount) / 10 ** decimals;
      return value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6,
      });
    } catch (e) {
      console.error('Error formatting amount:', e);
      return '0';
    }
  }, []);

  // Fetch token price from database or CoinGecko
  const fetchTokenPrice = useCallback(async () => {
    if (!sellToken || !buyToken || !chainId) {
      setRate('');
      return;
    }

    const sellTokenInfo = getTokenInfo(sellToken);
    const buyTokenInfo = getTokenInfo(buyToken);

    if (!sellTokenInfo || !buyTokenInfo) {
      console.warn('Token info not found', { sellToken, buyToken });
      setError('Token information not available');
      setLoading(false);
      return;
    }

    // Skip if tokens are the same
    if (sellToken.toLowerCase() === buyToken.toLowerCase()) {
      setRate('1.0'); // 1:1 rate for same tokens
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get 1 unit of sell token in its smallest denomination
      const oneUnit = parseUnits('1', sellTokenInfo.decimals).toString();

      // First try to get price from our database/price API
      const params = new URLSearchParams({
        chainId: chainId.toString(),
        sellToken: sellTokenInfo.address,
        buyToken: buyTokenInfo.address,
        sellAmount: oneUnit,
        taker: '0x0000000000000000000000000000000000000000',
      });

      const response = await fetch(`/api/price?${params}`);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data: PriceResponse = await response.json();

      if (data?.validationErrors?.length) {
        console.warn('Price API validation error:', data.validationErrors);
        // Don't throw here, try CoinGecko as fallback
        if (sellTokenInfo.coingeckoId && buyTokenInfo.coingeckoId) {
          await fetchCoingeckoRate(sellTokenInfo, buyTokenInfo);
          return;
        }
        throw new Error('No valid price data available');
      }

      if (data?.buyAmount) {
        const formattedRate = formatTokenAmount(data.buyAmount, buyTokenInfo.decimals);
        setRate(formattedRate);
        return;
      }

      // Fallback to CoinGecko if our API doesn't have the rate
      if (sellTokenInfo.coingeckoId && buyTokenInfo.coingeckoId) {
        await fetchCoingeckoRate(sellTokenInfo, buyTokenInfo);
      } else {
        throw new Error('No price source available for this token pair');
      }
    } catch (err) {
      console.error('Failed to fetch token price:', err);
      setError('Could not fetch rate');
      setRate('');
    } finally {
      setLoading(false);
    }
  }, [sellToken, buyToken, chainId, tokenMap, getTokenInfo, formatTokenAmount]);

  // Fetch rate from CoinGecko
  const fetchCoingeckoRate = async (sellTokenInfo: TokenInfo, buyTokenInfo: TokenInfo) => {
    if (!sellTokenInfo.coingeckoId || !buyTokenInfo.coingeckoId) {
      throw new Error('Missing CoinGecko ID for one or both tokens');
    }

    try {
      // Fetch both token prices in USD
      const response = await fetch(
        `/api/coingecko/price?ids=${sellTokenInfo.coingeckoId},${buyTokenInfo.coingeckoId}&vs_currencies=usd`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch from CoinGecko');
      }

      const data = await response.json();
      
      const sellPrice = data[sellTokenInfo.coingeckoId]?.usd;
      const buyPrice = data[buyTokenInfo.coingeckoId]?.usd;

      if (sellPrice === undefined || buyPrice === undefined) {
        throw new Error('Invalid price data from CoinGecko');
      }

      // Calculate the exchange rate: 1 sellToken = (sellPrice / buyPrice) buyToken
      const exchangeRate = sellPrice / buyPrice;
      
      // Format based on the magnitude of the rate
      let formattedRate: string;
      if (exchangeRate < 0.0001) {
        formattedRate = exchangeRate.toExponential(4);
      } else if (exchangeRate < 1) {
        formattedRate = exchangeRate.toFixed(6).replace(/\.?0+$/, '');
      } else {
        formattedRate = exchangeRate.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 6,
        });
      }

      setRate(formattedRate);
    } catch (err) {
      console.error('Error fetching from CoinGecko:', err);
      throw err;
    }
  };

  // Debounce and fetch price when dependencies change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchTokenPrice();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [fetchTokenPrice]);

  // Skip if tokens are not selected
  if (!sellToken || !buyToken) {
    return null;
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-32" />
        </div>
      );
    }

    if (error) {
      const sellSymbol = getTokenInfo(sellToken)?.symbol?.toUpperCase() || sellToken.toUpperCase();
      const buySymbol = getTokenInfo(buyToken)?.symbol?.toUpperCase() || buyToken.toUpperCase();
      
      return (
        <div className="flex flex-col items-end">
          <span className="text-xs text-muted-foreground">
            Rate unavailable
          </span>
          <span className="text-[10px] text-muted-foreground/50">
            {sellSymbol}/{buySymbol}
          </span>
        </div>
      );
    }

    if (rate) {
      const sellSymbol = getTokenInfo(sellToken)?.symbol?.toUpperCase() || sellToken.toUpperCase();
      const buySymbol = getTokenInfo(buyToken)?.symbol?.toUpperCase() || buyToken.toUpperCase();
      
      return (
        <div className="flex flex-col items-end">
          <span className="text-xs text-muted-foreground">
            1 {sellSymbol} = {rate} {buySymbol}
          </span>
          <span className="text-[10px] text-muted-foreground opacity-70">
            Exchange rate
          </span>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={`min-h-[20px] w-full ${className}`}>
      <Badge
        variant="outline"
        className="bg-transparent border-transparent font-normal m-0 p-0 h-auto w-full justify-end"
      >
        {renderContent()}
      </Badge>
    </div>
  );
};
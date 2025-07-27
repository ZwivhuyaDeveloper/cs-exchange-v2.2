import { useEffect, useState, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface TokenUSDValueProps {
  amount: string;
  tokenSymbol: string;
  chainId: number;
}

export const TokenUSDValue = ({ amount, tokenSymbol, chainId }: TokenUSDValueProps) => {
  const [usdPrice, setUsdPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);

  // Validate if amount is a valid number
  const isValidAmount = useCallback(() => {
    if (!amount) return false;
    const amountNum = parseFloat(amount);
    return !isNaN(amountNum) && amountNum > 0;
  }, [amount]);

  // Fetch token metadata (including coingeckoId)
  useEffect(() => {
    if (!tokenSymbol) return;
    
    setTokenInfo(null);
    setTokenError(null);
    setUsdPrice(null);
    
    const fetchTokenMetadata = async () => {
      try {
        const response = await fetch(`/api/token-metadata?symbols=${tokenSymbol}&chainId=${chainId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const tokens = await response.json();
        
        if (tokens?.length > 0) {
          setTokenInfo(tokens[0]);
        } else {
          setTokenError('Token not found');
        }
      } catch (error) {
        console.error('Error fetching token metadata:', error);
        setTokenError('Failed to load token info');
        // Fallback to direct CoinGecko search if metadata endpoint fails
        if (process.env.NEXT_PUBLIC_COINGECKO_API_KEY) {
          try {
            const response = await fetch(
              `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${tokenSymbol.toLowerCase()}`,
              { 
                headers: { 
                  'x-cg-demo-api-key': process.env.NEXT_PUBLIC_COINGECKO_API_KEY 
                } 
              }
            );
            
            if (response.ok) {
              const data = await response.json();
              if (data && data.length > 0) {
                setTokenInfo({ 
                  ...data[0],
                  coingeckoId: data[0].id
                });
                return;
              }
            }
          } catch (e) {
            console.error('Fallback CoinGecko search failed:', e);
          }
        }
        setTokenError('Failed to load token info');
      }
    };
    
    fetchTokenMetadata();
  }, [tokenSymbol, chainId]);

  const fetchUsdPrice = useCallback(async () => {
    if (!tokenInfo || !isValidAmount()) {
      setUsdPrice(null);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;
      if (!apiKey) throw new Error("CoinGecko API key is missing");
      
      const coingeckoId = tokenInfo?.coingeckoId || tokenInfo?.id;
      if (!coingeckoId) throw new Error("Token not supported on CoinGecko");

      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(coingeckoId)}&vs_currencies=usd`,
        { 
          headers: { 
            "x-cg-demo-api-key": apiKey,
            'Accept': 'application/json'
          },
          // Add timeout to prevent hanging requests
          signal: AbortSignal.timeout(5000)
        }
      );

      if (!response.ok) {
        // If rate limited, try alternative endpoint
        if (response.status === 429) {
          const fallbackResponse = await fetch(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${encodeURIComponent(coingeckoId)}`,
            { 
              headers: { 
                "x-cg-demo-api-key": apiKey,
                'Accept': 'application/json'
              }
            }
          );
          
          if (fallbackResponse.ok) {
            const data = await fallbackResponse.json();
            if (data && data.length > 0) {
              setUsdPrice(data[0].current_price);
              return;
            }
          }
        }
        throw new Error(`Failed to fetch price: ${response.status}`);
      }

      const data = await response.json();
      const price = data[coingeckoId]?.usd;

      if (price === undefined) throw new Error("No price data available");
      setUsdPrice(price);
    } catch (err) {
      console.error("Failed to fetch USD price:", err);
      // If we have token info but failed to fetch price, show a more specific error
      if (tokenInfo?.current_price) {
        setUsdPrice(tokenInfo.current_price);
      } else {
        setError(err instanceof Error ? err.message : "Failed to fetch price");
      }
    } finally {
      setLoading(false);
    }
  }, [tokenInfo, isValidAmount]);

  useEffect(() => {
    // Clear previous timeout
    if (timeoutId) clearTimeout(timeoutId);

    // Set new timeout to debounce requests
    const newTimeoutId = setTimeout(() => {
      fetchUsdPrice();
    }, 500); // 500ms debounce

    setTimeoutId(newTimeoutId);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [amount, tokenSymbol, chainId, tokenInfo]);

  if (!isValidAmount()) return null;

  return (
    <div className="text-sm text-muted-foreground mt-1 flex min-w-[120px] justify-end">
      {loading ? (
        <Skeleton className="h-4 w-24" />
      ) : error ? (
        <span className="text-sm text-gray-400">Price Error</span>
      ) : tokenError ? (
        <span className="text-sm text-gray-400">Token Unsupported</span>
      ) : usdPrice ? (
        <span className="text-sm text-gray-400">
          ${(parseFloat(amount) * usdPrice).toLocaleString(undefined, {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
          })}
        </span>
      ) : null}
    </div>
  );
};
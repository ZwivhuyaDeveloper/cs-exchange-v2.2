import { useEffect, useState, useCallback } from "react";
import { COINGECKO_IDS } from "@/src/constants";
import { Skeleton } from "@/components/ui/skeleton";

interface TokenUSDValueProps {
  amount: string;
  tokenSymbol: string;
  chainId: number;
  tokenMap: { [key: string]: any };
}

export const TokenUSDValue = ({ amount, tokenSymbol, chainId, tokenMap }: TokenUSDValueProps) => {
  const [usdPrice, setUsdPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // Get token info with safety checks
  const token = tokenSymbol ? tokenMap?.[tokenSymbol.toLowerCase()] : null;

  // Validate if amount is a valid number
  const isValidAmount = useCallback(() => {
    if (!amount) return false;
    const amountNum = parseFloat(amount);
    return !isNaN(amountNum) && amountNum > 0;
  }, [amount]);

  const fetchUsdPrice = useCallback(async () => {
    if (!token || !isValidAmount()) {
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

      const coingeckoId = COINGECKO_IDS[token.symbol.toLowerCase()];
      if (!coingeckoId) {
        setError("USD price not available for this token");
        return;
      }

      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId}&vs_currencies=usd`,
        { headers: { "x-cg-demo-api-key": apiKey } }
      );

      if (!response.ok) throw new Error(`Failed to fetch price: ${response.status}`);

      const data = await response.json();
      const price = data[coingeckoId]?.usd;

      if (!price) throw new Error("No price data available");
      setUsdPrice(price);
    } catch (err) {
      console.error("Failed to fetch USD price:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch price");
    } finally {
      setLoading(false);
    }
  }, [token, isValidAmount]);

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
  }, [amount, tokenSymbol, chainId]);

  if (!isValidAmount()) return null;

  return (
    <div className="text-sm text-muted-foreground mt-1 flex min-w-[120px] justify-end">
      {loading ? (
        <Skeleton className="h-4 w-24" />
      ) : error ? (
        <span className="text-xs text-gray-400">Error</span>
      ) : usdPrice ? (
        <span className="text-xs text-gray-400">
        ${(parseFloat(amount) * usdPrice).toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2
        })}
        </span>
      ) : null}
    </div>
  );
};
import { useEffect, useState, useMemo, useCallback } from "react";
import { formatUnits, parseUnits } from "ethers";
import { AFFILIATE_FEE } from "@/src/constants";
import { Skeleton } from "@/components/ui/skeleton";

interface FinalSwapValueProps {
  buyAmount: string;
  buyTokenSymbol: string;
  chainId: number;
  feeAmount: string;
  tokenMap: { [key: string]: any };
}

export const FinalSwapValue = ({ 
  buyAmount, 
  buyTokenSymbol, 
  chainId, 
  feeAmount, 
  tokenMap 
}: FinalSwapValueProps) => {
  const [formattedNetAmount, setFormattedNetAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get token info with memoization and debug logging
  const tokenInfo = useMemo(() => {
    if (!buyTokenSymbol) {
      console.log('No buyTokenSymbol provided');
      return null;
    }
    
    console.log('Looking up token:', buyTokenSymbol);
    console.log('Available tokens in map:', Object.keys(tokenMap || {}));
    
    const tokenKey = Object.keys(tokenMap || {}).find(
      key => key.toLowerCase() === buyTokenSymbol.toLowerCase()
    );
    
    const token = tokenKey ? tokenMap[tokenKey] : null;
    console.log('Found token:', token);
    
    return token;
  }, [buyTokenSymbol, tokenMap]);

  // Format the amount with proper decimal handling using ethers.js
  const formatTokenAmount = useCallback((amount: string, decimals: number = 18) => {
    try {
      console.log(`Formatting amount: ${amount} with ${decimals} decimals`);
      
      if (!amount || amount === '0' || amount === '0.') {
        console.log('Empty or zero amount');
        return { formatted: "", raw: "" };
      }
      
      // Parse the amount with the correct decimals
      let parsedAmount: number;
      try {
        parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
          console.log('Invalid or non-positive amount');
          return { formatted: "", raw: "" };
        }
      } catch (e) {
        console.error('Error parsing amount:', e);
        return { formatted: "", raw: "" };
      }

      // For tokens with very small values, show more decimal places
      const isSmallValue = parsedAmount < 0.0001;
      const isStablecoin = ['USDC', 'USDT', 'DAI', 'BUSD'].includes(buyTokenSymbol?.toUpperCase() || '');
      
      let significantDecimals = Math.min(decimals, 18); // Cap at 18 decimals
      
      if (isStablecoin) {
        // Always show 2 decimal places for stablecoins
        significantDecimals = Math.max(2, significantDecimals);
      } else if (isSmallValue) {
        // Show more decimals for very small values
        significantDecimals = Math.min(8, significantDecimals);
      } else {
        // For normal values, use 4-6 decimal places
        significantDecimals = Math.min(6, significantDecimals);
      }

      // Format with grouping and appropriate decimal places
      const formatOptions: Intl.NumberFormatOptions = {
        minimumFractionDigits: isStablecoin ? 2 : 0,
        maximumFractionDigits: significantDecimals,
        useGrouping: true
      };

      const formatted = parsedAmount.toLocaleString(undefined, formatOptions);
      console.log(`Formatted ${parsedAmount} as:`, formatted);
      
      return { 
        formatted, 
        raw: parsedAmount.toString() 
      };
    } catch (err) {
      console.error("Error formatting amount:", err);
      return { formatted: "", raw: "" };
    }
  }, [buyTokenSymbol]);

  useEffect(() => {
    let isMounted = true;
    
    const calculateFinalAmount = async () => {
      if (!isMounted) return;
      
      try {
        setLoading(true);
        setError(null);
        
        console.group('FinalSwapValue - calculateFinalAmount');
        console.log('buyTokenSymbol:', buyTokenSymbol);
        console.log('buyAmount:', buyAmount);
        console.log('tokenInfo:', tokenInfo);

        // If no token info is available, we can't proceed
        if (!tokenInfo && buyTokenSymbol) {
          const errorMsg = `Token not found in tokenMap: ${buyTokenSymbol}. Available tokens: ${Object.keys(tokenMap || {}).join(', ')}`;
          console.warn(errorMsg);
          if (isMounted) setError("Token not found");
          return;
        }

        // If no buy amount, reset
        if (!buyAmount || buyAmount === "0" || buyAmount === "0." || parseFloat(buyAmount) <= 0) {
          console.log('No valid buy amount provided');
          if (isMounted) setFormattedNetAmount("");
          return;
        }

        // Get token decimals with fallback to 18
        const decimals = tokenInfo?.decimals ?? 18;
        console.log('Using decimals:', decimals, 'for token:', buyTokenSymbol);
        
        // Format the amount with proper decimal handling
        const { formatted, raw } = formatTokenAmount(buyAmount, decimals);
        console.log('Formatted amount:', { formatted, raw });
        
        if (!formatted) {
          const errorMsg = `Invalid amount format for ${buyAmount} ${buyTokenSymbol} (${decimals} decimals)`;
          console.error(errorMsg);
          if (isMounted) setError("Invalid amount format");
          return;
        }
        
        if (isMounted) {
          setFormattedNetAmount(formatted);
          console.log('Successfully set formatted amount:', formatted);
        }
        
      } catch (err) {
        console.error("Failed to calculate final amount:", err);
        if (isMounted) setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        console.groupEnd();
        if (isMounted) setLoading(false);
      }
    };

    // Add a small debounce to prevent rapid recalculations
    const timer = setTimeout(() => {
      calculateFinalAmount();
    }, 50);

    // Cleanup function
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [buyAmount, buyTokenSymbol, tokenInfo, tokenMap, formatTokenAmount]);

  // Get token display symbol with fallback
  const displaySymbol = useMemo(() => {
    if (!buyTokenSymbol) return '';
    return tokenInfo?.symbol?.toUpperCase() || buyTokenSymbol.toUpperCase();
  }, [buyTokenSymbol, tokenInfo]);

  // Don't render anything if there's no amount to display
  if (!buyAmount || buyAmount === "0" || buyAmount === "0." || parseFloat(buyAmount) <= 0) return null;

  if (loading) {
    return <Skeleton className="h-6 w-32" />;
  }

  if (error) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30">
        <span className="text-xs font-medium text-red-600 dark:text-red-400">Error loading amount</span>
      </div>
    );
  }

  if (!formattedNetAmount) {
    return (
      <div className="flex items-center gap-1">
        <span className="font-medium text-foreground">0.0</span>
        <span className="text-muted-foreground">
          {tokenInfo?.symbol || buyTokenSymbol}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <div className="text-sm text-gray-400 font-normal">
        <div className="flex items-center gap-1">
          <span className="font-medium text-foreground">
            {formattedNetAmount}
          </span>
          <span className="text-muted-foreground">
            {tokenInfo?.symbol || buyTokenSymbol}
          </span>
          {feeAmount && parseFloat(feeAmount) > 0 && (
            <span className="text-sm text-muted-foreground ml-1">
              (incl. {AFFILIATE_FEE/100}% fee)
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
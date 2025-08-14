import { useEffect, useState, useMemo } from "react";
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
  const [state, setState] = useState({
    formattedNetAmount: "0.0",
    loading: false,
    error: null as string | null,
  });

  // Get token info (if available)
  const tokenInfo = useMemo(() => {
    if (!buyTokenSymbol) return null;
    
    const tokenKey = Object.keys(tokenMap || {}).find(
      key => key.toLowerCase() === buyTokenSymbol.toLowerCase()
    );
    
    return tokenKey ? tokenMap[tokenKey] : null;
  }, [buyTokenSymbol, tokenMap]);

  // Token display symbol (fallback to buyTokenSymbol if tokenInfo missing)
  const displaySymbol = useMemo(() => {
    if (!buyTokenSymbol) return '';
    return tokenInfo?.symbol?.toUpperCase() || buyTokenSymbol.toUpperCase();
  }, [buyTokenSymbol, tokenInfo]);

  // Format token amount
  const formatTokenAmount = useMemo(() => {
    return (amount: string, decimals: number = 18): string => {
      try {
        // Handle empty or zero amount
        if (!amount || amount === '0' || amount === '0.' || parseFloat(amount) <= 0) return "0.0";
        
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount)) return "0.0";
        
        const isStablecoin = ['USDC', 'USDT', 'DAI', 'BUSD'].includes(
          buyTokenSymbol?.toUpperCase() || ''
        );
        
        // Determine decimal places
        let maxDecimals = decimals > 18 ? 18 : decimals;
        if (isStablecoin) maxDecimals = Math.max(2, maxDecimals);
        else if (parsedAmount < 0.0001) maxDecimals = Math.min(8, maxDecimals);
        else maxDecimals = Math.min(6, maxDecimals);
        
        // Format the number
        return parsedAmount.toLocaleString(undefined, {
          minimumFractionDigits: isStablecoin ? 2 : 0,
          maximumFractionDigits: maxDecimals,
          useGrouping: true
        });
      } catch {
        return "0.0";
      }
    };
  }, [buyTokenSymbol]);

  // Calculate final amount
  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(() => {
      // show loader briefly if you like
      setState(prev => ({ ...prev, loading: true }));

      try {
        // If there's no buyTokenSymbol (nothing selected) -> show 0.0
        if (!buyTokenSymbol) {
          if (isMounted) {
            setState({
              formattedNetAmount: "0.0",
              loading: false,
              error: null
            });
          }
          return;
        }

        // If tokenInfo missing, we *don't* treat it as an error.
        // Instead fallback to default decimals (18) and fallback display symbol.
        const decimals = tokenInfo?.decimals ?? 18;
        const formatted = formatTokenAmount(buyAmount || "0", decimals);
        
        if (isMounted) {
          setState({
            formattedNetAmount: formatted,
            loading: false,
            error: null
          });
        }
      } catch (err) {
        if (isMounted) {
          setState({
            formattedNetAmount: "0.0",
            loading: false,
            error: "Formatting error"
          });
        }
      }
    }, 50);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [buyAmount, buyTokenSymbol, tokenInfo, tokenMap, formatTokenAmount]);

  return (
    <div className="flex flex-col w-full">
      <div className="text-sm text-gray-400 font-normal">
        {state.loading ? (
          <Skeleton className="h-4 w-32" />
        ) : state.error ? (
          // Only show the generic message when we had an *actual* formatting error
          <span className="text-sm text-muted-foreground">
            Could not calculate amount
          </span>
        ) : (
          <div className="flex items-center gap-1">
            <span className="font-medium text-foreground">
              {state.formattedNetAmount}
            </span>
            {displaySymbol && (
              <span className="text-muted-foreground">
                {displaySymbol}
              </span>
            )}
            {feeAmount && parseFloat(feeAmount || "0") > 0 && (
              <span className="text-sm text-muted-foreground ml-1">
                (incl. {AFFILIATE_FEE/100}% fee)
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

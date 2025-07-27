import { useEffect, useState } from "react";
import { formatUnits } from "ethers";
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

  useEffect(() => {
    const formatAmount = () => {
      try {
        setLoading(true);
        setError(null);

        // Safely get token info with fallbacks
        const tokenKey = buyTokenSymbol?.toLowerCase();
        const token = tokenKey ? tokenMap?.[tokenKey] : null;
        
        if (!token && buyTokenSymbol) {
          console.warn(`Token not found in tokenMap: ${buyTokenSymbol}`);
          setError("Token not found");
          return;
        }

        // The buyAmount is already net of fees, just format it
        const amount = parseFloat(buyAmount);
        if (isNaN(amount) || amount <= 0) {
          setFormattedNetAmount("");
          return;
        }

        const formatted = amount.toLocaleString(undefined, {
          minimumFractionDigits: 4,
          maximumFractionDigits: 6
        });
        
        setFormattedNetAmount(formatted);
        
      } catch (err) {
        console.error("Failed to format amount:", err);
        setError("Error formatting amount");
      } finally {
        setLoading(false);
      }
    };

    formatAmount();
  }, [buyAmount, buyTokenSymbol, chainId, tokenMap]);

  if (!buyAmount || parseFloat(buyAmount) <= 0) return null;

  // Simple token display function with fallback
  const getTokenDisplay = (symbol: string) => {
    if (!symbol) return '';
    const token = tokenMap?.[symbol.toLowerCase()];
    return token?.symbol?.toUpperCase() || symbol.toUpperCase();
  };

  return (
    <div className="flex flex-col gap-4 h-fit w-full">
      <div className="text-sm text-gray-400 font-normal flex">
        {loading ? (
          <Skeleton className="h-4 w-32" />
        ) : error ? (
          <span className="text-xs text-muted-foreground">
            Could not calculate amount
          </span>
        ) : formattedNetAmount ? (
          <div className="text-xs flex flex-row gap-1">
            <span className="text-gray-400 font-medium">
              {formattedNetAmount} {getTokenDisplay(buyTokenSymbol)}
            </span>
            {feeAmount && parseFloat(feeAmount) > 0 && (
              <span className="text-gray-400 text-xs opacity-70">
                (incl. {AFFILIATE_FEE/100}% fee)
              </span>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
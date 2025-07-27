import { Badge } from "@/components/ui/badge";
import { formatUnits } from "ethers";

interface TokenInfo {
  decimals?: number;
  symbol?: string;
  address?: string;
}

interface FeeInfo {
  amount: string | bigint | number;
  type?: string;
  token?: string;
}

interface FeeBadgeProps {
  price: any;
  buyToken: string;
  tokenMap: Record<string, TokenInfo>;
}

export function AffiliateFeeBadge({ price, buyToken, tokenMap }: FeeBadgeProps) {
  const getFormattedFee = (): { amount: string; symbol: string } | null => {
    if (!price?.fees) {
      console.debug('No fees object in price data');
      return null;
    }

    // Try to find any fee with an amount
    let feeInfo: FeeInfo | null = null;
    
    // Check standard fee locations
    const feeTypes = [
      'integratorFee',
      'liquidityProviderFee',
      'protocolFee',
      'affiliateFee',
      'fee'
    ];

    for (const feeType of feeTypes) {
      if (price.fees[feeType]?.amount) {
        feeInfo = {
          ...price.fees[feeType],
          type: feeType
        };
        break;
      }
    }

    // If no standard fee found, look for any object with an amount
    if (!feeInfo) {
      const feeEntries = Object.entries(price.fees);
      for (const [key, value] of feeEntries) {
        if (value && typeof value === 'object' && 'amount' in value) {
          feeInfo = {
            ...(value as FeeInfo),
            type: key
          };
          break;
        }
      }
    }

    if (!feeInfo?.amount) {
      console.debug('No fee amount found in fees object:', price.fees);
      return null;
    }

    // Get token info with fallbacks
    const tokenKey = buyToken.toLowerCase();
    const tokenInfo = tokenMap?.[tokenKey] || {};
    const decimals = tokenInfo?.decimals ?? 18;
    const symbol = tokenInfo?.symbol || tokenKey.toUpperCase();

    try {
      // Handle different amount types (string, bigint, number)
      const amount = typeof feeInfo.amount === 'number' 
        ? feeInfo.amount.toString() 
        : feeInfo.amount;
      
      const feeAmount = Number(
        formatUnits(BigInt(amount), decimals)
      ).toLocaleString(undefined, {
        minimumFractionDigits: 6,
        maximumFractionDigits: 6
      });
      
      return { amount: feeAmount, symbol };
    } catch (error) {
      console.error('Error formatting fee:', {
        error,
        amount: feeInfo.amount,
        decimals,
        tokenInfo,
        buyToken,
        feeInfo
      });
      return null;
    }
  };

  const feeData = getFormattedFee();
  if (!feeData) return null;

  return (
    <Badge 
      variant="outline"
      className="justify-end w-full items-end h-fit bg-transparent border-transparent gap-1 m-0 p-0"
    >
      <div className="flex w-full justify-end">
        <div className="text-muted-foreground text-xs font-medium">
          Fee: {feeData.amount} {feeData.symbol}
        </div>
      </div>
    </Badge>
  );
}
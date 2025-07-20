import { useEffect, useState } from "react";
import { MAINNET_TOKENS_BY_SYMBOL } from "@/src/constants";
import qs from "qs";
import { formatUnits, parseUnits } from "viem";
import { Badge } from '@/components/ui/badge';
import { Skeleton } from "@/components/ui/skeleton";

interface TokenEquivalentValueProps {
  sellToken: string;
  buyToken: string;
  chainId: number;
}

export const TokenEquivalentValue = ({
  sellToken,
  buyToken,
  chainId,
}: TokenEquivalentValueProps) => {
  const [equivalentAmount, setEquivalentAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConversionRate = async () => {
      if (!sellToken || !buyToken || sellToken === buyToken) return;
      
      setLoading(true);
      setError(null);

      try {
        const sellTokenInfo = MAINNET_TOKENS_BY_SYMBOL[sellToken.toLowerCase()];
        const buyTokenInfo = MAINNET_TOKENS_BY_SYMBOL[buyToken.toLowerCase()];

        if (!sellTokenInfo || !buyTokenInfo) {
          setError("Invalid token pair");
          return;
        }

        // Get 1 unit of sell token in its smallest denomination
        const oneUnit = parseUnits("1", sellTokenInfo.decimals).toString();

        const params = {
          chainId,
          sellToken: sellTokenInfo.address,
          buyToken: buyTokenInfo.address,
          sellAmount: oneUnit,
          taker: undefined,
        };

        const response = await fetch(`/api/price?${qs.stringify(params)}`);
        const data = await response.json();

        if (data?.validationErrors?.length > 0) {
          setError("Could not fetch rate");
          return;
        }

        if (data.buyAmount) {
          const formatted = formatUnits(data.buyAmount, buyTokenInfo.decimals);
          setEquivalentAmount(Number(formatted).toFixed(4));
        }
      } catch (err) {
        console.error("Failed to fetch conversion rate:", err);
        setError("Error fetching conversion rate");
      } finally {
        setLoading(false);
      }
    };

    fetchConversionRate();
  }, [sellToken, buyToken, chainId]);

  if (sellToken === buyToken) return null;

  return (
    <div className=" text-gray-400">
      <Badge className="text-gray-400 bg-transparent justify-end font-normal m-0 p-0" >
      {loading ? (
        <span className="text-sm">

          </span>
      ) : error ? (
        <span className="text-xs text-red-500">
        <div className="w-full h-full gap-3 p-3 flex flex-col ">
            <Skeleton className="h-full w-1/2"/>
          </div>
        </span>
      ) : equivalentAmount ? (
        <span className="text-gray-240 text-sm font-medium ">
          {`1 ${sellToken.toUpperCase()} = ${equivalentAmount} ${buyToken.toUpperCase()}`}
        </span>
      ) : null}
      </Badge>

    </div>
  );
};
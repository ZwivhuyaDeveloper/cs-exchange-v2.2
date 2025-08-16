import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

interface TaxInfoProps {
  buyTokenTax: {
    buyTaxBps: string;
    sellTaxBps: string;
  };
  sellTokenTax: {
    buyTaxBps: string;
    sellTaxBps: string;
  };
  buyToken: string;
  sellToken: string;
  tokenMap: Record<string, { symbol?: string }>;
}

export function TaxInfo({ buyTokenTax, sellTokenTax, buyToken, sellToken, tokenMap }: TaxInfoProps) {
  const formatTax = (taxBps: string) => (parseFloat(taxBps) / 100).toFixed(2);
  
  const hasBuyTax = buyTokenTax?.buyTaxBps !== "0";
  const hasSellTax = sellTokenTax?.sellTaxBps !== "0";
  
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  if (!hasBuyTax && !hasSellTax) {
    return (
      <div className="w-full text-right">
        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-800/50">
          <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
          <span className="text-xs font-medium text-green-700 dark:text-green-300">No token taxes detected</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {hasBuyTax && (
        <Badge 
          variant="outline"
          className="justify-end w-full items-end h-fit bg-transparent border-transparent gap-1 m-0 p-0"
        >
          <div className="flex w-full justify-end">
            <div className="text-muted-foreground text-sm font-medium">
              {(tokenMap?.[buyToken]?.symbol || buyToken)} Buy Tax: {formatTax(buyTokenTax.buyTaxBps)}%
            </div>
          </div>
        </Badge>
      )}
      {hasSellTax && (
        <Badge 
          variant="outline"
          className="justify-end w-full items-end h-fit bg-transparent border-transparent gap-1 m-0 p-0"
        >
          <div className="flex w-full justify-end">
            <div className="text-muted-foreground text-sm font-medium">
              <span className="text-sm">
                {(tokenMap?.[sellToken]?.symbol || sellToken)} Sell Tax:
              </span>
              <span className="text-sm"> {formatTax(sellTokenTax.sellTaxBps)}%</span>
            </div>
          </div>
        </Badge>
      )}
    </div>
  );
}
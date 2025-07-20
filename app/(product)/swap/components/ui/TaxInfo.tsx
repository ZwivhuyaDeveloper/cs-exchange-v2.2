import { useState } from "react";

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
}

export function TaxInfo({ buyTokenTax, sellTokenTax, buyToken, sellToken, tokenMap }: any) {
  const formatTax = (taxBps: string) => (parseFloat(taxBps) / 100).toFixed(2);

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  return (
    <div className="text-slate-400 w-26 h-6 " title="Tax Info">
      {buyTokenTax.buyTaxBps !== "0" && (
        <p>
          {(tokenMap?.[buyToken]?.symbol || buyToken) +
            ` Buy Tax: ${formatTax(buyTokenTax.buyTaxBps)}%`}
        </p>
      )}
      {sellTokenTax.sellTaxBps !== "0" && (
        <p>
          {(tokenMap?.[sellToken]?.symbol || sellToken) +
            ` Sell Tax: ${formatTax(sellTokenTax.sellTaxBps)}%`}
        </p>
      )}
    </div>
  );
}
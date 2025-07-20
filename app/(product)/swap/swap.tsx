"use client";

import PriceView from "@/app/(product)/swap/components/price";
import QuoteView from "@/app/(product)/swap/components/quote";

import { useState } from "react";
import { useAccount, useChainId } from "wagmi";

import type { PriceResponse, QuoteResponse } from "@/src/utils/types";

interface SwapProps {
  price: any;
  setPrice: (price: any) => void;
  setFinalize: (finalize: boolean) => void;
  chainId: number;
  fromToken: string;
  setFromToken: (token: string) => void;
  toToken: string;
  setToToken: (token: string) => void;
  setCurrentChartToken: (token: string) => void;

}

export default function Swap({
  fromToken,
  setFromToken,
  toToken,
  setToToken,
  setCurrentChartToken,
}: SwapProps) {
  const { address } = useAccount();

  const chainId = useChainId() || 1;
  console.log("chainId: ", chainId);

  const [finalize, setFinalize] = useState(false);
  const [price, setPrice] = useState<PriceResponse | undefined>();
  const [quote, setQuote] = useState<QuoteResponse | undefined>();

  return (
    <div
      className={`flex h-fit flex-col w-full items-center justify-between dark:bg-[#0F0F0F] bg-white rounded-none `}
    >
      {finalize && price ? (
        <QuoteView
          taker={address}
          price={price}
          quote={quote}
          setQuote={setQuote}
          chainId={chainId}
        />
      ) : (
        <PriceView
          taker={address}
          price={price}
          setPrice={setPrice}
          setFinalize={setFinalize}
          chainId={chainId}
          fromToken={fromToken}
          setFromToken={setFromToken}
          toToken={toToken}
          setToToken={setToToken}
          setCurrentChartToken={setCurrentChartToken} value={undefined}        
        />
      )}
    </div>
  );
}




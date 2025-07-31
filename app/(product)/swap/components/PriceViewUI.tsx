import { Address } from "viem";
import { Card, CardContent } from "../../../../components/ui/card";
import { Button } from "@/components/ui/button";
import { TokenPicker } from "./ui/tokenPicker";
import { TokenInputSection } from "./ui/TokenInputSection";
import { SwapButton } from "./ui/SwapButton";
import { FinalSwapValue } from "./ui/FinalSwapValue";
import { AffiliateFeeBadge } from "./ui/SwapFee";
import { TokenEquivalentValue } from "./ui/TokenEquivalentValue";
import { TaxInfo } from "./ui/TaxInfo";
import { TokenSelectorIconList } from "./ui/TokenSelectorIconList";
import { SlippageTolerance } from "./ui/SlippageTolerance";
import { useState } from "react";
import { LoaderOne } from "@/src/components/ui/loader";

export interface PriceViewUIProps {
  loading: boolean;
  apiError: string | null;
  fromToken: string;
  setFromToken: (token: string) => void;
  toToken: string;
  setToToken: (token: string) => void;
  sellAmount: string;
  setSellAmount: (amount: string) => void;
  buyAmount: string;
  setBuyAmount: (amount: string) => void;
  sellTokenDecimals: number;
  buyTokenDecimals: number;
  chainId: number;
  tokenList: any[];
  tokenMap: Record<string, any>;
  price: any;
  setPrice: (price: any) => void;
  setFinalize: (finalize: boolean) => void;
  taker: Address | undefined;
  buyTokenTax: any;
  sellTokenTax: any;
  tradeDirection: string;
  setTradeDirection: (dir: string) => void;
  inSufficientBalance: boolean;
  ApproveOrReviewButton: React.ReactNode;
  validationError?: string | null;
  isValidAmount?: boolean;
  balanceData?: { value: bigint; decimals: number; formatted: string; symbol: string } | undefined;
  slippageTolerance?: number;
  setSlippageTolerance?: (slippage: number) => void;
}

export default function PriceViewUI({
  loading,
  apiError,
  fromToken,
  setFromToken,
  toToken,
  setToToken,
  sellAmount,
  setSellAmount,
  buyAmount,
  setBuyAmount,
  sellTokenDecimals,
  buyTokenDecimals,
  chainId,
  tokenList,
  tokenMap,
  price,
  setPrice,
  setFinalize,
  taker,
  buyTokenTax,
  sellTokenTax,
  tradeDirection,
  setTradeDirection,
  inSufficientBalance,
  ApproveOrReviewButton,
  validationError,
  isValidAmount,
  balanceData,
  slippageTolerance,
  setSlippageTolerance,
}: PriceViewUIProps) {
  const [showSlippageSettings, setShowSlippageSettings] = useState(false);
  
  return (
    <div className="justify-center items-center gap-2 sm:w-fit md:w-fit w-fit h-fit max-h-fit px-1 pb-5">
      {loading && <div className="text-center text-blue-500 justify-center items-center"><LoaderOne /></div>}
      {apiError && <div className="text-center text-red-500">{apiError}</div>}
      {/* swap */}
      <div className="w-[380px] md:w-[350px] lg:w-[350px] h-fit flex flex-col bg-transparent my-0 justify-start gap-2 px-3">
        <div className="p-5 px-0 gap-3 flex flex-col pb-2">
          <div className="justify-between items-center flex flex-row">
            <div className="flex flex-row gap-2 items-center">
              <div className="dark:bg-zinc-800 bg-zinc-100 py-1 rounded-4xl text-xs px-3"><h1 className="text-md font-semibold">Spot Market</h1></div>
            </div>
            <div className="flex items-center gap-2">
              {/* Slippage Tolerance Control */}
              {slippageTolerance !== undefined && setSlippageTolerance && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs px-2 py-1 h-8 rounded-full border-[#00ffc2] text-[#00ffc2] bg-zinc-100 dark:bg-zinc-900"
                  onClick={() => setShowSlippageSettings(!showSlippageSettings)}
                >
                  {slippageTolerance}% slippage
                </Button>
              )}
            </div>
          </div>
          {/* Slippage Settings Panel */}
          {showSlippageSettings && slippageTolerance !== undefined && setSlippageTolerance && (
            <div className=" w-full pb-3">
              <SlippageTolerance
                value={slippageTolerance}
                onChange={setSlippageTolerance}
                className="w-full"
              />
            </div>
          )}
        </div>
        <div className="h-full">
          <section className="p-5 flex flex-col gap-2 rounded-2xl rounded-br-4xl dark:bg-zinc-900/80 bg-zinc-100 overflow-clip">
            <label htmlFor="sell" className="text-black text-[16px] dark:text-white font-medium items-start">
              Sell
            </label>
            <div className="flex flex-row items-center justify-between gap-5">
              <label htmlFor="sell-amount" className="sr-only"></label>
              <TokenPicker
                value={fromToken}
                onValueChange={setFromToken}
                label="From"
                chainId={chainId}
                excludedToken={toToken}
              />
              <div className="flex gap-2">
                <div className="dark:bg-zinc-900 bg-white h-10 w-10 rounded-md" />
                <div className="dark:bg-zinc-900 bg-white h-10 w-10 rounded-md" />
                <div className="dark:bg-zinc-900 bg-white h-10 w-10 rounded-md" />
                <div className="dark:bg-zinc-900 bg-white h-10 w-10 rounded-md" />
              </div>
            </div>
            <TokenInputSection
              label="sell"
              token={fromToken}
              onTokenChange={setFromToken}
              amount={sellAmount}
              chainId={chainId}
              onAmountChange={(value) => {
                setTradeDirection("sell");
                setSellAmount(value);
              }}
              tokens={tokenList}
              tokenMap={tokenMap}
              excludedToken={toToken}
              balance={balanceData?.formatted}
              validationError={tradeDirection === "sell" ? validationError : null}
              isValidAmount={tradeDirection === "sell" ? isValidAmount : true}
            />
          </section>
          <div>
            {/* Swap Button Container */}
            <div className="relative ">
              <SwapButton
                sellToken={fromToken}
                buyToken={toToken}
                sellAmount={sellAmount}
                buyAmount={buyAmount}
                chainId={chainId}
                setSellToken={setFromToken}
                setBuyToken={setToToken}
                setSellAmount={setSellAmount}
                setBuyAmount={setBuyAmount}
                tokenMap={tokenMap}
              />
            </div>
          </div>
          <div>
            <section className="p-5 flex flex-col gap-2 rounded-2xl rounded-tr-4xl dark:bg-zinc-900/80 bg-zinc-100 overflow-clip">
              <label htmlFor="buy" className="text-black text-[16px] dark:text-white font-medium items-start">
                Buy
              </label>
              <div className="flex flex-row items-center justify-between gap-5">
                <label htmlFor="buy-amount" className="sr-only"></label>
                <TokenPicker
                  value={toToken}
                  onValueChange={setToToken}
                  label="To"
                  chainId={chainId}
                  excludedToken={fromToken}
                />
                <TokenSelectorIconList
                  tokens={tokenList}
                  selectedToken={toToken}
                  onSelect={setToToken}
                  excludedToken={fromToken}
                />
              </div>
              <TokenInputSection
                label="buy"
                token={toToken}
                onTokenChange={setToToken}
                amount={buyAmount}
                chainId={chainId}
                onAmountChange={(value) => {
                  setTradeDirection("buy");
                  setBuyAmount(value);
                }}
                disabled
                tokens={tokenList}
                tokenMap={tokenMap}
                excludedToken={fromToken}
                balance={undefined}
                validationError={tradeDirection === "buy" ? validationError : null}
                isValidAmount={tradeDirection === "buy" ? isValidAmount : true}
              />
            </section>
          </div>
          <Card className="w-full h-fit bg-transparent rounded-none py-0 border-none shadow-none pt-5">
            <CardContent className="gap-2 flex flex-col">
              {/* Add FinalSwapValue here */}
              {price && (
                <div className="flex flex-col">
                  <div className="flex flex-row justify-between items-center ">
                    <p className="text-sm font-medium "><span>You receive:</span></p>
                    <div className="">
                      <FinalSwapValue
                        buyAmount={buyAmount}
                        buyTokenSymbol={toToken}
                        chainId={chainId}
                        tokenMap={tokenMap}
                        feeAmount={price?.fees?.integratorFee?.amount || '0'}
                      />
                    </div>
                  </div>
                </div>
              )}
              {/* Affiliate Fee Display */}
              <div className="flex flex-row justify-between items-center w-full">
                <div>
                  <p className="text-sm font-medium ">Gas Fee:</p>
                </div>
                <div>
                  {price?.fees && (
                    <AffiliateFeeBadge 
                      price={price} 
                      buyToken={toToken} 
                      tokenMap={tokenMap} 
                    />
                  )}
                </div>
              </div>
              {/* Token Equivalent Value Display */}
              <div className="w-full justify-between items-center  hidden h-fit  flex-row">
                <div className="text-xs font-medium ">
                  Rate:
                </div>
                <div>
                  <TokenEquivalentValue
                    sellToken={fromToken}
                    buyToken={toToken}
                    chainId={chainId}
                    tokenMap={tokenMap}
                  />
                </div>
              </div>
              {/* Tax Information Display */}
              <div>
                <TaxInfo
                  buyTokenTax={buyTokenTax}
                  sellTokenTax={sellTokenTax}
                  buyToken={toToken}
                  sellToken={fromToken}
                  tokenMap={tokenMap}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        {/* ApproveOrReviewButton or ConnectButton logic placeholder */}
        {ApproveOrReviewButton}
      </div>
    </div>
  );
} 
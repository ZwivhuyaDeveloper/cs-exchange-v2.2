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
}: PriceViewUIProps) {
  return (
    <div className="justify-center items-center gap-2 sm:w-fit md:w-fit w-fit h-fit max-h-fit px-1 pb-5">
      {loading && <div className="text-center text-blue-500">Loading price...</div>}
      {apiError && <div className="text-center text-red-500">{apiError}</div>}
      {/* swap */}
      <div className="w-[350px] h-fit flex flex-col bg-transparent my-0 justify-start gap-2 px-3">
        <div className="p-5 px-0 gap-3 flex flex-col pb-2">
          <div className="justify-between items-center flex flex-row">
            <div className="flex flex-row gap-2 items-center">
              <div className="dark:bg-zinc-800 bg-zinc-100 py-1 rounded-4xl text-xs px-3"><h1 className="text-md font-semibold">Swap</h1></div>
              <div className="dark:bg-zinc-800 py-1 bg-zinc-100 rounded-4xl text-xs px-3"><h1 className="text-md font-semibold">Limit</h1></div>
              <div className="dark:bg-zinc-800 py-1 bg-zinc-100 rounded-4xl text-xs px-3"><h1 className="text-md font-semibold">Spot</h1></div>
            </div>
            <Button variant="default" className="h-8 w-8 bg-transparent rounded-full shadow shadow-zinc-950">
              {/* Settings icon should be passed as a prop or imported here if needed */}
              <span>⚙️</span>
            </Button>
          </div>
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
                />
                <TokenSelectorIconList
                  tokens={tokenList}
                  selectedToken={toToken}
                  onSelect={setToToken}
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
                  <AffiliateFeeBadge price={price} buyToken={toToken} tokenMap={tokenMap} />
                </div>
              </div>
              {/* Token Equivalent Value Display */}
              <div className="w-full justify-between items-center h-fit flex flex-row">
                <div className="text-sm font-medium ">
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
import { useEffect, useState } from "react";
import { formatUnits } from "ethers";
import {
  useSignTypedData,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useWalletClient,
  type BaseError,
} from "wagmi";
import { Address, concat, numberToHex, size, type Hex } from "viem";
import type { PriceResponse, QuoteResponse } from "../../../../src/utils/types";
import {
  MAINNET_TOKENS_BY_ADDRESS,
  AFFILIATE_FEE,
  FEE_RECIPIENT,
} from "../../../../src/constants";
import Image from "next/image";
import qs from "qs";

export default function QuoteView({
  taker,
  price,
  quote,
  setQuote,
  chainId,
}: {
  taker: Address | undefined;
  price: PriceResponse;
  quote: QuoteResponse | undefined;
  setQuote: (price: any) => void;
  chainId: number;
}) {
  console.log("price", price);
  const [dbTokens, setDbTokens] = useState<any[]>([]);
  const [tokenMap, setTokenMap] = useState<Record<string, any>>({});
  const [tokenLoading, setTokenLoading] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);

  // Fetch tokens from the database
  useEffect(() => {
    async function fetchTokens() {
      try {
        const tokensRes = await fetch(`/api/tokens?chainId=${chainId}`);
        const tokens = await tokensRes.json();
        setDbTokens(tokens);
      } catch (err) {
        // fallback: do nothing, keep using constants
      }
    }
    fetchTokens();
  }, [chainId]);

  // Fetch token metadata for price.sellToken and price.buyToken
  useEffect(() => {
    async function fetchTokenMetadata() {
      if (!price?.sellToken && !price?.buyToken) return;
      setTokenLoading(true);
      setTokenError(null);
      try {
        const symbols = [price.sellToken, price.buyToken].filter(Boolean).join(",");
        if (!symbols) return;
        const res = await fetch(`/api/token-metadata?symbols=${symbols}&chainId=${chainId}`);
        const tokens = await res.json();
        const map: Record<string, any> = {};
        tokens.forEach((t: any) => { map[t.symbol.toLowerCase()] = t; });
        setTokenMap(map);
      } catch (err) {
        setTokenError("Failed to load token metadata");
      } finally {
        setTokenLoading(false);
      }
    }
    fetchTokenMetadata();
  }, [price?.sellToken, price?.buyToken, chainId]);

  // Helper to get token info by address from dbTokens
  const tokensByAddress = (chainId: number) => {
    if (dbTokens.length > 0) {
      const tokens = dbTokens.filter(t => t.chainId === chainId);
      const byAddress: Record<string, any> = {};
      tokens.forEach(t => { byAddress[t.address.toLowerCase()] = t; });
      return byAddress;
    }
    // fallback to constants
    return MAINNET_TOKENS_BY_ADDRESS;
  };

  // Replace MAINNET_TOKENS_BY_ADDRESS usage with tokensByAddress(chainId)
  const sellTokenInfo = tokenMap[price.sellToken.toLowerCase()];

  const buyTokenInfo = tokenMap[price.buyToken.toLowerCase()];

  const { signTypedDataAsync } = useSignTypedData();
  const { data: walletClient } = useWalletClient();

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Fetch quote data
  useEffect(() => {
    setApiError(null);
    setLoading(true);
    const params = {
      chainId: chainId,
      sellToken: price.sellToken,
      buyToken: price.buyToken,
      sellAmount: price.sellAmount,
      taker,
      swapFeeRecipient: FEE_RECIPIENT,
      swapFeeBps: AFFILIATE_FEE,
      swapFeeToken: price.buyToken,
      tradeSurplusRecipient: FEE_RECIPIENT,
    };

    async function main() {
      try {
        const response = await fetch(`/api/quote?${qs.stringify(params)}`);
        const data = await response.json();
        if (data?.validationErrors?.length > 0) {
          setApiError("Validation error: " + data.validationErrors.join(", "));
        } else if (data?.error) {
          setApiError(data.error);
        } else if (data?.message === "Invalid authentication credentials") {
          setApiError("Authentication error: Invalid API key or credentials.");
        } else {
          setApiError(null);
        }
        setQuote(data);
      } catch (err) {
        setApiError("Network or server error. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    main();
  }, [
    chainId,
    price.sellToken,
    price.buyToken,
    price.sellAmount,
    taker,
    setQuote,
  ]);

  const {
    data: hash,
    isPending,
    error,
    sendTransaction,
  } = useSendTransaction();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  if (loading) {
    return <div className="text-center text-blue-500">Loading quote...</div>;
  }
  if (apiError) {
    return <div className="text-center text-red-500">{apiError}</div>;
  }

  if (!quote) {
    return <div>Getting best quote...</div>;
  }

  console.log("quote", quote);

  // Helper function to format tax basis points to percentage
  const formatTax = (taxBps: string) => (parseFloat(taxBps) / 100).toFixed(2);

  return (
    <div className="p-3 mx-auto max-w-screen-sm ">
      <form>
        <div className="bg-slate-200 dark:bg-slate-800 p-4 rounded-sm mb-3">
          <div className="text-xl mb-2 text-white">You pay</div>
          <div className="flex items-center text-lg sm:text-3xl text-white">
            <Image
              alt={sellTokenInfo?.symbol}
              className="h-9 w-9 mr-2 rounded-md"
              src={sellTokenInfo?.logoURL || "/placeholder-token.png"}
              width={9}
              height={9}
            />
            <span>
              {formatUnits(quote.sellAmount, sellTokenInfo?.decimals)}
            </span>
            <div className="ml-2">{sellTokenInfo?.symbol}</div>
          </div>
        </div>

        <div className="bg-slate-200 dark:bg-slate-800 p-4 rounded-sm mb-3">
          <div className="text-xl mb-2 text-white">You receive</div>
          <div className="flex items-center text-lg sm:text-3xl text-white">
            <Image
              width={9}
              height={9}
              alt={
                buyTokenInfo?.symbol
              }
              className="h-9 w-9 mr-2 rounded-md"
              src={buyTokenInfo?.logoURL || "/placeholder-token.png"}
            />
            <span>
              {formatUnits(quote.buyAmount, buyTokenInfo?.decimals)}
            </span>
            <div className="ml-2">{buyTokenInfo?.symbol}</div>
          </div>
        </div>

        <div className="bg-slate-200 dark:bg-slate-800 p-4 rounded-sm mb-3">
          <div className="text-slate-400">
            {quote &&
              quote.fees &&
              quote.fees.integratorFee &&
              quote.fees.integratorFee.amount
              ? "Affiliate Fee: " +
                Number(
                  formatUnits(
                    BigInt(quote.fees.integratorFee.amount),
                    buyTokenInfo?.decimals
                  )
                ) +
                " " +
                buyTokenInfo?.symbol
              : null}
          </div>
          {/* Tax Information Display */}
          <div className="text-slate-400">
            {quote.tokenMetadata.buyToken.buyTaxBps &&
              quote.tokenMetadata.buyToken.buyTaxBps !== "0" && (
                <p>
                  {buyTokenInfo?.symbol +
                    ` Buy Tax: ${formatTax(
                      quote.tokenMetadata.buyToken.buyTaxBps
                    )}%`}
                </p>
              )}
            {quote.tokenMetadata.sellToken.sellTaxBps &&
              quote.tokenMetadata.sellToken.sellTaxBps !== "0" && (
                <p>
                  {sellTokenInfo?.symbol +
                    ` Sell Tax: ${formatTax(
                      quote.tokenMetadata.sellToken.sellTaxBps
                    )}%`}
                </p>
              )}
          </div>
        </div>
      </form>

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
        disabled={isPending}
        onClick={async () => {
          console.log("submitting quote to blockchain");
          console.log("to", quote.transaction.to);
          console.log("value", quote.transaction.value);

          // On click, (1) Sign the Permit2 EIP-712 message returned from quote
          if (quote.permit2?.eip712) {
            let signature: Hex | undefined;
            try {
              signature = await signTypedDataAsync(quote.permit2.eip712);
              console.log("Signed permit2 message from quote response");
            } catch (error) {
              console.error("Error signing permit2 coupon:", error);
            }

            // (2) Append signature length and signature data to calldata

            if (signature && quote?.transaction?.data) {
              const signatureLengthInHex = numberToHex(size(signature), {
                signed: false,
                size: 32,
              });

              const transactionData = quote.transaction.data as Hex;
              const sigLengthHex = signatureLengthInHex as Hex;
              const sig = signature as Hex;

              quote.transaction.data = concat([
                transactionData,
                sigLengthHex,
                sig,
              ]);
            } else {
              throw new Error("Failed to obtain signature or transaction data");
            }
          }

          // (3) Submit the transaction with Permit2 signature

          sendTransaction &&
            sendTransaction({
              account: walletClient?.account.address,
              gas: !!quote?.transaction.gas
                ? BigInt(quote?.transaction.gas)
                : undefined,
              to: quote?.transaction.to,
              data: quote.transaction.data, // submit
              value: quote?.transaction.value
                ? BigInt(quote.transaction.value)
                : undefined, // value is used for native tokens
              chainId: chainId,
            });
        }}
      >
        {isPending ? "Confirming..." : "Place Order"}
      </button>
      <br></br>
      <br></br>
      <br></br>
      {isConfirming && (
        <div className="text-center">Waiting for confirmation ⏳ ...</div>
      )}
      {isConfirmed && (
        <div className="text-center">
          Transaction Confirmed! 🎉{" "}
          <a href={`https://etherscan.io/tx/${hash}`}>Check Etherscan</a>
        </div>
      )}
      {error && (
        <div>Error: {(error as BaseError).shortMessage || error.message}</div>
      )}
    </div>
  );
}
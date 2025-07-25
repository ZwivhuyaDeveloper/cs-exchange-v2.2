import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState, useCallback, useRef } from "react";
import { formatUnits, parseUnits } from "ethers";
import {
  useReadContract,
  useBalance,
  useSimulateContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { erc20Abi, Address } from "viem";
import {
  MAINNET_TOKENS_BY_SYMBOL,
  AFFILIATE_FEE,
  FEE_RECIPIENT,
} from "@/src/constants";
import Image from "next/image";
import qs from "qs";
import PriceViewUI from "./PriceViewUI";

interface PriceViewProps {
  taker: Address | undefined;
  price: any;
  setPrice: (price: any) => void;
  setFinalize: (finalize: boolean) => void;
  chainId: number;
  fromToken: string;
  setFromToken: (token: string) => void;
  toToken: string;
  setToToken: (token: string) => void;
  setCurrentChartToken: (token: string) => void;
  value: any;
}

export const DEFAULT_BUY_TOKEN = (chainId: number) => {
  if (chainId === 1) {
    return "weth";
  }
};

export default function PriceView({
  taker,
  price,
  setPrice,
  setFinalize,
  chainId,
  fromToken,
  setFromToken,
  toToken,
  setToToken,
  setCurrentChartToken,
}: PriceViewProps) {

  const [sellAmount, setSellAmount] = useState("");
  const [buyAmount, setBuyAmount] = useState("");
  const [tradeDirection, setTradeDirection] = useState("sell");
  const [error, setError] = useState([]);
  const [buyTokenTax, setBuyTokenTax] = useState({buyTaxBps: "0", sellTaxBps: "0",});
  const [sellTokenTax, setSellTokenTax] = useState({buyTaxBps: "0", sellTaxBps: "0",});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [dbTokens, setDbTokens] = useState<any[]>([]);
  const [dbChains, setDbChains] = useState<any[]>([]);
  const [tokenMap, setTokenMap] = useState<Record<string, any>>({});
  const [tokenLoading, setTokenLoading] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);


  const sanitizeDecimalPlaces = (value: string, decimals: number): string => {
    const [integerPart, decimalPart] = value.split('.');
    if (!decimalPart) return value;
    return `${integerPart}.${decimalPart.slice(0, decimals)}`;
  }

  // Fetch tokens and chains from the database
  useEffect(() => {
    async function fetchTokensAndChains() {
      try {
        const [tokensRes, chainsRes] = await Promise.all([
          fetch(`/api/tokens?chainId=${chainId}`),
          fetch(`/api/chains`),
        ]);
        const tokens = await tokensRes.json();
        const chains = await chainsRes.json();
        setDbTokens(tokens);
        setDbChains(chains);
      } catch (err) {
        // fallback: do nothing, keep using constants
      }
    }
    fetchTokensAndChains();
  }, [chainId]);

  // Fetch token metadata for fromToken and toToken
  useEffect(() => {
    async function fetchTokenMetadata() {
      if (!fromToken && !toToken) return;
      setTokenLoading(true);
      setTokenError(null);
      try {
        const symbols = [fromToken, toToken].filter(Boolean).join(",");
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
  }, [fromToken, toToken, chainId]);

  // Helper to get tokens by symbol from dbTokens
  const tokensByChain = (chainId: number) => {
    if (dbTokens.length > 0) {
      const tokens = dbTokens.filter(t => t.chainId === chainId);
      const bySymbol: Record<string, any> = {};
      tokens.forEach(t => { bySymbol[t.symbol.toLowerCase()] = t; });
      return bySymbol;
    }
    // fallback to constants
    if (chainId === 1) {
      return MAINNET_TOKENS_BY_SYMBOL;
    }
    return MAINNET_TOKENS_BY_SYMBOL;
  };

  // Construct token list and map for the picker/input
  const tokenList = dbTokens.filter(t => t.chainId === chainId);
  const tokenMapForPicker = tokensByChain(chainId);

  const sellTokenObject = tokenMap[fromToken];
  const buyTokenObject = tokenMap[toToken];

  const sellTokenDecimals = sellTokenObject?.decimals || 18;
  const buyTokenDecimals = buyTokenObject?.decimals || 18;
  const sellTokenAddress = sellTokenObject?.address;

  const parsedSellAmount =
    sellAmount && tradeDirection === "sell" && sellTokenDecimals
      ? parseUnits(sellAmount, sellTokenDecimals).toString()
      : undefined;

  const parsedBuyAmount =
    buyAmount && tradeDirection === "buy" && buyTokenDecimals
      ? parseUnits(buyAmount, buyTokenDecimals).toString()
      : undefined;

  // Fetch price data and set the buyAmount whenever the sellAmount changes
  useEffect(() => {
    if (!sellTokenObject || !buyTokenObject) return;
    setApiError(null);
    setLoading(true);
    const params = {
      chainId: chainId,
      sellToken: sellTokenObject.address,
      buyToken: buyTokenObject.address,
      sellAmount: parsedSellAmount,
      buyAmount: parsedBuyAmount,
      taker,
      swapFeeRecipient: FEE_RECIPIENT,
      swapFeeBps: AFFILIATE_FEE,
      swapFeeToken: buyTokenObject.address,
      tradeSurplusRecipient: FEE_RECIPIENT,
    };
    async function main() {
      if (sellAmount === "") {
        setBuyAmount("");
        setPrice(null);
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`/api/price?${qs.stringify(params)}`);
        const data = await response.json();
        if (data?.validationErrors?.length > 0) {
          setError(data.validationErrors);
          setApiError("Validation error: " + data.validationErrors.join(", "));
        } else if (data?.error) {
          setApiError(data.error);
        } else if (data?.message === "Invalid authentication credentials") {
          setApiError("Authentication error: Invalid API key or credentials.");
        } else {
          setError([]);
          setApiError(null);
        }
        if (data.buyAmount) {
          const formattedBuyAmount = formatUnits(data.buyAmount, buyTokenDecimals);
          setBuyAmount(formattedBuyAmount);
          setPrice(data);
        }
        if (data?.tokenMetadata) {
          setBuyTokenTax(data.tokenMetadata.buyToken);
          setSellTokenTax(data.tokenMetadata.sellToken);
        }
      } catch (err) {
        setApiError("Network or server error. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    main();
  }, [
    sellTokenObject?.address,
    buyTokenObject?.address,
    parsedSellAmount,
    parsedBuyAmount,
    chainId,
    tradeDirection,
    sellAmount,
    setPrice,
    taker,
    buyTokenDecimals
  ]);

  // Hook for fetching balance information
  const { data: balanceData } = useBalance({
    address: taker,
    token: sellTokenObject?.address,
  });

  const inSufficientBalance =
    balanceData && sellAmount && sellTokenDecimals
      ? parseUnits(sellAmount, sellTokenDecimals) > balanceData.value
      : true;

  const MAX_ALLOWANCE = BigInt(2 ** 256 - 1);

  // ApproveOrReviewButton logic as a node
  const ApproveOrReviewButtonNode = taker && sellTokenObject?.address ? (
    <ApproveOrReviewButton
      sellTokenAddress={sellTokenObject.address}
      taker={taker}
      onClick={() => {
        setFinalize(true);
      }}
      disabled={inSufficientBalance || !sellAmount}
      price={price}
    />
  ) : (
    // ConnectButton logic as before
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;
        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <div className="w-full px-3 justify-start">
                    <button
                      className="w-full bg-blue-600 text-white rounded-3xl font-medium p-2 hover:bg-blue-700 justify-center items-center flex"
                      onClick={openConnectModal}
                      type="button"
                    >
                      Connect Wallet
                    </button>
                  </div>
                );
              }
              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button">
                    Wrong network
                  </button>
                );
              }
              return (
                <div style={{ display: "flex", gap: 12 }} className="w-full px-3 justify-start">
                  <button
                    onClick={openChainModal}
                    style={{ display: "flex", alignItems: "center" }}
                    type="button"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          overflow: "hidden",
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <Image
                            src={chain.iconUrl}
                            alt={chain.name ?? "Chain icon"}
                            width={12}
                            height={12}
                            layout="fixed"
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </button>
                  <button onClick={openAccountModal} type="button">
                    {account.displayName}
                    {account.displayBalance ? ` (${account.displayBalance})` : ""}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );

  return (
    <PriceViewUI
      loading={loading}
      apiError={apiError}
      fromToken={fromToken}
      setFromToken={setFromToken}
      toToken={toToken}
      setToToken={setToToken}
      sellAmount={sellAmount}
      setSellAmount={setSellAmount}
      buyAmount={buyAmount}
      setBuyAmount={setBuyAmount}
      sellTokenDecimals={sellTokenDecimals}
      buyTokenDecimals={buyTokenDecimals}
      chainId={chainId}
      tokenList={tokenList}
      tokenMap={tokenMap}
      price={price}
      setPrice={setPrice}
      setFinalize={setFinalize}
      taker={taker}
      buyTokenTax={buyTokenTax}
      sellTokenTax={sellTokenTax}
      tradeDirection={tradeDirection}
      setTradeDirection={setTradeDirection}
      inSufficientBalance={inSufficientBalance}
      ApproveOrReviewButton={ApproveOrReviewButtonNode}
    />
  );

  function ApproveOrReviewButton({
    taker,
    onClick,
    sellTokenAddress,
    disabled,
    price,
  }: {
    taker: Address;
    onClick: () => void;
    sellTokenAddress: Address;
    disabled?: boolean;
    price: any;
  }) {
    // If price.issues.allowance is null, show the Review Trade button
    if (price?.issues.allowance === null) {
      return (
        <div className="w-full px-3 justify-start">
          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              // fetch data, when finished, show quote view
              onClick();
            }}
            className="w-full bg-blue-500 text-white p-2 hover:bg-blue-700 disabled:opacity-25 rounded-3xl"
          >
            {disabled ? "Insufficient Balance" : "Review Trade"}
          </button>
        </div>
      );
    }

    // Determine the spender from price.issues.allowance
    const spender = price?.issues.allowance.spender;

    // 1. Read from erc20, check approval for the determined spender to spend sellToken
    const { data: allowance, refetch } = useReadContract({
      address: sellTokenAddress,
      abi: erc20Abi,
      functionName: "allowance",
      args: [taker, spender],
    });
    console.log("checked spender approval");

    // 2. (only if no allowance): write to erc20, approve token allowance for the determined spender
    const { data } = useSimulateContract({
      address: sellTokenAddress,
      abi: erc20Abi,
      functionName: "approve",
      args: [spender, MAX_ALLOWANCE],
    });

    // Define useWriteContract for the 'approve' operation
    const {
      data: writeContractResult,
      writeContractAsync: writeContract,
      error,
    } = useWriteContract();

    // useWaitForTransactionReceipt to wait for the approval transaction to complete
    const { data: approvalReceiptData, isLoading: isApproving } =
      useWaitForTransactionReceipt({
        hash: writeContractResult,
      });

    // Call `refetch` when the transaction succeeds
    useEffect(() => {
      if (data) {
        refetch();
      }
    }, [data, refetch]);

    if (error) {
      return <div>Something went wrong: {error.message}</div>;
    }

    if (allowance === BigInt(0)) {
      return (
        <>
        <div className="w-full px-3 justify-start">
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-3xl w-full"
            onClick={async () => {
              await writeContract({
                abi: erc20Abi,
                address: sellTokenAddress,
                functionName: "approve",
                args: [spender, MAX_ALLOWANCE],
              });
              console.log("approving spender to spend sell token");

              refetch();
            }}
          >
            {isApproving ? "Approving…" : "Approve"}
          </button>
        </div>
        </>
      );
    }

    return (
      <div className="w-full px-3 justify-start">
              <button
        type="button"
        disabled={disabled}
        onClick={() => {
          // fetch data, when finished, show quote view
          onClick();
        }}
        className="w-full bg-blue-500 text-white p-2 rounded-3xl hover:bg-blue-700 disabled:opacity-25"
      >
        {disabled ? "Insufficient Balance" : "Review Trade"}
      </button>
      </div>
    );
  }
}
"use client"

import { useState, useEffect } from "react";
import { 
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Separator } from "@radix-ui/react-separator";
import LiveChart from "./live-chart";
import { useTheme } from "@/context/ThemeContext";
import ChartStats from "./chart-stats";


interface TradingChartProps {
  buyTokenSymbol?: string;
  sellTokenSymbol?: string;
  setCurrentChartToken: (token: string) => void;
}

interface TokenMarketData {
  currentPrice: number;
  priceChange24h: number;
}

export function TradingChart({ 
  buyTokenSymbol,
  sellTokenSymbol,
  setCurrentChartToken
}: TradingChartProps) {
  const [showBuyChart, setShowBuyChart] = useState(true);
  const [marketData, setMarketData] = useState<TokenMarketData | null>(null);
  const [loadingMarketData, setLoadingMarketData] = useState(true);
  const [tokens, setTokens] = useState<any[]>([]);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  // Fetch tokens from the API
  useEffect(() => {
    fetch(`/api/tokens?chainId=1`)
      .then(res => res.json())
      .then(setTokens)
      .catch(() => setTokenError("Failed to load tokens"));
  }, []);

  // Helper to get token info by symbol
  const getTokenInfo = (symbol?: string) => {
    if (!symbol) return undefined;
    return tokens.find(t => t.symbol.toLowerCase() === symbol.toLowerCase());
  };

  // Determine which token to display in the chart
  const currentTokenSymbol = showBuyChart ? buyTokenSymbol : sellTokenSymbol;
  const tokenInfo = getTokenInfo(currentTokenSymbol);
  const tradingViewSymbol = tokenInfo?.tradingViewSymbol;

  // Update parent component with current chart token
  useEffect(() => {
    if (currentTokenSymbol) {
      setCurrentChartToken(currentTokenSymbol);
    }
  }, [currentTokenSymbol, setCurrentChartToken]);

  // Fetch market data when token changes
  useEffect(() => {
    const fetchMarketData = async () => {
      if (!tokenInfo || !currentTokenSymbol) return;
      setLoadingMarketData(true);
      try {
        if (!tokenInfo.coingeckoId) throw new Error("CoinGecko ID not found");
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${tokenInfo.coingeckoId}&vs_currencies=usd&include_24hr_change=true`
        );
        if (!response.ok) throw new Error('Failed to fetch market data');
        const data = await response.json();
        const tokenData = data[tokenInfo.coingeckoId];
        if (tokenData) {
          setMarketData({
            currentPrice: tokenData.usd,
            priceChange24h: tokenData.usd_24h_change
          });
        }
      } catch (error) {
        setMarketData(null);
      } finally {
        setLoadingMarketData(false);
      }
    };
    fetchMarketData();
  }, [currentTokenSymbol, tokenInfo]);

  // Get the other token for the toggle button
  const otherTokenSymbol = showBuyChart ? sellTokenSymbol : buyTokenSymbol;
  const otherTokenInfo = getTokenInfo(otherTokenSymbol);

  // Loading state when token info is not available
  if (!tokenInfo || !currentTokenSymbol) {
    return (
      <Card className="w-full flex flex-col justify-start border-transparent bg-transparent rounded-none mt-0 h-full">
        <CardHeader className="flex flex-row items-center justify-between h-[18px]">
          <div className="flex items-center gap-4 flex-row justify-start">
            <div className="h-8 w-8 rounded-full dark:bg-zinc-700 bg-zinc-100 animate-pulse" />
            <div className="flex flex-col justify-between h-full">
              <div className="flex flex-row items-center gap-3 w-full justify-between">
                <div className="h-4 w-32 bg-zinc-700 rounded animate-pulse" />
              </div>
            </div>
          </div>
          <div className="h-8 w-24 bg-zinc-700 rounded animate-pulse" />
        </CardHeader>
        <Separator className="w-full h-px bg-zinc-700" />
        <CardContent className="h-[410px] sm:h-[410px] w-full bg-transparent p-0">
          <div className="w-full h-full bg-zinc-800 animate-pulse flex items-center justify-center">
            <div className="text-zinc-500">Loading chart...</div>
          </div>
        </CardContent>
        <Separator className="w-full h-px bg-zinc-700" />
      </Card>
    );
  }

  return (
    <Card className="w-full flex flex-col justify-center gap-1 border-none bg-transparent rounded-2xl p-0 h-fit">
      <CardHeader className="flex flex-row items-center justify-between h-fit py-4 dark:bg-[#0F0F0F] bg-white rounded-none border border-px dark:border-zinc-700 border-zinc-200">
        <div className="flex items-center gap-2 flex-row justify-start">
          <Image 
            src={tokenInfo.logoURL || ""}
            alt={tokenInfo.name}
            className="h-8 w-8 rounded-full dark:bg-zinc-800 bg-white"
            width={40}
            height={40}
          />
          <div className="flex flex-col justify-between h-full gap-1">
            <div className="flex flex-row items-center gap-3 w-full justify-between">
              <div className="text-zinc-700 dark:text-zinc-100 font-semibold text-sm h-full">
                {tokenInfo.name} <span className="text-[#00FFC2] font-bold">({tokenInfo.symbol})</span>
              </div>
            </div>
            {/* Price & percentage change */}
            {loadingMarketData ? (
              <div className="flex flex-row gap-2">
                <div className="h-4 w-16 bg-zinc-700 rounded animate-pulse" />
                <div className="h-4 w-10 bg-zinc-700 rounded animate-pulse" />
              </div>
            ) : marketData ? (
              <div className="flex flex-row items-center gap-2">
                <p className="text-md font-semibold ">
                  ${marketData.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                </p>
                <p className={`text-xs font-medium w-fit rounded-2xl px-2 py-1 ${
                  marketData.priceChange24h >= 0 
                    ? 'text-green-500 bg-green-500/10' 
                    : 'text-red-500 bg-red-500/10'
                }`}>
                  {marketData.priceChange24h >= 0 ? '+' : ''}
                  {marketData.priceChange24h.toFixed(2)}%
                </p>
              </div>
            ) : (
              <div className="text-xs text-zinc-500">Price data unavailable</div>
            )}
          </div>
        </div>
        <div className="flex flex-row items-center gap-2 justify-center w-3xl h-fit">
          <ChartStats tokenSymbol={currentTokenSymbol} />
        </div>
        {otherTokenSymbol && (
          <button 
            onClick={() => setShowBuyChart(!showBuyChart)}
            className="text-sm w-fit px-3 py-2 rounded-md flex items-center gap-2 shadow-md shadow-black/10 justify-center dark:bg-zinc-800 bg-zinc-100 hover:bg-zinc-700 transition-colors"
            disabled={!buyTokenSymbol || !sellTokenSymbol}
          >
            <div className="flex flex-row gap-2 items-center w-full justify-between">
              <span className="dark:text-zinc-100 text-black font-medium uppercase  text-xs">
                {otherTokenSymbol}
              </span>
              {otherTokenInfo && (
                <Image 
                  src={otherTokenInfo.logoURL || ""}
                  alt={otherTokenInfo.name}
                  className="h-5 w-5 rounded-full"
                  width={20}
                  height={20}
                />
              )}
            </div>
          </button>
        )}
      </CardHeader>
      <CardContent className="h-[650px] sm:h-[650px] w-full p-0 flex dark:bg-[#0F0F0F] bg-white">
        <LiveChart 
          tokenSymbol={currentTokenSymbol} 
          tradingViewSymbol={tradingViewSymbol}
          theme={resolvedTheme}
        />
      </CardContent>
    </Card>
  )
}
"use client"

import { useState, useEffect } from "react";
import { 
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTrigger } from "@/components/ui/drawer";
import Image from "next/image";
import { Separator } from "@radix-ui/react-separator";
import LiveChart from "./live-chart";
import { useTheme } from "@/context/ThemeContext";
import ChartStats from "./chart-stats";
import { CandlestickChart, X } from "lucide-react";
import LiveChart2 from "./live-chart2";
import { useTokenMetadata } from "../../services/dashboardService";

interface TradingChartProps {
  buyTokenSymbol?: string;
  sellTokenSymbol?: string;
  setCurrentChartToken: (token: string) => void;
}

export function TradingChart({ 
  buyTokenSymbol,
  sellTokenSymbol,
  setCurrentChartToken
}: TradingChartProps) {
  const [showBuyChart, setShowBuyChart] = useState(true);
  const [showLiveChart, setShowLiveChart] = useState(false);
  const [tokens, setTokens] = useState<any[]>([]);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  // Fetch tokens from the API
  useEffect(() => {
    fetch(`/api/tokens?chainId=1&limit=10000`)
      .then(res => res.json())
      .then(data => {
        // Extract tokens array from the response object
        if (data && Array.isArray(data.tokens)) {
          setTokens(data.tokens);
        } else {
          setTokenError("Invalid tokens data format");
        }
      })
      .catch(() => setTokenError("Failed to load tokens"));
  }, []);

  // Helper to get token info by symbol
  const getTradingViewSymbol = (symbol: string) => {
    const token = tokens.find(t => t.symbol.toLowerCase() === symbol.toLowerCase());
    return token?.symbol ? `${token.symbol}USDT` : `${symbol}USDT`;
  };

  // Helper to get token info by symbol
  const getTokenInfo = (symbol?: string) => {
    if (!symbol) return undefined;
    const token = tokens.find(t => t.symbol.toLowerCase() === symbol.toLowerCase());
    // If token not found, log available tokens for debugging
    if (!token && tokens.length > 0) {
      console.warn(`Token '${symbol}' not found. Available tokens:`, tokens.map(t => t.symbol).slice(0, 10));
    }
    return token;
  };

  // Determine which token to display in the chart
  const currentTokenSymbol = showBuyChart ? buyTokenSymbol : sellTokenSymbol;
  const { token: tokenInfo, isLoading: isTokenLoading } = useTokenMetadata(currentTokenSymbol || '', 1);
  // Generate TradingView symbol by appending USDT to the token symbol
  const tradingViewSymbol = tokenInfo?.symbol ? `${tokenInfo.symbol}USDT` : '';

  // Update parent component with current chart token
  useEffect(() => {
    if (currentTokenSymbol) {
      setCurrentChartToken(currentTokenSymbol);
    }
  }, [currentTokenSymbol, setCurrentChartToken]);

  // Get the other token for the toggle button
  const otherTokenSymbol = showBuyChart ? sellTokenSymbol : buyTokenSymbol;
  const { token: otherTokenInfo } = useTokenMetadata(otherTokenSymbol || '', 1);

  // Loading state when token info is not available
  if (isTokenLoading || !tokenInfo || !currentTokenSymbol) {
    return (
      <Card className="w-full hidden sm:flex sm:flex-col justify-start border-transparent bg-transparent rounded-none mt-0 h-full">
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
      <CardHeader className="flex-row hidden sm:flex items-center justify-between h-22 py-4 dark:bg-[#0F0F0F] bg-white rounded-none border border-px dark:border-zinc-700 border-zinc-200">
        <div className="flex items-center gap-2 flex-row justify-start">
          <Image 
            src={tokenInfo.logoURL || "/placeholder-token.png"}
            alt={tokenInfo.name}
            className="h-8 w-8 rounded-full dark:bg-zinc-800 bg-white"
            width={40}
            height={40}
            onError={(e) => {
              // Fallback to a placeholder if the image fails to load
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-token.png';
            }}
          />
          <div className="flex flex-col justify-between h-full gap-1">
            <div className="flex flex-row items-center gap-3 w-full justify-between">
              <div className="text-zinc-700 dark:text-zinc-100 flex-row w-full font-semibold text-xs md:text-sm lg:text-sm h-full">
                {tokenInfo.name} <span className="dark:text-[#00FFC2] text-[#0E76FD] font-bold">({tokenInfo.symbol})</span>
              </div>
            </div>
            {/* Price & percentage change - Handled by ChartStats component */}
            <div className="h-6"></div>
          </div>
        </div>
        <div className="flex flex-row items-center gap-2 justify-center w-3xl h-fit">
          <ChartStats tokenSymbol={currentTokenSymbol} />
        </div>
        {otherTokenSymbol && (
          <Button
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
                  src={otherTokenInfo.logoURL || "/placeholder-token.png"}
                  alt={otherTokenInfo.name}
                  className="h-5 w-5 rounded-full"
                  width={20}
                  height={20}
                />
              )}
            </div>
          </Button>
        )}
      </CardHeader>
      {/* Mobile Drawer */}
      <div className="block h-full sm:hidden">
        <Drawer>
          <DrawerHeader className="flex flex-row items-center justify-between h-18 py-4 dark:bg-[#0F0F0F] bg-white rounded-none border border-px dark:border-zinc-700 border-zinc-200">
            <div className="flex items-center w-full gap-2 flex-row justify-start">
              <Image 
                src={tokenInfo.logoURL || ""}
                alt={tokenInfo.name}
                className="h-8 w-8  rounded-full dark:bg-zinc-800 bg-white"
                width={40}
                height={40}
              />
              <div className="flex flex-col w-full justify-between h-full gap-1">
                <div className="flex flex-row items-center gap-3 w-full justify-between">
                  <div className="text-zinc-700 dark:text-zinc-100 flex flex-row w-full gap-2 font-semibold text-xs md:text-sm lg:text-sm h-full">
                    <span className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-base ">{tokenInfo.name}</span> 
                    <span className="dark:text-[#00FFC2] text-[#0E76FD] font-bold text-sm">({tokenInfo.symbol})</span>
                  </div>
                </div>
                {/* Price & percentage change - Handled by ChartStats component */}
                <div className="h-6"></div>
              </div>
            </div>
            <div className="flex flex-row items-center gap-2 justify-center w-3xl h-fit">
              <ChartStats tokenSymbol={currentTokenSymbol} />
            </div>
            {otherTokenSymbol && (
              <Button
                onClick={() => setShowBuyChart(!showBuyChart)}
                className="text-sm w-fit px-3 py-2 rounded-md hidden lg:block md:block items-center gap-2 shadow-md shadow-black/10 justify-center dark:bg-zinc-800 bg-zinc-100 hover:bg-zinc-700 transition-colors"
                disabled={!buyTokenSymbol || !sellTokenSymbol}
              >
                <div className="flex flex-row gap-2 items-center w-full justify-between">
                  <span className="dark:text-zinc-100 text-black font-medium uppercase  text-xs">
                    {otherTokenSymbol}
                  </span>
                  {otherTokenInfo && (
                    <Image 
                      src={otherTokenInfo.logoURL || "/placeholder-token.png"}
                      alt={otherTokenInfo.name}
                      className="h-5 w-5 rounded-full"
                      width={20}
                      height={20}
                    />
                  )}
                </div>
              </Button>
            )}
            <DrawerTrigger asChild>
              <div 
                className="sm:hidden w-fit px-3 h-10 rounded-full bg-[#0E76FD] dark:bg-zinc-800 text-white shadow-lg flex items-center justify-center gap-1 cursor-pointer hover:opacity-90 transition-opacity"
              >
                <p className="text-xs dark:text-zinc-100 text-white">Chart</p>
                <CandlestickChart className="dark:text-[#00FFC2] text-white h-4 w-4" />
              </div>
            </DrawerTrigger>
          </DrawerHeader>
          <DrawerContent className="h-[900px] flex">
            <div className="w-full flex justify-between px-2 py-1 mt-2">
            {otherTokenSymbol && (
              <Button
                onClick={() => setShowBuyChart(!showBuyChart)}
                className="text-sm w-fit px-3 py-2 rounded-md lg:block md:block items-center gap-2 shadow-md shadow-black/10 justify-center dark:bg-zinc-800 bg-zinc-100 hover:bg-zinc-700 transition-colors"
                disabled={!buyTokenSymbol || !sellTokenSymbol}
              >
                <span className="text-xs dark:text-[#00FFC2] text-[#0E76FD]">Switch Token</span>
                <div className="flex flex-row gap-2 items-center w-full justify-between">
                  <span className="dark:text-zinc-100 text-black font-medium uppercase  text-xs">
                    {otherTokenSymbol}
                  </span>
                  {otherTokenInfo && (
                    <Image 
                      src={otherTokenInfo.logoURL || "/placeholder-token.png"}
                      alt={otherTokenInfo.name}
                      className="h-5 w-5 rounded-full"
                      width={20}
                      height={20}
                    />
                  )}
                </div>
              </Button>
            )}
            <div>
              <DrawerClose>
                <Button variant="default" size="sm" className="text-xs dark:bg-[#00FFC2] bg-[#0E76FD]" onClick={() => setShowBuyChart(false)}> Close <X className="h-3 w-3" /></Button>
              </DrawerClose>
            </div>
          </div>
            <div className="h-[700px] p-2">
              <LiveChart 
                tokenSymbol={currentTokenSymbol} 
                tradingViewSymbol={tradingViewSymbol}
                theme={resolvedTheme}
              />
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Desktop Chart */}
      <CardContent className="h-[700px] hidden sm:h-[700px] w-full p-0 lg:flex md:flex dark:bg-[#0F0F0F] bg-white">
        <LiveChart2 
          tokenSymbol={currentTokenSymbol} 
          tradingViewSymbol={tradingViewSymbol}
          theme={resolvedTheme}
        />
      </CardContent>
    </Card>
  )
}
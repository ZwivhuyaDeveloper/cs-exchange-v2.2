"use client"

import { useState } from "react"
import { NavMenu } from "@/app/(product)/components/layout/NavMenu"
import MarketStats from "@/app/(product)/Dashboard/components/ui/MarketStats"
import TechnicalSpecs from "@/app/(product)/Dashboard/components/ui/TechnicalSpecs"
import { TradingChart } from "@/app/(product)/Dashboard/components/chart/trading-chart"
import Swap from "../swap/swap"
import TickerTape from "@/app/(product)/Dashboard/components/ui/TickerTape"
import OrderData from "@/app/(product)/Dashboard/components/ui/OrderData"
import * as ScrollArea from '@radix-ui/react-scroll-area';
import BottomPanel from "@/app/(product)/components/layout/BottomPanel"
import NewList from "@/app/(product)/Dashboard/components/tokenList/new-list"
import LoadingIntro from "@/src/components/ui/loading-intro"
import { ChartRadarMultiple } from "@/app/(product)/Dashboard/components/ui/Chart-radar"
import LiquidityDistributionChart from "@/app/(product)/Dashboard/components/ui/LiquidityDistributionChart"
import RelatedResearch from "../Research/components/related-research"


export default function Page() {
  const [fromToken, setFromToken] = useState("link");
  const [toToken, setToToken] = useState("comp");
  const [currentChartToken, setCurrentChartToken] = useState(fromToken);
  const [showIntro, setShowIntro] = useState(true);

  if (showIntro) {
    return <LoadingIntro onComplete={() => setShowIntro(false)} />;
  }
  const chainId = 1;
  return (
    <div className="w-full  h-full dark:bg-black bg-zinc-200 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 flex h-fit bg-white items-center border-none rounded-b-3xl backdrop-filter backdrop-blur-2xl dark:bg-zinc-900/90 ">
        <NavMenu />
      </header>

      {/* Ticker */}
      <div className="w-full h-fit flex justify-center items-center py-1 px-1 md:py-1 ">
        <div className="border border-px dark:border-zinc-700 border-zinc-200 w-full">
          <TickerTape />
        </div>
      </div>

      {/* Main 3-column layout */}
      <main className="flex-1 flex flex-col items-center w-full h-full px-1 md:px-1">
        <div className="flex flex-col lg:flex-row gap-y-2 lg:gap-y-0 lg:gap-x-1 w-full h-full lg:h-[calc(156vh-100px)]">{/* 200px header+footer approx */}
          {/* Indicators (Left) */}
          <div className="lg:w-[390px] hidden w-full md:flex lg:flex-col gap-2 h-full">
            <ScrollArea.Root className="h-full w-full rounded-none border-none overflow-clip gap-y-2" type="auto">
              <ScrollArea.Viewport className="w-full overflow-clip h-full flex flex-col gap-y-2">
                <div className="border border-px dark:border-zinc-700 border-zinc-2000">
                  <MarketStats tokenSymbol={currentChartToken} />
                </div>
                <div className="mt-1 border border-px dark:border-zinc-700 border-zinc-200">
                  <OrderData tokenSymbol={currentChartToken} />
                </div>
                <div className="mt-1 border border-px dark:border-zinc-700 border-zinc-200">
                  <LiquidityDistributionChart tokenSymbol={currentChartToken} />
                </div>
                <div className="mt-1 border border-px dark:border-zinc-700 border-zinc-200">
                  <ChartRadarMultiple tokenSymbol={currentChartToken} />
                </div>
                <div className="mt-1 border border-px dark:border-zinc-700 border-zinc-200">
                  <TechnicalSpecs tokenSymbol={currentChartToken} />
                </div>
              </ScrollArea.Viewport>
              <ScrollArea.Scrollbar className="flex w-0 bg-transparent touch-none select-none transition-colors duration-150 ease-out hover:bg-transparent" orientation="vertical">
                <ScrollArea.Thumb className="flex-1 rounded-full bg-zinc-600" />
              </ScrollArea.Scrollbar>
              <ScrollArea.Corner />
            </ScrollArea.Root>
          </div>

          {/* Chart (Middle) */}
          <div className="flex flex-col lg:flex-row md:flex-row gap-1 w-full">


              <div className="flex-1 flex flex-col gap-1 w-full h-full">
                <TradingChart
                  buyTokenSymbol={toToken}
                  sellTokenSymbol={fromToken}
                  setCurrentChartToken={setCurrentChartToken}
                />
                <div className=" lg:flex hidden mb-5 md:flex gap-1 w-full h-fit items-stretch ">
                  <NewList value={toToken} onValueChange={setToToken} label="To Token" />
                </div>
              </div>

              {/* Swap (Right) */}
              <div className="lg:w-fit w-full flex flex-col lg:flex-col  gap-1 h-full">
                <div className="border border-px dark:border-zinc-700 border-zinc-200">
                  <Swap
                    fromToken={fromToken}
                    setFromToken={setFromToken}
                    toToken={toToken}
                    setToToken={setToToken}
                    setCurrentChartToken={setCurrentChartToken}
                    price={undefined}
                    setPrice={function (price: any): void {
                      throw new Error("Function not implemented.")
                    }}
                    setFinalize={function (finalize: boolean): void {
                      throw new Error("Function not implemented.")
                    }}
                    chainId={chainId}
                  />
                </div>
                <div>

                </div>
              </div>
            </div>
          </div>
      </main>

            {/* Footer */}
      <footer
        className="z-50 flex h-fit items-center backdrop-filter backdrop-blur-2xl dark:bg-zinc-900/90 bg-zinc-200/80 px-2 md:px-6 py-2 md:py-4
        sticky bottom-0 w-full
        lg:fixed lg:left-0 lg:bottom-0 lg:w-full"
        style={{ boxShadow: '0 -2px 16px 0 rgba(0,0,0,0.08)' }}
      >
        <BottomPanel />
      </footer>
    </div>
  )
}
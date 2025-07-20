"use client"

import { useState } from "react"
import { NavMenu } from "@/app/(product)/Dashboard/components/layout/NavMenu"
import MarketStats from "@/app/(product)/Dashboard/components/ui/MarketStats"
import TechnicalSpecs from "@/app/(product)/Dashboard/components/ui/TechnicalSpecs"
import { TradingChart } from "@/app/(product)/Dashboard/components/chart/trading-chart"
import Swap from "../swap/swap"
import TickerTape from "@/app/(product)/Dashboard/components/ui/TickerTape"
import OrderData from "@/app/(product)/Dashboard/components/ui/OrderData"
import * as ScrollArea from '@radix-ui/react-scroll-area';
import BottomPanel from "@/app/(product)/Dashboard/components/layout/BottomPanel"
import { ERC20_TO_TRADINGVIEW } from "@/src/constants"
import NewList from "@/app/(product)/Dashboard/components/tokenList/new-list"
import LoadingIntro from "@/src/components/ui/loading-intro"
import { ChartBarStacked } from "@/app/(product)/Dashboard/components/ui/bar-chart-stack"
import { ChartRadarMultiple } from "@/app/(product)/Dashboard/components/ui/Chart-radar"
import LiquidityDistributionChart from "@/app/(product)/Dashboard/components/ui/LiquidityDistributionChart"
import { ChartAreaLinear} from "@/app/(product)/Dashboard/components/ui/Linear-Chart"



export default function Page() {

  const [fromToken, setFromToken] = useState("link");
  const [toToken, setToToken] = useState("comp");
  const [currentChartToken, setCurrentChartToken] = useState(fromToken);

    // Map ERC20 tokens to TradingView symbols
  const getTradingViewSymbol = (symbol: string): string => {
    return ERC20_TO_TRADINGVIEW[symbol] || symbol
  }

    const handleTokenSelect = (symbol: string) => {
    setFromToken(symbol)
    setCurrentChartToken(symbol)
  }

  const handleToTokenSelect = (symbol: string) => {
    setToToken(symbol)
  }

    const [showIntro, setShowIntro] = useState(true);

  if (showIntro) {
    return <LoadingIntro onComplete={() => setShowIntro(false)} />;
  }
  return (
    <div className=" w-full h-full dark:bg-black bg-zinc-200">
      <div className="backdrop-filter backdrop-blur-3xl  w-full gap-0 flex">
        <div className=" w-full backdrop-filter backdrop-blur-3xl dark:bg-black bg-zinc-200 gap-0 flex flex-col h-full min-h-screen max-w-full mx-auto">

        <header className="sticky top-0 z-50 flex h-fit items-center rounded-3xl backdrop-filter backdrop-blur-2xl dark:bg-zinc-900/90 backdrop-brightness-200">
          <NavMenu/>
        </header>
      
        <div className="w-full gap-2 h-full flex flex-col items-center justify-start p-0 bg-transparent">
          <div className="flex flex-row w-full h-full gap-1">
              <div className="flex flex-1 flex-col gap-1 w-full h-fit">
                <div className="h-fit w-full  justify-center dark:bg-[#0F0F0F] bg-zinc-100 items-center flex mt-1 ">
                  <TickerTape/>
                  {/* <Ticker/> */}
                </div> 

                  <div className="justify-start items-start flex lg:flex-row md:flex-col sm:flex-col gap-1 w-full h-full overflow-hidden">

                    <div className="lg:max-w-[350px] md:w-[350px] bg-transparent overflow-clip h-full">
                      <div className="h-full w-full bg-transparent">
                        <ScrollArea.Root className="h-full w-full rounded-none border-none overflow-clip" type="auto">
                          <ScrollArea.Viewport className="w-full overflow-clip h-[1392px] flex lg:flex-col md:flex-row sm:flex-row px-1  ">
                              <div className="h-fit w-full">
                                <MarketStats tokenSymbol={currentChartToken} />
                              </div>
                              <div className="w-full h-fit mt-1">
                                <OrderData tokenSymbol={currentChartToken} />
                              </div>
                              <div className="w-full h-fit mt-1">
                                <LiquidityDistributionChart tokenSymbol={currentChartToken} />
                              </div>
                              <div className="w-full h-fit mt-1">
                                <ChartRadarMultiple tokenSymbol={currentChartToken} />
                              </div>
                              <div className="h-fit w-full mt-1">
                                <TechnicalSpecs tokenSymbol={currentChartToken} />
                              </div>
                          </ScrollArea.Viewport>
                          <ScrollArea.Scrollbar
                            className="flex w-0 bg-transparent  touch-none select-none transition-colors duration-150 ease-out  hover:bg-transparent"
                            orientation="vertical"
                          >
                            <ScrollArea.Thumb className="flex-1 rounded-full bg-zinc-600" />
                          </ScrollArea.Scrollbar>
                          <ScrollArea.Corner />
                        </ScrollArea.Root>
                      </div>
                    </div>
                    
                        {/* chart */}
                      <div className="w-full h-full  border-none flex flex-col p-0 gap-1 ">

                        <div className="">
                          <TradingChart
                            buyTokenSymbol={toToken}
                            sellTokenSymbol={fromToken}
                            setCurrentChartToken={setCurrentChartToken}
                          />
                        </div>

                          {/*<Networks/>*/}

                        <div className="flex flex-row gap-4 w-full h-full bg-transparent items-center p-0" >
                          <NewList value={toToken} onValueChange={setToToken} label="To Token" />
                        </div>
                        
                      </div>


                        <div className="max-w-[400px] h-[715px] flex flex-col">
                          <div className="h-full flex flex-col bg-transparent p-0 rounded-none">
                            <div className=" h-full w-full flex flex-col gap-1 bg-transparent px-1 rounded-none">
                              <Swap
                                fromToken={fromToken}
                                setFromToken={setFromToken}
                                toToken={toToken}
                                setToToken={setToToken}
                                setCurrentChartToken={setCurrentChartToken} 
                                price={undefined} 
                                setPrice={function (price: any): void {
                                  throw new Error("Function not implemented.")
                                } } setFinalize={function (finalize: boolean): void {
                                  throw new Error("Function not implemented.")
                                } } chainId={0}                              
                              />
                              <div className="h-fit w-full mt-1">
                                <ChartBarStacked/>
                              </div>
                              <div className="h-fit w-full mt-1">
                                <ChartAreaLinear/>
                              </div>

                              {/*<TransactionList />*/}
                            </div>
                          </div>
                        </div>
                  </div>
                </div>
              </div>
            </div>
          <footer className="sticky bottom-0 z-50 flex h-fit items-center backdrop-filter backdrop-blur-2xl dark:bg-zinc-900/90 backdrop-brightness-200">
            <BottomPanel />
          </footer>
        </div>
      </div>
    </div>
  )
}
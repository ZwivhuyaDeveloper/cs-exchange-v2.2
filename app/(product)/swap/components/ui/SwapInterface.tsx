// components/SwapInterface.tsx
"use client"

import { useState } from "react"
import { TokenInputSection } from "./TokenInputSection"
import { TradingChart } from "@/app/(product)/Dashboard/components/chart/trading-chart"

export function SwapInterface() {
  const [fromToken, setFromToken] = useState("")
  const [toToken, setToToken] = useState("")

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
      <div className="space-y-6">
        <TokenInputSection
                  label="sell"
                  token={fromToken}
                  onTokenChange={setFromToken} amount={""} chainId={0} onAmountChange={function (amount: string): void {
                      throw new Error("Function not implemented.")
                  } }        />
        <TokenInputSection
                  label="buy"
                  token={toToken}
                  onTokenChange={setToToken} amount={""} chainId={0} onAmountChange={function (amount: string): void {
                      throw new Error("Function not implemented.")
                  } }        />
      </div>
      <TradingChart 
        buyTokenSymbol={toToken}
        sellTokenSymbol={fromToken}
      />
    </div>
  )
}
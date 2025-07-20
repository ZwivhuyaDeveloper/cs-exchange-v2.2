'use client'

import { useState } from 'react'
import { ArrowUpDown, Settings, Info } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

const tokens = [
  { symbol: 'ETH', name: 'Ethereum', logo: '⟠', price: 2876.45, balance: 2.5 },
  { symbol: 'BTC', name: 'Bitcoin', logo: '₿', price: 45234.12, balance: 0.15 },
  { symbol: 'USDC', name: 'USD Coin', logo: '💵', price: 1.00, balance: 5000 },
  { symbol: 'UNI', name: 'Uniswap', logo: '🦄', price: 8.45, balance: 150 },
  { symbol: 'LINK', name: 'Chainlink', logo: '🔗', price: 15.67, balance: 75 },
  { symbol: 'AAVE', name: 'Aave', logo: '👻', price: 89.23, balance: 25 }
]

export default function SwapDemo() {
  const [fromToken, setFromToken] = useState(tokens[0])
  const [toToken, setToToken] = useState(tokens[2])
  const [fromAmount, setFromAmount] = useState('1.0')
  const [toAmount, setToAmount] = useState('2876.45')
  const [slippage, setSlippage] = useState('0.5')

  const handleSwapTokens = () => {
    const temp = fromToken
    setFromToken(toToken)
    setToToken(temp)
    
    const tempAmount = fromAmount
    setFromAmount(toAmount)
    setToAmount(tempAmount)
  }

  const calculateToAmount = (amount: string) => {
    const numAmount = parseFloat(amount) || 0
    const rate = fromToken.price / toToken.price
    return (numAmount * rate).toFixed(6)
  }

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value)
    setToAmount(calculateToAmount(value))
  }

  return (
    <section className="py-20 bg-gradient-to-b from-[#0A0E17] to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Try Our <span className="text-accent">Swap Interface</span>
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Experience the smoothest token swapping interface in DeFi
          </p>
        </motion.div>

        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-gray-100/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Swap Tokens</h3>
              <Button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                <Settings className="h-5 w-5 text-gray-500" />
              </Button>
            </div>

            {/* From Token */}
            <div className="mb-4">
              <div className="bg-gray-200/50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">From</span>
                  <span className="text-sm text-gray-500">
                    Balance: {fromToken.balance} {fromToken.symbol}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 bg-gray-200 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-200 transition-colors">
                    <span className="text-xl">{fromToken.logo}</span>
                    <span className="font-semibold text-white">{fromToken.symbol}</span>
                  </div>
                  <input
                    type="text"
                    value={fromAmount}
                    onChange={(e) => handleFromAmountChange(e.target.value)}
                    className="flex-1 bg-transparent text-right text-xl font-semibold text-white focus:outline-none"
                    placeholder="0.0"
                  />
                </div>
                <div className="text-right text-sm text-gray-400 mt-1">
                  ≈ ${(parseFloat(fromAmount) * fromToken.price).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center mb-4">
              <Button
                onClick={handleSwapTokens}
                className="p-3 bg-gray-200 hover:bg-[#00FFC2] hover:text-[#0A0E17] rounded-full transition-all duration-300 transform hover:scale-110"
              >
                <ArrowUpDown className="h-5 w-5" />
              </Button>
            </div>

            {/* To Token */}
            <div className="mb-6">
              <div className="bg-gray-200/50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">To</span>
                  <span className="text-sm text-gray-500 ">
                    Balance: {toToken.balance} {toToken.symbol}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 bg-gray-200 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-200 transition-colors">
                    <span className="text-xl">{toToken.logo}</span>
                    <span className="font-semibold text-white">{toToken.symbol}</span>
                  </div>
                  <input
                    type="text"
                    value={toAmount}
                    readOnly
                    className="flex-1 bg-transparent text-right text-xl font-semibold text-white focus:outline-none"
                    placeholder="0.0"
                  />
                </div>
                <div className="text-right text-sm text-gray-400 mt-1">
                  ≈ ${(parseFloat(toAmount) * toToken.price).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Swap Details */}
            <div className="bg-gray-200/300 rounded-lg p-4 mb-6 space-y-2 border border-gray-200/50">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Rate</span>
                <span className="text-white">1 {fromToken.symbol} = {(fromToken.price / toToken.price).toFixed(6)} {toToken.symbol}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Slippage Tolerance</span>
                <span className="text-white">{slippage}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Network Fee</span>
                <span className="text-white">~$12.50</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Route</span>
                <span className="text-white">Uniswap V3 → 1inch</span>
              </div>
            </div>

            {/* Price Impact Warning */}
            <div className="flex items-center space-x-2 bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3 mb-6">
              <Info className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-yellow-200">Price impact: 0.12%</span>
            </div>

            {/* Swap Button */}
            <button className="w-full bg-[#00FFC2] hover:bg-[#00FFC2]/80 text-primary py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105">
              Connect Wallet to Swap
            </button>

            {/* Powered By */}
            <div className="text-center mt-4">
              <span className="text-xs text-gray-500">Powered by AlphaChain DEX Aggregator</span>
            </div>
          </motion.div>

          {/* Features Below */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mt-8 grid grid-cols-3 gap-4 text-center"
          >
            <div className="bg-gray-200/30 rounded-lg p-4">
              <div className="text-lg font-bold text-[#00FFC2]">0.3%</div>
              <div className="text-xs text-gray-400">Avg Slippage</div>
            </div>
            <div className="bg-gray-200/30 rounded-lg p-4">
              <div className="text-lg font-bold text-[#00FFC2]">15+</div>
              <div className="text-xs text-gray-400">DEX Sources</div>
            </div>
            <div className="bg-gray-200/30 rounded-lg p-4">
              <div className="text-lg font-bold text-[#00FFC2]">99.9%</div>
              <div className="text-xs text-gray-400">Success Rate</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
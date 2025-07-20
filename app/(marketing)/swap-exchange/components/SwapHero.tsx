'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowUpDown, Shield, Zap, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { AuroraBackground } from '@/components/ui/aurora-background'
import { Tourney } from 'next/font/google'

const tourney = Tourney({
  subsets: ['latin'],
  weight: ['400', '700'],
})


export default function SwapHero() {
  const [swapVolume, setSwapVolume] = useState(2450000)

  useEffect(() => {
    const interval = setInterval(() => {
      setSwapVolume(prev => prev + Math.floor(Math.random() * 10000))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 ">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-[#0A0E17]/50 to-[#0A0E17]/100" />
        <AuroraBackground children={undefined} className="absolute inset-0  " />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="text-center">
          {/* Live Volume Counter */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 inline-flex items-center space-x-4 bg-gray-200/50 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-200"
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#00FFC2] rounded-full animate-pulse" />
              <span className="text-sm font-mono text-gray-500">24H VOLUME</span>
            </div>
            <div className="text-lg font-mono font-bold text-[#00FFC2]">
              ${swapVolume.toLocaleString()}
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            <span className={`${tourney.className} bg-gradient-to-r from-[#00FFC2] to-[#3A86FF] bg-clip-text text-transparent`}>
              Lightning-Fast
            </span>
            <br />
            <span className={`${tourney.className} text-white`}>Token Swaps</span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-500 mb-12 max-w-3xl mx-auto"
          >
            Swap 500+ tokens instantly with the best rates, minimal slippage, and maximum security across multiple DEXs
          </motion.p>

          {/* Trust Elements */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center space-x-3">
              <div className="p-3 bg-[#00FFC2]/20 rounded-full">
                <Zap className="h-6 w-6 text-[#00FFC2]" color='#00FFC2' />
              </div>
              <div>
                <div className="font-semibold text-white">Instant Swaps</div>
                <div className="text-sm text-gray-500">Sub-second execution</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="p-3 bg-[#00FFC2]/20 rounded-full">
                <TrendingUp className="h-6 w-6 text-[#00FFC2]" color='#00FFC2' />
              </div>
              <div>
                <div className="font-semibold text-white">Best Rates</div>
                <div className="text-sm text-gray-500">Multi-DEX aggregation</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="p-3 bg-[#00FFC2]/20 rounded-full">
                <Shield className="h-6 w-6 text-[#00FFC2]" color='#00FFC2' />
              </div>
              <div>
                <div className="font-semibold text-white">Secure & Safe</div>
                <div className="text-sm text-gray-500">Non-custodial</div>
              </div>
            </div>
          </motion.div>

          {/* Performance Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-3xl mx-auto"
          >
            <div className="bg-gray-100/50 rounded-xl p-4 border border-gray-100">
              <div className="text-2xl font-bold text-accent mb-1">500+</div>
              <div className="text-sm text-gray-500">Tokens</div>
            </div>
            <div className="bg-gray-100/50 rounded-xl p-4 border border-gray-100">
              <div className="text-2xl font-bold text-accent mb-1">0.3%</div>
              <div className="text-sm text-gray-500">Avg Slippage</div>
            </div>
            <div className="bg-gray-100/50 rounded-xl p-4 border border-gray-100">
              <div className="text-2xl font-bold text-accent mb-1">15+</div>
              <div className="text-sm text-gray-500">DEX Sources</div>
            </div>
            <div className="bg-gray-100/50 rounded-xl p-4 border border-gray-100">
              <div className="text-2xl font-bold text-accent mb-1">$50M+</div>
              <div className="text-sm text-gray-500">Daily Volume</div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <Link
              href="/trial"
              className="bg-[#00FFC2] hover:bg-[#00FFC2]/80 text-primary px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 glow-effect flex items-center space-x-2"
            >
              <ArrowUpDown className="h-5 w-5" color='black' />
              <span className='text-black'>Start Swapping Now</span>
            </Link>
            <div className="text-sm text-gray-100">
              <div>✓ No registration required</div>
              <div>✓ Connect any wallet</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
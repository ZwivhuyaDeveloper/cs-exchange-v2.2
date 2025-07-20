'use client'

import Link from 'next/link'
import { TrendingUp, Zap, Shield, Bot } from 'lucide-react'
import { motion } from 'framer-motion'
import { AuroraBackground } from '@/components/ui/aurora-background'
import { Tourney } from 'next/font/google'

const tourney = Tourney({
  subsets: ['latin'],
  weight: ['400', '700'],
})

export default function TradingHero() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 ">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-[#0A0E17]/50 to-[#0A0E17]/100" />
        <AuroraBackground children={undefined} className="absolute inset-0  " />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              <span className={`${tourney.className} bg-gradient-to-r from-[#00FFC2] to-[#3A86FF] bg-clip-text text-transparent`}>
                Automated Trading
              </span>
              <br />
              <span className={`${tourney.className} text-white`}>Made Simple</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-500 mb-8 leading-relaxed"
            >
              Execute trades automatically with our advanced trading bots. Connect to major exchanges, set your parameters, and let AI handle the rest while you sleep.
            </motion.p>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8"
            >
              <div className="flex items-center space-x-3">
                <Bot className="h-6 w-6 text-accent" color='#00FFC2' />
                <div>
                  <div className="font-semibold text-white">AI Trading Bots</div>
                  <div className="text-sm text-gray-400">24/7 Automation</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-accent" color='#00FFC2' />
                <div>
                  <div className="font-semibold text-white">Secure API Keys</div>
                  <div className="text-sm text-gray-400">Bank-level Security</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-6 w-6 text-accent" color='#00FFC2' />
                <div>
                  <div className="font-semibold text-white">Risk Management</div>
                  <div className="text-sm text-gray-400">Stop Loss & Take Profit</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Zap className="h-6 w-6 text-accent" color='#00FFC2' />
                <div>
                  <div className="font-semibold text-white">Lightning Fast</div>
                  <div className="text-sm text-gray-400">Sub-second Execution</div>
                </div>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6"
            >
              <Link
                href="/trial"
                className="bg-accent hover:bg-accent-hover text-primary px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 glow-effect"
              >
                Start Trading Bot
              </Link>
              <div className="text-sm text-gray-400">
                <div>✓ 7-day free trial</div>
                <div>✓ No trading fees for first month</div>
              </div>
            </motion.div>
          </div>

          {/* Trading Bot Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <div className="bg-gray-200/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 floating">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Trading Bot Dashboard</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                  <span className="text-sm text-gray-500">Active</span>
                </div>
              </div>

              {/* Bot Status */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-300/30 rounded-lg p-3">
                  <div className="text-sm text-gray-500">Total Profit</div>
                  <div className="text-xl font-bold text-accent">+$12,450</div>
                </div>
                <div className="bg-gray-300/30 rounded-lg p-3">
                  <div className="text-sm text-gray-500">Win Rate</div>
                  <div className="text-xl font-bold text-accent">87%</div>
                </div>
              </div>

              {/* Recent Trades */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-white">Recent Trades</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-gray-300/20 rounded-lg p-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-accent rounded-full" />
                      <span className="text-sm text-white">BTC/USDT</span>
                    </div>
                    <span className="text-sm text-accent">+2.4%</span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-300/20 rounded-lg p-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-accent rounded-full" />
                      <span className="text-sm text-white">ETH/USDT</span>
                    </div>
                    <span className="text-sm text-accent">+1.8%</span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-300/20 rounded-lg p-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full" />
                      <span className="text-sm text-white">SOL/USDT</span>
                    </div>
                    <span className="text-sm text-red-400">-0.5%</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
'use client'

import Link from 'next/link'
import { BarChart, TrendingUp, Database } from 'lucide-react'
import { motion } from 'framer-motion'
import { AuroraBackground } from '@/components/ui/aurora-background'
import { Tourney } from 'next/font/google'

const tourney = Tourney({
  subsets: ['latin'],
  weight: ['400', '700'],
})

export default function ResearchHero() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 ">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-[#0A0E17]/50 to-[#0A0E17]/100" />
        <AuroraBackground className="absolute inset-0">
          {null}
        </AuroraBackground>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-5xl font-bold mb-6"
            >
              <span className={`${tourney.className} bg-gradient-to-r from-[#00FFC2] to-[#3A86FF] bg-clip-text text-transparent`}>
                Institutional-Grade
              </span>
              <br />
              <span className={`${tourney.className} text-white`}>Crypto Intelligence</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-500 mb-8 leading-relaxed"
            >
              Advanced research terminal with technical analysis, fundamental reports, and whale tracking. Make informed decisions with Bloomberg-level insights.
            </motion.p>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8"
            >
              <div className="flex items-center space-x-3">
                <BarChart className="h-6 w-6 text-[#00FFC2]" />
                <div>
                  <div className="font-semibold text-white">Technical Analysis</div>
                  <div className="text-sm text-gray-400">50+ Indicators</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Database className="h-6 w-6 text-[#00FFC2]" />
                <div>
                  <div className="font-semibold text-white">Fundamental Data</div>
                  <div className="text-sm text-gray-400">500+ Coins</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-6 w-6 text-[#00FFC2]" />
                <div>
                  <div className="font-semibold text-white">Whale Tracking</div>
                  <div className="text-sm text-gray-400">Real-time Alerts</div>
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
                className="bg-[#00FFC2] hover:bg-accent-hover text-[#0A0E17] px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 glow-effect"
              >
                Unlock Advanced Research
              </Link>
              <div className="text-sm text-gray-400">
                <div>✓ 7-day free trial</div>
                <div>✓ Full access to all features</div>
              </div>
            </motion.div>
          </div>

          {/* 3D Dashboard Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <div className=" backdrop-blur-3xl rounded-2xl p-6 border border-gray-200 floating">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">BTC/USD Analysis</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#00FFC2] rounded-full animate-pulse" />
                  <span className="text-sm text-gray-400">Live</span>
                </div>
              </div>

              {/* Price Chart Simulation */}
              <div className="mb-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-2xl font-bold text-white">$45,234</div>
                  <div className="text-[#00FFC2]">+2.4%</div>
                </div>
                <div className="h-32 bg-gray-200/30 rounded-lg relative overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 300 100">
                    <polyline
                      points="0,80 30,75 60,70 90,65 120,60 150,55 180,50 210,45 240,40 270,35 300,30"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="2"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#00FFC2" />
                        <stop offset="100%" stopColor="#3A86FF" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              {/* Indicators */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-200/30 rounded-lg p-3">
                  <div className="text-sm text-gray-600">RSI</div>
                  <div className="text-lg font-semibold text-accent">67.4</div>
                </div>
                <div className="bg-gray-200/30 rounded-lg p-3">
                  <div className="text-sm text-gray-600">MACD</div>
                  <div className="text-lg font-semibold text-accent">Bullish</div>
                </div>
                <div className="bg-gray-200/30 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Volume</div>
                  <div className="text-lg font-semibold text-white">24.6B</div>
                </div>
                <div className="bg-gray-200/30 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Support</div>
                  <div className="text-lg font-semibold text-white">$44,100</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
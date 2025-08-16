'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Zap, Target, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { AuroraBackground } from '@/components/ui/aurora-background'
import { Tourney } from 'next/font/google'

const tourney = Tourney({
  subsets: ['latin'],
  weight: ['400', '700'],
})

export default function SignalsHero() {
  const [signalCount, setSignalCount] = useState(1247)

  useEffect(() => {
    const interval = setInterval(() => {
      setSignalCount(prev => prev + Math.floor(Math.random() * 3))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative py-20 overflow-hidden blockchain-pattern">
      {/* Background Elements */}
      <div className="absolute inset-0 ">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-[#0A0E17]/50 to-[#0A0E17]/100" />
        <AuroraBackground className="absolute inset-0">
          {null}
        </AuroraBackground>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="text-center">
          {/* Live Signal Counter */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 inline-flex items-center space-x-4 bg-gray-200/50 backdrop-blur-md px-6 py-3 rounded-full border border-gray-200"
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#00FFC2] rounded-full animate-pulse" />
              <span className="text-sm font-mono text-gray-500">SIGNALS SENT</span>
            </div>
            <div className="text-lg font-mono font-bold text-[#00FFC2]">
              {signalCount.toLocaleString()}
            </div>
            <span className="text-sm text-gray-500">this week</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            <span className={`${tourney.className} bg-gradient-to-r from-[#00FFC2] to-[#3A86FF] bg-clip-text text-transparent`}>
              High-Accuracy Trades
            </span>
            <br />
            <span className={`${tourney.className} text-white`}>Delivered to Your Inbox</span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-500 mb-12 max-w-3xl mx-auto"
          >
            AI-detected opportunities verified by expert analysts and delivered instantly via Telegram, Email, and SMS
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
                <Zap className="h-6 w-6 text-[#00FFC2]" color='#00FFC2'/>
              </div>
              <div>
                <div className="font-semibold text-white">AI Detection</div>
                <div className="text-sm text-gray-500">Real-time scanning</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="p-3 bg-[#00FFC2]/20 rounded-full">
                <Target className="h-6 w-6 text-[#00FFC2]" color='#00FFC2' />
              </div>
              <div>
                <div className="font-semibold text-white">Expert Verified</div>
                <div className="text-sm text-gray-500">8+ analysts approve</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="p-3 bg-[#00FFC2]/20 rounded-full">
                <TrendingUp className="h-6 w-6 text-[#00FFC2]" color='#00FFC2' />
              </div>
              <div>
                <div className="font-semibold text-white">90% Win Rate</div>
                <div className="text-sm text-gray-500">Proven accuracy</div>
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
              <div className="text-2xl font-bold text-[#00FFC2] mb-1">90%</div>
              <div className="text-sm text-gray-500">Win Rate</div>
            </div>
            <div className="bg-gray-100/50 rounded-xl p-4 border border-gray-100">
              <div className="text-2xl font-bold text-[#00FFC2] mb-1">4.2x</div>
              <div className="text-sm text-gray-500">Avg ROI</div>
            </div>
            <div className="bg-gray-100/50 rounded-xl p-4 border border-gray-100">
              <div className="text-2xl font-bold text-[#00FFC2] mb-1">&lt;30s</div>
              <div className="text-sm text-gray-500">Alert Speed</div>
            </div>
            <div className="bg-gray-100/50 rounded-xl p-4 border border-gray-100">
              <div className="text-2xl font-bold text-[#00FFC2] mb-1">24/7</div>
              <div className="text-sm text-gray-500">Monitoring</div>
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
              className="bg-[#00FFC2] hover:bg-[#00FFC2]/80 text-[#3A86FF] px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 glow-effect flex items-center space-x-2"
            >
              <Zap className="h-5 w-5 text-gray-100" color='#0A0E17' />
              <span className='text-gray-100'>Get Your First Signal Today</span>
            </Link>
            <div className="text-sm text-gray-500">
              <div>✓ 7-day free trial</div>
              <div>✓ No credit card required</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
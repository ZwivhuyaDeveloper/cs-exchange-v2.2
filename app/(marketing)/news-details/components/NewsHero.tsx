'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Bell, TrendingUp, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { AuroraBackground } from '@/components/ui/aurora-background'
import { Tourney } from 'next/font/google'
import Bitcoin from '@/public/Token-Logos/BTC.png'
import Ethereum from '@/public/Token-Logos/ethereum-eth-logo.png'
import Image from 'next/image'

const tourney = Tourney({
  subsets: ['latin'],
  weight: ['400', '700'],
})

export default function NewsHero() {
  const [cryptoPrices, setCryptoPrices] = useState({
    btc: { price: 45234, change: 2.4 },
    eth: { price: 2876, change: -1.2 }
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setCryptoPrices(prev => ({
        btc: {
          price: prev.btc.price + (Math.random() - 0.5) * 100,
          change: (Math.random() - 0.5) * 10
        },
        eth: {
          price: prev.eth.price + (Math.random() - 0.5) * 50,
          change: (Math.random() - 0.5) * 8
        }
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative py-20 overflow-hidden bg-[#0A0E17]">
      {/* Background Elements */}
      <div className="absolute inset-0 ">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-[#0A0E17]/50 to-[#0A0E17]/100" />
        <AuroraBackground className="absolute inset-0">
          {null}
        </AuroraBackground>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="text-center">
          {/* Live Price Ticker */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 inline-flex items-center space-x-6 bg-gray-100/50 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-100"
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-sm font-mono text-gray-400">LIVE PRICES</span>
            </div>
            <div className="text-sm font-mono">
              <Image
                src={Bitcoin}
                alt="Bitcoin Icon"
                width={16}
                height={16}
                className="inline-block mr-1"
              />
              BTC: <span className="text-white">${cryptoPrices.btc.price.toLocaleString()}</span>
              <span className={`ml-2 ${cryptoPrices.btc.change >= 0 ? 'text-accent' : 'text-red-400'}`}>
                {cryptoPrices.btc.change >= 0 ? '+' : ''}{cryptoPrices.btc.change.toFixed(2)}%
              </span>
            </div>
            <div className="text-sm font-mono">
              <Image
                src={Ethereum}
                alt="Ethereum Icon"
                width={16}
                height={16}
                className="inline-block mr-1"
              />
              ETH: <span className="text-white">${cryptoPrices.eth.price.toLocaleString()}</span>
              <span className={`ml-2 ${cryptoPrices.eth.change >= 0 ? 'text-accent' : 'text-red-400'}`}>
                {cryptoPrices.eth.change >= 0 ? '+' : ''}{cryptoPrices.eth.change.toFixed(2)}%
              </span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            <span className={`${tourney.className} text-white`}>Never Miss a</span>
            <br />
            <span className={`${tourney.className} bg-gradient-to-r from-[#00FFC2] to-[#3A86FF] bg-clip-text text-transparent`}>
              Market-Moving Event
            </span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-500 mb-12 max-w-3xl mx-auto"
          >
            AI-powered crypto news aggregation from 200+ sources with real-time sentiment analysis and instant alerts
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">200+</div>
              <div className="text-sm text-gray-400">News Sources</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">10K+</div>
              <div className="text-sm text-gray-400">Articles Daily</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">95%</div>
              <div className="text-sm text-gray-400">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">&lt;30s</div>
              <div className="text-sm text-gray-400">Alert Speed</div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <Link
              href="/trial"
              className="bg-[#00FFC2] hover:bg-[#00FFC2]/80 text-[#0A0E17] px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 glow-effect flex items-center space-x-2"
            >
              <Bell className="h-5 w-5" color='BLACK' />
              <span className='text-gray-200'>Get Real-Time Alerts</span>
            </Link>
            <div className="flex items-center space-x-2 text-gray-400">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">7-day free trial • No credit card required</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
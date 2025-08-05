'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Play, TrendingUp, Shield, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { AuroraBackground } from '../../../../components/ui/aurora-background'
import { Tourney } from 'next/font/google';
import { FlipWords } from "../ui/flip-words";
import Image from 'next/image'

const tourney = Tourney({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-tourney',
  preload: true,
});
import Bitcoin from '@/public/Token-Logos/BTC.png'
import Ethereum from '@/public/Token-Logos/ethereum-eth-logo.png'
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'



export default function Hero() {
  const [cryptoPrice, setCryptoPrice] = useState({ btc: 45234, eth: 2876 })
  const words = ["Crypto Markets", "Blockchains", "Liquidity Pools", "Market Trends", "Whale Movements", "Trading Signals"];
  

  useEffect(() => {
    const interval = setInterval(() => {
      setCryptoPrice(prev => ({
        btc: prev.btc + (Math.random() - 0.5) * 100,
        eth: prev.eth + (Math.random() - 0.5) * 50,
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative py-20 overflow-hidden ">
      {/* Background Elements */}
      <div className="absolute inset-0 ">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-[#0A0E17]/50 to-[#0A0E17]/100" />
        <AuroraBackground children={undefined} className="absolute inset-0  " />
      </div>


      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="text-center">
          {/* Live Price Ticker */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 inline-flex items-center space-x-6 bg-gray-200/50 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-200"
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#00FFC2] rounded-full animate-pulse" />
              <span className="text-sm font-mono text-gray-400">LIVE</span>
            </div>
            <div className="text-sm font-mono">
              <Image
                src={Bitcoin}
                alt="Bitcoin Icon"
                width={16}
                height={16}
                className="inline-block mr-1"
              />
              BTC: <span className="text-[#00FFC2]">${cryptoPrice.btc.toLocaleString()}</span>
            </div>
            <div className="text-sm font-mono">
              <Image
                src={Ethereum}
                alt="Ethereum Icon"
                width={16}
                height={16}
                className="inline-block mr-1"
              />
              ETH: <span className="text-[#00FFC2]">${cryptoPrice.eth.toLocaleString()}</span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
          >
            <h1 className={`${tourney.className} antialiased`}>
              <span className="bg-gradient-to-r from-white via-[#00FFC2] to-[#3A86FF] bg-clip-text text-transparent">
                Decode <FlipWords className='bg-gradient-to-r from-white via-[#00FFC2] to-[#3A86FF] bg-clip-text text-transparent -z-10' words={words} /> 
              </span>
              <br />
              <span className="text-white">in Real-Time</span>
            </h1>
          </motion.div>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto"
          >
            AI-Powered Signals, News & Research
            <br />
            <span className="text-[#00FFC2] font-semibold">Trade Smarter, Not Harder</span>
          </motion.p>

          {/* Trust Elements */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center items-center space-x-8 mb-12 text-sm text-gray-700"
          >
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-[#00FFC2]" color='#00FFC2' />
              <span>90% Signal Accuracy</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-[#00FFC2]" color='#00FFC2' />
              <span>256-bit Encryption</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-[#00FFC2]" color='#00FFC2' />
              <span>Regulatory Compliance</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <Link
              href="/Dashboard"
              className="bg-accent hover:bg-accent-hover text-primary px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 glow-effect"
            >
              Dashboard
            </Link>
            <button className="flex items-center space-x-2 text-white hover:text-accent transition-colors group">
              <div className="p-3 bg-gray-300/50 rounded-full group-hover:bg-[#00FFC2]/20 transition-colors">
                <Play className="h-5 w-5" />
              </div>
              <span>Watch Demo</span>
            </button>
          </motion.div>

          {/* Success Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00FFC2]">50K+</div>
              <div className="text-sm text-gray-700">Active Traders</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00FFC2]">$2.5B+</div>
              <div className="text-sm text-gray-700">Trading Volume</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00FFC2]">90%</div>
              <div className="text-sm text-gray-700">Signal Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00FFC2]">24/7</div>
              <div className="text-sm text-gray-700">Market Coverage</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
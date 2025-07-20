'use client'

import { useState } from 'react'
import { Filter, Clock, TrendingUp, TrendingDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const categories = ['All', 'Regulations', 'NFTs', 'DeFi', 'Bitcoin', 'Ethereum']

const newsItems = {
  All: [
    { title: 'Bitcoin ETF Approval Speculation Drives Market Rally', category: 'Bitcoin', sentiment: 'bullish', time: '5 min ago', impact: 'high' },
    { title: 'New DeFi Protocol Launches with $50M TVL', category: 'DeFi', sentiment: 'bullish', time: '12 min ago', impact: 'medium' },
    { title: 'SEC Announces New Crypto Compliance Guidelines', category: 'Regulations', sentiment: 'neutral', time: '23 min ago', impact: 'high' },
    { title: 'Major NFT Collection Sees 200% Price Surge', category: 'NFTs', sentiment: 'bullish', time: '35 min ago', impact: 'low' },
    { title: 'Ethereum Network Upgrade Scheduled for Next Month', category: 'Ethereum', sentiment: 'bullish', time: '1 hr ago', impact: 'medium' },
  ],
  Regulations: [
    { title: 'SEC Announces New Crypto Compliance Guidelines', category: 'Regulations', sentiment: 'neutral', time: '23 min ago', impact: 'high' },
    { title: 'EU Parliament Votes on Crypto Asset Regulation', category: 'Regulations', sentiment: 'bearish', time: '2 hr ago', impact: 'high' },
    { title: 'Fed Chair Powell Comments on Digital Dollar', category: 'Regulations', sentiment: 'neutral', time: '3 hr ago', impact: 'medium' },
  ],
  NFTs: [
    { title: 'Major NFT Collection Sees 200% Price Surge', category: 'NFTs', sentiment: 'bullish', time: '35 min ago', impact: 'low' },
    { title: 'Celebrity NFT Drop Sells Out in Minutes', category: 'NFTs', sentiment: 'bullish', time: '1 hr ago', impact: 'low' },
    { title: 'OpenSea Introduces New Royalty Structure', category: 'NFTs', sentiment: 'neutral', time: '2 hr ago', impact: 'medium' },
  ],
  DeFi: [
    { title: 'New DeFi Protocol Launches with $50M TVL', category: 'DeFi', sentiment: 'bullish', time: '12 min ago', impact: 'medium' },
    { title: 'Uniswap V4 Development Updates Released', category: 'DeFi', sentiment: 'bullish', time: '45 min ago', impact: 'medium' },
    { title: 'Major DeFi Hack Results in $20M Loss', category: 'DeFi', sentiment: 'bearish', time: '3 hr ago', impact: 'high' },
  ],
  Bitcoin: [
    { title: 'Bitcoin ETF Approval Speculation Drives Market Rally', category: 'Bitcoin', sentiment: 'bullish', time: '5 min ago', impact: 'high' },
    { title: 'Lightning Network Reaches New Transaction Record', category: 'Bitcoin', sentiment: 'bullish', time: '1 hr ago', impact: 'medium' },
    { title: 'Bitcoin Mining Difficulty Adjusts Lower', category: 'Bitcoin', sentiment: 'neutral', time: '4 hr ago', impact: 'low' },
  ],
  Ethereum: [
    { title: 'Ethereum Network Upgrade Scheduled for Next Month', category: 'Ethereum', sentiment: 'bullish', time: '1 hr ago', impact: 'medium' },
    { title: 'Ethereum Gas Fees Drop to 6-Month Low', category: 'Ethereum', sentiment: 'bullish', time: '2 hr ago', impact: 'medium' },
    { title: 'Vitalik Buterin Discusses Future Roadmap', category: 'Ethereum', sentiment: 'bullish', time: '5 hr ago', impact: 'low' },
  ],
}

export default function NewsDemo() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish':
        return <TrendingUp className="h-4 w-4 text-accent" />
      case 'bearish':
        return <TrendingDown className="h-4 w-4 text-red-400" />
      default:
        return <div className="w-4 h-4 bg-gray-500 rounded-full" />
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Interactive News <span className="text-accent">Dashboard</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Filter and explore crypto news with real-time sentiment analysis
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-center gap-3 mb-8"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-accent text-primary'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* News Feed */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="bg-gray-100/50 backdrop-blur-sm rounded-2xl border border-gray-100 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <Filter className="h-5 w-5 text-accent" />
                <span className="font-semibold text-white">
                  {activeCategory} News Feed
                </span>
                <div className="ml-auto flex items-center space-x-2 text-sm text-gray-400">
                  <div className="w-2 h-2 bg-[#00FFC2] rounded-full animate-pulse" />
                  <span>Live Updates</span>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              <AnimatePresence mode="wait">
                {newsItems[activeCategory as keyof typeof newsItems]?.map((item, index) => (
                  <motion.div
                    key={`${activeCategory}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 hover:bg-gray-50/20 transition-colors cursor-pointer"
                    onMouseEnter={() => setHoveredItem(index)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {getSentimentIcon(item.sentiment)}
                          <span className="text-sm text-[#00FFC2] font-semibold">
                            {item.category}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full border ${getImpactColor(item.impact)}`}>
                            {item.impact.toUpperCase()}
                          </span>
                        </div>
                        <h3 className={`text-lg font-semibold transition-colors ${
                          hoveredItem === index ? 'text-[#00FFC2]' : 'text-white'
                        }`}>
                          {item.title}
                        </h3>
                        <div className="flex items-center space-x-2 mt-2 text-sm text-gray-100">
                          <Clock className="h-3 w-3" />
                          <span>{item.time}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Demo Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center"
          >
            <div className="bg-gray-100/50 rounded-lg p-4">
              <div className="text-xl font-bold text-accent">1,247</div>
              <div className="text-sm text-gray-500">Articles Today</div>
            </div>
            <div className="bg-gray-100/50 rounded-lg p-4">
              <div className="text-xl font-bold text-accent">23s</div>
              <div className="text-sm text-gray-500">Avg. Alert Speed</div>
            </div>
            <div className="bg-gray-100/50 rounded-lg p-4">
              <div className="text-xl font-bold text-accent">95%</div>
              <div className="text-sm text-gray-500">Accuracy Rate</div>
            </div>
            <div className="bg-gray-100/50 rounded-lg p-4">
              <div className="text-xl font-bold text-accent">24/7</div>
              <div className="text-sm text-gray-500">Monitoring</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
'use client'

import { BarChart, FileText, Eye, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
  {
    icon: BarChart,
    title: 'Technical Analysis',
    description: 'Advanced charting with 50+ indicators including RSI, MACD, Bollinger Bands, and custom pattern recognition.',
    features: ['Chart Patterns', 'RSI & MACD', 'Volume Analysis', 'Support/Resistance']
  },
  {
    icon: FileText,
    title: 'Fundamental Reports',
    description: 'Deep-dive analysis of tokenomics, team backgrounds, partnerships, and market positioning for 500+ cryptocurrencies.',
    features: ['Tokenomics Analysis', 'Team Research', 'Risk Assessment', 'Market Outlook']
  },
  {
    icon: Eye,
    title: 'Whale Tracker',
    description: 'Monitor large wallet movements and institutional trading patterns that can signal major market shifts.',
    features: ['Large Transactions', 'Wallet Clustering', 'Flow Analysis', 'Impact Scoring']
  },
  {
    icon: Zap,
    title: 'Real-time Alerts',
    description: 'Instant notifications for technical breakouts, fundamental changes, and whale movements across all monitored assets.',
    features: ['Breakout Alerts', 'Volume Spikes', 'Whale Movements', 'News Impact']
  }
]

export default function ResearchFeatures() {
  return (
    <section className="py-20 bg-gradient-to-b from-[#0A0E17] to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Professional <span className="text-accent">Research Tools</span>
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Everything you need to make informed trading decisions in one comprehensive platform
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-gray-100/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-100 hover:border-[#00FFC2]/50 transition-all duration-300 group"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gradient-to-br from-[#00FFC2] to-[#3A86FF] rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#00FFC2] transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-500 mb-4 leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {feature.features.map((item) => (
                        <div
                          key={item}
                          className="bg-gray-100/50 rounded-lg px-3 py-2 text-sm text-gray-500 text-center border border-gray-100"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          <div>
            <div className="text-3xl font-bold text-accent mb-2">500+</div>
            <div className="text-gray-500">Coins Analyzed</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-accent mb-2">50+</div>
            <div className="text-gray-500">Technical Indicators</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-accent mb-2">1000+</div>
            <div className="text-gray-500">Whales Tracked</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-accent mb-2">24/7</div>
            <div className="text-gray-500">Market Monitoring</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
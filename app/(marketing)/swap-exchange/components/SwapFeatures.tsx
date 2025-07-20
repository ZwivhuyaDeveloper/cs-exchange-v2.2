'use client'

import { Zap, TrendingUp, Shield, BarChart, Globe, Cpu } from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
  {
    icon: Zap,
    title: 'Lightning Speed',
    description: 'Execute swaps in under 2 seconds with our optimized routing algorithms and direct DEX integrations.',
    features: ['Sub-second execution', 'Instant confirmations', 'Real-time updates', 'No delays']
  },
  {
    icon: TrendingUp,
    title: 'Best Rates Guaranteed',
    description: 'Our smart routing finds the best prices across 15+ DEXs, ensuring you always get maximum value.',
    features: ['Multi-DEX aggregation', 'Price optimization', 'Slippage protection', 'MEV protection']
  },
  {
    icon: Shield,
    title: 'Maximum Security',
    description: 'Non-custodial swaps with audited smart contracts and enterprise-grade security measures.',
    features: ['Non-custodial', 'Audited contracts', 'No KYC required', 'Private transactions']
  },
  {
    icon: BarChart,
    title: 'Advanced Analytics',
    description: 'Track your swap history, analyze performance, and optimize your trading strategy with detailed insights.',
    features: ['Swap history', 'Performance metrics', 'Gas optimization', 'Profit tracking']
  },
  {
    icon: Globe,
    title: 'Multi-Chain Support',
    description: 'Swap tokens across Ethereum, BSC, Polygon, Arbitrum, and 10+ other popular blockchain networks.',
    features: ['15+ blockchains', 'Cross-chain swaps', 'Bridge integration', 'Universal wallet']
  },
  {
    icon: Cpu,
    title: 'AI-Powered Routing',
    description: 'Machine learning algorithms continuously optimize routing paths for better prices and lower fees.',
    features: ['ML optimization', 'Dynamic routing', 'Gas prediction', 'Smart execution']
  }
]

export default function SwapFeatures() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Choose <span className="text-[#00FFC2]">AlphaChain Swap</span>
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            The most advanced token swapping platform with unmatched speed, security, and savings
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-100/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 hover:border-[#00FFC2]/50 transition-all duration-300 group"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gradient-to-br from-[#00FFC2] to-[#3A86FF] rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#00FFC2] transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-450 mb-4 leading-relaxed text-sm">
                      {feature.description}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {feature.features.map((item) => (
                        <div
                          key={item}
                          className="bg-gray-200/50 rounded-lg px-2 py-1 text-xs text-gray-500 text-center border border-gray-200"
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

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-20"
        >
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            How We Compare
          </h3>
          <div className="bg-gray-100/50 backdrop-blur-sm rounded-2xl border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-4 gap-4 p-6 border-b border-gray-200 bg-gray-200/30">
              <div className="font-semibold text-white">Feature</div>
              <div className="text-center font-semibold text-[#00FFC2]">AlphaChain</div>
              <div className="text-center font-semibold text-gray-400">Uniswap</div>
              <div className="text-center font-semibold text-gray-400">1inch</div>
            </div>
            
            {[
              ['Swap Speed', '< 2 seconds', '~30 seconds', '~15 seconds'],
              ['DEX Sources', '15+', '1', '12+'],
              ['Gas Optimization', '✓ AI-powered', '✗ Basic', '✓ Standard'],
              ['MEV Protection', '✓ Advanced', '✗ None', '✓ Basic'],
              ['Multi-chain', '✓ 15+ chains', '✗ Ethereum only', '✓ 8 chains'],
              ['Analytics', '✓ Advanced', '✗ Basic', '✓ Standard']
            ].map((row, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 p-4 border-b border-gray-300/50 hover:bg-gray-300/20 transition-colors">
                <div className="text-gray-400">{row[0]}</div>
                <div className="text-center text-accent font-semibold">{row[1]}</div>
                <div className="text-center text-gray-400">{row[2]}</div>
                <div className="text-center text-gray-400">{row[3]}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
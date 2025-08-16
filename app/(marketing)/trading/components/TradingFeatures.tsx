'use client'

import { Bot, Shield, Zap, BarChart, Settings, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
  {
    icon: Bot,
    title: 'AI Trading Bots',
    description: 'Advanced algorithms that learn from market patterns and execute trades automatically based on your risk preferences.',
    features: ['Machine Learning', 'Pattern Recognition', 'Adaptive Strategies', 'Backtesting']
  },
  {
    icon: Shield,
    title: 'Secure API Integration',
    description: 'Connect to major exchanges with military-grade encryption. Your API keys are never stored on our servers.',
    features: ['256-bit Encryption', 'Read-only Keys', 'IP Whitelisting', 'Multi-factor Auth']
  },
  {
    icon: Zap,
    title: 'Lightning Execution',
    description: 'Sub-second trade execution with direct exchange connections and optimized routing for best prices.',
    features: ['Sub-second Speed', 'Smart Routing', 'Slippage Protection', 'Order Optimization']
  },
  {
    icon: BarChart,
    title: 'Advanced Analytics',
    description: 'Comprehensive performance tracking with detailed reports and insights to optimize your trading strategy.',
    features: ['Performance Metrics', 'Risk Analysis', 'Profit/Loss Reports', 'Strategy Comparison']
  },
  {
    icon: Settings,
    title: 'Customizable Strategies',
    description: 'Create and customize trading strategies with our intuitive strategy builder or choose from proven templates.',
    features: ['Strategy Builder', 'Template Library', 'Custom Indicators', 'Parameter Tuning']
  },
  {
    icon: TrendingUp,
    title: 'Risk Management',
    description: 'Built-in risk management tools including stop-loss, take-profit, and position sizing to protect your capital.',
    features: ['Stop Loss/Take Profit', 'Position Sizing', 'Drawdown Limits', 'Portfolio Balance']
  }
]

export default function TradingFeatures() {
  return (
    <section className="py-20 bg-gradient-to-b from-[#0A0E17] to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Complete <span className="text-[#00FFC2]">Trading Suite</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to automate your crypto trading with confidence
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
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-[#00FFC2]/50 transition-all duration-300 group"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gradient-to-br from-[#00FFC2] to-[#3A86FF] rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-6 w-6 text-white"  />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#00FFC2] transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 mb-4 leading-relaxed text-sm">
                      {feature.description}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {feature.features.map((item) => (
                        <div
                          key={item}
                          className="bg-gray-700/50 rounded-lg px-2 py-1 text-xs text-gray-400 text-center border border-gray-700"
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
      </div>
    </section>
  )
}
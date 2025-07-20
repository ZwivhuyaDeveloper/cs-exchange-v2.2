'use client'

import { CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

const exchanges = [
  { name: 'Binance', logo: '🔶', status: 'Live', features: ['Spot Trading', 'Futures', 'Options'] },
  { name: 'Coinbase Pro', logo: '🔵', status: 'Live', features: ['Spot Trading', 'Advanced Orders'] },
  { name: 'Kraken', logo: '🟣', status: 'Live', features: ['Spot Trading', 'Margin Trading'] },
  { name: 'KuCoin', logo: '🟢', status: 'Live', features: ['Spot Trading', 'Futures'] },
  { name: 'Bybit', logo: '🟡', status: 'Live', features: ['Derivatives', 'Spot Trading'] },
  { name: 'OKX', logo: '⚫', status: 'Coming Soon', features: ['Spot Trading', 'Derivatives'] }
]

export default function TradingIntegrations() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Exchange <span className="text-accent">Integrations</span>
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Connect to major cryptocurrency exchanges with secure API integration
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exchanges.map((exchange, index) => (
            <motion.div
              key={exchange.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-100/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 hover:border-accent/50 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{exchange.logo}</div>
                  <h3 className="text-lg font-semibold text-white">{exchange.name}</h3>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  exchange.status === 'Live' 
                    ? 'bg-accent/20 text-[#00FFC2]' 
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {exchange.status}
                </div>
              </div>

              <div className="space-y-2">
                {exchange.features.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-[#00FFC2]"  color='#00FFC2'/>
                    <span className="text-sm text-gray-500">{feature}</span>
                  </div>
                ))}
              </div>

              {exchange.status === 'Live' && (
                <button className="w-full mt-4 bg-[#00FFC2]/20 hover:bg-[#00FFC2]/30 text-[#00FFC2] py-2 rounded-lg font-semibold transition-colors">
                  Connect Exchange
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-16 bg-gray-100/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-100 text-center"
        >
          <h3 className="text-xl font-bold text-white mb-4">Security First</h3>
          <p className="text-gray-500 mb-6 max-w-2xl mx-auto">
            We use read-only API keys and never store your credentials. All connections are encrypted with 256-bit SSL and monitored 24/7 for suspicious activity.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-accent mb-1">256-bit</div>
              <div className="text-sm text-gray-400">SSL Encryption</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent mb-1">Read-Only</div>
              <div className="text-sm text-gray-400">API Keys</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent mb-1">24/7</div>
              <div className="text-sm text-gray-400">Monitoring</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent mb-1">SOC 2</div>
              <div className="text-sm text-gray-400">Compliant</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
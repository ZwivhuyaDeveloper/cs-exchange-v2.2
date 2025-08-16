'use client'

import { Check, X } from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
  {
    category: 'News & Alerts',
    items: [
      { name: 'Basic crypto news feed', free: true, pro: true, institutional: true },
      { name: 'Real-time breaking news alerts', free: false, pro: true, institutional: true },
      { name: 'Sentiment analysis scoring', free: false, pro: true, institutional: true },
      { name: 'Custom news filters', free: false, pro: true, institutional: true },
      { name: 'Multi-channel alerts (Email/SMS/Telegram)', free: false, pro: true, institutional: true },
      { name: 'Priority news delivery (<30s)', free: false, pro: false, institutional: true },
    ]
  },
  {
    category: 'Trading Signals',
    items: [
      { name: 'Community trading signals', free: true, pro: true, institutional: true },
      { name: 'Premium AI signals (90% accuracy)', free: false, pro: true, institutional: true },
      { name: 'Expert-verified signals', free: false, pro: true, institutional: true },
      { name: 'Risk-adjusted position sizing', free: false, pro: true, institutional: true },
      { name: 'Custom signal parameters', free: false, pro: false, institutional: true },
      { name: 'Institutional-grade signals', free: false, pro: false, institutional: true },
    ]
  },
  {
    category: 'Research & Analysis',
    items: [
      { name: 'Basic market data', free: true, pro: true, institutional: true },
      { name: 'Technical analysis tools', free: false, pro: true, institutional: true },
      { name: 'Advanced charting suite', free: false, pro: true, institutional: true },
      { name: 'Fundamental analysis reports', free: false, pro: true, institutional: true },
      { name: 'Whale tracker & on-chain analysis', free: false, pro: false, institutional: true },
      { name: 'Custom research reports', free: false, pro: false, institutional: true },
    ]
  },
  {
    category: 'Platform & Support',
    items: [
      { name: 'Mobile app access', free: true, pro: true, institutional: true },
      { name: 'Web dashboard', free: true, pro: true, institutional: true },
      { name: 'Email support', free: true, pro: true, institutional: true },
      { name: 'Priority support', free: false, pro: true, institutional: true },
      { name: 'Phone support', free: false, pro: false, institutional: true },
      { name: 'Dedicated account manager', free: false, pro: false, institutional: true },
    ]
  },
  {
    category: 'API & Integrations',
    items: [
      { name: 'Basic API access', free: false, pro: false, institutional: true },
      { name: 'Webhook integrations', free: false, pro: false, institutional: true },
      { name: 'Custom integrations', free: false, pro: false, institutional: true },
      { name: 'White-label solutions', free: false, pro: false, institutional: true },
      { name: 'Team collaboration tools', free: false, pro: false, institutional: true },
      { name: 'Advanced analytics API', free: false, pro: false, institutional: true },
    ]
  }
]

export default function PricingComparison() {
  return (
    <section className="py-20 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Feature <span className="text-[#00ffc3]">Comparison</span>
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Compare all features across our plans to find the perfect fit for your trading needs
          </p>
        </motion.div>

        <div className="bg-gray-700/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-4 gap-4 p-6 border-b border-gray-700 bg-gray-700/30">
            <div className="text-lg font-semibold text-white">Features</div>
            <div className="text-center">
              <div className="text-lg font-semibold text-white">Free</div>
              <div className="text-sm text-gray-400">$0/month</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-white">Pro</div>
              <div className="text-sm text-gray-400">$29/month</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-white">Institutional</div>
              <div className="text-sm text-gray-500">$99/month</div>
            </div>
          </div>

          {/* Feature Categories */}
          {features.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
            >
              {/* Category Header */}
              <div className="px-6 py-4 bg-gray-700/30 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-[#00ffc3]">{category.category}</h3>
              </div>

              {/* Feature Items */}
              {category.items.map((item, itemIndex) => (
                <div
                  key={item.name}
                  className={`grid grid-cols-4 gap-4 p-4 border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors ${
                    itemIndex % 2 === 0 ? 'bg-gray-800/20' : ''
                  }`}
                >
                  <div className="text-gray-00 text-sm">{item.name}</div>
                  <div className="text-center">
                    {item.free ? (
                      <Check className="h-5 w-5 text-[#00ffc3] mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-gray-600 mx-auto" />
                    )}
                  </div>
                  <div className="text-center">
                    {item.pro ? (
                      <Check className="h-5 w-5 text-[#00ffc3] mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-gray-600 mx-auto" />
                    )}
                  </div>
                  <div className="text-center">
                    {item.institutional ? (
                      <Check className="h-5 w-5 text-[#00ffc3] mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-gray-600 mx-auto" />
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
'use client'

import { X, Check } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ResearchComparison() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Before vs. After <span className="text-[#00FFC2]">AlphaChain</span>
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            See how our research terminal transforms your trading analysis
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Without AlphaChain */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="bg-red-900/20 border border-red-500/30 rounded-2xl p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <X className="h-6 w-6 text-red-400" color='red' />
              <h3 className="text-2xl font-bold text-white">Without AlphaChain</h3>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-3">
                <X className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" color='red' />
                <span className="text-gray-500">Hours spent collecting data from multiple sources</span>
              </div>
              <div className="flex items-start space-x-3">
                <X className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" color='red' />
                <span className="text-gray-500">Outdated or conflicting information</span>
              </div>
              <div className="flex items-start space-x-3">
                <X className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" color='red' />
                <span className="text-gray-500">Missing crucial whale movements</span>
              </div>
              <div className="flex items-start space-x-3">
                <X className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" color='red' />
                <span className="text-gray-500">Manual chart analysis and pattern recognition</span>
              </div>
              <div className="flex items-start space-x-3">
                <X className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" color='red' />
                <span className="text-gray-500">Emotional decision making without data backing</span>
              </div>
            </div>

            {/* Messy Chart Visualization */}
            <div className="bg-red-900/30 rounded-lg p-4 border border-red-500/20">
              <div className="text-sm text-gray-500 mb-2">Typical Trading Setup</div>
              <div className="h-32 bg-gray-50/50 rounded relative overflow-hidden">
                <div className="absolute inset-2 border border-red-400/50 rounded">
                  <div className="text-xs text-red-400 p-2">
                    Cluttered interface, unclear signals, no context
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* With AlphaChain */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="bg-[#00FFC2]/20 border border-[#00FFC2]/30 rounded-2xl p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Check className="h-6 w-6 text-[#00FFC2]" />
              <h3 className="text-2xl font-bold text-white">With AlphaChain</h3>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-3">
                <Check className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-gray-500">All data unified in one comprehensive dashboard</span>
              </div>
              <div className="flex items-start space-x-3">
                <Check className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-gray-500">Real-time, verified data from trusted sources</span>
              </div>
              <div className="flex items-start space-x-3">
                <Check className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-gray-500">Instant whale movement alerts and analysis</span>
              </div>
              <div className="flex items-start space-x-3">
                <Check className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-gray-500">AI-powered pattern recognition and trade setups</span>
              </div>
              <div className="flex items-start space-x-3">
                <Check className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-gray-500">Data-driven decisions with confidence scores</span>
              </div>
            </div>

            {/* Clean Chart Visualization */}
            <div className="bg-[#00FFC2]/20 rounded-lg p-4 border border-[#00FFC2]/30">
              <div className="text-sm text-gray-500 mb-2">AlphaChain Research Terminal</div>
              <div className="h-32 bg-gray-200/50 rounded relative overflow-hidden">
                <div className="absolute inset-2">
                  <div className="flex justify-between text-xs text-accent mb-2">
                    <span>BTC/USD</span>
                    <span>Entry: $44,200</span>
                  </div>
                  <svg className="w-full h-20" viewBox="0 0 200 60">
                    <polyline
                      points="0,50 20,45 40,40 60,35 80,30 100,25 120,20 140,25 160,30 180,35 200,30"
                      fill="none"
                      stroke="#00FFC2"
                      strokeWidth="2"
                    />
                    <circle cx="120" cy="20" r="3" fill="#00FFC2" />
                    <text x="125" y="15" fontSize="8" fill="#00FFC2">Entry</text>
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-16 text-center"
        >
          <div className="bg-gray-100/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-100 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">The Result?</h3>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-accent mb-2">5x</div>
                <div className="text-sm text-gray-400">Faster Analysis</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent mb-2">80%</div>
                <div className="text-sm text-gray-400">Better Accuracy</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent mb-2">90%</div>
                <div className="text-sm text-gray-400">Less Stress</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
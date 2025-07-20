'use client'

import { useState } from 'react'
import { TrendingUp, TrendingDown, BarChart } from 'lucide-react'
import { motion } from 'framer-motion'

const performanceData = {
  'Conservative': { btc: 85, sol: 78, meme: 65, roi: 2.1 },
  'Moderate': { btc: 92, sol: 87, meme: 70, roi: 4.2 },
  'Aggressive': { btc: 88, sol: 83, meme: 75, roi: 6.8 }
}

export default function SignalsPerformance() {
  const [riskLevel, setRiskLevel] = useState<'Conservative' | 'Moderate' | 'Aggressive'>('Moderate')

  const data = performanceData[riskLevel]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Performance <span className="text-[#00FFC2]">Dashboard</span>
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Real trading results from the last 30 days across different risk profiles
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Risk Level Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-white mb-4">Adjust Risk Profile</h3>
                <div className="flex justify-center space-x-4">
                {Object.keys(performanceData).map((level) => (
                  <button
                    key={level}
                    onClick={() => setRiskLevel(level as any)}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                      riskLevel === level
                        ? 'bg-accent text-primary'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Performance Metrics */}
          <motion.div
            key={riskLevel}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 gap-8 mb-12"
          >
            {/* Win Rates */}
            <div className="bg-gray-100/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-100">
              <h4 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-[#00FFC2]" />
                <span>30-Day Win Rates</span>
              </h4>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Bitcoin (BTC)</span>
                  <span className="text-2xl font-bold text-[#00FFC2]">{data.btc}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className="bg-[#00FFC2] h-2 rounded-full transition-all duration-1000" 
                    style={{ width: `${data.btc}%` }}
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Solana (SOL)</span>
                  <span className="text-2xl font-bold text-accent">{data.sol}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className="bg-accent h-2 rounded-full transition-all duration-1000" 
                    style={{ width: `${data.sol}%` }}
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">MEME Coins</span>
                  <span className="text-2xl font-bold text-accent">{data.meme}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-accent h-2 rounded-full transition-all duration-1000" 
                    style={{ width: `${data.meme}%` }}
                  />
                </div>
              </div>
            </div>

            {/* ROI Metrics */}
            <div className="bg-gray-100/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-100">
              <h4 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                <BarChart className="h-5 w-5 text-[#00FFC2]" />
                <span>Average ROI</span>
              </h4>

              <div className="text-center">
                <div className="text-6xl font-bold text-[#00FFC2] mb-4">
                  {data.roi}x
                </div>
                <div className="text-gray-400 mb-6">Return on Investment</div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-gray-200/30 rounded-lg p-3">
                    <span className="text-gray-400">Best Performer</span>
                    <span className="text-[#00FFC2] font-semibold">+{(data.roi * 2.5).toFixed(1)}x</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-200/30 rounded-lg p-3">
                    <span className="text-gray-300">Worst Performer</span>
                    <span className="text-red-400 font-semibold">-0.8x</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-200/30 rounded-lg p-3">
                    <span className="text-gray-300">Total Signals</span>
                    <span className="text-white font-semibold">247</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Performance Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-gray-100/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-100"
          >
            <h4 className="text-xl font-semibold text-white mb-6">Portfolio Performance (30 Days)</h4>
            
            <div className="relative">
              <svg className="w-full h-64" viewBox="0 0 400 200">
                <defs>
                  <linearGradient id="portfolioGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#00FFC2" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#00FFC2" stopOpacity="0" />
                  </linearGradient>
                </defs>
                
                {/* Grid Lines */}
                {[0, 1, 2, 3, 4].map(i => (
                  <line
                    key={i}
                    x1="0"
                    y1={i * 40}
                    x2="400"
                    y2={i * 40}
                    stroke="#374151"
                    strokeWidth="1"
                    opacity="0.3"
                  />
                ))}
                
                {/* Performance Line */}
                <polyline
                  points="0,160 50,150 100,140 150,120 200,100 250,80 300,70 350,60 400,50"
                  fill="url(#portfolioGradient)"
                  stroke="#00FFC2"
                  strokeWidth="3"
                />
                
                {/* Data Points */}
                <circle cx="400" cy="50" r="4" fill="#00FFC2" />
              </svg>
              
              <div className="flex justify-between text-sm text-gray-400 mt-4">
                <span>Day 1</span>
                <span>Day 15</span>
                <span>Day 30</span>
              </div>
              
              <div className="absolute top-4 right-4 bg-[#00FFC2]/20 text-[#00FFC2] px-3 py-1 rounded-lg text-sm font-semibold">
                +{((data.roi - 1) * 100).toFixed(0)}% Total Return
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
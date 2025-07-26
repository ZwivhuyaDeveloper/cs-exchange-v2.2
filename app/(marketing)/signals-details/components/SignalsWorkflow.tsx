'use client'

import { Bot, Users, Smartphone, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

const steps = [
  {
    step: 1,
    icon: Bot,
    title: 'AI Detects Opportunities',
    description: 'Our advanced algorithms scan market data, identify patterns, and detect profitable trading opportunities across 500+ cryptocurrencies.',
    features: ['Pattern Recognition', 'Volume Analysis', 'Price Action', 'Market Sentiment']
  },
  {
    step: 2,
    icon: Users,
    title: 'Human Analysts Verify',
    description: 'Every AI signal is reviewed and verified by our team of 8+ expert analysts before being sent to ensure maximum accuracy.',
    features: ['Expert Review', 'Risk Assessment', 'Market Context', 'Entry/Exit Points']
  },
  {
    step: 3,
    icon: Smartphone,
    title: 'Instant Delivery',
    description: 'Verified signals are instantly delivered to your preferred channels with detailed analysis and clear action items.',
    features: ['Telegram Bot', 'Email Alerts', 'SMS Notifications', 'Mobile App']
  }
]

export default function SignalsWorkflow() {
  return (
    <section className="py-20 bg-gradient-to-b from-[#0A0E17] to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Signal <span className="text-[#00FFC2]">Workflow</span>
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            From market detection to your device in under 30 seconds
          </p>
        </motion.div>

        <div className="space-y-20">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isEven = index % 2 === 0

            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}
              >
                {/* Content */}
                <div className="flex-1 space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-[#00FFC2]/20 text-[#00FFC2] rounded-full font-bold text-lg">
                      {step.step}
                    </div>
                    <div className="p-3 bg-gradient-to-br from-[#00FFC2] to-[#3A86FF] rounded-xl">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold text-white">
                    {step.title}
                  </h3>

                  <p className="text-lg text-gray-400 leading-relaxed">
                    {step.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    {step.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-2 bg-gray-100/50 rounded-lg px-3 py-2 border border-gray-100"
                      >
                        <CheckCircle className="h-4 w-4 text-[#00FFC2] flex-shrink-0" />
                        <span className="text-sm text-gray-500">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual */}
                <div className="flex-1">
                  <div className="bg-gray-100/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-100">
                    {step.step === 1 && (
                      <div className="space-y-6">
                        <div className="text-center mb-4">
                          <h4 className="text-lg font-semibold text-white mb-2">ETH/USD Chart Analysis</h4>
                        </div>
                        <div className="bg-gray-200/30 rounded-lg p-4 relative">
                          <svg className="w-full h-32" viewBox="0 0 300 100">
                            <polyline
                              points="0,80 30,75 60,70 90,60 120,50 150,45 180,40 210,35 240,30 270,25 300,20"
                              fill="none"
                              stroke="#00FFC2"
                              strokeWidth="2"
                            />
                            <circle cx="180" cy="40" r="4" fill="#3A86FF" />
                            <circle cx="210" cy="35" r="4" fill="#3A86FF" />
                            <text x="185" y="30" fontSize="10" fill="#3A86FF">Entry</text>
                            <text x="215" y="25" fontSize="10" fill="#3A86FF">Exit</text>
                          </svg>
                          <div className="absolute top-2 right-2 bg-[#00FFC2]/20 text-[#00FFC2] px-2 py-1 rounded text-xs">
                            +15% Potential
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-[#00FFC2] font-semibold">Pattern Detected: Bullish Breakout</div>
                          <div className="text-sm text-gray-500">Confidence: 92%</div>
                        </div>
                      </div>
                    )}

                    {step.step === 2 && (
                      <div className="space-y-4">
                        <div className="text-center mb-4">
                          <h4 className="text-lg font-semibold text-white">Analyst Verification</h4>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between bg-gray-200/30 rounded-lg p-3">
                            <span className="text-sm text-gray-300">Technical Analysis</span>
                            <CheckCircle className="h-5 w-5 text-[#00FFC2]" />
                          </div>
                          <div className="flex items-center justify-between bg-gray-200/30 rounded-lg p-3">
                            <span className="text-sm text-gray-300">Risk Assessment</span>
                            <CheckCircle className="h-5 w-5 text-[#00FFC2]" />
                          </div>
                          <div className="flex items-center justify-between bg-gray-200/30 rounded-lg p-3">
                            <span className="text-sm text-gray-300">Market Conditions</span>
                            <CheckCircle className="h-5 w-5 text-[#00FFC2]" />
                          </div>
                          <div className="flex items-center justify-between bg-gray-200/30 rounded-lg p-3">
                            <span className="text-sm text-gray-300">Entry/Exit Strategy</span>
                            <CheckCircle className="h-5 w-5 text-[#00FFC2]" />
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="bg-[#00FFC2]/20 text-[#00FFC2] px-4 py-2 rounded-lg font-semibold">
                            ✓ Verified by 8+ Experts
                          </div>
                        </div>
                      </div>
                    )}

                    {step.step === 3 && (
                      <div className="space-y-4">
                        <div className="text-center mb-4">
                          <h4 className="text-lg font-semibold text-white">Signal Delivery</h4>
                        </div>
                        <div className="bg-gray-200/30 rounded-lg p-4 border-l-4 border-[#00FFC2]">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-2 h-2 bg-[#00FFC2] rounded-full animate-pulse" />
                            <span className="font-semibold text-white">NEW SIGNAL</span>
                          </div>
                          <div className="text-sm text-gray-300 mb-2">
                            <strong className="text-[#00FFC2]">ETH/USD</strong> - Long Position
                          </div>
                          <div className="text-xs text-gray-400 space-y-1">
                            <div>Entry: $2,850 - $2,870</div>
                            <div>Target: $3,200 (+15%)</div>
                            <div>Stop Loss: $2,750</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-gray-200/30 rounded-lg p-2 text-center">
                            <div className="text-xs text-[#00FFC2]">Telegram</div>
                            <div className="text-xs text-gray-400">Sent</div>
                          </div>
                          <div className="bg-gray-200/30 rounded-lg p-2 text-center">
                            <div className="text-xs text-[#00FFC2] ">Email</div>
                            <div className="text-xs text-gray-400">Sent</div>
                          </div>
                        </div>
                      </div>
                    )}
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
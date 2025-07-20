'use client'

import { Search, Brain, Smartphone, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

const steps = [
  {
    step: 1,
    icon: Search,
    title: 'AI Scans 200+ Sources',
    description: 'Our AI continuously monitors exchanges, social media, news outlets, and regulatory announcements',
    sources: ['CoinDesk', 'Twitter/X', 'Reddit', 'Exchanges', 'SEC Filings', 'Telegram']
  },
  {
    step: 2,
    icon: Brain,
    title: 'Sentiment Analysis',
    description: 'Advanced NLP algorithms analyze sentiment and assign bullish/bearish scores to each article',
    features: ['Sentiment Scoring', 'Impact Rating', 'Credibility Check', 'Market Correlation']
  },
  {
    step: 3,
    icon: Smartphone,
    title: 'Instant Push Alerts',
    description: 'Breaking news delivered instantly to your preferred devices with customizable filters',
    channels: ['Mobile App', 'Email', 'Telegram', 'SMS', 'Slack', 'Discord']
  }
]

export default function NewsFeatures() {
  return (
    <section className="py-20 bg-gradient-to-b from-[#0A0E17] to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How It <span className="text-accent">Works</span>
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            From raw data to actionable insights in seconds
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
                    <div className="p-3 bg-gradient-to-br from-[#00FFC2] to-[#00FFC2]/80 rounded-xl">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold text-white">
                    {step.title}
                  </h3>

                  <p className="text-lg text-gray-500 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Features/Sources Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {(step.sources || step.features || step.channels)?.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-100/50 rounded-lg px-3 py-2 text-center text-sm text-gray-500 border border-gray-100"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual */}
                <div className="flex-1">
                  <div className="relative">
                    <div className="bg-gray-100/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-100">
                      {step.step === 1 && (
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3 animate-pulse">
                            <div className="w-2 h-2 bg-accent rounded-full" />
                            <div className="text-sm text-gray-500">Scanning CoinDesk...</div>
                          </div>
                          <div className="flex items-center space-x-3 animate-pulse delay-100">
                            <div className="w-2 h-2 bg-secondary rounded-full" />
                            <div className="text-sm text-gray-500">Monitoring Twitter feeds...</div>
                          </div>
                          <div className="flex items-center space-x-3 animate-pulse delay-200">
                            <div className="w-2 h-2 bg-accent rounded-full" />
                            <div className="text-sm text-gray-500">Checking exchange announcements...</div>
                          </div>
                          <div className="mt-6 text-center">
                            <div className="text-2xl font-bold text-accent">200+</div>
                            <div className="text-sm text-gray-500">Sources Monitored</div>
                          </div>
                        </div>
                      )}

                      {step.step === 2 && (
                        <div className="space-y-6">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-500">Market Impact</span>
                              <span className="text-accent font-semibold">High</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div className="bg-accent h-2 rounded-full w-4/5"></div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-500">Sentiment</span>
                              <span className="text-accent font-semibold">Bullish</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div className="bg-accent h-2 rounded-full w-3/4"></div>
                            </div>
                          </div>
                          <div className="text-center mt-6">
                            <div className="text-2xl font-bold text-accent">95%</div>
                            <div className="text-sm text-gray-500">Accuracy Rate</div>
                          </div>
                        </div>
                      )}

                      {step.step === 3 && (
                        <div className="space-y-4">
                          <div className="bg-gray-50/30 rounded-lg p-4 border-l-4 border-accent">
                            <div className="flex items-center space-x-2 mb-2">
                              <Zap className="h-4 w-4 text-accent" />
                              <span className="text-sm font-semibold text-white">Breaking News</span>
                            </div>
                            <p className="text-sm text-gray-400">Bitcoin ETF approval rumors send BTC +5%</p>
                            <div className="text-xs text-gray-500 mt-2">Sent 23 seconds ago</div>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="bg-gray-50/30 rounded-lg p-2">
                              <div className="text-xs text-accent">Mobile</div>
                            </div>
                            <div className="bg-gray-50/30 rounded-lg p-2">
                              <div className="text-xs text-accent">Email</div>
                            </div>
                            <div className="bg-gray-50/30 rounded-lg p-2">
                              <div className="text-xs text-accent">Telegram</div>
                            </div>
                          </div>
                        </div>
                      )}
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
'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Crypto Fund Manager',
    content: 'AlphaChain\'s signals helped me achieve 300% returns this quarter. The accuracy is unmatched.',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=100&h=100&fit=crop'
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Day Trader',
    content: 'The real-time news alerts saved me from the last market crash. Worth every penny.',
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=100&h=100&fit=crop'
  },
  {
    name: 'Emily Foster',
    role: 'Institutional Investor',
    content: 'Research terminal is like having a Bloomberg for crypto. Game-changing insights.',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100&h=100&fit=crop'
  }
]

const signals = [
  { coin: 'BTC', change: '+12%', type: 'buy', time: '2 mins ago' },
  { coin: 'ETH', change: '+8%', type: 'buy', time: '5 mins ago' },
  { coin: 'SOL', change: '+15%', type: 'buy', time: '8 mins ago' },
  { coin: 'ADA', change: '-3%', type: 'sell', time: '12 mins ago' },
  { coin: 'DOT', change: '+22%', type: 'buy', time: '15 mins ago' },
]

export default function SocialProof() {
  const [currentSignal, setCurrentSignal] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSignal((prev) => (prev + 1) % signals.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-20 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Signal Success Ticker */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Live Signal Success</h2>
              <p className="text-gray-500">Real-time performance from AlphaChain traders</p>
            </div>
            
            <div className="relative overflow-hidden h-16">
              <motion.div
                key={currentSignal}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="flex items-center space-x-4 bg-gray-700/50 px-6 py-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    {signals[currentSignal].type === 'buy' ? (
                      <TrendingUp className="h-5 w-5 text-accent" />
                    ) :  (
                      <TrendingDown className="h-5 w-5 text-red-400" />
                    )}
                    <span className="font-mono text-lg font-bold text-white">
                      {signals[currentSignal].coin}
                    </span>
                  </div>
                  <span className={`font-mono text-lg font-bold ${
                    signals[currentSignal].type === 'buy' ? 'text-[#00FFC2]' : 'text-red-400'
                  }`}>
                    {signals[currentSignal].change}
                  </span>
                  <span className="text-sm text-gray-500">
                    {signals[currentSignal].time}
                  </span>
                  <span className="text-sm text-[#00FFC2] font-semibold">
                    via AlphaChain
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by <span className="text-[#00FFC2]">50,000+</span> Traders
          </h2>
          <p className="text-xl text-gray-400">
            Join the community that&apos;s redefining crypto trading
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative w-12 h-12">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-white">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-500 italic">&ldquo;{testimonial.content}&rdquo;</p>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          <div>
            <div className="text-3xl font-bold text-[#00FFC2] mb-2">5,000+</div>
            <div className="text-gray-400">Hours Saved Weekly</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#00FFC2] mb-2">99.9%</div>
            <div className="text-gray-400">Uptime</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#00FFC2] mb-2">$500M+</div>
            <div className="text-gray-400">Protected Assets</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#00FFC2] mb-2">24/7</div>
            <div className="text-gray-400">Support</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
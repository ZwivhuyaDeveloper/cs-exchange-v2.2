'use client'

import Link from 'next/link'
import { Star, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'

const testimonials = [
  {
    name: 'Alex Thompson',
    role: 'Day Trader',
    content: 'The trading bot has been running for 3 months and generated 45% returns. The risk management features saved me from major losses during the last crash.',
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=80&h=80&fit=crop',
    results: '+45% in 3 months',
    rating: 5
  },
  {
    name: 'Maria Rodriguez',
    role: 'Crypto Investor',
    content: 'Finally, a trading bot that actually works! The AI adapts to market conditions and the backtesting feature helped me optimize my strategy before going live.',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=80&h=80&fit=crop',
    results: '87% win rate',
    rating: 5
  },
  {
    name: 'David Chen',
    role: 'Portfolio Manager',
    content: 'We use AlphaChain bots for our institutional clients. The performance and reliability are exceptional. Best trading automation platform we\'ve used.',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=80&h=80&fit=crop',
    results: '$2.5M managed',
    rating: 5
  }
]

export default function TradingTestimonials() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-[#0A0E17]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by <span className="text-accent">Professional Traders</span>
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            See how our trading bots are helping traders achieve consistent profits
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-gray-100/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-100"
            >
              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-accent fill-current" />
                ))}
              </div>

              {/* Content */}
              <blockquote className="text-gray-400 mb-6 italic">
                &ldquo;{testimonial.content}&rdquo;
              </blockquote>

              {/* Results */}
              <div className="bg-[#00FFC2]/10 border border-[#00FFC2]/20 rounded-lg p-3 mb-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-[#00FFC2]" />
                  <span className="text-[#00FFC2] font-semibold">{testimonial.results}</span>
                </div>
              </div>

              {/* Author */}
              <div className="flex items-center space-x-3">
                <div className="relative w-10 h-10">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="rounded-full object-cover"
                    sizes="40px"
                  />
                </div>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mb-12"
        >
          <div>
            <div className="text-3xl font-bold text-accent mb-2">$50M+</div>
            <div className="text-gray-400">Trading Volume</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-accent mb-2">85%</div>
            <div className="text-gray-400">Average Win Rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-accent mb-2">2,500+</div>
            <div className="text-gray-400">Active Bots</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-accent mb-2">24/7</div>
            <div className="text-gray-400">Uptime</div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Link
            href="/trial"
            className="inline-block bg-accent hover:bg-accent-hover text-primary px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 glow-effect"
          >
            Start Your Trading Bot
          </Link>
          <p className="text-sm text-gray-400 mt-4">
            7-day free trial • No trading fees for first month
          </p>
        </motion.div>
      </div>
    </section>
  )
}
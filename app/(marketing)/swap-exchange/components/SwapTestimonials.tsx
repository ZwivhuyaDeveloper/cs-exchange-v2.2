'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Star, TrendingUp, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

const testimonials = [
  {
    name: 'Alex Chen',
    role: 'DeFi Trader',
    content: 'AlphaChain Swap consistently gives me the best rates. Saved over $2,000 in slippage and fees in just 3 months.',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=80&h=80&fit=crop',
    results: '$2,000 saved',
    rating: 5
  },
  {
    name: 'Maria Rodriguez',
    role: 'Crypto Investor',
    content: 'The speed is incredible! Swaps execute in seconds, not minutes. Perfect for catching market opportunities.',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=80&h=80&fit=crop',
    results: '2-second swaps',
    rating: 5
  },
  {
    name: 'David Kim',
    role: 'Portfolio Manager',
    content: 'Security and transparency are top-notch. Non-custodial swaps give me peace of mind when managing client funds.',
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=80&h=80&fit=crop',
    results: '$500K managed',
    rating: 5
  }
]

export default function SwapTestimonials() {
  return (
    <section className="py-20 bg-[#0A0E17]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by <span className="text-[#00FFC2]">DeFi Traders</span>
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Join thousands of traders who save money and time with AlphaChain Swap
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
                  <Star key={i} className="h-4 w-4 text-[#00FFC2] fill-current" />
                ))}
              </div>

              {/* Content */}
              <blockquote className="text-gray-500 mb-6 italic">
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
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
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
            <div className="text-gray-500">Daily Volume</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-accent mb-2">100K+</div>
            <div className="text-gray-500">Active Users</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-accent mb-2">10M+</div>
            <div className="text-gray-500">Swaps Completed</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-accent mb-2">99.9%</div>
            <div className="text-gray-500">Success Rate</div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to Start <span className="text-[#00FFC2]">Swapping</span>?
          </h3>
          <p className="text-gray-500 mb-8 max-w-2xl mx-auto">
            Join the revolution in token swapping. Experience the fastest, most secure, and cost-effective way to trade tokens.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              href="/trial"
              className="bg-[#00FFC2] hover:bg-[#00FFC2]/80 text-[#0A0E17] px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 glow-effect flex items-center space-x-2"
            >
              <Zap className="h-5 w-5" color='black' />
              <span className='text-black'>Start Swapping Now</span>
            </Link>
            <div className="text-sm text-gray-50">
              <div>✓ No registration required</div>
              <div>✓ Connect any wallet</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
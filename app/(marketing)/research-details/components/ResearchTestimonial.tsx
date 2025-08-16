'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Star, Building2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ResearchTestimonial() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-[#0A0E17]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Stars */}
          <div className="flex justify-center space-x-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-6 w-6 text-[#00FFC2] fill-current" />
            ))}
          </div>

          {/* Quote */}
          <blockquote className="text-2xl md:text-3xl font-bold text-white mb-8 leading-relaxed">
            &ldquo;Found <span className="text-[#00FFC2]">3x gems</span> using their on-chain research. The fundamental analysis and whale tracking saved our fund millions in potential losses.&rdquo;
          </blockquote>

          {/* Attribution */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="relative w-16 h-16">
              <Image
                src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=80&h=80&fit=crop"
                alt="Sarah Chen"
                fill
                className="rounded-full object-cover"
                sizes="64px"
              />
            </div>
            <div className="text-left">
              <div className="font-semibold text-white text-lg">Sarah Chen</div>
              <div className="text-gray-400">Senior Portfolio Manager</div>
              <div className="flex items-center space-x-2 mt-1">
                <Building2 className="h-4 w-4 text-[#00FFC2]" />
                <span className="text-sm text-[#00FFC2]">Crypto Capital Partners</span>
              </div>
            </div>
          </div>

          {/* Company Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="inline-flex items-center space-x-2 bg-gray-100/50 px-6 py-3 rounded-full border border-gray-100">
              <Building2 className="h-5 w-5 text-[#00FFC2]" />
              <span className="text-lg font-semibold text-white">Crypto Capital Partners</span>
              <span className="text-sm text-gray-400">• $500M AUM</span>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          >
            <div className="bg-gray-100/50 backdrop-blur-sm rounded-xl p-6 border border-gray-100">
              <div className="text-3xl font-bold text-accent mb-2">$2.5M</div>
              <div className="text-gray-400">Losses Prevented</div>
            </div>
            <div className="bg-gray-100/50 backdrop-blur-sm rounded-xl p-6 border border-gray-100">
              <div className="text-3xl font-bold text-accent mb-2">3x</div>
              <div className="text-gray-400">Hidden Gems Found</div>
            </div>
            <div className="bg-gray-100/50 backdrop-blur-sm rounded-xl p-6 border border-gray-100">
              <div className="text-3xl font-bold text-accent mb-2">150%</div>
              <div className="text-gray-400">Portfolio Outperformance</div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <Link
              href="/trial"
              className="inline-block bg-accent hover:bg-accent-hover text-primary px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 glow-effect"
            >
              Unlock Advanced Research
            </Link>
            <p className="text-sm text-gray-400 mt-4">
              Join 500+ institutional investors • 7-day free trial
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
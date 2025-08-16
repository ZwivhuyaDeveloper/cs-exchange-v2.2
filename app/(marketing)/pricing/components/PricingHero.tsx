'use client'

import { AuroraBackground } from '@/components/ui/aurora-background'
import { motion } from 'framer-motion'
import { Check, Star } from 'lucide-react'

export default function PricingHero() {
  return (
    <section className="relative py-20 overflow-hidden ">
      {/* Background Elements */}
      <div className="absolute inset-0 ">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-[#0A0E17]/50 to-[#0A0E17]/100" />
        <AuroraBackground className="absolute inset-0">
          {null}
        </AuroraBackground>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="text-center">
          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 inline-flex items-center space-x-2 bg-gray-300/50 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-300"
          >
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-[#00FFC2] fill-current" />
              ))}
            </div>
            <span className="text-sm text-gray-500">Trusted by 50,000+ traders</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            <span className="text-white">Choose Your</span>
            <br />
            <span className="bg-gradient-to-r from-[#00ffc3] to-[#3a86ff] bg-clip-text text-transparent">
              Trading Edge
            </span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-500 mb-12 max-w-3xl mx-auto"
          >
            Start free and scale as you grow. All plans include our 7-day money-back guarantee and 24/7 support.
          </motion.p>

          {/* Value Props */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center items-center space-x-8 mb-12 text-sm text-gray-500"
          >
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-accent" />
              <span>No setup fees</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-accent" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-accent" />
              <span>7-day free trial</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-accent" />
              <span>Money-back guarantee</span>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">50K+</div>
              <div className="text-sm text-gray-400">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">90%</div>
              <div className="text-sm text-gray-400">Signal Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">$2.5B+</div>
              <div className="text-sm text-gray-400">Trading Volume</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">24/7</div>
              <div className="text-sm text-gray-400">Support</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
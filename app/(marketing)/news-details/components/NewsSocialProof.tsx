'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Clock, Users, Trophy } from 'lucide-react'
import { motion } from 'framer-motion'

export default function NewsSocialProof() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Join <span className="text-accent">5,000+ Traders</span> Saving Time
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Don&apos;t spend hours scrolling through crypto Twitter and news sites
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center"
          >
            <div className="inline-flex p-4 bg-[#00FFC2]/20 rounded-full mb-4">
              <Clock className="h-8 w-8 text-[#00FFC2]" color='#00FFC2' />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">10+ Hours Saved</h3>
            <p className="text-gray-500">Per week on average, according to user surveys</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="inline-flex p-4 bg-[#00FFC2]/20 rounded-full mb-4">
              <Users className="h-8 w-8 text-[#00FFC2]" color='#00FFC2' />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">5,000+ Traders</h3>
            <p className="text-gray-500">Active users relying on our news dashboard daily</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <div className="inline-flex p-4 bg-[#00FFC2]/20 rounded-full mb-4">
              <Trophy className="h-8 w-8 text-[#00FFC2]" color='#00FFC2' />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">95% Accuracy</h3>
            <p className="text-gray-500">Market impact predictions verified by outcomes</p>
          </motion.div>
        </div>

        {/* Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <div className="bg-gray-100/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-100">
            <p className="text-xl text-gray-400 italic mb-6">
              &ldquo;AlphaChain&apos;s news dashboard is a game-changer. I used to spend hours every morning catching up on crypto news. Now I get the most important updates delivered instantly with clear sentiment analysis. It&apos;s like having a research team working 24/7.&rdquo;
            </p>
            <div className="flex items-center justify-center space-x-4">
              <div className="relative w-12 h-12">
                <Image
                  src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=60&h=60&fit=crop"
                  alt="Marcus Rodriguez"
                  fill
                  className="rounded-full object-cover"
                  sizes="48px"
                />
              </div>
              <div>
                <div className="font-semibold text-white">Marcus Rodriguez</div>
                <div className="text-sm text-gray-400">Professional Day Trader</div>
              </div>
            </div>
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
            className="inline-block bg-[#00FFC2] hover:bg-[#00FFC2]/80 text-primary px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 glow-effect"
          >
            Get Real-Time Alerts Now
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            7-day free trial • No credit card required
          </p>
        </motion.div>
      </div>
    </section>
  )
}
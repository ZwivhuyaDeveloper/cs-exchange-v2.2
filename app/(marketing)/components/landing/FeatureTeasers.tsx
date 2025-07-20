'use client'

import Link from 'next/link'
import { Newspaper, BarChart, Zap, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { IconExchange } from '@tabler/icons-react'

const features = [
  {
    icon: IconExchange,
    title: 'Trading Dashboard',
    description: 'Lightning fast gasless swaps with lows fees, crypto aggregation from 200+ token with real-time price trackers.',
    href: '/news',
    color: 'from-orange-500 to-yellow-500',
    stats: '500 tokens added weekly'
  },
  {
    icon: Newspaper,
    title: 'News Dashboard',
    description: 'AI-powered crypto news aggregation from 200+ sources with real-time sentiment analysis.',
    href: '/news',
    color: 'from-blue-500 to-cyan-500',
    stats: '10K+ articles daily'
  },
  {
    icon: BarChart,
    title: 'Research Terminal',
    description: 'Institutional-grade analysis with technical indicators, fundamental reports, and whale tracking.',
    href: '/research',
    color: 'from-purple-500 to-pink-500',
    stats: '500+ coins analyzed'
  },
  {
    icon: Zap,
    title: 'Trading Signals',
    description: 'High-accuracy trade alerts verified by expert analysts and delivered instantly to your devices.',
    href: '/signals',
    color: 'from-[#00FFC2] to-[#3A86FF]',
    stats: '90% win rate'
  }
]

export default function FeatureTeasers() {
  return (
    <section className="py-20 bg-gradient-to-b from-[#0A0E17] to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Everything You Need to
            <span className="bg-gradient-to-r from-[#00FFC2] to-[#3A86FF] bg-clip-text text-transparent"> Dominate Crypto</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Comprehensive tools and insights to give you the edge in cryptocurrency trading
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="group "
              >
                <Link href={feature.href}>
                  <div className="relative bg-gray-100/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-100 hover:border-[#00FFC2]/50 transition-all duration-300 h-full">
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
                    
                    {/* Icon */}
                    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>

                    {/* Stats Badge */}
                    <div className="absolute top-4 right-4 bg-[#00FFC2]/20 text-[#00FFC2] px-3 py-1 rounded-full text-sm font-mono">
                      {feature.stats}
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#00FFC2] transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 mb-6 leading-relaxed">
                      {feature.description}
                    </p>

                    {/* CTA */}
                    <div className="flex items-center text-accent group-hover:text-white transition-colors">
                      <span className="font-semibold">Explore Feature</span>
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Integration Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-20 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-8">Trusted by Leading Exchanges</h3>
          <div className="flex justify-center items-center space-x-12 opacity-60">
            <div className="text-xl font-bold text-gray-400">Binance</div>
            <div className="text-xl font-bold text-gray-400">Coinbase</div>
            <div className="text-xl font-bold text-gray-400">Kraken</div>
            <div className="text-xl font-bold text-gray-400">FTX</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
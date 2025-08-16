'use client'

import { FileText, Code, BookOpen, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { Tourney } from 'next/font/google'
import { AuroraBackground } from '@/components/ui/aurora-background'

const tourney = Tourney({
  subsets: ['latin'],
  weight: ['400', '700'],
})

export default function DocsComingSoon() {
  return (
    <section className="py-20 min-h-screen flex items-center justify-center">
      {/* Background Elements */}
      <div className="absolute inset-0 ">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-[#0A0E17]/50 to-[#0A0E17]/100" />
        <AuroraBackground className="absolute inset-0">
          {null}
        </AuroraBackground>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-[#00FFC2] to-[#3A86FF] rounded-full flex items-center justify-center mx-auto mb-8">
            <FileText className="h-12 w-12 text-white" color='black' />
          </div>

          <h1 className={`${tourney.className} text-4xl md:text-6xl font-bold text-white mb-6`}>
            Documentation <span className="text-accent">Coming Soon</span>
          </h1>
          
          <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
            We&apos;re working hard to bring you comprehensive API documentation, integration guides, and developer resources.
          </p>
        </motion.div>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-8 mb-12"
        >
          <div className="bg-gray-100/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-100">
            <Code className="h-8 w-8 text-accent mb-4 mx-auto" color='#00FFC2' />
            <h3 className="text-lg font-semibold text-white mb-2">API Reference</h3>
            <p className="text-gray-400 text-sm">Complete REST API documentation with examples and SDKs</p>
          </div>
          
          <div className="bg-gray-100/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-100">
            <BookOpen className="h-8 w-8 text-accent mb-4 mx-auto" color='#00FFC2' />
            <h3 className="text-lg font-semibold text-white mb-2">Integration Guides</h3>
            <p className="text-gray-400 text-sm">Step-by-step tutorials for popular platforms and frameworks</p>
          </div>
          
          <div className="bg-gray-100/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-100">
            <Zap className="h-8 w-8 text-accent mb-4 mx-auto" color='#00FFC2' />
            <h3 className="text-lg font-semibold text-white mb-2">Quick Start</h3>
            <p className="text-gray-400 text-sm">Get up and running with AlphaChain in minutes</p>
          </div>
        </motion.div>

        {/* Notification Signup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-100/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-100 max-w-2xl mx-auto"
        >
          <h3 className="text-2xl font-bold text-white mb-4">Get Notified When Docs Launch</h3>
          <p className="text-gray-500 mb-6">
            Be the first to know when our comprehensive documentation goes live
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-white focus:border-[#00FFC2] focus:outline-none"
            />
            <button className="bg-accent hover:bg-[#00FFC2] text-[#0A0E17] px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap">
              Notify Me
            </button>
          </div>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <p className="text-gray-400 mb-4">
            Need help in the meantime? Our support team is here to assist you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a
              href="mailto:support@alphachain.com"
              className="text-[#00FFC2] hover:text-[#00FFC2]/80 transition-colors"
            >
              support@alphachain.com
            </a>
            <span className="hidden sm:block text-gray-600">•</span>
            <a
              href="/contact"
              className="text-accent hover:text-accent-hover transition-colors"
            >
              Contact Support
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
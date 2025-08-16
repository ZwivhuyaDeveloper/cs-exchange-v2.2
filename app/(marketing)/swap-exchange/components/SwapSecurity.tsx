'use client'

import { Shield, Lock, Eye, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function SwapSecurity() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-950 to-[#0A0E17]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Security <span className="text-[#00FFC2]">First</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Your funds and privacy are protected by enterprise-grade security measures
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Security Features */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-[#00FFC2]/20 rounded-xl">
                <Shield className="h-6 w-6 text-[#00FFC2]" color='#00FFC2' />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Non-Custodial</h3>
                <p className="text-gray-400 leading-relaxed">
                  Your tokens never leave your wallet. We never have access to your funds, ensuring complete control and ownership.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-3 bg-[#00FFC2]/20 rounded-xl">
                <Lock className="h-6 w-6 text-[#00FFC2]" color='#00FFC2' />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Audited Smart Contracts</h3>
                <p className="text-gray-400 leading-relaxed">
                  All smart contracts are audited by leading security firms including CertiK, Quantstamp, and Trail of Bits.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-3 bg-[#00FFC2]/20 rounded-xl">
                <Eye className="h-6 w-6 text-[#00FFC2]" color='#00FFC2' />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Privacy Protected</h3>
                <p className="text-gray-500 leading-relaxed">
                  No KYC required, no personal data collected. Your trading activity remains completely private and anonymous.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-3 bg-[#00FFC2]/20 rounded-xl">
                <CheckCircle className="h-6 w-6 text-[#00FFC2]" color='#00FFC2' />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">MEV Protection</h3>
                <p className="text-gray-500 leading-relaxed">
                  Advanced MEV protection prevents front-running and sandwich attacks, ensuring fair execution prices.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Security Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700"
          >
            <h3 className="text-2xl font-bold text-white mb-8 text-center">Security Metrics</h3>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center p-4 bg-gray-700/30 rounded-lg">
                <span className="text-gray-400">Funds Secured</span>
                <span className="text-2xl font-bold text-[#00FFC2]">$2.5B+</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gray-700/30 rounded-lg">
                <span className="text-gray-400">Security Audits</span>
                <span className="text-2xl font-bold text-[#00FFC2]">12</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gray-700/30 rounded-lg">
                <span className="text-gray-400">Uptime</span>
                <span className="text-2xl font-bold text-[#00FFC2]">99.99%</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gray-700/30 rounded-lg">
                <span className="text-gray-400">Successful Swaps</span>
                <span className="text-2xl font-bold text-[#00FFC2]">10M+</span>
              </div>
            </div>

            {/* Audit Badges */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-white mb-4 text-center">Audited By</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700/30 rounded-lg p-3 text-center">
                  <div className="font-semibold text-[#00FFC2]">CertiK</div>
                  <div className="text-xs text-gray-400">Smart Contract Audit</div>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3 text-center">
                  <div className="font-semibold text-[#00FFC2]">Quantstamp</div>
                  <div className="text-xs text-gray-400">Security Review</div>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3 text-center">
                  <div className="font-semibold text-[#00FFC2]">Trail of Bits</div>
                  <div className="text-xs text-gray-400">Code Assessment</div>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3 text-center">
                  <div className="font-semibold text-[#00FFC2]">OpenZeppelin</div>
                  <div className="text-xs text-gray-400">Security Analysis</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Security Promise */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-16 text-center"
        >
          <div className="bg-[#00FFC2]/10 border border-[#00FFC2]/20 rounded-2xl p-8 max-w-3xl mx-auto">
            <Shield className="h-12 w-12 text-[#00FFC2] mx-auto mb-4" color='#00FFC2' />
            <h3 className="text-2xl font-bold text-white mb-4">Our Security Promise</h3>
            <p className="text-gray-400 leading-relaxed">
              We&apos;ve secured over $2.5 billion in user funds with zero security incidents. Our commitment to security 
              means continuous monitoring, regular audits, and implementing the latest security best practices to 
              keep your assets safe.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
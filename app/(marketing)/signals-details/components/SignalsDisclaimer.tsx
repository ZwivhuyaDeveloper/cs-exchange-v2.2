'use client'

import Link from 'next/link'
import { AlertTriangle, Shield, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

export default function SignalsDisclaimer() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-[#0A0E17]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Risk Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="bg-yellow-200/10 border border-yellow-600/20 rounded-2xl p-8">
            <div className="flex items-start space-x-4">
              <AlertTriangle className="h-8 w-8 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">Important Risk Disclaimer</h3>
                <div className="space-y-3 text-gray-300">
                  <p>
                    <strong className="text-yellow-400">Past performance does not guarantee future results.</strong> All trading signals are for educational purposes only and should not be considered as financial advice.
                  </p>
                  <p>
                    Cryptocurrency trading involves substantial risk of loss and is not suitable for all investors. You should carefully consider your financial situation and risk tolerance before trading.
                  </p>
                  <p>
                    <strong className="text-white">Always Do Your Own Research (DYOR)</strong> and never invest more than you can afford to lose. AlphaChain Signals is not responsible for any trading losses.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Security & Trust */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 gap-8 mb-16"
        >
          <div className="bg-gray-100/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="h-6 w-6 text-[#00FFC2] " />
              <h3 className="text-xl font-bold text-white">Security First</h3>
            </div>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 bg-[#00FFC2] rounded-full mt-2 flex-shrink-0" />
                <span>256-bit SSL encryption for all data transmission</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 bg-[#00FFC2] rounded-full mt-2 flex-shrink-0" />
                <span>No access to your trading accounts or funds</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 bg-[#00FFC2] rounded-full mt-2 flex-shrink-0" />
                <span>SOC 2 Type II compliant infrastructure</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 bg-[#00FFC2] rounded-full mt-2 flex-shrink-0" />
                <span>Regular third-party security audits</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-100/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <Zap className="h-6 w-6 text-[#00FFC2]" />
              <h3 className="text-xl font-bold text-white">Regulatory Compliance</h3>
            </div>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 bg-[#00FFC2] rounded-full mt-2 flex-shrink-0" />
                <span>Registered financial technology company</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 bg-[#00FFC2] rounded-full mt-2 flex-shrink-0" />
                <span>GDPR and CCPA privacy compliant</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 bg-[#00FFC2] rounded-full mt-2 flex-shrink-0" />
                <span>Transparent fee structure and terms</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 bg-[#00FFC2] rounded-full mt-2 flex-shrink-0" />
                <span>Licensed to operate in 40+ jurisdictions</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start <span className="text-[#00FFC2]">Trading Smarter</span>?
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of traders who are already using our signals to improve their trading performance
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
            <Link
              href="/trial"
              className="bg-[#00FFC2] hover:bg-[#00FFC2]/80 text-primary px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 glow-effect"
            >
              Get Your First Signal Today
            </Link>
            <Link
              href="/contact"
              className="bg-gray-100 hover:bg-gray-200 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors border border-gray-200"
            >
              Talk to an Expert
            </Link>
          </div>

          <div className="text-sm text-gray-400 space-y-1">
            <div>✓ 7-day free trial • No credit card required</div>
            <div>✓ Cancel anytime • Full money-back guarantee</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
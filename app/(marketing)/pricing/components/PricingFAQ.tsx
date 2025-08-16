'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    question: 'Can I change plans at any time?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any billing adjustments.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and cryptocurrency payments (Bitcoin, Ethereum, USDC).'
  },
  {
    question: 'Is there a free trial for paid plans?',
    answer: 'Yes! Both Pro and Institutional plans come with a 7-day free trial. No credit card required to start, and you can cancel anytime during the trial period.'
  },
  {
    question: 'What happens if I cancel my subscription?',
    answer: 'You can cancel anytime with no penalties. You\'ll retain access to your plan features until the end of your current billing period. Your data is preserved for 30 days in case you want to reactivate.'
  },
  {
    question: 'Do you offer refunds?',
    answer: 'We offer a 7-day money-back guarantee on all paid plans. If you\'re not satisfied within the first 7 days, we\'ll provide a full refund, no questions asked.'
  },
  {
    question: 'How accurate are your trading signals?',
    answer: 'Our premium signals maintain a 90% accuracy rate based on 30-day rolling performance. All signals are verified by our team of 8+ expert analysts before being sent to users.'
  },
  {
    question: 'Can I use the API with the Pro plan?',
    answer: 'API access is only available with the Institutional plan. This includes full REST API, WebSocket feeds, and webhook integrations for automated trading systems.'
  },
  {
    question: 'Do you provide customer support?',
    answer: 'Yes! Free users get email support, Pro users get priority email support, and Institutional users get phone support plus a dedicated account manager.'
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. We use 256-bit SSL encryption, SOC 2 Type II compliance, and never store your exchange API keys or trading credentials. Your data is fully protected.'
  },
  {
    question: 'Can I get a custom enterprise solution?',
    answer: 'Yes! We offer custom solutions for hedge funds, trading firms, and large institutions. This includes white-label options, dedicated infrastructure, and custom integrations. Contact our sales team for details.'
  }
]

export default function PricingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-20 bg-[#0A0E17]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Frequently Asked <span className="text-[#00ffc3]">Questions</span>
          </h2>
          <p className="text-xl text-gray-400">
            Everything you need to know about our pricing and plans
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-700/30 transition-colors"
              >
                <span className="text-lg font-semibold text-white">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-[#00ffc3]" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-[#00ffc3]" />
                )}
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 text-gray-300 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-16 text-center"
        >
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-4">Still have questions?</h3>
            <p className="text-gray-400 mb-6">
              Our team is here to help you choose the right plan for your trading needs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <a
                href="mailto:support@alphachain.com"
                className="bg-[#00ffc3] hover:bg-[#00ffc3]/80 text-[#0A0E17] px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Email Support
              </a>
              <a
                href="/contact"
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Schedule a Call
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
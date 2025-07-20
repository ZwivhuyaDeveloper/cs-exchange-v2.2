'use client'

import Link from 'next/link'
import { Check, Zap, Crown, Building } from 'lucide-react'
import { motion } from 'framer-motion'

const plans = [
  {
    name: 'Free',
    price: 0,
    description: 'Perfect for getting started',
    icon: Zap,
    features: [
      'Basic crypto news',
      'Community signals',
      'Email alerts',
      'Basic market data',
    ],
    notIncluded: [
      'Premium signals',
      'Advanced research',
      'API access',
      'Priority support'
    ],
    cta: 'Get Started Free',
    popular: false
  },
  {
    name: 'Pro',
    price: 29,
    description: 'Best for active traders',
    icon: Crown,
    features: [
      'All Free features',
      'Premium trading signals',
      'Real-time news alerts',
      'Technical analysis tools',
      'Telegram/SMS alerts',
      'Portfolio tracking',
    ],
    notIncluded: [
      'Advanced research terminal',
      'API access'
    ],
    cta: 'Start Pro Trial',
    popular: true
  },
  {
    name: 'Institutional',
    price: 99,
    description: 'For serious investors',
    icon: Building,
    features: [
      'All Pro features',
      'Advanced research terminal',
      'Whale tracker alerts',
      'API access',
      'Priority support',
      'Custom integrations',
      'Dedicated account manager',
    ],
    notIncluded: [],
    cta: 'Contact Sales',
    popular: false
  }
]

export default function PricingSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-[#0A0E17]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Choose Your <span className="text-accent">Trading Edge</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start free and upgrade as you grow. All plans include our 7-day money-back guarantee.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className={`relative bg-gray-100/50 backdrop-blur-sm rounded-2xl p-8 border transition-all duration-300 hover:scale-105 ${
                  plan.popular 
                    ? 'border-accent shadow-lg shadow-accent/20' 
                    : 'border-gray-200 hover:border-accent/50'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-accent text-primary px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className={`inline-flex p-3 rounded-xl mb-4 ${
                    plan.popular 
                      ? 'bg-accent text-primary' 
                      : 'bg-gray-100 text-accent'
                  }`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-white">${plan.price}</span>
                    <span className="text-gray-400 ml-1">/month</span>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-accent flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map((feature) => (
                    <div key={feature} className="flex items-center space-x-3 opacity-50">
                      <div className="h-5 w-5 rounded-full border border-gray-100 flex-shrink-0" />
                      <span className="text-gray-500 line-through">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href={plan.name === 'Institutional' ? '/contact' : '/trial'}
                  className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-accent hover:bg-accent-hover text-primary'
                      : 'bg-gray-100 hover:bg-[#00] text-white hover:text-primary'
                  }`}
                >
                  {plan.cta}
                </Link>

                {plan.name === 'Pro' && (
                  <p className="text-center text-sm text-gray-400 mt-3">
                    7-day free trial • No credit card required
                  </p>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-20 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-8">Questions?</h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            <div>
              <h4 className="font-semibold text-white mb-2">Can I cancel anytime?</h4>
              <p className="text-gray-400">Yes, you can cancel your subscription at any time. No questions asked.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Do you offer refunds?</h4>
              <p className="text-gray-400">We offer a 7-day money-back guarantee on all paid plans.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Is there a free trial?</h4>
              <p className="text-gray-400">Yes! Pro plan comes with a 7-day free trial. No credit card required.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">What payment methods do you accept?</h4>
              <p className="text-gray-400">We accept all major credit cards, PayPal, and cryptocurrency payments.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
'use client'

import Link from 'next/link'
import { Check, X, Zap, Crown, Building, Star } from 'lucide-react'
import { motion } from 'framer-motion'

const plans = [
  {
    name: 'Free',
    price: 0,
    originalPrice: null,
    description: 'Perfect for getting started',
    icon: Zap,
    features: [
      'Basic crypto news feed',
      'Community trading signals',
      'Email alerts',
      'Basic market data',
      'Mobile app access',
    ],
    notIncluded: [
      'Premium signals',
      'Advanced research tools',
      'Whale tracker',
      'API access',
      'Priority support',
      'Custom alerts'
    ],
    cta: 'Get Started Free',
    ctaLink: '/onboarding?plan=free',
    popular: false,
    badge: null
  },
  {
    name: 'Pro',
    price: 29,
    originalPrice: 49,
    description: 'Best for active traders',
    icon: Crown,
    features: [
      'Everything in Free',
      'Premium trading signals (90% accuracy)',
      'Real-time news alerts',
      'Technical analysis tools',
      'Telegram/SMS alerts',
      'Portfolio tracking',
      'Advanced charting',
      'Market sentiment analysis',
      'Priority email support',
    ],
    notIncluded: [
      'Advanced research terminal',
      'Whale tracker alerts',
      'API access',
      'Custom integrations'
    ],
    cta: 'Start 7-Day Free Trial',
    ctaLink: '/onboarding?plan=pro',
    popular: true,
    badge: 'Most Popular'
  },
  {
    name: 'Institutional',
    price: 99,
    originalPrice: 149,
    description: 'For serious investors & funds',
    icon: Building,
    features: [
      'Everything in Pro',
      'Advanced research terminal',
      'Whale tracker alerts',
      'Full API access',
      'Custom integrations',
      'Dedicated account manager',
      'White-label solutions',
      'Advanced analytics',
      'Priority phone support',
      'Custom alert rules',
      'Team collaboration tools',
    ],
    notIncluded: [],
    cta: 'Start Enterprise Trial',
    ctaLink: '/onboarding?plan=institutional',
    popular: false,
    badge: 'Best Value'
  }
]

export default function PricingPlans() {
  return (
    <section className="py-20 bg-gradient-to-b from-[#0A0E17] to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center bg-gray-800/50 rounded-full p-1 border border-gray-700">
            <button className="px-6 py-2 rounded-full bg-[#00ffc3] text-[#0A0E17] font-semibold">
              Monthly
            </button>
            <button className="px-6 py-2 rounded-full text-gray-400 hover:text-white transition-colors">
              Annual
            </button>
            <div className="ml-3 bg-[#00ffc3]/20 text-[#00ffc3] px-3 py-1 rounded-full text-sm font-semibold">
              Save 40%
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className={`relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border transition-all duration-300 hover:scale-105 ${
                  plan.popular 
                    ? 'border-[#00ffc3] shadow-lg shadow-[#00ffc3]/20 ring-2 ring-[#00ffc3]/20' 
                    : 'border-gray-700 hover:border-[#00ffc3]/50'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className={`px-4 py-1 rounded-full text-sm font-semibold ${
                      plan.popular 
                        ? 'bg-[#00ffc3] text-[#0A0E17]' 
                        : 'bg-[#3a86ff] text-white'
                    }`}>
                      {plan.badge}
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className={`inline-flex p-3 rounded-xl mb-4 ${
                    plan.popular 
                      ? 'bg-[#00ffc3] text-[#0A0E17]' 
                      : 'bg-gray-700 text-[#3a86ff]'
                  }`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 mb-4">{plan.description}</p>
                  
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-4xl font-bold text-white">${plan.price}</span>
                    <span className="text-gray-400 ml-1">/month</span>
                  </div>
                  
                  {plan.originalPrice && (
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-gray-400 line-through">${plan.originalPrice}/mo</span>
                      <span className="bg-[#00ffc3]/20 text-[#3a86ff] px-2 py-1 rounded text-sm font-semibold">
                        Save ${plan.originalPrice - plan.price}/mo
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-[#3a86ff] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map((feature) => (
                    <div key={feature} className="flex items-start space-x-3 opacity-50">
                      <X className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-500 line-through text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href={plan.ctaLink}
                  className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-[#00ffc3] hover:bg-[#00ffc3]/80 text-primary transform hover:scale-105'
                      : 'bg-gray-700 hover:bg-[#3a86ff]/80 text-white hover:text-[#0A0E17]'
                  }`}
                >
                  {plan.cta}
                </Link>

                {plan.name !== 'Free' && (
                  <p className="text-center text-sm text-gray-400 mt-3">
                    7-day free trial • No credit card required
                  </p>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Enterprise CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-[#00ffc3]/20 to-[#3a86ff]/20 rounded-2xl p-8 border border-[#00ffc3]/30">
            <h3 className="text-2xl font-bold text-white mb-4">Need a Custom Solution?</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              For hedge funds, trading firms, and large institutions requiring custom integrations, dedicated infrastructure, or white-label solutions.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-[#00ffc3] hover:bg-[#00ffc3]/80 text-[#0A0E17] px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Contact Sales Team
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
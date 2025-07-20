'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Check, Zap, Crown, Building } from 'lucide-react'
import { motion } from 'framer-motion'

const plans = [
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    icon: Crown,
    description: 'Perfect for active traders',
    features: [
      'Premium trading signals (90% accuracy)',
      'Real-time news alerts',
      'Technical analysis tools',
      'Telegram/SMS alerts',
      'Portfolio tracking',
      'Priority support'
    ],
    popular: true
  },
  {
    id: 'institutional',
    name: 'Institutional',
    price: 99,
    icon: Building,
    description: 'For serious investors & funds',
    features: [
      'Everything in Pro',
      'Advanced research terminal',
      'Whale tracker alerts',
      'Full API access',
      'Custom integrations',
      'Dedicated account manager'
    ],
    popular: false
  }
]

export default function TrialSignup() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState('pro')
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Redirect to onboarding with selected plan
    router.push(`/onboarding?plan=${selectedPlan}`)
  }

  const selectedPlanData = plans.find(plan => plan.id === selectedPlan)!

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Start Your <span className="text-accent">Free Trial</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Get full access to AlphaChain for 7 days. No credit card required. Cancel anytime.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Plan Selection */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Choose Your Plan</h2>
          
          {plans.map((plan) => {
            const Icon = plan.icon
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`p-6 rounded-xl border cursor-pointer transition-all duration-300 ${
                  selectedPlan === plan.id
                    ? 'border-accent bg-accent/10'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${
                    selectedPlan === plan.id ? 'bg-accent text-primary' : 'bg-gray-700 text-accent'
                  }`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                      {plan.popular && (
                        <span className="bg-accent text-primary px-2 py-1 rounded text-xs font-semibold">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 mb-3">{plan.description}</p>
                    <div className="text-3xl font-bold text-accent mb-4">${plan.price}/month</div>
                    <div className="space-y-2">
                      {plan.features.map((feature) => (
                        <div key={feature} className="flex items-center space-x-2">
                          <Check className="h-4 w-4 text-accent flex-shrink-0" />
                          <span className="text-sm text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </motion.div>

        {/* Trial Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-accent to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Start Your Free Trial</h2>
            <p className="text-gray-400">Get instant access to {selectedPlanData.name} features</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-accent focus:outline-none"
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-accent focus:outline-none"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-accent focus:outline-none"
                placeholder="john@example.com"
                required
              />
            </div>

            <div className="bg-gray-700/30 rounded-lg p-4">
              <h3 className="font-semibold text-white mb-2">Trial Includes:</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-accent" />
                  <span className="text-sm text-gray-300">7 days free access</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-accent" />
                  <span className="text-sm text-gray-300">No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-accent" />
                  <span className="text-sm text-gray-300">Cancel anytime</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-accent" />
                  <span className="text-sm text-gray-300">Full {selectedPlanData.name} features</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-accent hover:bg-accent-hover text-primary py-3 rounded-lg font-semibold transition-colors"
            >
              Start Free Trial
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link href="/login" className="text-accent hover:text-accent-hover font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Trust Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-16 text-center"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold text-accent mb-2">50K+</div>
            <div className="text-sm text-gray-400">Active Users</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-accent mb-2">90%</div>
            <div className="text-sm text-gray-400">Signal Accuracy</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-accent mb-2">4.9/5</div>
            <div className="text-sm text-gray-400">User Rating</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-accent mb-2">24/7</div>
            <div className="text-sm text-gray-400">Support</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
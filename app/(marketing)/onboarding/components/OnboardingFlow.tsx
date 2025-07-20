'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Check, Zap, Crown, Building, TrendingUp, Bell, BarChart } from 'lucide-react'

const steps = [
  {
    id: 'welcome',
    title: 'Welcome to AlphaChain',
    subtitle: 'Let\'s get you set up in less than 2 minutes'
  },
  {
    id: 'plan',
    title: 'Choose Your Plan',
    subtitle: 'Select the plan that best fits your trading needs'
  },
  {
    id: 'profile',
    title: 'Tell Us About Yourself',
    subtitle: 'Help us personalize your experience'
  },
  {
    id: 'preferences',
    title: 'Set Your Preferences',
    subtitle: 'Customize your alerts and notifications'
  },
  {
    id: 'complete',
    title: 'You\'re All Set!',
    subtitle: 'Welcome to the future of crypto trading'
  }
]

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    icon: Zap,
    features: ['Basic news', 'Community signals', 'Email alerts'],
    popular: false
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    icon: Crown,
    features: ['Premium signals', 'Real-time alerts', 'Technical analysis'],
    popular: true
  },
  {
    id: 'institutional',
    name: 'Institutional',
    price: 99,
    icon: Building,
    features: ['Advanced research', 'API access', 'Dedicated support'],
    popular: false
  }
]

export default function OnboardingFlow() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedPlan, setSelectedPlan] = useState(searchParams?.get('plan') || 'pro')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    experience: '',
    interests: [] as string[],
    notifications: {
      email: true,
      sms: false,
      telegram: false
    }
  })

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    // In a real app, this would save the user data and redirect to dashboard
    router.push('/login?onboarded=true')
  }

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  index <= currentStep 
                    ? 'bg-accent text-primary' 
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    index < currentStep ? 'bg-accent' : 'bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">{steps[currentStep].title}</h1>
            <p className="text-gray-400">{steps[currentStep].subtitle}</p>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 min-h-[400px]">
          <AnimatePresence mode="wait">
            {/* Welcome Step */}
            {currentStep === 0 && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="text-center space-y-6"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-accent to-secondary rounded-full flex items-center justify-center mx-auto">
                  <TrendingUp className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Ready to Trade Smarter?</h2>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Join 50,000+ traders who are already using AlphaChain to make better trading decisions with AI-powered signals, real-time news, and institutional-grade research.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-accent">90%</div>
                    <div className="text-sm text-gray-400">Signal Accuracy</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent">24/7</div>
                    <div className="text-sm text-gray-400">Market Coverage</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent">$2.5B+</div>
                    <div className="text-sm text-gray-400">Trading Volume</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Plan Selection Step */}
            {currentStep === 1 && (
              <motion.div
                key="plan"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                <div className="grid gap-4">
                  {plans.map((plan) => {
                    const Icon = plan.icon
                    return (
                      <div
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                          selectedPlan === plan.id
                            ? 'border-accent bg-accent/10'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-lg ${
                            selectedPlan === plan.id ? 'bg-accent text-primary' : 'bg-gray-700 text-accent'
                          }`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                              {plan.popular && (
                                <span className="bg-accent text-primary px-2 py-1 rounded text-xs font-semibold">
                                  Popular
                                </span>
                              )}
                            </div>
                            <div className="text-2xl font-bold text-accent">${plan.price}/month</div>
                          </div>
                          <div className="text-right">
                            <div className="space-y-1">
                              {plan.features.map((feature) => (
                                <div key={feature} className="text-sm text-gray-400">{feature}</div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* Profile Step */}
            {currentStep === 2 && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-accent focus:outline-none"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-accent focus:outline-none"
                      placeholder="Enter your last name"
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
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Trading Experience</label>
                  <select
                    value={formData.experience}
                    onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-accent focus:outline-none"
                  >
                    <option value="">Select your experience level</option>
                    <option value="beginner">Beginner (0-1 years)</option>
                    <option value="intermediate">Intermediate (1-3 years)</option>
                    <option value="advanced">Advanced (3-5 years)</option>
                    <option value="expert">Expert (5+ years)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-4">What are you most interested in?</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Bitcoin', 'Ethereum', 'DeFi', 'NFTs', 'Altcoins', 'Day Trading'].map((interest) => (
                      <button
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all duration-300 ${
                          formData.interests.includes(interest)
                            ? 'border-accent bg-accent/10 text-accent'
                            : 'border-gray-600 text-gray-300 hover:border-gray-500'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Preferences Step */}
            {currentStep === 3 && (
              <motion.div
                key="preferences"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">How would you like to receive alerts?</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Bell className="h-5 w-5 text-accent" />
                        <div>
                          <div className="font-medium text-white">Email Notifications</div>
                          <div className="text-sm text-gray-400">Get alerts via email</div>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.notifications.email}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, email: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Bell className="h-5 w-5 text-accent" />
                        <div>
                          <div className="font-medium text-white">SMS Notifications</div>
                          <div className="text-sm text-gray-400">Get alerts via text message</div>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.notifications.sms}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, sms: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Bell className="h-5 w-5 text-accent" />
                        <div>
                          <div className="font-medium text-white">Telegram Bot</div>
                          <div className="text-sm text-gray-400">Get alerts via Telegram</div>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.notifications.telegram}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, telegram: e.target.checked }
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Complete Step */}
            {currentStep === 4 && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="text-center space-y-6"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-accent to-secondary rounded-full flex items-center justify-center mx-auto">
                  <Check className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Welcome to AlphaChain!</h2>
                  <p className="text-gray-300 text-lg">
                    Your account has been set up successfully. You're now ready to start trading smarter with our AI-powered platform.
                  </p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">What's Next?</h3>
                  <div className="space-y-3 text-left">
                    <div className="flex items-center space-x-3">
                      <Check className="h-4 w-4 text-accent" />
                      <span className="text-gray-300">Check your email for account verification</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Check className="h-4 w-4 text-accent" />
                      <span className="text-gray-300">Explore your personalized dashboard</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Check className="h-4 w-4 text-accent" />
                      <span className="text-gray-300">Start receiving your first signals</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
              currentStep === 0
                ? 'text-gray-500 cursor-not-allowed'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back</span>
          </button>

          <div className="text-sm text-gray-400">
            Step {currentStep + 1} of {steps.length}
          </div>

          {currentStep === steps.length - 1 ? (
            <button
              onClick={handleComplete}
              className="flex items-center space-x-2 bg-accent hover:bg-accent-hover text-primary px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <span>Get Started</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={nextStep}
              className="flex items-center space-x-2 bg-accent hover:bg-accent-hover text-primary px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <span>Continue</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
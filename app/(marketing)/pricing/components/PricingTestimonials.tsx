'use client'

import { Star, Building2 } from 'lucide-react'
import { motion } from 'framer-motion'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Portfolio Manager',
    company: 'Crypto Capital Partners',
    plan: 'Institutional',
    content: 'AlphaChain\'s institutional plan has been a game-changer for our fund. The whale tracker alone has saved us millions in potential losses.',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=80&h=80&fit=crop',
    rating: 5,
    results: '$2.5M losses prevented'
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Day Trader',
    company: 'Independent',
    plan: 'Pro',
    content: 'The Pro plan gives me everything I need. The signal accuracy is incredible - 90% win rate over the last 3 months. Worth every penny.',
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=80&h=80&fit=crop',
    rating: 5,
    results: '300% portfolio growth'
  },
  {
    name: 'Emily Foster',
    role: 'Crypto Enthusiast',
    company: 'Retail Investor',
    plan: 'Free',
    content: 'Started with the free plan and loved the news aggregation. Upgraded to Pro after seeing the quality of insights. Great value!',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=80&h=80&fit=crop',
    rating: 5,
    results: 'Upgraded to Pro'
  }
]

export default function PricingTestimonials() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-[#0A0E17]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What Our <span className="text-[#00ffc3]">Customers Say</span>
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Real results from traders using AlphaChain across all plan tiers
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-gray-200/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-300 hover:border-[#00ffc3]/50 transition-all duration-300"
            >
              {/* Plan Badge */}
              <div className="flex justify-between items-start mb-6">
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  testimonial.plan === 'Institutional' 
                    ? 'bg-[#00ffc3]/20 text-[#00ffc3]'
                    : testimonial.plan === 'Pro'
                    ? 'bg-[#3a86ff]/20 text-[#3a86ff]'
                    : 'bg-gray-200/20 text-gray-500'
                }`}>
                  {testimonial.plan} Plan
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-[#00ffc3] fill-current" />
                  ))}
                </div>
              </div>

              {/* Content */}
              <blockquote className="text-gray-500 mb-6 italic">
                "{testimonial.content}"
              </blockquote>

              {/* Results */}
              <div className="bg-[#00ffc3]/10 border border-[#00ffc3]/20 rounded-lg p-3 mb-6">
                <div className="text-sm text-gray-500">Result:</div>
                <div className="text-[#00ffc3] font-semibold">{testimonial.results}</div>
              </div>

              {/* Author */}
              <div className="flex items-center space-x-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.role}</div>
                  {testimonial.company !== 'Independent' && testimonial.company !== 'Retail Investor' && (
                    <div className="flex items-center space-x-1 mt-1">
                      <Building2 className="h-3 w-3 text-[#00ffc3]" />
                      <span className="text-xs text-[#00ffc3]">{testimonial.company}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          <div>
            <div className="text-3xl font-bold text-[#00ffc3] mb-2">4.9/5</div>
            <div className="text-gray-500">Average Rating</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#00ffc3] mb-2">50K+</div>
            <div className="text-gray-500">Happy Customers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#00ffc3] mb-2">95%</div>
            <div className="text-gray-500">Retention Rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#00ffc3] mb-2">24/7</div>
            <div className="text-gray-500">Support</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
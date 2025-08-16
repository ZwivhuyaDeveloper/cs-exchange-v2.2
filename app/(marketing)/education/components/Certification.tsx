'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Award, CheckCircle, Users } from 'lucide-react'
import { motion } from 'framer-motion'

export default function EducationCertification() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-[#0A0E17]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Earn Your <span className="text-[#00FFC2]">Professional Certification</span>
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Validate your skills with industry-recognized certifications that employers trust
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Certification Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <div className="bg-gray-100/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <Award className="h-8 w-8 text-[#00FFC2]" color='#00FFC2'/>
                <h3 className="text-2xl font-bold text-white">AlphaChain Certified Trader</h3>
              </div>

              <p className="text-gray-500 mb-6 leading-relaxed">
                Our comprehensive certification program validates your expertise in cryptocurrency trading, 
                risk management, and market analysis. Recognized by leading crypto firms and trading platforms.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-accent" color='#00FFC2' />
                  <span className="text-gray-500">Complete all foundation courses</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-accent" color='#00FFC2' />
                  <span className="text-gray-500">Pass comprehensive final exam</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-accent" color='#00FFC2' />
                  <span className="text-gray-500">Complete practical trading project</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-accent" color='#00FFC2' />
                  <span className="text-gray-500">Maintain continuing education credits</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-200/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-[#00FFC2] mb-1">2,500+</div>
                  <div className="text-sm text-gray-500">Certified Traders</div>
                </div>
                <div className="bg-gray-200/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-[#00FFC2] mb-1">95%</div>
                  <div className="text-sm text-gray-500">Pass Rate</div>
                </div>
              </div>

              <button className="w-full bg-[#00FFC2] hover:bg-[#00FFC2]/80 text-[#0A0E17] py-3 rounded-lg font-semibold transition-colors">
                Start Certification Path
              </button>
            </div>
          </motion.div>

          {/* Certificate Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border-2 border-[#00FFC2]/30 shadow-2xl">
              {/* Certificate Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-[#00FFC2] to-[#00FFC2] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-white" color='black' />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Certificate of Completion</h3>
                <div className="w-24 h-1 bg-[#00FFC2] mx-auto"></div>
              </div>

              {/* Certificate Body */}
              <div className="text-center space-y-4">
                <p className="text-gray-500">This certifies that</p>
                <div className="text-2xl font-bold text-[#00FFC2]">John Doe</div>
                <p className="text-gray-500">has successfully completed the</p>
                <div className="text-xl font-semibold text-white">AlphaChain Certified Trader Program</div>
                <p className="text-gray-500">and demonstrated proficiency in cryptocurrency trading</p>
              </div>

              {/* Certificate Footer */}
              <div className="flex justify-between items-end mt-8 pt-6 border-t border-gray-500">
                <div className="text-center">
                  <div className="w-24 h-0.5 bg-gray-500 mb-2"></div>
                  <div className="text-sm text-gray-500">Date Issued</div>
                  <div className="text-sm text-white">March 15, 2025</div>
                </div>
                <div className="text-center">
                  <div className="w-24 h-0.5 bg-gray-500 mb-2"></div>
                  <div className="text-sm text-gray-500">Certificate ID</div>
                  <div className="text-sm text-white">ACT-2025-001</div>
                </div>
              </div>
            </div>

          </motion.div>
        </div>

        {/* Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-16 text-center"
        >
          <div className="bg-gray-100/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-100 max-w-3xl mx-auto">
            <blockquote className="text-xl text-gray-500 italic mb-6">
              &ldquo;The AlphaChain certification opened doors I never thought possible. Within 3 months of earning my certificate, I landed a position at a top crypto hedge fund.&rdquo;
            </blockquote>
            <div className="flex items-center justify-center space-x-4">
              <div className="relative w-12 h-12">
                <Image
                  src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=60&h=60&fit=crop"
                  alt="Sarah Chen"
                  fill
                  className="rounded-full object-cover"
                  sizes="48px"
                />
              </div>
              <div>
                <div className="font-semibold text-white">Sarah Chen</div>
                <div className="text-sm text-gray-500">Quantitative Analyst, Crypto Capital</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
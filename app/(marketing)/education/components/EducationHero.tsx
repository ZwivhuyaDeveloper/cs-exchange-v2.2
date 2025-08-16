'use client'

import { GraduationCap, Award, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { AuroraBackground } from '@/components/ui/aurora-background'
import { Tourney } from 'next/font/google'

const tourney = Tourney({
  subsets: ['latin'],
  weight: ['400', '700'],
})

export default function EducationHero() {
  return (
    <section className="relative py-20 overflow-hidden blockchain-pattern">
      {/* Background Elements */}
      <div className="absolute inset-0 ">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-[#0A0E17]/50 to-[#0A0E17]/100" />
        <AuroraBackground className="absolute inset-0">
          {null}
        </AuroraBackground>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            <span className={`${tourney.className} bg-gradient-to-r from-[#00FFC2] to-[#3A86FF] bg-clip-text text-transparent`}>
              Crypto Trading Academy
            </span>
            <br />
            <span className={`${tourney.className} text-white`}>Master the Markets</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto"
          >
            Comprehensive courses designed by professional traders to take you from beginner to expert. Learn at your own pace with hands-on projects and real market examples.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto mb-12"
          >
            <div className="flex items-center justify-center space-x-3">
              <GraduationCap className="h-6 w-6 text-accent" color='#00FFC2' />
              <div>
                <div className="text-2xl font-bold text-white">25+</div>
                <div className="text-sm text-gray-500">Courses</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Users className="h-6 w-6 text-accent" color='#00FFC2' />
              <div>
                <div className="text-2xl font-bold text-white">10K+</div>
                <div className="text-sm text-gray-500">Students</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Award className="h-6 w-6 text-accent" color='#00FFC2' />
              <div>
                <div className="text-2xl font-bold text-white">95%</div>
                <div className="text-sm text-gray-500">Success Rate</div>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <button className="bg-[#00FFC2] hover:bg-[#00FFC2]/80 text-primary px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 glow-effect">
              Start Learning Today
            </button>
            <div className="text-sm text-gray-400">
              <div>✓ 30-day money-back guarantee</div>
              <div>✓ Lifetime access to all courses</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
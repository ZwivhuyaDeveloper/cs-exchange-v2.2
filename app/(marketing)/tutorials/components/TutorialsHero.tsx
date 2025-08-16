'use client'

import { BookOpen, Play, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { AuroraBackground } from '@/components/ui/aurora-background'
import { Tourney } from 'next/font/google'

const tourney = Tourney({
  subsets: ['latin'],
  weight: ['400', '700'],
})


export default function TutorialsHero() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <AuroraBackground className="absolute inset-0">
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-[#0A0E17]/50 to-[#0A0E17]/100" />
        </AuroraBackground>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            <span className={`${tourney.className} bg-gradient-to-r from-[#00FFC2] to-[#3A86FF] bg-clip-text text-transparent`}>Master Crypto Trading with</span>
            <br />
            <span className={`${tourney.className} text-white`}>
              Step-by-Step Guides
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto"
          >
            From beginner basics to advanced strategies, our comprehensive tutorials will help you become a confident crypto trader
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            <div className="flex items-center justify-center space-x-3">
              <BookOpen className="h-6 w-6 text-[#00FFC2]" color='#00FFC2'/>
              <div>
                <div className="text-2xl font-bold text-white">50+</div>
                <div className="text-sm text-gray-500">Tutorials</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Play className="h-6 w-6 text-[#00FFC2]" color='#00FFC2'/>
              <div>
                <div className="text-2xl font-bold text-white">20+</div>
                <div className="text-sm text-gray-500">Video Guides</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Clock className="h-6 w-6 text-[#00FFC2]" color='#00FFC2'/>
              <div>
                <div className="text-2xl font-bold text-white">100+</div>
                <div className="text-sm text-gray-500">Hours Content</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
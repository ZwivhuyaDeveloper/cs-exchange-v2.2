'use client'

import { CheckCircle, Clock, Trophy } from 'lucide-react'
import { motion } from 'framer-motion'

export default function EducationProgress() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Track Your <span className="text-[#00FFC2]">Learning Journey</span>
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Monitor your progress and celebrate your achievements as you master crypto trading
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Progress Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="bg-gray-100/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-100"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Your Progress</h3>
            
            {/* Overall Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500">Overall Completion</span>
                <span className="text-[#00FFC2] font-semibold">68%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-[#00FFC2] to-[#00FFC2] h-3 rounded-full w-2/3"></div>
              </div>
            </div>

            {/* Course Progress */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-200/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-[#00FFC2]" />
                  <span className="text-white">Cryptocurrency Fundamentals</span>
                </div>
                <span className="text-[#00FFC2] font-semibold">Completed</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-400/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-[#00FFC2]/30 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#00FFC2] rounded-full animate-pulse" />
                  </div>
                  <span className="text-white">Technical Analysis Mastery</span>
                </div>
                <span className="text-yellow-400 font-semibold">75%</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-200/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <span className="text-white">Risk Management & Psychology</span>
                </div>
                <span className="text-gray-500 font-semibold">Not Started</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#00FFC2]">3</div>
                <div className="text-sm text-gray-500">Courses Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#00FFC2]">45</div>
                <div className="text-sm text-gray-500">Hours Learned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#00FFC2]">12</div>
                <div className="text-sm text-gray-500">Certificates Earned</div>
              </div>
            </div>
          </motion.div>

          {/* Learning Path */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Recommended Learning Path</h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" color='black' />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Foundation Level</h4>
                  <p className="text-gray-500 text-sm">Master the basics of cryptocurrency and blockchain technology</p>
                  <div className="text-xs text-[#00FFC2] mt-1">✓ Completed</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#00FFC2]/30 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-[#00FFC2] rounded-full animate-pulse" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Trading Fundamentals</h4>
                  <p className="text-gray-500 text-sm">Learn technical analysis and trading strategies</p>
                  <div className="text-xs text-yellow-400 mt-1">⏳ In Progress (75%)</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#3A86FF]/30 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-[#3A86FF] rounded-full" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Advanced Strategies</h4>
                  <p className="text-gray-500 text-sm">Master advanced trading techniques and automation</p>
                  <div className="text-xs text-gray-500 mt-1">🔒 Locked</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#3A86FF] rounded-full flex items-center justify-center">
                  <Trophy className="h-4 w-4 text-gray-500" color='WHITE'/>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Professional Certification</h4>
                  <p className="text-gray-500 text-sm">Earn your professional crypto trading certification</p>
                  <div className="text-xs text-gray-500 mt-1">🔒 Locked</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
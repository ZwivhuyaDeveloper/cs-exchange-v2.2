'use client'

import { useState } from 'react'
import { BookOpen, TrendingUp, Bot, Shield, BarChart, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

const categories = [
  {
    id: 'beginner',
    name: 'Beginner',
    icon: BookOpen,
    description: 'Start your crypto journey',
    count: 15,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'trading',
    name: 'Trading',
    icon: TrendingUp,
    description: 'Master trading strategies',
    count: 12,
    color: 'from-[#00FFC2] to-[#3A86FF]'
  },
  {
    id: 'automation',
    name: 'Automation',
    icon: Bot,
    description: 'Set up trading bots',
    count: 8,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'security',
    name: 'Security',
    icon: Shield,
    description: 'Protect your assets',
    count: 6,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'analysis',
    name: 'Analysis',
    icon: BarChart,
    description: 'Technical & fundamental',
    count: 10,
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'advanced',
    name: 'Advanced',
    icon: Zap,
    description: 'Pro strategies & tools',
    count: 9,
    color: 'from-yellow-500 to-orange-500'
  }
]

export default function TutorialsCategories() {
  const [selectedCategory, setSelectedCategory] = useState('beginner')

  return (
    <section className="py-20 bg-gradient-to-b from-[#0A0E17] to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Choose Your <span className="text-[#00FFC2]">Learning Path</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Select a category that matches your experience level and goals
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon
            const isSelected = selectedCategory === category.id

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border cursor-pointer transition-all duration-300 hover:scale-105 ${
                  isSelected
                    ? 'border-[#00FFC2]/50 shadow-lg shadow-[#00FFC2]/20'
                    : 'border-gray-800 hover:border-[#00FFC2]/50'
                }`}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
                
                {/* Content */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${category.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="bg-[#00FFC2]/20 text-[#00FFC2] px-3 py-1 rounded-full text-sm font-semibold">
                      {category.count} guides
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    {category.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {category.count} tutorials available
                    </span>
                    {isSelected && (
                      <div className="w-2 h-2 bg-[#00FFC2]/50 rounded-full animate-pulse" />
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
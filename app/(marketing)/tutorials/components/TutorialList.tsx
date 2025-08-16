'use client'

import { Play, Clock, BookOpen, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'

const tutorials = [
  {
    id: 1,
    title: 'Getting Started with Cryptocurrency',
    description: 'Learn the basics of cryptocurrency, blockchain technology, and how to get started safely.',
    duration: '15 min',
    type: 'video',
    difficulty: 'Beginner',
    completed: false,
    thumbnail: 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?w=300&h=200&fit=crop'
  },
  {
    id: 2,
    title: 'Setting Up Your First Wallet',
    description: 'Step-by-step guide to creating and securing your cryptocurrency wallet.',
    duration: '12 min',
    type: 'video',
    difficulty: 'Beginner',
    completed: true,
    thumbnail: 'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?w=300&h=200&fit=crop'
  },
  {
    id: 3,
    title: 'Understanding Trading Pairs',
    description: 'Learn how trading pairs work and how to read market data effectively.',
    duration: '20 min',
    type: 'article',
    difficulty: 'Beginner',
    completed: false,
    thumbnail: 'https://images.pexels.com/photos/186461/pexels-photo-186461.jpeg?w=300&h=200&fit=crop'
  },
  {
    id: 4,
    title: 'Technical Analysis Fundamentals',
    description: 'Master the basics of chart reading, support/resistance, and key indicators.',
    duration: '35 min',
    type: 'video',
    difficulty: 'Intermediate',
    completed: false,
    thumbnail: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?w=300&h=200&fit=crop'
  },
  {
    id: 5,
    title: 'Risk Management Strategies',
    description: 'Learn how to protect your capital with proper risk management techniques.',
    duration: '25 min',
    type: 'article',
    difficulty: 'Intermediate',
    completed: false,
    thumbnail: 'https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?w=300&h=200&fit=crop'
  },
  {
    id: 6,
    title: 'Setting Up Trading Bots',
    description: 'Complete guide to configuring and optimizing your first trading bot.',
    duration: '45 min',
    type: 'video',
    difficulty: 'Advanced',
    completed: false,
    thumbnail: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?w=300&h=200&fit=crop'
  }
]

export default function TutorialsList() {
  return (
    <section className="py-20 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Featured <span className="text-[#00FFC2]">Tutorials</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Start with these popular tutorials to build your crypto trading foundation
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tutorials.map((tutorial, index) => (
            <motion.div
              key={tutorial.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700 hover:border-[#00FFC2]/50 transition-all duration-300 group cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="relative">
                <div className="relative w-full h-48">
                  <Image
                    src={tutorial.thumbnail}
                    alt={tutorial.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />
                
                {/* Play Button for Videos */}
                {tutorial.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-[#00FFC2]/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Play className="h-6 w-6 text-white ml-1" color='black' />
                    </div>
                  </div>
                )}

                {/* Completion Badge */}
                {tutorial.completed && (
                  <div className="absolute top-4 right-4 bg-[#00FFC2] rounded-full p-2">
                    <CheckCircle className="h-4 w-4 text-white" color='black' />
                  </div>
                )}

                {/* Difficulty Badge */}
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${
                  tutorial.difficulty === 'Beginner' 
                    ? 'bg-green-500/20 text-green-400'
                    : tutorial.difficulty === 'Intermediate'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {tutorial.difficulty}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    {tutorial.type === 'video' ? (
                      <Play className="h-4 w-4" />
                    ) : (
                      <BookOpen className="h-4 w-4" />
                    )}
                    <span className="capitalize">{tutorial.type}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>{tutorial.duration}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#00FFC2] transition-colors">
                  {tutorial.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {tutorial.description}
                </p>

                {/* Progress Bar (for completed tutorials) */}
                {tutorial.completed && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-[#00FFC2] h-2 rounded-full w-full"></div>
                    </div>
                    <div className="text-xs text-[#00FFC2] mt-1">Completed</div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mt-12"
        >
          <button className="bg-[#00FFC2] hover:bg-[#00FFC2]/80 text-[#0A0E17] px-8 py-3 rounded-lg font-semibold transition-colors">
            Load More Tutorials
          </button>
        </motion.div>
      </div>
    </section>
  )
}
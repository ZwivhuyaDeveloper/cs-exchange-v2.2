'use client'

import { Clock, Users, Star, Play } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'

const courses = [
  {
    id: 1,
    title: 'Cryptocurrency Fundamentals',
    description: 'Complete beginner\'s guide to understanding blockchain, cryptocurrencies, and digital assets.',
    instructor: 'Sarah Chen',
    duration: '8 hours',
    students: 2450,
    rating: 4.9,
    price: 'Free',
    level: 'Beginner',
    thumbnail: 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?w=400&h=250&fit=crop',
    lessons: 12
  },
  {
    id: 2,
    title: 'Technical Analysis Mastery',
    description: 'Learn to read charts, identify patterns, and use technical indicators for profitable trading.',
    instructor: 'Marcus Rodriguez',
    duration: '15 hours',
    students: 1890,
    rating: 4.8,
    price: '$99',
    level: 'Intermediate',
    thumbnail: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?w=400&h=250&fit=crop',
    lessons: 24
  },
  {
    id: 3,
    title: 'Automated Trading Strategies',
    description: 'Build and deploy profitable trading bots using advanced algorithms and risk management.',
    instructor: 'David Kim',
    duration: '20 hours',
    students: 1250,
    rating: 4.9,
    price: '$199',
    level: 'Advanced',
    thumbnail: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?w=400&h=250&fit=crop',
    lessons: 32
  },
  {
    id: 4,
    title: 'DeFi and Yield Farming',
    description: 'Explore decentralized finance protocols and learn to maximize yields safely.',
    instructor: 'Emily Foster',
    duration: '12 hours',
    students: 980,
    rating: 4.7,
    price: '$149',
    level: 'Intermediate',
    thumbnail: 'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?w=400&h=250&fit=crop',
    lessons: 18
  },
  {
    id: 5,
    title: 'Risk Management & Psychology',
    description: 'Master the mental game of trading and learn professional risk management techniques.',
    instructor: 'Alex Thompson',
    duration: '10 hours',
    students: 1650,
    rating: 4.8,
    price: '$79',
    level: 'All Levels',
    thumbnail: 'https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?w=400&h=250&fit=crop',
    lessons: 16
  },
  {
    id: 6,
    title: 'Portfolio Management Pro',
    description: 'Learn institutional-grade portfolio management strategies for crypto investments.',
    instructor: 'Maria Rodriguez',
    duration: '18 hours',
    students: 750,
    rating: 4.9,
    price: '$249',
    level: 'Advanced',
    thumbnail: 'https://images.pexels.com/photos/186461/pexels-photo-186461.jpeg?w=400&h=250&fit=crop',
    lessons: 28
  }
]

export default function EducationCourses() {
  return (
    <section className="py-20 bg-gradient-to-b from-[#0A0E17] to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Featured <span className="text-[#00FFC2]">Courses</span>
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Learn from industry experts with our comprehensive course library
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700 hover:border-[#00FFC2]/50 transition-all duration-300 group cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="relative">
                <div className="relative w-full h-48">
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />
                
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-[#00FFC2]/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Play className="h-6 w-6 text-white ml-1" color='black' />
                  </div>
                </div>

                {/* Level Badge */}
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${
                  course.level === 'Beginner' 
                    ? 'bg-green-500/20 text-green-400'
                    : course.level === 'Intermediate'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : course.level === 'Advanced'
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {course.level}
                </div>

                {/* Price Badge */}
                <div className="absolute top-4 right-4 bg-[#00FFC2]/90 text-black px-3 py-1 rounded-full text-sm font-semibold">
                  {course.price}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#00FFC2] transition-colors">
                  {course.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  {course.description}
                </p>

                {/* Instructor */}
                <div className="text-sm text-gray-400 mb-4">
                  by <span className="text-[#00FFC2]">{course.instructor}</span>
                </div>

                {/* Course Stats */}
                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{course.students.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-[#00FFC2] fill-current" />
                    <span>{course.rating}</span>
                  </div>
                </div>

                {/* Lessons Count */}
                <div className="text-sm text-gray-400 mb-4">
                  {course.lessons} lessons
                </div>

                {/* Enroll Button */}
                <button className="w-full bg-[#00FFC2]/20 hover:bg-[#00FFC2] hover:text-primary text-[#00FFC2] py-2 rounded-lg font-semibold transition-all duration-300">
                  {course.price === 'Free' ? 'Start Free Course' : 'Enroll Now'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
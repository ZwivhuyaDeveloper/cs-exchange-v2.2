'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, Menu, X, Shield, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Space_Mono, Tourney } from 'next/font/google'
import Image from 'next/image'
import Main from "@/public/Cyclespace-logo/CS logo color.png"
import { Button } from '@/components/ui/button'
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

const tourney = Tourney({
  subsets: ['latin'],
  weight: ['400', '700'],
})

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [featuresOpen, setFeaturesOpen] = useState(false)
  const [resourcesOpen, setResourcesOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-[#00FFC2]/5 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-[#00FFC2]/20 to-[#3A86FF]/30 rounded-lg">
        
              <Image 
                src={Main} 
                width={35} 
                height={35}
              alt="Cyclespace Logo"
              className="w-8 h-8 sm:w-8 sm:h-8"
            />

            </div>
            <span className={`${tourney.className} antialiased text-lg sm:text-xl md:text-2xl font-semibold bg-white text-transparent bg-clip-text`}>CYCLESPACE</span>
            <span className="text-[#00FFC2] font-mono">DEX</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <div className="relative">
              <button
                onClick={() => setFeaturesOpen(!featuresOpen)}
                className="flex items-center space-x-1 text-gray-600 hover:text-white transition-colors"
              >
                <span>Features</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              <AnimatePresence>
                {featuresOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-gray-100 rounded-lg shadow-lg border border-gray-100"
                  >
                    <Link
                      href="/news-details"
                      className="block px-4 py-3 text-sm text-gray-600 hover:text-white hover:rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      News Dashboard
                    </Link>
                    <Link
                      href="/research-details"
                      className="block px-4 py-3 text-sm text-gray-500 hover:text-white hover:rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Research Terminal
                    </Link>
                    <Link
                      href="/signals"
                      className="block px-4 py-3 text-sm text-gray-500 hover:text-white hover: hover:bg-gray-200 transition-colors"
                    >
                      Trading Signals
                    </Link>
                    <Link
                      href="/swap-exchange"
                      className="block px-4 py-3 text-sm text-gray-500 hover:text-white hover: hover:bg-gray-200 transition-colors"
                    >
                      Swap
                    </Link>
                    <Link
                      href="/trading"
                      className="block px-4 py-3 text-sm text-gray-500 hover:text-white hover: hover:bg-gray-200 transition-colors"
                    >
                      Trading Bots
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="relative">
              <button
                onClick={() => setResourcesOpen(!resourcesOpen)}
                className="flex items-center space-x-1 text-gray-600 hover:text-white transition-colors"
              >
                <span>Resources</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              <AnimatePresence>
                {resourcesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-gray-100 rounded-lg shadow-lg border border-gray-100"
                  >
                    <Link
                      href="/tutorials"
                      className="block px-4 py-3 text-sm text-gray-500 hover:text-white hover:bg-gray-200 transition-colors"
                    >
                      Tutorials
                    </Link>
                    <Link
                      href="/education"
                      className="block px-4 py-3 text-sm text-gray-500 hover:text-white hover:bg-gray-200 transition-colors"
                    >
                      Education
                    </Link>
                    <Link
                      href="/docs"
                      className="block px-4 py-3 text-sm text-gray-500 hover:text-white hover:bg-gray-200 transition-colors"
                    >
                      Documentation
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/blog" className="text-gray-800 hover:text-white transition-colors">
              <span className="text-sm">Blog</span>
            </Link>
            <Link href="/pricing" className="text-gray-800 hover:text-white transition-colors">
              <span className="text-sm">Pricing</span>
            </Link>
          </nav>

          {/* Trust Badges */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Shield className="h-4 w-4 text-[#00FFC2]" />
              <span>256-bit SSL</span>
            </div>
            <div className="text-xs text-gray-500">90% Accuracy</div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <SignedOut>
              <SignInButton />
              <SignUpButton>
                <button className="bg-[#00FFC2] hover:bg-[#00E6B0] text-[#0A0E17] px-4 py-2 rounded-lg font-semibold transition-colors glow-effect">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-700 py-4"
            >
              <div className="space-y-3">
                <Link
                  href="/news"
                  className="block text-gray-300 hover:text-white transition-colors"
                >
                  News Dashboard
                </Link>
                <Link
                  href="/research"
                  className="block text-gray-300 hover:text-white transition-colors"
                >
                  Research Terminal
                </Link>
                <Link
                  href="/signals"
                  className="block text-gray-300 hover:text-white transition-colors"
                >
                  Trading Signals
                </Link>
                <Link
                  href="/blog"
                  className="block text-gray-300 hover:text-white transition-colors"
                >
                  Blog
                </Link>
                <Link
                  href="/pricing"
                  className="block text-gray-300 hover:text-white transition-colors"
                >
                  Pricing
                </Link>
                <div className="pt-4 border-t border-gray-700">
                  <Link
                    href="/login"
                    className="block text-gray-300 hover:text-white transition-colors mb-3"
                  >
                    Login
                  </Link>
                  <Link
                    href="/trial"
                    className="block bg-[#00FFC2] hover:bg-[#00E6B0] text-[#0A0E17] px-4 py-2 rounded-lg font-semibold text-center transition-colors"
                  >
                    Start Free Trial
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
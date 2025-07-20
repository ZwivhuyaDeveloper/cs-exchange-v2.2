import { ThemeProvider } from '@/context/ThemeContext'
import type { Metadata } from 'next'
import { Inter, Manrope, Space_Mono } from 'next/font/google'
import '@/app/globals.css'
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from '../providers';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const spaceMono = Space_Mono({ 
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
})

const manrope = Manrope({
  subsets: ['latin'],
  weight: [ '200', '300', '400', '500', '600', '700', '800',],
  variable: '--font-manrope',
})

export const metadata: Metadata = {
  title: 'AlphaChain Signals - Trade Smarter, Not Harder',
  description: 'AI-Powered Crypto Signals, News & Research. Decode crypto markets in real-time with 90% signal accuracy.',
  keywords: 'crypto signals, cryptocurrency trading, blockchain news, crypto research, trading alerts',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="antialiased">
      <ThemeProvider>
        <Providers>
          {children}
        </Providers>
      </ThemeProvider>
    </div>
  )
}
import { ThemeProvider } from '@/context/ThemeContext'
import type { Metadata } from 'next'
import '@/app/globals.css'
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from '../providers';
import { NavMenu } from './components/layout/NavMenu';
import BottomTabs from './components/layout/BottomTabs';
import { ClerkProvider } from '@clerk/nextjs';
;

export const metadata: Metadata = {
  title: 'Cyclespace Exchange - Trade Smarter, Not Harder',
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
      <ClerkProvider>
      <ThemeProvider>
        <Providers>
          {/* Header */}
          <header className="sticky top-0 z-50 flex h-fit bg-white items-center border-none rounded-b-3xl backdrop-filter backdrop-blur-2xl dark:bg-zinc-900/90 ">
            <NavMenu />
          </header>
          
          {children}
          <BottomTabs/>
        </Providers>
      </ThemeProvider>
      </ClerkProvider>
    </div>
  )
}
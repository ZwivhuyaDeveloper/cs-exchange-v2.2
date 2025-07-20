import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AlphaChain Signals | AI Crypto Trading, News & Research Platform',
  description: 'Unlock real-time AI-powered crypto signals, news, and research. Trade smarter with 90% signal accuracy, advanced analytics, and the best swap rates. Join 50,000+ traders on AlphaChain.',
  keywords: 'crypto signals, AI trading, cryptocurrency news, blockchain analytics, swap exchange, trading platform, market research, trading bots',
  openGraph: {
    title: 'AlphaChain Signals | AI Crypto Trading, News & Research Platform',
    description: 'Unlock real-time AI-powered crypto signals, news, and research. Trade smarter with 90% signal accuracy, advanced analytics, and the best swap rates. Join 50,000+ traders on AlphaChain.',
    url: 'https://alphachain.com/',
    type: 'website',
    images: [
      {
        url: '/Cyclespace-logo/CS-logo-black-2.png',
        width: 1200,
        height: 630,
        alt: 'AlphaChain Signals Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AlphaChain Signals | AI Crypto Trading, News & Research Platform',
    description: 'Unlock real-time AI-powered crypto signals, news, and research. Trade smarter with 90% signal accuracy, advanced analytics, and the best swap rates. Join 50,000+ traders on AlphaChain.',
    images: ['/Cyclespace-logo/CS-logo-black-2.png'],
    site: '@AlphaChain',
  },
  alternates: {
    canonical: 'https://alphachain.com/',
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
};

import Header from '@/app/(marketing)/components/layout/Header'
import Hero from '@/app/(marketing)/components/landing/Hero'
import FeatureTeasers from '@/app/(marketing)/components/landing/FeatureTeasers'
import SocialProof from '@/app/(marketing)/components/landing/SocialProof'
import PricingSection from '@/app/(marketing)/components/landing/PricingSection'
import Footer from '@/app/(marketing)/components/layout/Footer'
import { TabsHome } from './components/landing/TabsHome'


export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-white">
      <Header />
      <main>
        <Hero />
        <FeatureTeasers />
        <TabsHome />
        <SocialProof />
        <PricingSection />
      </main>
      <Footer />
    </div>
  )
}
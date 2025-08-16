
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crypto Trading Bots & Automation | AlphaChain Platform',
  description: 'Automate your crypto trading with AlphaChain’s AI-powered bots. Enjoy lightning-fast execution, advanced analytics, and secure API integration for top exchanges.',
  keywords: 'crypto trading bots, trading automation, AI trading, secure API, AlphaChain bots, automated trading, exchange integration',
  openGraph: {
    title: 'Crypto Trading Bots & Automation | AlphaChain Platform',
    description: 'Automate your crypto trading with AlphaChain’s AI-powered bots. Enjoy lightning-fast execution, advanced analytics, and secure API integration for top exchanges.',
    url: 'https://alphachain.com/trading',
    type: 'website',
    images: [
      {
        url: '/Cyclespace-logo/CS-logo-black-2.png',
        width: 1200,
        height: 630,
        alt: 'AlphaChain Trading Bots',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crypto Trading Bots & Automation | AlphaChain Platform',
    description: 'Automate your crypto trading with AlphaChain’s AI-powered bots. Enjoy lightning-fast execution, advanced analytics, and secure API integration for top exchanges.',
    images: ['/Cyclespace-logo/CS-logo-black-2.png'],
    site: '@AlphaChain',
  },
  alternates: {
    canonical: 'https://alphachain.com/trading',
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
};

import Header from '../components/layout/Header'
import TradingHero from './components/TradingHero'
import TradingFeatures from './components/TradingFeatures'
import TradingIntegrations from './components/TradingIntegrations'
import TradingTestimonials from './components/TradingTesmonials'
import Footer from '../components/layout/Footer'



export default function TradingPage() {
  return (
    <div className="min-h-screen bg-[#0A0E17] text-white">
      <Header />
      <main>
        <TradingHero />
        <TradingFeatures />
        <TradingIntegrations />
        <TradingTestimonials />
      </main>
      <Footer />
    </div>
  )
}
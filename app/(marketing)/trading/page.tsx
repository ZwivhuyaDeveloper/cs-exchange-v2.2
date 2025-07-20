
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crypto Trading Bots & Automation | AlphaChain Platform',
  description: 'Automate your crypto trading with AlphaChain’s AI-powered bots. Enjoy lightning-fast execution, advanced analytics, and secure API integration for top exchanges.',
  keywords: 'crypto trading bots, trading automation, AI trading, secure API, AlphaChain bots, automated trading, exchange integration',
};

import Header from '../components/layout/Header'
import TradingHero from './components/TradingHero'
import TradingFeatures from './components/TradingFeatures'
import TradingIntegrations from './components/TradingIntegrations'
import TradingTestimonials from './components/TradingTesmonials'
import Footer from '../components/layout/Footer'



export default function TradingPage() {
  return (
    <div className="min-h-screen bg-primary text-white">
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
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Crypto Trading Signals | 90% Accuracy | AlphaChain',
  description: 'Get high-accuracy, AI-powered crypto trading signals verified by expert analysts. Boost your trading performance with AlphaChain’s real-time alerts and portfolio tools.',
  keywords: 'crypto signals, AI trading, trading alerts, portfolio tools, AlphaChain signals, expert analysis, real-time crypto',
  openGraph: {
    title: 'AI Crypto Trading Signals | 90% Accuracy | AlphaChain',
    description: 'Get high-accuracy, AI-powered crypto trading signals verified by expert analysts. Boost your trading performance with AlphaChain’s real-time alerts and portfolio tools.',
    url: 'https://alphachain.com/signals',
    type: 'website',
    images: [
      {
        url: '/Cyclespace-logo/CS-logo-black-2.png',
        width: 1200,
        height: 630,
        alt: 'AlphaChain Trading Signals',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Crypto Trading Signals | 90% Accuracy | AlphaChain',
    description: 'Get high-accuracy, AI-powered crypto trading signals verified by expert analysts. Boost your trading performance with AlphaChain’s real-time alerts and portfolio tools.',
    images: ['/Cyclespace-logo/CS-logo-black-2.png'],
    site: '@AlphaChain',
  },
  alternates: {
    canonical: 'https://alphachain.com/signals',
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
};

import Footer from "@/app/(marketing)/components/layout/Footer";
import Header from "@/app/(marketing)/components/layout/Header";
import SignalsDisclaimer from "@/app/(marketing)/signals/components/SignalsDisclaimer";
import SignalsHero from "@/app/(marketing)/signals/components/SignalsHero";
import SignalsPerformance from "@/app/(marketing)/signals/components/SignalsPerformance";
import SignalsWorkflow from "@/app/(marketing)/signals/components/SignalsWorkflow";


export default function SignalsPage() {
  return (
    <div className="min-h-screen bg-primary text-white">
      <Header />
      <main>
        <SignalsHero />
        <SignalsWorkflow />
        <SignalsPerformance />
        <SignalsDisclaimer />
      </main>
      <Footer />
    </div>
  )
}
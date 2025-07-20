import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crypto Swap Exchange | Fast, Secure Token Swaps | AlphaChain',
  description: 'Swap cryptocurrencies instantly with AlphaChain’s secure, non-custodial exchange. Enjoy lightning-fast trades, best rates, and cross-chain support for 200+ tokens.',
  keywords: 'crypto swap, token exchange, instant swap, cross-chain, secure trading, AlphaChain swap, best rates',
  openGraph: {
    title: 'Crypto Swap Exchange | Fast, Secure Token Swaps | AlphaChain',
    description: 'Swap cryptocurrencies instantly with AlphaChain’s secure, non-custodial exchange. Enjoy lightning-fast trades, best rates, and cross-chain support for 200+ tokens.',
    url: 'https://alphachain.com/swap',
    type: 'website',
    images: [
      {
        url: '/Cyclespace-logo/CS-logo-black-2.png',
        width: 1200,
        height: 630,
        alt: 'AlphaChain Swap Exchange',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crypto Swap Exchange | Fast, Secure Token Swaps | AlphaChain',
    description: 'Swap cryptocurrencies instantly with AlphaChain’s secure, non-custodial exchange. Enjoy lightning-fast trades, best rates, and cross-chain support for 200+ tokens.',
    images: ['/Cyclespace-logo/CS-logo-black-2.png'],
    site: '@AlphaChain',
  },
  alternates: {
    canonical: 'https://alphachain.com/swap',
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
};

import Header from "../components/layout/Header";

import Footer from "../components/layout/Footer";
import SwapHero from "./components/SwapHero";
import SwapDemo from "./components/SwapDemo";
import SwapFeatures from "./components/SwapFeatures";
import SwapSecurity from "./components/SwapSecurity";
import SwapTestimonials from "./components/SwapTestimonials";


export default function SwapDetails() {
  return (
    <div className="min-h-screen bg-primary text-white">
      <Header />
      <main>
        <SwapHero />
        <SwapDemo />
        <SwapFeatures />
        <SwapSecurity />
        <SwapTestimonials />
      </main>
      <Footer />
    </div>
  )
}
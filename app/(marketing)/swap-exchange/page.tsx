import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crypto Swap Exchange | Fast, Secure Token Swaps | AlphaChain',
  description: 'Swap cryptocurrencies instantly with AlphaChain’s secure, non-custodial exchange. Enjoy lightning-fast trades, best rates, and cross-chain support for 200+ tokens.',
  keywords: 'crypto swap, token exchange, instant swap, cross-chain, secure trading, AlphaChain swap, best rates',
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
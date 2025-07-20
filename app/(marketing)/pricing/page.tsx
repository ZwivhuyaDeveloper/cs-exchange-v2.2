import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing | AlphaChain Signals Plans & Subscription Costs',
  description: 'Compare AlphaChain Signals pricing plans. Choose from Free, Pro, or Institutional to access AI-powered crypto signals, advanced analytics, and premium trading tools. 7-day free trial available.',
  keywords: 'crypto pricing, trading plans, subscription, AlphaChain cost, pro plan, institutional trading, free trial, crypto analytics',
};

import Footer from "@/app/(marketing)/components/layout/Footer";
import Header from "@/app/(marketing)/components/layout/Header";
import PricingComparison from "@/app/(marketing)/pricing/components/PricingComparison";
import PricingFAQ from "@/app/(marketing)/pricing/components/PricingFAQ";
import PricingHero from "@/app/(marketing)/pricing/components/PricingHero";
import PricingPlans from "@/app/(marketing)/pricing/components/PricingPlans";
import PricingTestimonials from "@/app/(marketing)/pricing/components/PricingTestimonials";


export default function PricingPage() {
  return (
    <div className="min-h-screen bg-primary text-white">
      <Header />
      <main>
        <PricingHero />
        <PricingPlans />
        <PricingComparison />
        <PricingTestimonials />
        <PricingFAQ />
      </main>
      <Footer />
    </div>
  )
}
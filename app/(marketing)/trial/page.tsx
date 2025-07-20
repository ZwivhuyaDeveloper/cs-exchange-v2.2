import type { Metadata } from 'next';
import TrialSignup from "@/app/(marketing)/trial/components/TrialSignup";
import Footer from "@/app/(marketing)/components/layout/Footer";
import Header from "@/app/(marketing)/components/layout/Header";

export const metadata: Metadata = {
  title: 'Start Free Trial | AlphaChain Crypto Signals & Tools',
  description: 'Start your 7-day free trial with AlphaChain. Experience AI-powered crypto signals, advanced analytics, and premium trading tools with no credit card required.',
  keywords: 'free trial, AlphaChain trial, crypto signals free, trading tools trial, 7-day trial, no credit card',
};

export default function TrialPage() {
  return (
    <div className="min-h-screen bg-primary text-white">
      <Header />
      <main className="py-20">
        <TrialSignup />
      </main>
      <Footer />
    </div>
  )
}
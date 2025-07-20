import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crypto News Dashboard | Real-Time AI Market Alerts | AlphaChain',
  description: 'Stay ahead with AlphaChain’s AI-powered crypto news dashboard. Get real-time alerts, sentiment analysis, and breaking news from 200+ sources. Trusted by 5,000+ traders.',
  keywords: 'crypto news, market alerts, sentiment analysis, AI news, blockchain news, real-time crypto, AlphaChain dashboard',
};
import Footer from "@/app/(marketing)/components/layout/Footer";
import Header from "@/app/(marketing)/components/layout/Header";
import NewsHero from "./components/NewsHero";
import NewsFeatures from "./components/NewsFeatures";
import NewsDemo from "./components/NewsDemo";
import NewsSocialProof from "./components/NewsSocialProof";




export default function NewsDetails() {
  return (
    <div className="min-h-screen bg-primary text-white">
      <Header />
      <main>
        <NewsHero />
        <NewsFeatures />
        <NewsDemo />
        <NewsSocialProof />
      </main>
      <Footer />
    </div>
  )
}
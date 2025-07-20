import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Crypto News Dashboard | Real-Time AI Market Alerts | AlphaChain',
  description: 'Stay ahead with AlphaChain’s AI-powered crypto news dashboard. Get real-time alerts, sentiment analysis, and breaking news from 200+ sources. Trusted by 5,000+ traders.',
  keywords: 'crypto news, market alerts, sentiment analysis, AI news, blockchain news, real-time crypto, AlphaChain dashboard',
  openGraph: {
    title: 'Crypto News Dashboard | Real-Time AI Market Alerts | AlphaChain',
    description: 'Stay ahead with AlphaChain’s AI-powered crypto news dashboard. Get real-time alerts, sentiment analysis, and breaking news from 200+ sources. Trusted by 5,000+ traders.',
    url: 'https://alphachain.com/news',
    type: 'website',
    images: [
      {
        url: '/Cyclespace-logo/CS-logo-black-2.png',
        width: 1200,
        height: 630,
        alt: 'AlphaChain News Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crypto News Dashboard | Real-Time AI Market Alerts | AlphaChain',
    description: 'Stay ahead with AlphaChain’s AI-powered crypto news dashboard. Get real-time alerts, sentiment analysis, and breaking news from 200+ sources. Trusted by 5,000+ traders.',
    images: ['/Cyclespace-logo/CS-logo-black-2.png'],
    site: '@AlphaChain',
  },
  alternates: {
    canonical: 'https://alphachain.com/news',
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
        <Script id="ld-json-articles" type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'NewsArticle',
                headline: 'Bitcoin ETF Approval Speculation Drives Market Rally',
                datePublished: '2025-07-10',
                author: { '@type': 'Organization', name: 'AlphaChain News' },
                articleSection: 'Bitcoin',
                description: 'Speculation around Bitcoin ETF approval is driving a significant market rally.',
                url: 'https://alphachain.com/news',
              },
              {
                '@type': 'NewsArticle',
                headline: 'New DeFi Protocol Launches with $50M TVL',
                datePublished: '2025-07-10',
                author: { '@type': 'Organization', name: 'AlphaChain News' },
                articleSection: 'DeFi',
                description: 'A new DeFi protocol has launched, quickly amassing $50M in total value locked.',
                url: 'https://alphachain.com/news',
              },
              {
                '@type': 'NewsArticle',
                headline: 'SEC Announces New Crypto Compliance Guidelines',
                datePublished: '2025-07-10',
                author: { '@type': 'Organization', name: 'AlphaChain News' },
                articleSection: 'Regulations',
                description: 'The SEC has announced new compliance guidelines for the crypto industry.',
                url: 'https://alphachain.com/news',
              },
            ],
          })}
        </Script>
      </main>
      <Footer />
    </div>
  );
}
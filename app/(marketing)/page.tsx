import type { Metadata } from 'next';
import Script from 'next/script';
import Header from '@/app/(marketing)/components/layout/Header'
import Hero from '@/app/(marketing)/components/landing/Hero'
import FeatureTeasers from '@/app/(marketing)/components/landing/FeatureTeasers'
import SocialProof from '@/app/(marketing)/components/landing/SocialProof'
import PricingSection from '@/app/(marketing)/components/landing/PricingSection'
import Footer from '@/app/(marketing)/components/layout/Footer'
import { TabsHome } from './components/landing/TabsHome'


export const metadata: Metadata = {
  title: 'Cyclespace Exchange | AI Crypto Trading, News & Research Platform',
  description: 'Unlock real-time AI-powered crypto signals, news, and research. Trade smarter with 90% signal accuracy, advanced analytics, and the best swap rates. Join 50,000+ traders on Cyclespace.',
  keywords: 'crypto signals, AI trading, cryptocurrency news, blockchain analytics, swap exchange, trading platform, market research, trading bots',
  openGraph: {
    title: 'Cyclespace Exchange | AI Crypto Trading, News & Research Platform',
    description: 'Unlock real-time AI-powered crypto signals, news, and research. Trade smarter with 90% signal accuracy, advanced analytics, and the best swap rates. Join 50,000+ traders on Cyclespace.',
    url: 'https://cyclespace.exchange/',
    type: 'website',
    images: [
      {
        url: '/Cyclespace-logo/CS-logo-black-2.png',
        width: 1200,
        height: 630,
        alt: 'Cyclespace Exchange Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cyclespace Exchange | AI Crypto Trading, News & Research Platform',
    description: 'Unlock real-time AI-powered crypto signals, news, and research. Trade smarter with 90% signal accuracy, advanced analytics, and the best swap rates. Join 50,000+ traders on Cyclespace.',
    images: ['/Cyclespace-logo/CS-logo-black-2.png'],
    site: '@Cyclespace',
  },
  alternates: {
    canonical: 'https://cyclespace.exchange/',
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
};

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
        <Script id="ld-json-org" type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Cyclespace',
            url: 'https://cyclespace.exchange/',
            logo: 'https://cyclespace.exchange/Cyclespace-logo/CS-logo-black-2.png',
            sameAs: [
              'https://twitter.com/Cyclespace',
              'https://github.com/Cyclespace',
              'https://linkedin.com/company/cyclespace',
            ],
          })}
        </Script>
        <Script id="ld-json-website" type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Cyclespace',
            url: 'https://cyclespace.exchange/',
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://cyclespace.exchange/search?q={search_term_string}',
              'query-input': 'required name=search_term_string',
            },
          })}
        </Script>
      </main>
      <Footer />
    </div>
  );
}
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crypto Research Terminal | Analytics & Reports | AlphaChain',
  description: 'Access institutional-grade crypto research, technical indicators, and fundamental analysis. AlphaChain’s research terminal empowers traders with actionable insights and whale tracking.',
  keywords: 'crypto research, blockchain analytics, market reports, technical analysis, whale tracking, AlphaChain research terminal',
  openGraph: {
    title: 'Crypto Research Terminal | Analytics & Reports | AlphaChain',
    description: 'Access institutional-grade crypto research, technical indicators, and fundamental analysis. AlphaChain’s research terminal empowers traders with actionable insights and whale tracking.',
    url: 'https://alphachain.com/research',
    type: 'website',
    images: [
      {
        url: '/Cyclespace-logo/CS-logo-black-2.png',
        width: 1200,
        height: 630,
        alt: 'AlphaChain Research Terminal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crypto Research Terminal | Analytics & Reports | AlphaChain',
    description: 'Access institutional-grade crypto research, technical indicators, and fundamental analysis. AlphaChain’s research terminal empowers traders with actionable insights and whale tracking.',
    images: ['/Cyclespace-logo/CS-logo-black-2.png'],
    site: '@AlphaChain',
  },
  alternates: {
    canonical: 'https://alphachain.com/research',
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
import ResearchHero from "./components/ResearchHero";
import ResearchFeatures from "./components/ResearchFeatures";
import ResearchComparison from "./components/ResearchComparison";
import ResearchTestimonial from "./components/ResearchTestimonial";


export default function ResearchDetails() {
  return (
    <div className="min-h-screen bg-primary text-white">
      <Header />
      <main>
        <ResearchHero />
        <ResearchFeatures />
        <ResearchComparison />
        <ResearchTestimonial />
      </main>
      <Footer />
    </div>
  )
}
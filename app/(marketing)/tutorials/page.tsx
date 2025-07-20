import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crypto Trading Tutorials & Guides | AlphaChain Academy',
  description: 'Master crypto trading with AlphaChain’s step-by-step tutorials and guides. Learn technical analysis, DeFi, risk management, and more from industry experts.',
  keywords: 'crypto tutorials, trading guides, technical analysis, DeFi, risk management, AlphaChain academy, blockchain education',
  openGraph: {
    title: 'Crypto Trading Tutorials & Guides | AlphaChain Academy',
    description: 'Master crypto trading with AlphaChain’s step-by-step tutorials and guides. Learn technical analysis, DeFi, risk management, and more from industry experts.',
    url: 'https://alphachain.com/tutorials',
    type: 'website',
    images: [
      {
        url: '/Cyclespace-logo/CS-logo-black-2.png',
        width: 1200,
        height: 630,
        alt: 'AlphaChain Tutorials',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crypto Trading Tutorials & Guides | AlphaChain Academy',
    description: 'Master crypto trading with AlphaChain’s step-by-step tutorials and guides. Learn technical analysis, DeFi, risk management, and more from industry experts.',
    images: ['/Cyclespace-logo/CS-logo-black-2.png'],
    site: '@AlphaChain',
  },
  alternates: {
    canonical: 'https://alphachain.com/tutorials',
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
};

import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import TutorialsList from "./components/TutorialList";
import TutorialsCategories from "./components/TutorialsCategory";
import TutorialsHero from "./components/TutorialsHero";


export default function TutorialsPage() {
  return (
    <div className="min-h-screen bg-primary text-white">
      <Header />
      <main>
        <TutorialsHero />
        <TutorialsCategories />
        <TutorialsList />
      </main>
      <Footer />
    </div>
  )
}
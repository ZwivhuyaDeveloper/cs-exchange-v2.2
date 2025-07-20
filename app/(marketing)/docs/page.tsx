import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Documentation | AlphaChain Developer Resources',
  description: 'Explore AlphaChain’s API documentation, integration guides, and developer resources. Get started with our REST API and SDKs for seamless integration.',
  keywords: 'API documentation, developer resources, integration guides, AlphaChain API, SDK, crypto API, developer docs',
  openGraph: {
    title: 'API Documentation | AlphaChain Developer Resources',
    description: 'Explore AlphaChain’s API documentation, integration guides, and developer resources. Get started with our REST API and SDKs for seamless integration.',
    url: 'https://alphachain.com/docs',
    type: 'website',
    images: [
      {
        url: '/Cyclespace-logo/CS-logo-black-2.png',
        width: 1200,
        height: 630,
        alt: 'AlphaChain Docs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'API Documentation | AlphaChain Developer Resources',
    description: 'Explore AlphaChain’s API documentation, integration guides, and developer resources. Get started with our REST API and SDKs for seamless integration.',
    images: ['/Cyclespace-logo/CS-logo-black-2.png'],
    site: '@AlphaChain',
  },
  alternates: {
    canonical: 'https://alphachain.com/docs',
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
import DocsComingSoon from "./components/Docs";


export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#0A0E17] text-white">
      <Header />
      <main>
        <DocsComingSoon />
      </main>
      <Footer />
    </div>
  )
}
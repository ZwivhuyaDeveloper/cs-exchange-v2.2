import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | AlphaChain Platform',
  description: 'Read the Terms of Service for AlphaChain. Learn about user rights, responsibilities, and platform policies for AI-powered crypto trading and research.',
  keywords: 'terms of service, AlphaChain terms, user agreement, trading platform policies, crypto terms',
  openGraph: {
    title: 'Terms of Service | AlphaChain Platform',
    description: 'Read the Terms of Service for AlphaChain. Learn about user rights, responsibilities, and platform policies for AI-powered crypto trading and research.',
    url: 'https://alphachain.com/terms',
    type: 'website',
    images: [
      {
        url: '/Cyclespace-logo/CS-logo-black-2.png',
        width: 1200,
        height: 630,
        alt: 'AlphaChain Terms of Service',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service | AlphaChain Platform',
    description: 'Read the Terms of Service for AlphaChain. Learn about user rights, responsibilities, and platform policies for AI-powered crypto trading and research.',
    images: ['/Cyclespace-logo/CS-logo-black-2.png'],
    site: '@AlphaChain',
  },
  alternates: {
    canonical: 'https://alphachain.com/terms',
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
};

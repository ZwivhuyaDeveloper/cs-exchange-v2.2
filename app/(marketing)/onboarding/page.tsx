import type { Metadata } from 'next';
import OnboardingFlow from "@/app/(marketing)/onboarding/components/OnboardingFlow";


export const metadata: Metadata = {
  title: 'Sign Up | Create Your AlphaChain Account',
  description: 'Join AlphaChain to access AI-powered crypto signals, trading tools, and research. Create your free account and start your trading journey today.',
  keywords: 'sign up, create account, AlphaChain registration, crypto onboarding, trading platform signup, free account',
  openGraph: {
    title: 'Sign Up | Create Your AlphaChain Account',
    description: 'Join AlphaChain to access AI-powered crypto signals, trading tools, and research. Create your free account and start your trading journey today.',
    url: 'https://alphachain.com/onboarding',
    type: 'website',
    images: [
      {
        url: '/Cyclespace-logo/CS-logo-black-2.png',
        width: 1200,
        height: 630,
        alt: 'AlphaChain Sign Up',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sign Up | Create Your AlphaChain Account',
    description: 'Join AlphaChain to access AI-powered crypto signals, trading tools, and research. Create your free account and start your trading journey today.',
    images: ['/Cyclespace-logo/CS-logo-black-2.png'],
    site: '@AlphaChain',
  },
  alternates: {
    canonical: 'https://alphachain.com/onboarding',
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
};

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-primary text-white">
      <OnboardingFlow />
    </div>
  )
}
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | Access Your AlphaChain Account',
  description: 'Sign in to your AlphaChain account to access AI-powered crypto signals, trading tools, and portfolio analytics. Secure login for all users.',
  keywords: 'login, account access, AlphaChain login, crypto dashboard, secure sign in, trading platform login',
  openGraph: {
    title: 'Login | Access Your AlphaChain Account',
    description: 'Sign in to your AlphaChain account to access AI-powered crypto signals, trading tools, and portfolio analytics. Secure login for all users.',
    url: 'https://alphachain.com/login',
    type: 'website',
    images: [
      {
        url: '/Cyclespace-logo/CS-logo-black-2.png',
        width: 1200,
        height: 630,
        alt: 'AlphaChain Login',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Login | Access Your AlphaChain Account',
    description: 'Sign in to your AlphaChain account to access AI-powered crypto signals, trading tools, and portfolio analytics. Secure login for all users.',
    images: ['/Cyclespace-logo/CS-logo-black-2.png'],
    site: '@AlphaChain',
  },
  alternates: {
    canonical: 'https://alphachain.com/login',
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
};

import Header from '@/app/(marketing)/components/layout/Header'
import Footer from '../components/layout/Footer'
import LoginForm from '@/app/(marketing)/login/components/LoginForm'


export default function LoginPage() {
  return (
    <div className="min-h-screen bg-primary text-white">
      <Header />
      <main className="py-20">
        <LoginForm />
      </main>
      <Footer />
    </div>
  )
}
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | Access Your AlphaChain Account',
  description: 'Sign in to your AlphaChain account to access AI-powered crypto signals, trading tools, and portfolio analytics. Secure login for all users.',
  keywords: 'login, account access, AlphaChain login, crypto dashboard, secure sign in, trading platform login',
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
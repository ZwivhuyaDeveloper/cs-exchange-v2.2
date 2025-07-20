import type { Metadata } from 'next';
import OnboardingFlow from "@/app/(marketing)/onboarding/components/OnboardingFlow";


export const metadata: Metadata = {
  title: 'Sign Up | Create Your AlphaChain Account',
  description: 'Join AlphaChain to access AI-powered crypto signals, trading tools, and research. Create your free account and start your trading journey today.',
  keywords: 'sign up, create account, AlphaChain registration, crypto onboarding, trading platform signup, free account',
};

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-primary text-white">
      <OnboardingFlow />
    </div>
  )
}
import Header from '@/app/(marketing)/components/layout/Header'
import Hero from '@/app/(marketing)/components/landing/Hero'
import FeatureTeasers from '@/app/(marketing)/components/landing/FeatureTeasers'
import SocialProof from '@/app/(marketing)/components/landing/SocialProof'
import PricingSection from '@/app/(marketing)/components/landing/PricingSection'
import Footer from '@/app/(marketing)/components/layout/Footer'
import { TabsHome } from './components/landing/TabsHome'


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
      </main>
      <Footer />
    </div>
  )
}
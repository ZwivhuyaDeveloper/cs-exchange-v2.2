import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crypto Trading Tutorials & Guides | AlphaChain Academy',
  description: 'Master crypto trading with AlphaChain’s step-by-step tutorials and guides. Learn technical analysis, DeFi, risk management, and more from industry experts.',
  keywords: 'crypto tutorials, trading guides, technical analysis, DeFi, risk management, AlphaChain academy, blockchain education',
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
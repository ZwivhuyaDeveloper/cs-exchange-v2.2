
import Header from '../components/layout/Header'
import TradingHero from './components/TradingHero'
import TradingFeatures from './components/TradingFeatures'
import TradingIntegrations from './components/TradingIntegrations'
import TradingTestimonials from './components/TradingTesmonials'
import Footer from '../components/layout/Footer'



export default function TradingPage() {
  return (
    <div className="min-h-screen bg-primary text-white">
      <Header />
      <main>
        <TradingHero />
        <TradingFeatures />
        <TradingIntegrations />
        <TradingTestimonials />
      </main>
      <Footer />
    </div>
  )
}
import Footer from "@/app/(marketing)/components/layout/Footer";
import Header from "@/app/(marketing)/components/layout/Header";
import SignalsDisclaimer from "@/app/(marketing)/signals/components/SignalsDisclaimer";
import SignalsHero from "@/app/(marketing)/signals/components/SignalsHero";
import SignalsPerformance from "@/app/(marketing)/signals/components/SignalsPerformance";
import SignalsWorkflow from "@/app/(marketing)/signals/components/SignalsWorkflow";


export default function SignalsPage() {
  return (
    <div className="min-h-screen bg-primary text-white">
      <Header />
      <main>
        <SignalsHero />
        <SignalsWorkflow />
        <SignalsPerformance />
        <SignalsDisclaimer />
      </main>
      <Footer />
    </div>
  )
}
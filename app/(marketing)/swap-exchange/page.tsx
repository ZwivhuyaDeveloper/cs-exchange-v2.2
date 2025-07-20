import Header from "../components/layout/Header";

import Footer from "../components/layout/Footer";
import SwapHero from "./components/SwapHero";
import SwapDemo from "./components/SwapDemo";
import SwapFeatures from "./components/SwapFeatures";
import SwapSecurity from "./components/SwapSecurity";
import SwapTestimonials from "./components/SwapTestimonials";


export default function SwapDetails() {
  return (
    <div className="min-h-screen bg-primary text-white">
      <Header />
      <main>
        <SwapHero />
        <SwapDemo />
        <SwapFeatures />
        <SwapSecurity />
        <SwapTestimonials />
      </main>
      <Footer />
    </div>
  )
}
import Footer from "@/app/(marketing)/components/layout/Footer";
import Header from "@/app/(marketing)/components/layout/Header";
import ResearchHero from "./components/ResearchHero";
import ResearchFeatures from "./components/ResearchFeatures";
import ResearchComparison from "./components/ResearchComparison";
import ResearchTestimonial from "./components/ResearchTestimonial";


export default function ResearchDetails() {
  return (
    <div className="min-h-screen bg-primary text-white">
      <Header />
      <main>
        <ResearchHero />
        <ResearchFeatures />
        <ResearchComparison />
        <ResearchTestimonial />
      </main>
      <Footer />
    </div>
  )
}
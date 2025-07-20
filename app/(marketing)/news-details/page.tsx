import Footer from "@/app/(marketing)/components/layout/Footer";
import Header from "@/app/(marketing)/components/layout/Header";
import NewsHero from "./components/NewsHero";
import NewsFeatures from "./components/NewsFeatures";
import NewsDemo from "./components/NewsDemo";
import NewsSocialProof from "./components/NewsSocialProof";




export default function NewsDetails() {
  return (
    <div className="min-h-screen bg-primary text-white">
      <Header />
      <main>
        <NewsHero />
        <NewsFeatures />
        <NewsDemo />
        <NewsSocialProof />
      </main>
      <Footer />
    </div>
  )
}
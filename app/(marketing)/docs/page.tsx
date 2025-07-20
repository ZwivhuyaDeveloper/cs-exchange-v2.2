import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import DocsComingSoon from "./components/Docs";


export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#0A0E17] text-white">
      <Header />
      <main>
        <DocsComingSoon />
      </main>
      <Footer />
    </div>
  )
}
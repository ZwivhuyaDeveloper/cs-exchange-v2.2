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
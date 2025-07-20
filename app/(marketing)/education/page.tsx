import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import EducationCertification from "./components/Certification";
import EducationCourses from "./components/Courses";
import EducationHero from "./components/EducationHero";
import EducationProgress from "./components/Progress";


export default function EducationPage() {
  return (
    <div className="min-h-screen bg-primary text-white">
      <Header />
      <main>
        <EducationHero />
        <EducationCourses />
        <EducationProgress />
        <EducationCertification />
      </main>
      <Footer />
    </div>
  )
}
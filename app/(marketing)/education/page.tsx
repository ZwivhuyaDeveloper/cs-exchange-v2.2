import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crypto Trading Academy | Courses & Certification | AlphaChain',
  description: 'Advance your crypto career with AlphaChain’s trading academy. Access expert-led courses, professional certification, and track your learning progress.',
  keywords: 'crypto academy, trading courses, certification, blockchain education, AlphaChain learning, professional trader, crypto skills',
};

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
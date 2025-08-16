import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crypto Trading Academy | Courses & Certification | AlphaChain',
  description: 'Advance your crypto career with AlphaChain’s trading academy. Access expert-led courses, professional certification, and track your learning progress.',
  keywords: 'crypto academy, trading courses, certification, blockchain education, AlphaChain learning, professional trader, crypto skills',
  openGraph: {
    title: 'Crypto Trading Academy | Courses & Certification | AlphaChain',
    description: 'Advance your crypto career with AlphaChain’s trading academy. Access expert-led courses, professional certification, and track your learning progress.',
    url: 'https://alphachain.com/education',
    type: 'website',
    images: [
      {
        url: '/Cyclespace-logo/CS-logo-black-2.png',
        width: 1200,
        height: 630,
        alt: 'AlphaChain Academy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crypto Trading Academy | Courses & Certification | AlphaChain',
    description: 'Advance your crypto career with AlphaChain’s trading academy. Access expert-led courses, professional certification, and track your learning progress.',
    images: ['/Cyclespace-logo/CS-logo-black-2.png'],
    site: '@AlphaChain',
  },
  alternates: {
    canonical: 'https://alphachain.com/education',
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
};

import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import EducationCertification from "./components/Certification";
import EducationCourses from "./components/Courses";
import EducationHero from "./components/EducationHero";
import EducationProgress from "./components/Progress";


export default function EducationPage() {
  return (
    <div className="min-h-screen bg-[#0A0E17] text-white">
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
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Documentation | AlphaChain Developer Resources',
  description: 'Explore AlphaChain’s API documentation, integration guides, and developer resources. Get started with our REST API and SDKs for seamless integration.',
  keywords: 'API documentation, developer resources, integration guides, AlphaChain API, SDK, crypto API, developer docs',
};

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
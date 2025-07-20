import TrialSignup from "@/app/(marketing)/trial/components/TrialSignup";
import Footer from "@/app/(marketing)/components/layout/Footer";
import Header from "@/app/(marketing)/components/layout/Header";

export default function TrialPage() {
  return (
    <div className="min-h-screen bg-primary text-white">
      <Header />
      <main className="py-20">
        <TrialSignup />
      </main>
      <Footer />
    </div>
  )
}
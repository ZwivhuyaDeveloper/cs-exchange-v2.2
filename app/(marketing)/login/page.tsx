import Header from '@/app/(marketing)/components/layout/Header'
import Footer from '@/components/Footer'
import LoginForm from '@/app/(marketing)/login/components/LoginForm'


export default function LoginPage() {
  return (
    <div className="min-h-screen bg-primary text-white">
      <Header />
      <main className="py-20">
        <LoginForm />
      </main>
      <Footer />
    </div>
  )
}
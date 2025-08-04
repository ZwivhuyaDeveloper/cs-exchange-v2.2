import { 
  SignIn,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useAuth,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, LogIn } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              CS Exchange
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <SignedIn>
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <Button asChild variant="ghost" size="sm">
                <Link href="/">Back to Home</Link>
              </Button>
              <SignUpButton mode="modal">
                <Button size="sm">Sign Up</Button>
              </SignUpButton>
            </SignedOut>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Welcome Message */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
              Welcome back to <span className="text-blue-600 dark:text-blue-400">CS Exchange</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Sign in to access your account, manage your portfolio, and explore the latest market insights.
            </p>
            <div className="space-y-4 pt-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <svg className="h-4 w-4 text-blue-600 dark:text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-600 dark:text-gray-300">Access premium research and signals</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <svg className="h-4 w-4 text-blue-600 dark:text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-600 dark:text-gray-300">Track your portfolio performance</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <svg className="h-4 w-4 text-blue-600 dark:text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-600 dark:text-gray-300">Get personalized market insights</span>
              </div>
            </div>
          </div>

          {/* Right Column - Sign In Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sign in to your account</h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{' '}
                  <SignUpButton mode="modal">
                    <button className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                      Sign up
                    </button>
                  </SignUpButton>
                </p>
              </div>

              <div className="space-y-6">
                <SignIn
                  appearance={{
                    elements: {
                      formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 px-4 rounded-lg w-full transition-colors',
                      formFieldInput: 'block w-full rounded-lg border-0 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 p-3',
                      formFieldLabel: 'block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100 mb-1',
                      socialButtonsBlockButton: 'flex w-full items-center justify-center space-x-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors',
                      dividerLine: 'bg-gray-200 dark:bg-gray-600',
                      dividerText: 'text-xs text-gray-500 dark:text-gray-400',
                      footerActionText: 'text-sm text-gray-600 dark:text-gray-400',
                      footerActionLink: 'font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300',
                    },
                  }}
                  path="/sign-in"
                  routing="path"
                  signUpUrl="/sign-up"
                  afterSignInUrl="/dashboard"
                  afterSignUpUrl="/onboarding"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} CS Exchange. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

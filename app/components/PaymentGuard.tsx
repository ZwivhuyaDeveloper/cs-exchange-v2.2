'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function PaymentGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser()
  const [accessGranted, setAccessGranted] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter();


  useEffect(() => {
    if (!isLoaded) return

    const verifyPayment = async () => {
      if (user) {
        // Check Clerk metadata first
        const isPremium = user.publicMetadata.isPremium as boolean
        
        if (isPremium) {
          setAccessGranted(true)
        } else {
          // Check server for payment status
          try {
            const res = await fetch('/api/payment/status')
            if (res.ok) {
              const data = await res.json()
              setAccessGranted(data.isPremium)
              if (data.isPremium) {
                // Refresh to update Clerk metadata
                router.refresh();
              }
            }
          } catch (error) {
            console.error('Payment status check failed:', error)
          }
        }
      }
      setLoading(false)
    }

    verifyPayment()
  }, [user, isLoaded, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner border-4 border-blue-500 border-t-transparent rounded-full w-12 h-12 mx-auto mb-4"></div>
          <p>Verifying payment status...</p>
        </div>
      </div>
    )
  }

  if (!accessGranted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md p-8 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4">Premium Access Required</h2>
          <p className="mb-6 text-gray-600">
            You need an active subscription to access this content
          </p>
          <a 
            href="/payment-required" 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Upgrade Account
          </a>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
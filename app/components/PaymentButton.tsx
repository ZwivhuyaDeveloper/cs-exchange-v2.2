'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function PaymentButton() {
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter();

  const handlePayment = async () => {
    if (!user) return
    
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/payment/create-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: 1000 }) // $10.00
      })
      
      if (!response.ok) {
        throw new Error('Failed to create payment link')
      }
      
      const { url } = await response.json()
      // Open payment in new tab
      const newWindow = window.open(url, '_blank');
      if (!newWindow) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }
      
      // Poll for payment completion
      const checkPayment = setInterval(async () => {
        try {
          const statusRes = await fetch('/api/payment/status');
          if (statusRes.ok) {
            const { isPremium } = await statusRes.json();
            if (isPremium) {
              clearInterval(checkPayment);
              router.refresh();
            }
          }
        } catch (error) {
          console.error('Payment status check failed:', error);
        }
      }, 5000);
      
    } catch (err: any) {
      setError(err.message || 'Failed to initiate payment. Please try again.')
      console.error('Payment initiation error:', err)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="mt-6">
      <button
        onClick={handlePayment}
        disabled={loading}
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Upgrade to Premium ($10)'}
      </button>
      
      {error && (
        <p className="mt-3 text-red-500">{error}</p>
      )}
    </div>
  )
}
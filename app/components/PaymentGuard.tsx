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
    if (!isLoaded) return;

    const verifyPayment = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Type-safe access to public metadata
        const publicMetadata = user.publicMetadata as {
          isPremium?: boolean;
          boomFiCustomerId?: string;
        };

        // Check Clerk metadata first
        if (publicMetadata.isPremium) {
          setAccessGranted(true);
          setLoading(false);
          return;
        }

        // Check if user has a BoomFi customer ID
        const customerId = publicMetadata.boomFiCustomerId;
        if (!customerId) {
          setLoading(false);
          return;
        }

        // Check for recent payments (last 5 minutes)
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
        
        // Use absolute URL to ensure proper resolution
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
          (typeof window !== 'undefined' ? window.location.origin : '');
        
        if (!baseUrl) {
          console.error('Failed to determine base URL');
          setLoading(false);
          return;
        }

        const url = new URL('/api/check-payments', baseUrl);
        url.searchParams.append('customerId', customerId);
        url.searchParams.append('since', fiveMinutesAgo);
        
        const res = await fetch(url.toString(), {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const { hasRecentPayments } = await res.json();
        setAccessGranted(hasRecentPayments);
        
        if (hasRecentPayments) {
          // Refresh to update Clerk metadata
          router.refresh();
        }
      } catch (error) {
        console.error('Payment status check failed:', error);
        // If there's an error, we'll deny access to be safe
        setAccessGranted(false);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [user, isLoaded, router]);

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
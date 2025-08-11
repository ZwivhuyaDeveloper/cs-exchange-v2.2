'use client'

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface PaymentButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  buttonText?: string;
  loadingText?: string;
  successText?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function PaymentButton({
  variant = 'default',
  size = 'md',
  className = '',
  buttonText = 'Upgrade to Premium',
  loadingText = 'Processing...',
  successText = 'Payment Successful!',
  onSuccess,
  onError,
}: PaymentButtonProps) {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  
  const variantClasses = {
    default: 'bg-green-600 hover:bg-green-700 text-white',
    outline: 'bg-transparent border-2 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-green-600',
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
  };

  const handlePayment = async () => {
    if (!user) {
      router.push('/sign-in?redirect_url=' + encodeURIComponent(window.location.pathname));
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      // Use your prebuilt BoomFi link with user metadata
      const paymentUrl = new URL('https://pay.boomfi.xyz/2zrz89atDuKzeUqJ4uIpyGv4N3S');
      
      // Add user metadata to identify them in the webhook
      paymentUrl.searchParams.append('metadata[clerkUserId]', user.id);
      paymentUrl.searchParams.append('redirect', window.location.href);
      
      // Open payment in new tab
      const paymentWindow = window.open(paymentUrl.toString(), '_blank');
      
      if (!paymentWindow) {
        throw new Error('Popup was blocked. Please allow popups for this site and try again.');
      }
      
      // Start polling for payment status
      await pollForPaymentStatus();
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initiate payment. Please try again.';
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
      console.error('Payment initiation error:', err);
      setLoading(false);
    }
  };
  
  const pollForPaymentStatus = async () => {
    if (!user) return;
    
    let checkCount = 0;
    const maxChecks = 24; // 2 minutes of polling (24 * 5s)
    
    const checkInterval = setInterval(async () => {
      try {
        checkCount++;
        
        if (checkCount > maxChecks) {
          clearInterval(checkInterval);
          setError('Payment verification timed out. Please refresh the page if your payment was successful.');
          setLoading(false);
          return;
        }

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
          (typeof window !== 'undefined' ? window.location.origin : '');
        
        if (!baseUrl) {
          throw new Error('Failed to determine base URL');
        }

        const url = new URL('/api/check-payments', baseUrl);
        url.searchParams.append('customerId', user.id);
        url.searchParams.append('since', new Date(Date.now() - 10 * 60 * 1000).toISOString());
        
        const statusRes = await fetch(url.toString(), {
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
        });
        
        if (statusRes.ok) {
          const { hasRecentPayments } = await statusRes.json();
          if (hasRecentPayments) {
            clearInterval(checkInterval);
            setSuccess(true);
            setLoading(false);
            onSuccess?.();
            // Refresh the page to update the UI with new permissions
            setTimeout(() => router.refresh(), 1500);
            return;
          }
        } else if (statusRes.status === 429) {
          // Handle rate limiting
          const retryAfter = statusRes.headers.get('Retry-After') || '5';
          console.warn(`Rate limited. Retrying after ${retryAfter} seconds`);
          await new Promise(resolve => setTimeout(resolve, parseInt(retryAfter) * 1000));
        }
      } catch (error) {
        console.error('Payment status check failed:', error);
        // Don't show every error to the user to avoid spamming
        if (checkCount % 3 === 0) {
          setError('Having trouble verifying payment. Please refresh the page to check your status.');
        }
      }
    }, 5000); // Check every 5 seconds
    
    // Cleanup interval on component unmount
    return () => clearInterval(checkInterval);
  };

  if (!isLoaded) {
    return (
      <button 
        disabled 
        className={`inline-flex items-center justify-center rounded-md ${sizeClasses[size]} bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed ${className}`}
      >
        <Loader2 className="animate-spin mr-2 h-4 w-4" />
        Loading...
      </button>
    );
  }

  if (success) {
    return (
      <div className="flex items-center text-green-600 dark:text-green-400">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        {successText}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handlePayment}
        disabled={loading}
        className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 disabled:opacity-50 disabled:pointer-events-none ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin mr-2 h-4 w-4" />
            {loadingText}
          </>
        ) : (
          buttonText
        )}
      </button>
      
      {error && (
        <p className="mt-2 text-sm text-red-500 dark:text-red-400 text-center">
          {error}
        </p>
      )}
    </div>
  );
}
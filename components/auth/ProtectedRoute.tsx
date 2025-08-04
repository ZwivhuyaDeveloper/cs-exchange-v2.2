'use client'

import { useAuth } from '@clerk/nextjs'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: ReactNode
  requiredPermission?: 'canAccessSignals' | 'canAccessResearch'
  redirectUrl?: string
}

type UserMetadata = {
  [key: string]: unknown
  canAccessSignals?: boolean
  canAccessResearch?: boolean
}

export function ProtectedRoute({ 
  children, 
  requiredPermission = 'canAccessSignals',
  redirectUrl = '/sign-in'
}: ProtectedRouteProps) {
  const { isLoaded, userId, isSignedIn, getToken } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoaded) return

    const checkAccess = async () => {
      if (!isSignedIn) {
        // Redirect to sign-in if not authenticated
        const redirectUrlWithOrigin = `${window.location.origin}${redirectUrl}?redirect_url=${encodeURIComponent(pathname || '/')}`
        window.location.href = redirectUrlWithOrigin
        return
      }

      try {
        // Get the session token which contains the user's metadata
        const token = await getToken({ template: 'access_control' })
        if (!token) {
          console.error('Failed to get session token')
          return
        }

        // Parse the token to get the metadata
        const base64Url = token.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        )
        
        const { metadata } = JSON.parse(jsonPayload)
        const hasAccess = metadata?.[requiredPermission] === true
        
        if (!hasAccess) {
          router.push('/unauthorized')
        }
      } catch (error) {
        console.error('Error checking access:', error)
        router.push('/unauthorized')
      }
    }

    checkAccess()
  }, [isLoaded, isSignedIn, getToken, router, requiredPermission, pathname, redirectUrl])

  // Show loading state while checking auth
  if (!isLoaded || (isSignedIn && !userId)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  // If we get here, the user is either:
  // 1. Not signed in (will be redirected by the useEffect)
  // 2. Signed in and has the required permission
  return <>{children}</>
}

'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function UnauthorizedPage() {
  const router = useRouter()
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Access Denied</h1>
          <p className="text-muted-foreground">
            You don't have permission to access this page. If you believe this is an error, 
            please contact our support team.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => router.push('/')}>
            Return to Home
          </Button>
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    </div>
  )
}

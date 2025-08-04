'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import SignalsPage from './page'

export default function ProtectedSignals() {
  return (
    <ProtectedRoute requiredPermission="canAccessSignals">
      <SignalsPage />
    </ProtectedRoute>
  )
}

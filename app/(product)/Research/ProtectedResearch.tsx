'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import ResearchPage from './page'

export default function ProtectedResearch() {
  return (
    <ProtectedRoute requiredPermission="canAccessResearch">
      <ResearchPage />
    </ProtectedRoute>
  )
}

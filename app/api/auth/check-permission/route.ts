import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { permission } = await request.json()
    if (!permission) {
      return NextResponse.json(
        { error: 'Permission not specified' },
        { status: 400 }
      )
    }

    // Get the session claims directly from auth()
    const { sessionClaims } = await auth()
    const unsafeMetadata = sessionClaims?.unsafeMetadata as Record<string, unknown> | undefined
    const hasPermission = unsafeMetadata?.[permission] === true

    return NextResponse.json({ hasPermission })
  } catch (error) {
    console.error('Error checking permission:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Add this to avoid caching the response
export const dynamic = 'force-dynamic'

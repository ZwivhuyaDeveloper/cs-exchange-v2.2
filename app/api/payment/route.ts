import { NextRequest, NextResponse } from 'next/server'
import { createPaymentLink } from '@/lib/boomfi'
import { getAuth } from '@clerk/nextjs/server'
import { checkUserPaymentStatus } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { userId } = getAuth(req)
  
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const { amount } = await req.json()
    const payment = await createPaymentLink(userId, amount)
    
    return NextResponse.json({ url: payment.url })
  } catch (error) {
    console.error('Payment creation error:', error)
    return new Response('Payment creation failed', { status: 500 })
  }
}

export async function GET(req: NextRequest) {
    const { userId } = getAuth(req)
    
    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }
  
    try {
      const isPremium = await checkUserPaymentStatus(userId);
      return NextResponse.json({ isPremium })
    } catch (error) {
      console.error('Payment status check failed:', error)
      return new Response('Status check failed', { status: 500 })
    }
  }
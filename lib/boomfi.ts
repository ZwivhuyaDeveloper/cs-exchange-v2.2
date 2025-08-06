import prisma from './prisma'

const BOOMFI_API_KEY = process.env.BOOMFI_API_KEY
const BASE_URL = 'https://api.boomfi.xyz'

interface BoomFiCustomer {
  id: string
  email: string
  name: string
  metadata?: Record<string, any>
}

export async function createBoomFiCustomer(customerData: {
  email: string
  name: string
  metadata?: Record<string, any>
}): Promise<BoomFiCustomer> {
  const response = await fetch(`${BASE_URL}/customers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${BOOMFI_API_KEY}`
    },
    body: JSON.stringify(customerData)
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`BoomFi customer creation failed: ${error}`)
  }

  return response.json()
}

export async function createPaymentLink(userId: string, amount: number, currency: string = 'USD') {
  const user = await prisma.userProfile.findUnique({
    where: { clerkUserId: userId }
  })

  if (!user || !user.boomFiCustomerId) {
    throw new Error('User not found or missing BoomFi customer ID')
  }

  const response = await fetch(`${BASE_URL}/paylinks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${BOOMFI_API_KEY}`
    },
    body: JSON.stringify({
      customer: user.boomFiCustomerId,
      amount,
      currency,
      metadata: {
        clerkUserId: userId,
        prismaId: user.id
      }
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Payment link creation failed: ${error}`)
  }

  return response.json()
}

import { createHmac } from 'crypto';

// ... existing BoomFi functions ...

export async function verifyBoomFiWebhook(req: Request): Promise<boolean> {
  const BOOMFI_WEBHOOK_SECRET = process.env.BOOMFI_WEBHOOK_SECRET;
  const signature = req.headers.get('BoomFi-Signature') || '';
  
  if (!BOOMFI_WEBHOOK_SECRET) {
    console.error('BOOMFI_WEBHOOK_SECRET not configured');
    return false;
  }

  // Get the raw payload as text
  const payload = await req.text();
  
  // Create HMAC signature
  const computedSignature = createHmac('sha256', BOOMFI_WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');
  
  // Compare signatures in constant time to prevent timing attacks
  return constantTimeCompare(signature, computedSignature);
}

// Constant-time comparison to prevent timing attacks
function constantTimeCompare(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  
  if (aBuffer.length !== bBuffer.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < aBuffer.length; i++) {
    result |= aBuffer[i] ^ bBuffer[i];
  }
  
  return result === 0;
}

export async function getUserActiveSubscription(customerId: string) {
  const BOOMFI_API_KEY = process.env.BOOMFI_API_KEY;
  const BASE_URL = 'https://api.boomfi.xyz';
  
  if (!BOOMFI_API_KEY) {
    throw new Error('BOOMFI_API_KEY not configured');
  }

  const response = await fetch(`${BASE_URL}/subscriptions?customer=${customerId}&status=active`, {
    headers: {
      'Authorization': `Bearer ${BOOMFI_API_KEY}`
    }
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch subscriptions: ${error}`);
  }

  const { data } = await response.json();
  return data?.length > 0 ? data[0] : null;
}

export async function getUserSuccessfulPayments(customerId: string) {
  const BOOMFI_API_KEY = process.env.BOOMFI_API_KEY;
  const BASE_URL = 'https://api.boomfi.xyz';
  
  if (!BOOMFI_API_KEY) {
    throw new Error('BOOMFI_API_KEY not configured');
  }

  const response = await fetch(`${BASE_URL}/payments?customer=${customerId}&status=success`, {
    headers: {
      'Authorization': `Bearer ${BOOMFI_API_KEY}`
    }
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch payments: ${error}`);
  }

  const { data } = await response.json();
  return data || [];
}
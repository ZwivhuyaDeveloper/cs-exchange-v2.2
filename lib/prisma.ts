import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Check if we're on the server side
const isServer = typeof window === 'undefined';

// BoomFi API client
const createBoomFiCustomer = async (userData: {
  email: string;
  name: string;
  metadata?: Record<string, any>;
}): Promise<{ id: string }> => {
  const BOOMFI_API_KEY = process.env.BOOMFI_API_KEY;
  const BASE_URL = 'https://api.boomfi.xyz';
  
  if (!BOOMFI_API_KEY) {
    throw new Error('BOOMFI_API_KEY is not configured');
  }

  const response = await fetch(`${BASE_URL}/customers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${BOOMFI_API_KEY}`
    },
    body: JSON.stringify(userData)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`BoomFi customer creation failed: ${error}`);
  }

  return response.json();
};

const prismaClientSingleton = () => {
  if (!isServer) {
    throw new Error('PrismaClient is not available on the client side');
  }

  // Remove dotenv.config() - Environment variables are automatically loaded in Vercel
  neonConfig.webSocketConstructor = ws;
  const connectionString = `${process.env.DATABASE_URL}`;
  const pool = new Pool({ connectionString });
  
  const prisma = new PrismaClient().$extends({
    model: {
      userProfile: {
        async createWithBoomFi(data: {
          clerkUserId: string;
          email: string;
          firstName?: string;
          lastName?: string;
        }) {
          const user = await prisma.userProfile.create({
            data: {
              clerkUserId: data.clerkUserId,
              email: data.email,
            }
          });

          try {
            const name = [data.firstName, data.lastName].filter(Boolean).join(' ') || data.email;
            const boomFiCustomer = await createBoomFiCustomer({
              email: data.email,
              name,
              metadata: {
                clerkUserId: data.clerkUserId,
                prismaId: user.id
              }
            });
            
            return await prisma.userProfile.update({
              where: { id: user.id },
              data: { boomFiCustomerId: boomFiCustomer.id }
            });
          } catch (error) {
            console.error('BoomFi customer creation failed:', error);
            await prisma.userProfile.delete({ where: { id: user.id } });
            throw new Error('User creation failed due to payment system error');
          }
        }
      }
    }
  }).$extends(withAccelerate());

  return prisma;
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;
if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
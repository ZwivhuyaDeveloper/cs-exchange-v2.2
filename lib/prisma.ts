import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate'
import { Pool, neonConfig } from '@neondatabase/serverless'
import ws from 'ws'
import dotenv from 'dotenv'

// Check if we're on the server side
const isServer = typeof window === 'undefined';

const prismaClientSingleton = () => {
  // Only initialize Prisma on the server side
  if (!isServer) {
    throw new Error('PrismaClient is not available on the client side');
  }

  dotenv.config()
  neonConfig.webSocketConstructor = ws
  const connectionString = `${process.env.DATABASE_URL}`
  const pool = new Pool({ connectionString })
  const prisma = new PrismaClient().$extends(withAccelerate())

  return prisma
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>
}& typeof global

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma;
if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
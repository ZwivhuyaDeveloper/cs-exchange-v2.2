import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Cache configuration
const CACHE_TTL = 10 * 60; // 10 minutes for token metadata
const tokenCache = new Map<string, { timestamp: number; data: any }>();

export async function GET(request: NextRequest) {
  try {
    const symbols = request.nextUrl.searchParams.get("symbols");
    const chainId = request.nextUrl.searchParams.get("chainId");
    
    if (!symbols) {
      return NextResponse.json([]);
    }
    
    // Check cache first
    const cacheKey = `${symbols}-${chainId || 'default'}`;
    const cached = tokenCache.get(cacheKey);
    const now = Math.floor(Date.now() / 1000);
    
    if (cached && now - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data);
    }
    
    const symbolArr = symbols.split(",").map(s => s.trim());
    const where: any = {
      OR: symbolArr.map(symbol => ({ symbol: { equals: symbol, mode: 'insensitive' } }))
    };
    
    if (chainId) {
      where.chainId = Number(chainId);
    }
    
    const tokens = await prisma.token.findMany({ where });
    
    // Update cache
    tokenCache.set(cacheKey, {
      timestamp: now,
      data: tokens,
    });
    
    return NextResponse.json(tokens);
    
  } catch (error) {
    console.error('Error in token metadata API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch token metadata' },
      { status: 500 }
    );
  }
}

// Set revalidation time for ISR
export const revalidate = 600; // 10 minutes 
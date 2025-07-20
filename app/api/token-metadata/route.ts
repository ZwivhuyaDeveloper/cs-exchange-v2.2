import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const symbols = request.nextUrl.searchParams.get("symbols");
  const chainId = request.nextUrl.searchParams.get("chainId");
  if (!symbols) return new Response(JSON.stringify([]), { status: 200 });
  const symbolArr = symbols.split(",").map(s => s.trim());
  const where: any = {
    OR: symbolArr.map(symbol => ({ symbol: { equals: symbol, mode: 'insensitive' } }))
  };
  if (chainId) where.chainId = Number(chainId);
  const tokens = await prisma.token.findMany({ where });
  return new Response(JSON.stringify(tokens), { headers: { "Content-Type": "application/json" } });
} 
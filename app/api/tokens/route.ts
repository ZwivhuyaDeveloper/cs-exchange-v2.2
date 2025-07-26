import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function getTradingViewSymbol(token: any) {
  // Fallback: use COINBASE:{symbol}USD for mainnet, else just {symbol}USD
  if (token.tradingViewSymbol) return token.tradingViewSymbol;
  if (token.chainId === 1) return `COINBASE:${token.symbol.toUpperCase()}USD`;
  return `${token.symbol.toUpperCase()}USD`;
}

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const chainId = searchParams.get("chainId");
  const symbol = searchParams.get("symbol");
  const address = searchParams.get("address");
  const search = searchParams.get("search");
  const limit = parseInt(searchParams.get("limit") || "50");
  const page = parseInt(searchParams.get("page") || "1");

  try {
    const where: any = {};
    if (chainId) where.chainId = Number(chainId);
    if (symbol) where.symbol = symbol;
    if (address) where.address = address.toLowerCase();
    
    // Add search functionality
    if (search) {
      where.OR = [
        { symbol: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    let tokens = await prisma.token.findMany({ 
      where,
      take: limit,
      skip: skip,
      orderBy: [
        { isDefault: 'desc' }, // Default tokens first
        { symbol: 'asc' }
      ],
      include: {
        chain: {
          select: {
            chainId: true,
            name: true
          }
        }
      }
    });
    
    // Get total count for pagination
    const total = await prisma.token.count({ where });
    
    // Add tradingViewSymbol to each token
    const enrichedTokens = tokens.map(token => ({ 
      ...token, 
      tradingViewSymbol: getTradingViewSymbol(token) 
    }));
    
    return new Response(JSON.stringify({
      tokens: enrichedTokens,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error('Error fetching tokens:', error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch tokens" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
} 
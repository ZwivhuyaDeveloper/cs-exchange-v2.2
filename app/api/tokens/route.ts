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

  try {
    const where: any = {};
    if (chainId) where.chainId = Number(chainId);
    if (symbol) where.symbol = symbol;
    if (address) where.address = address.toLowerCase();
    let tokens = await prisma.token.findMany({ where });
    // Add tradingViewSymbol to each token
    tokens = tokens.map(token => ({ ...token, tradingViewSymbol: getTradingViewSymbol(token) }));
    return new Response(JSON.stringify(tokens), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch tokens" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
} 
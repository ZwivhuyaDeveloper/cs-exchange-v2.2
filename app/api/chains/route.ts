import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const chainId = searchParams.get("chainId");
  const name = searchParams.get("name");

  try {
    const where: any = {};
    if (chainId) where.chainId = Number(chainId);
    if (name) where.name = name;
    const chains = await prisma.chain.findMany({ where });
    return new Response(JSON.stringify(chains), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch chains" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
} 
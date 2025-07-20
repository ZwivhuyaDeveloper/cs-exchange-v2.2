// app/api/price/chart/route.ts
import { type NextRequest } from "next/server";

const COINGECKO_API = "https://api.coingecko.com/api/v3";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  try {
    const coinId = searchParams.get("coinId");
    const vsCurrency = searchParams.get("vsCurrency") || "usd";
    const days = searchParams.get("days") || "1";
    const interval = searchParams.get("interval") || "hourly";

    const res = await fetch(
      `${COINGECKO_API}/coins/${coinId}/market_chart?vs_currency=${vsCurrency}&days=${days}&interval=${interval}`
    );
    
    const data = await res.json();
    return Response.json(data.prices);
  } catch (error) {
    console.log(error);
    return Response.json([]);
  }
}
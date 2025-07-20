import { type NextRequest } from "next/server";
import { priceParamsSchema, validateParams } from "../../../src/utils/validation";
import { checkRateLimit } from "../../../src/utils/rateLimit";

// CORS headers for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, 0x-api-key, 0x-version",
  "Access-Control-Max-Age": "86400",
};

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const rateLimit = checkRateLimit(ip);
  
  if (!rateLimit.allowed) {
    return new Response(
      JSON.stringify({ 
        error: "Rate limit exceeded",
        remaining: rateLimit.remaining,
        resetTime: new Date(rateLimit.resetTime).toISOString()
      }),
      { 
        status: 429, 
        headers: { 
          "Content-Type": "application/json",
          "X-RateLimit-Remaining": rateLimit.remaining.toString(),
          "X-RateLimit-Reset": new Date(rateLimit.resetTime).toISOString(),
          ...corsHeaders
        } 
      }
    );
  }

  // Input validation
  try {
    validateParams(priceParamsSchema, searchParams);
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || "Invalid input" }),
      { 
        status: 400, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        } 
      }
    );
  }

  try {
    const res = await fetch(
      `https://api.0x.org/swap/permit2/price?${searchParams}`,
      {
        headers: {
          "0x-api-key": process.env.ZEROEX_API_KEY as string,
          "0x-version": "v2",
        },
      }
    );
    const data = await res.json();

    console.log(
      "price api",
      `https://api.0x.org/swap/permit2/price?${searchParams}`
    );

    console.log("price data", data);

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "X-RateLimit-Remaining": rateLimit.remaining.toString(),
        "X-RateLimit-Reset": new Date(rateLimit.resetTime).toISOString(),
        ...corsHeaders
      }
    });
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { 
        status: 500, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        } 
      }
    );
  }
}
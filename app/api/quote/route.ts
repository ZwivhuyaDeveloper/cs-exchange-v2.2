import { type NextRequest } from "next/server";
import { quoteParamsSchema, validateParams } from "../../../src/utils/validation";
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

  function getApiBaseUrl(chainId: number): string {
    const baseUrls: Record<number, string> = {
      1: 'https://api.0x.org/swap',
      137: 'https://polygon.api.0x.org/swap'
    };
    return baseUrls[chainId as keyof typeof baseUrls] || baseUrls[1];
  }



  const searchParams = request.nextUrl.searchParams;

  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const rateLimit = checkRateLimit(ip);
  
  if (rateLimit.remaining <= 0) {
    return new Response(
      JSON.stringify({ error: "Too many requests" }),
      { 
        status: 429, 
        headers: { 
          "Content-Type": "application/json",
          "Retry-After": Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
          ...corsHeaders
        } 
      }
    );
  }

  // Input validation
  try {
    validateParams(quoteParamsSchema, searchParams);
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
    const chainId = searchParams.get('chainId') ? Number(searchParams.get('chainId')) : 1;
    const apiBaseUrl = getApiBaseUrl(chainId);
    const res = await fetch(
      `${apiBaseUrl}/permit2/quote?${searchParams}`,
      {
        headers: {
          "0x-api-key": process.env.ZEROEX_API_KEY as string,
          "0x-version": "v2",
        },
      }
    );
  
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      console.error('Quote API error:', {
        status: res.status,
        statusText: res.statusText,
        error
      });
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to get quote',
          details: error.validationErrors || error,
          chainId
        }),
        { 
          status: res.status, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          } 
        }
      );
    }

    const data = await res.json();

    return new Response(JSON.stringify({
      ...data,
      chainId
    }), {
      headers: {
        "Content-Type": "application/json",
        "X-RateLimit-Remaining": rateLimit.remaining.toString(),
        "X-RateLimit-Reset": new Date(rateLimit.resetTime).toISOString(),
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('Unexpected error in quote endpoint:', error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error",
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      }),
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
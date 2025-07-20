import { DEFAULT_SLIPPAGE_BPS } from "@/src/constants";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
  const searchParams = request.nextUrl.searchParams;
  const slippageBps = searchParams.get('slippageBps') || DEFAULT_SLIPPAGE_BPS.toString();
  searchParams.set('slippageBps', slippageBps);

  const res = await fetch(
    `https://api.0x.org/swap/permit2/quote?${searchParams}`,
    {
      headers: {
        "0x-api-key": process.env.NEXT_PUBLIC_ZEROEX_API_KEY as string,
        "0x-version": "v2",
      },
    }
  );
  const data = await res.json();

  console.log(
    "quote api",
    `https://api.0x.org/swap/permit2/quote?${searchParams}`
  );

  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to fetch quote' }, { status: 500 });
  }
}
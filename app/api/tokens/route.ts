import { type NextRequest } from "next/server";
import { TokenService } from "@/services/tokenService";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const chainId = parseInt(searchParams.get('chainId') || '1');
    const symbol = searchParams.get('symbol');
    const address = searchParams.get('address');
    const search = searchParams.get('search');

    let tokens;

    if (address) {
      // Get token by address
      const token = await TokenService.getTokenByAddress(address, chainId);
      return Response.json(token ? [token] : []);
    } else if (symbol) {
      // Get token by symbol
      const token = await TokenService.getTokenBySymbol(symbol, chainId);
      return Response.json(token ? [token] : []);
    } else if (search) {
      // Search tokens by symbol or name
      const symbolResults = await TokenService.searchTokensBySymbol(search);
      const nameResults = await TokenService.searchTokensByName(search);
      
      // Combine and deduplicate results
      const allResults = [...symbolResults, ...nameResults];
      const uniqueResults = allResults.filter((token, index, self) => 
        index === self.findIndex(t => t.id === token.id)
      );
      
      return Response.json(uniqueResults);
    } else {
      // Get all tokens for the chain
      tokens = await TokenService.getTokensByChain(chainId);
    }

    return Response.json(tokens);
  } catch (error) {
    console.error('Error fetching tokens:', error);
    return Response.json({ error: 'Failed to fetch tokens' }, { status: 500 });
  }
} 
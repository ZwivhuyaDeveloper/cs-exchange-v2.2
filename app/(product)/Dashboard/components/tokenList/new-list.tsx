import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { MAINNET_TOKENS, COINGECKO_IDS, Token } from '@/src/constants';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from 'cmdk';
import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';

// Define an interface that extends the Token type with market data properties
interface TokenWithMarketData extends Token {
  price?: number;
  priceChange24h?: number;
  marketCap?: number;
}

interface TokenPickerProps {
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
}

const API_DELAY = 1500;
const MAX_RETRIES = 3;
const BATCH_SIZE = 10;

export default function NewList({ value, onValueChange, label }: TokenPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [tokensWithMarketData, setTokensWithMarketData] = useState<TokenWithMarketData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const filteredTokens = tokensWithMarketData.filter(token =>
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchWithRetry = useCallback(async (url: string, retries = MAX_RETRIES): Promise<any> => {
    try {
      const response = await fetch(url);
      
      // Handle rate limits with exponential backoff
      if (response.status === 429) {
        if (retries > 0) {
          const delay = Math.pow(2, MAX_RETRIES - retries) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          return fetchWithRetry(url, retries - 1);
        }
        throw new Error("Rate limit exceeded");
      }
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      if (retries > 0) {
        const delay = Math.pow(2, MAX_RETRIES - retries) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithRetry(url, retries - 1);
      }
      throw error;
    }
  }, []);

  const fetchMarketData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Create tokens with Coingecko IDs
      const tokensWithDataPromises = MAINNET_TOKENS.map(async (token): Promise<TokenWithMarketData> => {
        const coingeckoId = COINGECKO_IDS[token.symbol.toLowerCase()];
        if (!coingeckoId) return token; // Return as-is if no ID

        try {
          const data = await fetchWithRetry(
            `https://api.coingecko.com/api/v3/coins/${coingeckoId}`
          );
          
          return {
            ...token,
            price: data.market_data?.current_price?.usd,
            priceChange24h: data.market_data?.price_change_percentage_24h,
            marketCap: data.market_data?.market_cap?.usd
          };
        } catch (error) {
          console.error(`Failed to fetch data for ${token.symbol}:`, error);
          return token; // Return original token on error
        }
      });

      // Process all tokens in parallel
      const tokensWithData = await Promise.all(tokensWithDataPromises);
      
      // Sort by market cap descending with proper type handling
      const sortedTokens = tokensWithData.sort((a, b) => 
        (b.marketCap || 0) - (a.marketCap || 0)
      );
      
      setTokensWithMarketData(sortedTokens);
    } catch (error) {
      console.error("Failed to load market data:", error);
      setError("Failed to load market data. Please try again later.");
      // Fallback to original tokens
      setTokensWithMarketData(MAINNET_TOKENS);
    } finally {
      setIsLoading(false);
    }
  }, [fetchWithRetry]);

  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <div className="w-full border dark:bg-[#0F0F0F] bg-white rounded-none border-none shadow-sm p-4 h-full ">
      <div className="flex items-center h-full justify-between py-0 border-none rounded-none bg-transparent p-0 w-full gap-4">
        <div className="relative w-full h-full">
          <Command className="border-none h-full flex flex-col gap-2">
            <div className="flex items-center px-5 py-2 dark:bg-zinc-900/80 bg-zinc-100 rounded-2xl ">
              <CommandInput
                placeholder="Search token by name or symbol..."
                value={searchQuery}
                onValueChange={handleSearchChange}
                className="border-none focus:ring-0 focus-visible:ring-0 w-full text-sm h-6"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="default" size="sm" className="ml-2 text-xs font-normal flex gap-0 text-white bg-blue-500">
                    Filters <ChevronDown strokeWidth={2} className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Verified Only</DropdownMenuItem>
                  <DropdownMenuItem>Stablecoins</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className=''>
              <div className='flex flex-row gap-2'>
                <Button 
                  variant="default" 
                  className='text-xs p-2 text-zinc-400 dark:bg-zinc-900 bg-zinc-100  hover:bg-zinc-800'>Ethereum
                  <p className='text-blue-400'>Mainnet</p>
                </Button>
                <Button 
                  variant="default" 
                  className='text-xs p-2 text-zinc-400 dark:bg-zinc-900 bg-zinc-100 hover:bg-zinc-800'>Trending
                </Button>
                <Button 
                  variant="default" 
                  className='text-xs p-2 text-zinc-400 dark:bg-zinc-900 bg-zinc-100 hover:bg-zinc-800'>Meme Coins
                </Button>
                <Button 
                  variant="default" 
                  className='text-xs p-2 text-zinc-400 dark:bg-zinc-900 bg-zinc-100 hover:bg-zinc-800'>Blockchains
                </Button>
                <Button 
                  variant="default" 
                  className='text-xs p-2 text-zinc-400 dark:bg-zinc-900 bg-zinc-100 hover:bg-zinc-800'>Gainers
                </Button>
                <Button 
                  variant="default" 
                  className='text-xs p-2 text-zinc-400 dark:bg-zinc-900 bg-zinc-100 hover:bg-zinc-800'>Losers
                </Button>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 p-3 rounded-lg flex items-center justify-between mx-3 my-2">
                <span className="text-red-700 text-sm">{error}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchMarketData}
                  className="text-red-700 hover:bg-red-200"
                >
                  Retry
                </Button>
              </div>
            )}

            <CommandList className="max-h-[550px] overflow-auto">
              <CommandEmpty className="py-6 text-center text-muted-foreground">
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Skeleton className="h-4 w-32" />
                  </div>
                ) : (
                  "No tokens found. Try a different search term."
                )}
              </CommandEmpty>
              
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <CommandItem 
                    key={`skeleton-${i}`} 
                    className="py-3 px-4 border-b"
                  >
                    <div className="flex items-center gap-4 w-full">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-3 w-12" />
                      </div>
                    </div>
                  </CommandItem>
                ))
              ) : (
                filteredTokens.map((token) => (
                  <CommandItem
                    key={token.address || token.symbol}
                    value={token.address || token.symbol}
                    onSelect={() => {
                      onValueChange(token.symbol.toLowerCase());
                      setSearchQuery("");
                    }}
                    className="py-3 px-4 rounded-2xl my-2  cursor-pointer transition-colors hover:bg-muted/50 dark:bg-zinc-900 bg-zinc-100"
                  >
                    <div className="flex items-center gap-4 w-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={token.logoURL} alt={token.symbol} />
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 justify-between">
                          <span className="font-medium text-sm truncate">{token.symbol}</span>
                          {token.address && (
                            <span className="text-xs text-muted-foreground font-mono">
                              {token.address.slice(0, 6)}...{token.address.slice(-4)}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">{token.name}</div>
                      </div>
                      <div className="flex flex-col items-end min-w-[80px]">
                        {token.price !== undefined ? (
                          <span className="font-medium text-right">
                            ${token.price.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: token.price < 1 ? 4 : 2
                            })}
                          </span>
                        ) : (
                          <span className="font-medium">-</span>
                        )}
                        {token.priceChange24h !== undefined ? (
                          <span className={`text-xs text-right ${
                            token.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </div>
                    </div>
                  </CommandItem>
                ))
              )}
            </CommandList>
          </Command>
        </div>
      </div>

      <div className="flex items-center justify-between py-4 px-4 border-t mt-2 border-b-gray-700">
        <div className="text-sm text-muted-foreground">
          Showing {filteredTokens.length} of {tokensWithMarketData.length} tokens
        </div>
        <div className="space-x-2">
          <Button variant="outline" size="sm">
            Manage Token Lists
          </Button>
          <Button variant="outline" size="sm">
            Import Custom Token
          </Button>
        </div>
      </div>
    </div>
  );
}
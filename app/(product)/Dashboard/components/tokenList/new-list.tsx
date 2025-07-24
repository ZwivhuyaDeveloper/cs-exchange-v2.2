import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from 'cmdk';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination';

interface TokenListProps {
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
  chainId?: number;
}

export default function NewList({ value, onValueChange, label, chainId = 1 }: TokenListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [tokens, setTokens] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 20; // Items per page

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    fetch(`/api/tokens?chainId=${chainId}`)
      .then(res => res.json())
      .then(setTokens)
      .catch(() => setError("Failed to load tokens."))
      .finally(() => setIsLoading(false));
  }, [chainId]);

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  // Filter tokens based on search query
  const filteredTokens = tokens.filter(token => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    
    return (
      token.symbol.toLowerCase().includes(query) ||
      token.name.toLowerCase().includes(query) ||
      (token.address && token.address.toLowerCase().includes(query))
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredTokens.length / pageSize);
  const paginatedTokens = filteredTokens.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="w-full  dark:bg-[#0F0F0F] bg-white rounded-none shadow-sm p-4 h-fit flex flex-col border border-px border-zinc-700">
      <div className="flex items-center h-fit justify-between py-0  border-none rounded-none bg-transparent p-0 w-full gap-4">
        <div className="relative w-full h-fit">
          <Command 
            className="border-none h-fit flex flex-col gap-2"
            shouldFilter={false} // Disable internal filtering
          >
            <div className="flex items-center px-5 py-4 dark:bg-zinc-900/80 bg-zinc-100 rounded-2xl ">
              <CommandInput
                placeholder="Search token by name, symbol, or address..."
                value={searchQuery}
                onValueChange={setSearchQuery}
                className="border-none focus:ring-0 focus-visible:ring-0 w-full text-sm h-6 select-none focus-none focus:outline-0"
              />
            </div>
            {error && (
              <div className="bg-red-100 p-3 rounded-lg flex items-center justify-between mx-3 my-2">
                <span className="text-red-700 text-sm">{error}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsLoading(true);
                    setError(null);
                    fetch(`/api/tokens?chainId=${chainId}`)
                      .then(res => res.json())
                      .then(setTokens)
                      .catch(() => setError("Failed to load tokens."))
                      .finally(() => setIsLoading(false));
                  }}
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
                  `No tokens found for "${searchQuery}". Try a different search term.`
                )}
              </CommandEmpty>
              {isLoading ? (
                Array(pageSize).fill(0).map((_, i) => (
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
                paginatedTokens.map((token) => (
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
                    </div>
                  </CommandItem>
                ))
              )}
            </CommandList>
          </Command>
        </div>
      </div>
      
      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="mb-10 h-full">
          <Pagination className='justify-between'>
            <div className="flex items-center justify-between py-4 px-4 border-t mt-2 border-b-gray-700">
              <div className="text-sm text-muted-foreground">
                Showing {paginatedTokens.length} of {filteredTokens.length} tokens
                {searchQuery && ` matching "${searchQuery}"`}
              </div>
              <div className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </div>
            </div>
            <PaginationContent>
              <PaginationItem className='bg-[#00ffc2] text-black rounded-2xl' >
                <PaginationPrevious
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  aria-disabled={page === 1}
                  className={page === 1 ? 'opacity-50 pointer-events-none font-semibold' : ''}
                />
              </PaginationItem>
              
              <PaginationItem>
                <span className="px-2 text-xs">
                  Page {page} of {totalPages}
                </span>
              </PaginationItem>
              
              <PaginationItem className='bg-[#00ffc2] text-black rounded-2xl'>
                <PaginationNext
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  aria-disabled={page === totalPages}
                  className={page === totalPages ? 'opacity-50 pointer-events-none font-semibold' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
      
    </div>
  );
}
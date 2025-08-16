import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from 'cmdk';
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface TokenList {
  id: number;
  listId: string;
  name: string;
  description: string;
  isDefault: boolean;
  tokens: Token[];
}

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination';

// Token type from Prisma schema
type TokenType = 'CRYPTO' | 'MEMECOIN' | 'ETHEREUM' | 'POLYGON' | 'STOCK' | 'FOREX' | 'INDEX' | 'COMMODITY';

interface Token {
  id: number;
  chainId: number;
  address: string;
  symbol: string;
  name: string;
  logoURL?: string | null;
  isDefault: boolean;
  isActive: boolean;
  decimals: number;
  coingeckoId?: string | null;
  tradingViewSymbol?: string | null;
  type?: string | null;
  exchange?: string | null;
  tokenLists?: TokenList[];
}

const DEFAULT_LIST = {
  id: 0,
  listId: 'all',
  name: 'All Tokens',
  description: 'Show all available tokens',
  isDefault: true,
  tokens: []
};

interface TokenListProps {
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
  chainId?: number;
  className?: string;
}

export default function NewList({ value, onValueChange, label, chainId = 1, className }: TokenListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [tokens, setTokens] = useState<Token[]>([]);
  const [tokenLists, setTokenLists] = useState<TokenList[]>([DEFAULT_LIST]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingLists, setIsLoadingLists] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [selectedList, setSelectedList] = useState<string>(DEFAULT_LIST.listId);
  const pageSize = 20; // Items per page

  // Fetch token lists
  useEffect(() => {
    const fetchTokenLists = async () => {
      try {
        const response = await fetch('/api/token-lists');
        if (!response.ok) throw new Error('Failed to fetch token lists');
        const data = await response.json();
        setTokenLists([DEFAULT_LIST, ...data]);
      } catch (err) {
        console.error('Error fetching token lists:', err);
        setError('Failed to load token lists');
      } finally {
        setIsLoadingLists(false);
      }
    };

    fetchTokenLists();
  }, []);

  // Fetch tokens
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    const fetchTokens = async () => {
      try {
        const url = selectedList === 'all' 
          ? `/api/tokens?chainId=${chainId}&limit=10000`
          : `/api/tokens?listId=${selectedList}&chainId=${chainId}&limit=10000`;
          
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch tokens');
        
        const data = await response.json();
        if (data && Array.isArray(data.tokens)) {
          setTokens(data.tokens);
        } else {
          setError("Invalid tokens data format");
        }
      } catch (err) {
        console.error('Error fetching tokens:', err);
        setError("Failed to load tokens");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokens();
  }, [chainId, selectedList]);

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  // Filter tokens based on search query
  const filteredTokens = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    
    return tokens.filter(token => {
      // Filter by search query
      return !query || 
        token.symbol.toLowerCase().includes(query) ||
        token.name.toLowerCase().includes(query) ||
        (token.address && token.address.toLowerCase().includes(query));
    });
  }, [tokens, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredTokens.length / pageSize);
  const paginatedTokens = filteredTokens.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className={cn("w-full dark:bg-[#0F0F0F] bg-white rounded-none shadow-sm p-4 h-fit flex flex-col border border-px dark:border-zinc-700 border-zinc-200", className)}>
      <div className="flex items-center h-fit justify-between py-0 border-none rounded-none bg-transparent p-0 w-full gap-4">
        <div className="relative w-full h-fit">
          <Command 
            className="border-none h-fit flex flex-col gap-3"
            shouldFilter={false} // Disable internal filtering
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center px-5 py-4 dark:bg-zinc-900/80 bg-zinc-100 rounded-2xl">
                <CommandInput
                  placeholder="Search token by name, symbol, or address..."
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  className="border-none focus:ring-0 focus-visible:ring-0 w-full text-sm h-6 select-none focus-none focus:outline-0"
                />
              </div>
              
              {/* Token List Filter */}
              <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex space-x-2 pb-2">
                  {isLoadingLists ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-8 w-24 rounded-full" />
                    ))
                  ) : (
                    tokenLists.map((list) => (
                      <Button
                        key={list.listId}
                        variant={selectedList === list.listId ? 'default' : 'outline'}
                        size="sm"
                        className={cn(
                          'rounded-full px-4 py-1 text-xs font-medium transition-all duration-200',
                          'whitespace-nowrap',
                          selectedList === list.listId 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-transparent hover:bg-accent/50'
                        )}
                        onClick={() => {
                          setSelectedList(list.listId);
                          setPage(1); // Reset to first page when changing list
                        }}
                        title={list.description}
                      >
                        {list.name}
                      </Button>
                    ))
                  )}
                </div>
                <ScrollBar orientation="horizontal" className="h-1" />
              </ScrollArea>
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
                    fetch(`/api/tokens?chainId=${chainId}&limit=10000`)
                      .then(res => res.json())
                      .then(data => {
                        // Extract tokens array from the response object
                        if (data && Array.isArray(data.tokens)) {
                          setTokens(data.tokens);
                        } else {
                          setError("Invalid tokens data format");
                        }
                      })
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
              <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Skeleton className="h-4 w-32" />
                  </div>
                ) : (
                  `No tokens found${searchQuery ? ` for "${searchQuery}"` : ''}. Try a different search term.`
                )}
              </CommandEmpty>
                <AnimatePresence>
                  {isLoading ? (
                    <div className="space-y-2 p-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center space-x-3 p-3 rounded-lg">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-1 flex-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    paginatedTokens.map((token) => (
                      <motion.div
                        key={token.address}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="w-full"
                      >
                        <CommandItem
                          value={`${token.symbol}:${token.address}`}
                          onSelect={() => onValueChange(token.address)}
                          className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-accent/50"
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={token.logoURL || ''} alt={token.symbol} />
                            </Avatar>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium truncate">{token.symbol}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground truncate">{token.name}</span>
                              </div>
                            </div>
                          </div>
                          <div className='bg-zinc-200 dark:bg-zinc-800 rounded-full items-center justify-center px-3 py-1'>
                            <span className="text-xs text-muted-foreground font-mono">
                              {token.address.slice(0, 6)}...{token.address.slice(-4)}
                            </span>
                          </div>
                          {value === token.address && (
                            <motion.div 
                              className="h-2 w-2 rounded-full bg-primary"
                              layoutId="activeToken"
                              transition={{ duration: 0.2 }}
                            />
                          )}
                        </CommandItem>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
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
import { useState, useEffect, useRef } from "react";
import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area";
import { 
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "@/components/ui/command";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronDown, X, Search } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Chain {
  id: number;
  name: string;
  symbol: string;
  logoURL?: string;
  isActive: boolean;
}

interface TokenPickerProps {
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
  chainId?: number;
  excludedToken?: string;
  onChainChange?: (chainId: number) => void;
}

export function TokenPicker({ value, onValueChange, label, chainId, excludedToken, onChainChange }: TokenPickerProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [tokens, setTokens] = useState<any[]>([]);
  const [chains, setChains] = useState<Chain[]>([]);
  const [selectedChain, setSelectedChain] = useState<number | null>(chainId || null);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Ref for the viewport inside ScrollArea
  const viewportRef = useRef<HTMLDivElement>(null);

  // Fetch chains from DB
  useEffect(() => {
    const fetchChains = async () => {
      try {
        console.log('Fetching chains from /api/chains...');
        const res = await fetch('/api/chains');
        if (!res.ok) {
          throw new Error(`Failed to fetch chains: ${res.status} ${res.statusText}`);
        }
        const chainsData = await res.json();
        console.log('Raw chains data:', chainsData);
        
        if (Array.isArray(chainsData)) {
          // Transform the data to match our Chain interface
          const formattedChains = chainsData.map(chain => ({
            id: chain.chainId || chain.id,
            name: chain.name,
            symbol: chain.symbol || chain.name.substring(0, 3).toUpperCase(),
            logoURL: chain.logoUrl || chain.logoURL || `https://cryptoicons.org/api/icon/${chain.symbol?.toLowerCase() || chain.name.toLowerCase().replace(/\s+/g, '')}/200`,
            isActive: chain.isActive !== false
          }));
          
          console.log('Formatted chains:', formattedChains);
          setChains(formattedChains);
          
          // Set initial selected chain if not already set
          if (!selectedChain && formattedChains.length > 0) {
            const newChainId = formattedChains[0].id;
            console.log('Setting initial selected chain:', newChainId);
            setSelectedChain(newChainId);
          }
        } else {
          console.error('Unexpected chains data format:', chainsData);
        }
      } catch (error) {
        console.error('Failed to fetch chains:', error);
        // Fallback to some default chains if the API fails
        const defaultChains = [
          { id: 1, name: 'Ethereum', symbol: 'ETH', logoURL: 'https://cryptoicons.org/api/icon/eth/200', isActive: true },
          { id: 56, name: 'BNB Chain', symbol: 'BSC', logoURL: 'https://cryptoicons.org/api/icon/bnb/200', isActive: true },
          { id: 137, name: 'Polygon', symbol: 'MATIC', logoURL: 'https://cryptoicons.org/api/icon/matic/200', isActive: true },
        ];
        console.log('Using fallback chains:', defaultChains);
        setChains(defaultChains);
        if (!selectedChain) {
          setSelectedChain(defaultChains[0].id);
        }
      }
    };
    
    fetchChains();
  }, [selectedChain]);

  // Fetch tokens from DB
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const url = selectedChain 
          ? `/api/tokens?chainId=${selectedChain}&limit=10000` 
          : "/api/tokens?limit=10000";
        const res = await fetch(url);
        const data = await res.json();
        // Extract tokens array from the response object
        if (data && Array.isArray(data.tokens)) {
          setTokens(data.tokens);
        } else {
          setTokens([]);
        }
      } catch {
        setTokens([]);
      }
    };
    fetchTokens();
  }, [selectedChain]);

  // Handle chain selection
  const handleChainSelect = (chainId: number) => {
    setSelectedChain(chainId);
    setPage(1); // Reset to first page when changing chains
    if (onChainChange) {
      onChainChange(chainId);
    }
  };

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  // Sort tokens alphabetically by symbol
  const sortedTokens = [...tokens].sort((a, b) => a.symbol.localeCompare(b.symbol));

  // Filter tokens based on search query and exclude excludedToken
  const filteredTokens = sortedTokens.filter(token => {
    const query = searchQuery.toLowerCase().trim();
    
    // Exclude the token if it matches the excludedToken
    if (excludedToken && token.symbol.toLowerCase() === excludedToken.toLowerCase()) {
      return false;
    }
    
    if (!query) return true;
    
    return (
      token.symbol.toLowerCase().includes(query) ||
      token.name.toLowerCase().includes(query) ||
      (token.address && token.address.toLowerCase().includes(query))
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredTokens.length / pageSize) || 1;
  const paginatedTokens = filteredTokens.slice((page - 1) * pageSize, page * pageSize);

  // Build tokenMap for logo display
  const tokenMap = tokens.reduce((map, token) => {
    map[token.symbol.toLowerCase()] = token;
    return map;
  }, {} as Record<string, any>);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 w-fit h-full px-1 rounded-full bg-white dark:bg-[#0F0F0F]  justify-between  border border-px dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:shadow-lg hover:shadow-black/20 active:bg-zinc-900 active:shadow-none transition-all duration-200 ease-in-out text-sm text-white dark:text-gray-300"
        >
          {value ? (
            <>
              <Avatar className="h-8 w-8 sm:h-6 sm:w-6">
                <AvatarImage src={tokenMap[value]?.logoURL || tokenMap[value]?.logoURI} />
              </Avatar>
              <span className="font-medium text-xs text-black dark:text-white">{value.toUpperCase()}</span>
            </>
          ) : (
            "Select Token"
          )}
          <ChevronDown size={25} color="grey" strokeWidth={2} className="" />
        </Button>
      </DialogTrigger>

      <DialogContent  
        className="flex items-center justify-center bg-background/95 backdrop-blur-sm rounded-2xl border border-border/20 shadow-xl p-0 sm:max-w-2xl w-[90vw] h-[80vh] max-h-[90vh] overflow-hidden"
        hideCloseButton={true}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full h-full flex flex-col">
          <DialogHeader className="px-4 pt-4 pb-2">
            <div className="flex items-center justify-between gap-1">
              <div className="relative items-center w-full bg-white rounded-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4  text-black dark:text-white" />
                <Input
                  placeholder="Search token by symbol, name, or address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 w-full bg-transparent text-sm border-none shadow-none"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                className="h-8 w-8 bg-white rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <DialogTitle className="w-full text-left px-3 pt-2 text-md hidden">Chains</DialogTitle>
            <div className="w-full px-4 py-2 border-b">
              <div className="flex items-center space-x-2 overflow-x-auto pb-2 -mx-1">
                {chains.length > 0 ? (
                  chains.map((chain) => (
                    <Button
                      key={chain.id}
                      variant={selectedChain === chain.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleChainSelect(chain.id)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1 rounded-full text-sm whitespace-nowrap",
                        "transition-colors flex-shrink-0",
                        selectedChain === chain.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent/50"
                      )}
                    >
                      <Avatar className="h-5 w-5">
                        <AvatarImage 
                          src={chain.logoURL} 
                          alt={chain.name}
                        />
                        <AvatarFallback className="text-xs">
                          {chain.symbol?.[0] || chain.name?.[0] || '•'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{chain.name}</span>
                    </Button>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground py-1">
                    No chains available
                  </div>
                )}
              </div>
            </div>
          </DialogHeader>

          <Command className="overflow-hidden flex-1 flex flex-col" shouldFilter={false}>
            <CommandList className="flex-1">
              <ScrollArea className="h-full">
                <ScrollAreaViewport ref={viewportRef} className="w-full h-full">
                  {paginatedTokens.length === 0 ? (
                    <CommandEmpty className="py-8 text-center text-muted-foreground">
                      No tokens found for "{searchQuery}"
                    </CommandEmpty>
                  ) : (
                    <div className="p-2 space-y-1">
                      {paginatedTokens.map((token) => (
                        <CommandItem
                          key={token.address}
                          value={token.symbol}
                          onSelect={() => {
                            onValueChange(token.symbol.toLowerCase());
                            setOpen(false);
                            setSearchQuery("");
                          }}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg transition-colors",
                            "hover:bg-accent/50 cursor-pointer"
                          )}
                        >
                          <Avatar className="h-9 w-9">
                            <AvatarImage 
                              src={token.logoURL || token.logoURI} 
                              alt={token.symbol}
                              className="object-cover"
                            />
                            <AvatarFallback className="text-xs">
                              {token.symbol.slice(0, 3).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-medium text-sm truncate">
                                {token.symbol}
                              </span>
                              {token.address && (
                                <Badge variant="secondary" className="font-mono text-xs">
                                  {`${token.address.slice(0, 4)}...${token.address.slice(-4)}`}
                                </Badge>
                              )}
                            </div>
                            {token.name && (
                              <div className="text-xs text-muted-foreground truncate">
                                {token.name}
                              </div>
                            )}
                          </div>
                        </CommandItem>
                      ))}
                    </div>
                  )}
                </ScrollAreaViewport>
              </ScrollArea>
            </CommandList>

            <div className="border-t p-2">
              <Pagination className="justify-center">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => {
                        setPage((p) => {
                          const newPage = Math.max(1, p - 1);
                          if (viewportRef.current) {
                            viewportRef.current.scrollTo({ top: 0, behavior: "smooth" });
                          }
                          return newPage;
                        });
                      }}
                      aria-disabled={page === 1}
                      className={cn(
                        page === 1 && "opacity-50 pointer-events-none"
                      )}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <span className="text-sm text-muted-foreground px-2">
                      Page {page} of {totalPages}
                    </span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => {
                        setPage((p) => {
                          const newPage = Math.min(totalPages, p + 1);
                          if (viewportRef.current) {
                            viewportRef.current.scrollTo({ top: 0, behavior: "smooth" });
                          }
                          return newPage;
                        });
                      }}
                      aria-disabled={page === totalPages}
                      className={cn(
                        page === totalPages && "opacity-50 pointer-events-none"
                      )}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </Command>
        </div>
      </DialogContent>
  </Dialog>
);
}
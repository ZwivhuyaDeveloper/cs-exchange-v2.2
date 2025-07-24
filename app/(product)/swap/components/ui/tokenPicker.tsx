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
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronDown, X } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";

interface TokenPickerProps {
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
  chainId?: number;
}

export function TokenPicker({ value, onValueChange, label, chainId }: TokenPickerProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [tokens, setTokens] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Ref for the viewport inside ScrollArea
  const viewportRef = useRef<HTMLDivElement>(null);

  // Fetch tokens from DB
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const url = chainId ? `/api/tokens?chainId=${chainId}` : "/api/tokens";
        const res = await fetch(url);
        const data = await res.json();
        setTokens(data);
      } catch {
        setTokens([]);
      }
    };
    fetchTokens();
  }, [chainId]);

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  // Sort tokens alphabetically by symbol
  const sortedTokens = [...tokens].sort((a, b) => a.symbol.localeCompare(b.symbol));

  // Filter tokens based on search query
  const filteredTokens = sortedTokens.filter(token => {
    const query = searchQuery.toLowerCase().trim();
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
          className="flex items-center gap-2 w-fit h-fit py-2 px-1 rounded-full dark:bg-[#0F0F0F] bg-white justify-between shadow shadow-black/10 border border-px dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:shadow-lg hover:shadow-black/20 active:bg-zinc-900 active:shadow-none transition-all duration-200 ease-in-out text-sm text-white dark:text-gray-300"
        >
          {value ? (
            <>
              <Avatar className="h-6 w-6">
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

      {open && (
        <DialogContent 
          className="flex items-center justify-center backdrop-filter backdrop-blur-lg w-full h-fit bg-black/30 p-5"
          onClick={() => setOpen(false)}
        >
          <DialogTitle className="sr-only">Select a token</DialogTitle>
          <div 
            className="relative max-w-full w-full justify-center items-center place-content-center p-0"
            onClick={(e) => e.stopPropagation()}
          >
            <Command 
              className="border bg-transparent w-full border-none dark:bg-transparent shadow-lg flex-col flex h-full max-h-[800px] p-0"
              // Disable internal filtering since we're doing it manually
              shouldFilter={false}
            >
              <DialogHeader className="w-full flex-row h-fit my-2 relative items-start justify-between flex">
                <CommandInput
                  placeholder="Search token by symbol, name, or address..."
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  className="border-none focus:outline-none active:outline-none w-full h-fit"
                />
              </DialogHeader>

              <ScrollArea className="h-fit">
                <ScrollAreaViewport ref={viewportRef} className="h-full w-full rounded-[inherit]">
                  <CommandList className="max-h-[400px]">
                    {paginatedTokens.length === 0 ? (
                      <CommandEmpty className="py-4 text-center">
                        No tokens found for "{searchQuery}"
                      </CommandEmpty>
                    ) : (
                      paginatedTokens.map((token) => (
                        <CommandItem
                          key={token.address}
                          value={token.address}
                          onSelect={() => {
                            onValueChange(token.symbol.toLowerCase());
                            setOpen(false);
                            setSearchQuery("");
                          }}
                          className="flex items-center gap-4 p-3 cursor-pointer hover:bg-slate-200 dark:hover:bg-gray-800 rounded-3xl"
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={token.logoURL || token.logoURI} />
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 justify-between">
                              <span className="font-semibold">{token.symbol}</span>
                              <span className="text-xs text-slate-500">
                                {token.address?.slice(0, 6)}...{token.address?.slice(-4)}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">{token.name}</div>
                          </div>
                        </CommandItem>
                      ))
                    )}
                  </CommandList>
                </ScrollAreaViewport>
              </ScrollArea>
              
              {/* Pagination controls */}
              <Pagination className="mt-2">
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
                      className={page === 1 ? 'opacity-50 pointer-events-none' : ''}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <span className="px-2 text-xs">Page {page} of {totalPages}</span>
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
                      className={page === totalPages ? 'opacity-50 pointer-events-none' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </Command>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
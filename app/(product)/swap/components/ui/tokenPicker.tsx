import { useState, useEffect } from "react";
import { 
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { MAINNET_TOKENS, MAINNET_TOKENS_BY_SYMBOL } from "@/src/constants";
import { Button } from "@/components/ui/button";
import { ChevronDown, X } from "lucide-react";

interface TokenPickerProps {
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
  tokens?: any[]; // Accept dynamic tokens
  chainId?: number; // Accept chainId for fetching tokens
}

export function TokenPicker({ value, onValueChange, tokens, label, chainId }: TokenPickerProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [fetchedTokens, setFetchedTokens] = useState<any[]>([]);

  // Fetch tokens if not provided
  useEffect(() => {
    if (!tokens && chainId) {
      fetch(`/api/tokens?chainId=${chainId}`)
        .then(res => res.json())
        .then(setFetchedTokens)
        .catch(() => setFetchedTokens([]));
    }
  }, [tokens, chainId]);

  // Use dynamic tokens if provided, else fallback to fetched, else constants
  const tokenList = tokens && tokens.length > 0
    ? tokens
    : (fetchedTokens.length > 0 ? fetchedTokens : MAINNET_TOKENS);
  const tokenMap = tokenList.length > 0
    ? Object.fromEntries(tokenList.map(t => [t.symbol.toLowerCase(), t]))
    : MAINNET_TOKENS_BY_SYMBOL;

  const filteredTokens = tokenList.filter(token =>
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                <AvatarImage src={tokenMap[value]?.logoURL} />
              </Avatar>
              <span className="font-medium text-xs text-black dark:text-white">{value.toUpperCase()}</span>
            </>
          ) : (
            "Select Token"
          )}
          <ChevronDown size={25} color="grey" strokeWidth={2}  className="" />
        </Button>
      </DialogTrigger>

      {open && (
        <DialogContent 
          className="  flex items-center justify-center backdrop-filter backdrop-blur-lg w-full h-fit bg-black/30 p-5"
          onClick={() => setOpen(false)}
        >
          <div 
            className="relative max-w-full w-full justify-center items-center place-content-center p-0"
            onClick={(e) => e.stopPropagation()}
          >
            <Command className="border bg-transparent w-full border-none dark:bg-transparent shadow-lg flex-col flex h-full max-h-[800px] p-0">
              <DialogHeader className="w-full flex-row h-fit my-2 relative items-start justify-between flex">
                <CommandInput
                  placeholder="Search token..."
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  className="border-none focus:outline-none active:outline-none w-full h-fit"
                />
              </DialogHeader>

              <ScrollArea className="h-fit">
                <CommandList className="max-h-[400px] ">
                  <CommandEmpty>No token found.</CommandEmpty>
                  {filteredTokens.map((token) => (
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
                        <AvatarImage src={token.logoURL} />
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
                  ))}
                </CommandList>
              </ScrollArea>
            </Command>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
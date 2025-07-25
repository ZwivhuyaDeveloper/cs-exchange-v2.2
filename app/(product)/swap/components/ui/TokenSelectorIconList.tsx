import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface TokenSelectorIconListProps {
  tokens: any[];
  selectedToken: string;
  onSelect: (symbol: string) => void;
  excludedToken?: string;
}

export function TokenSelectorIconList({
  tokens,
  selectedToken,
  onSelect,
  excludedToken,
}: TokenSelectorIconListProps) {
  // Filter out excluded token, then show the first 4 tokens
  const filteredTokens = tokens.filter(token => 
    !excludedToken || token.symbol.toLowerCase() !== excludedToken.toLowerCase()
  );
  const topTokens = filteredTokens.slice(0, 4);
  return (
    <div className="flex gap-2 overflow-x-auto py-1">
      {topTokens.map((token) => (
        <button
          key={token.symbol}
          type="button"
          title={token.symbol}
          className={`flex items-center justify-center h-full w-full rounded-full border-2 transition-all
            ${selectedToken === token.symbol.toLowerCase()
              ? "border-blue-500 bg-blue-100 dark:bg-blue-900"
              : "border-transparent bg-white dark:bg-zinc-900"}
          `}
          onClick={() => onSelect(token.symbol.toLowerCase())}
        >
          <Avatar className="h-6 w-6">
            <AvatarImage src={token.logoURL || token.logoURI} />
          </Avatar>
        </button>
      ))}
    </div>
  );
} 
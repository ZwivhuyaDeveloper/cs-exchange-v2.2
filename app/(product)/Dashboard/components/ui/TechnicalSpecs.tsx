// components/TechnicalSpecs.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { COINGECKO_IDS } from "@/src/constants";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { ChevronDownIcon, CopyIcon, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

interface TechnicalSpecsProps {
  tokenSymbol: string;
}

interface TechnicalSpecsData {
  marketCapRank: number;
  hashingAlgorithm: string;
  blockTime: number;
  genesisDate: string;
  tokenAddress: string;
  categories: string[];
  description: string;
}

// Fetch function for technical specs data
const fetchTechnicalSpecs = async (tokenSymbol: string): Promise<TechnicalSpecsData> => {
  const coingeckoId = COINGECKO_IDS[tokenSymbol.toLowerCase()];
  if (!coingeckoId) {
    throw new Error('Token not supported');
  }

  const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;
  const headers: HeadersInit = {};
  if (apiKey) headers["x-cg-demo-api-key"] = apiKey;

  const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coingeckoId}`, { headers });
  if (!res.ok) {
    throw new Error(`Failed to fetch technical data: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  
  // Get first available contract address
  const platforms = data.platforms ? Object.entries(data.platforms) : [];
  const foundAddress = platforms.find(([_, addr]) => typeof addr === "string" && addr);
  const tokenAddress = typeof foundAddress?.[1] === "string" ? foundAddress[1] : 'N/A';

  return {
    marketCapRank: data.market_cap_rank,
    hashingAlgorithm: data.hashing_algorithm || 'N/A',
    blockTime: data.block_time_in_minutes,
    genesisDate: data.genesis_date ? new Date(data.genesis_date).toLocaleDateString() : 'N/A',
    tokenAddress,
    categories: data.categories || [],
    description: data.description?.en || 'No description available'
  };
};

export default function TechnicalSpecs({ tokenSymbol }: TechnicalSpecsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    data: specsData,
    isLoading,
    error,
    refetch,
    isError
  } = useQuery({
    queryKey: ['technicalSpecs', tokenSymbol.toLowerCase()],
    queryFn: () => fetchTechnicalSpecs(tokenSymbol),
    staleTime: 10 * 60 * 1000, // 10 minutes (technical specs don't change often)
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !!tokenSymbol,
  });

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`Copied to clipboard!`, {
        description: text,
        duration: 2000,
      });
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full border-none dark:bg-[#0F0F0F] bg-white rounded-none">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-16" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="w-full border-none dark:bg-[#0F0F0F] bg-white rounded-none">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-[#0E76FD]/20 rounded-full flex items-center justify-center">
              <span className="text-[#0E76FD] text-[8px] font-bold"><List width={17} height={17}/></span>
            </div>
            <h1 className="dark:text-white text-back font-semibold text-md sm:text-md">Technical Specifications</h1>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <h2 className="text-red-500 font-medium text-sm">Error loading technical data</h2>
            <p className="text-zinc-500 text-xs">{error?.message}</p>
            <Button 
              onClick={() => refetch()} 
              size="sm" 
              variant="outline"
              className="w-fit"
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!specsData) {
    return (
      <Card className="w-full border-none dark:bg-[#0F0F0F] bg-white rounded-none">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-[#0E76FD]/20 rounded-full flex items-center justify-center">
              <span className="text-[#0E76FD] text-[8px] font-bold"><List width={17} height={17}/></span>
            </div>
            <h1 className="dark:text-white text-back font-semibold text-md sm:text-md">Technical Specifications</h1>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-500 text-sm">No technical data available for {tokenSymbol.toUpperCase()}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border-none dark:bg-[#0F0F0F] bg-white rounded-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className='w-full flex flex-row gap-3'>
            <div className="h-6 w-6 bg-[#0E76FD]/20 rounded-full flex items-center justify-center">
              <span className="text-[#0E76FD] text-[8px] font-bold"><List width={17} height={17}/></span>
            </div>
            <h1 className="dark:text-white text-back font-semibold text-md sm:text-md"> Technical Specifications </h1>
          </div>
          <Badge variant="secondary" className='text-[#0E76FD] bg-[#0E76FD]/20 items-center justify-center'>
            Rank #{specsData.marketCapRank}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {/* Contract Address */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Contract Address</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono truncate max-w-[160px]">
              {specsData.tokenAddress}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => copyToClipboard(specsData.tokenAddress)}
            >
              <CopyIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-col gap-2">
          <span className="text-sm text-muted-foreground">Categories</span>
          <div className="flex flex-wrap gap-2">
            {specsData.categories?.map((category) => (
              <Badge key={category} variant="outline" className='font-semibold border-none border-[#0E76FD]/0 bg-[#0E76FD]/10 dark:bg-zinc-400/10'>
                {category}
              </Badge>
            ))}
            {!specsData.categories?.length && (
              <span className="text-sm text-muted-foreground">Uncategorized</span>
            )}
          </div>
        </div>

        {/* Technical Specs */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Algorithm</span>
          <Badge variant="outline">{specsData.hashingAlgorithm}</Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Block Time</span>
          <span className="text-sm font-medium">
            {specsData.blockTime} minutes
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Genesis Date</span>
          <span className="text-sm font-medium">
            {specsData.genesisDate}
          </span>
        </div>

        {/* Expandable Description */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className='w-full'>
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Description</span>
              <ChevronDownIcon className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className='w-full'>
            <p className="text-sm text-muted-foreground mt-2 whitespace-pre-line w-ful">
              {specsData.description}
            </p>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
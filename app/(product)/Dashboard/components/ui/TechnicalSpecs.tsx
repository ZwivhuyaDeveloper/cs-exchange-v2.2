// components/TechnicalSpecs.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { ChevronDownIcon, CopyIcon, List, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import Image from 'next/image';
import { InfoCard } from './InfoCard';
import { getTechnicalSpecsInfo } from './componentData';
import { useTokenMetadata } from '../../services/dashboardService';

interface TechnicalSpecsProps {
  tokenSymbol: string;
  chainId?: number;
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

const fetchTechnicalSpecs = async (coingeckoId: string): Promise<TechnicalSpecsData> => {
  if (!coingeckoId) throw new Error('Token not supported');
  const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;
  const headers: HeadersInit = {};
  if (apiKey) headers["x-cg-demo-api-key"] = apiKey;
  const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coingeckoId}`, { headers });
  if (!res.ok) {
    throw new Error(`Failed to fetch technical data: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
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

export default function TechnicalSpecs({ tokenSymbol, chainId = 1 }: TechnicalSpecsProps) {
  const { token: tokenInfo, isLoading: isTokenLoading, error: tokenError } = useTokenMetadata(tokenSymbol, chainId);
  const coingeckoId = tokenInfo?.coingeckoId || '';

  const {
    data: specsData,
    isLoading: isSpecsLoading,
    error: specsError,
    refetch,
    isError: isSpecsError
  } = useQuery<TechnicalSpecsData, Error>({
    queryKey: ['technicalSpecs', coingeckoId],
    queryFn: () => fetchTechnicalSpecs(coingeckoId),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !!coingeckoId,
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

  if (tokenError || isSpecsError) {
    const errorMessage = tokenError && typeof tokenError === 'object' && 'message' in tokenError 
      ? String(tokenError.message) 
      : specsError?.message || 'An error occurred';
    
    return (
      <Card className="rounded-none shadow-none bg-white dark:bg-[#0F0F0F]">
        <CardHeader className="items-center">
          <div className="flex flex-row items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div className="rounded-full p-1 bg-red-100 dark:bg-red-900/30">
                <List className="h-4 w-4 text-red-500" />
              </div>
              <CardTitle>Technical Specs</CardTitle>
            </div>
            <InfoCard {...getTechnicalSpecsInfo()} />
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <p className="text-red-500 font-medium mb-2">
            {tokenError ? 'Failed to load token data' : 'Failed to load technical specs'}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            {errorMessage}
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.reload()}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isTokenLoading || (coingeckoId && isSpecsLoading)) {
    return (
      <Card className="rounded-none shadow-none bg-white dark:bg-[#0F0F0F] animate-pulse">
        <CardHeader className="items-center">
          <div className="flex flex-row items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!specsData) {
    return (
      <Card className="rounded-none shadow-none bg-white dark:bg-[#0F0F0F]">
        <CardHeader className="items-center">
          <div className="flex flex-row items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 dark:bg-[#00FFC2]/20 bg-[#0E76FD]/20 rounded-full flex items-center justify-center">
                {tokenInfo?.logoURL ? (
                  <Image 
                    src={tokenInfo.logoURL}
                    alt={tokenInfo.name || 'Token'}
                    className="h-8 w-8 rounded-full dark:bg-zinc-800 bg-white"
                    width={32}
                    height={32}
                  />
                ) : (
                  <List className="h-4 w-4 text-foreground" />
                )}
              </div>
              <CardTitle className="flex items-center gap-2">
                Technical Specs <span className="dark:text-[#00FFC2] font-black text-[#0E76FD]">{tokenSymbol.toUpperCase()}</span>
              </CardTitle>
            </div>
            <InfoCard {...getTechnicalSpecsInfo()} />
          </div>
        </CardHeader>
        <CardContent className="text-center py-6">
          <p className="text-zinc-500">No technical data available for {tokenSymbol.toUpperCase()}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-none shadow-none bg-white dark:bg-[#0F0F0F]">
      <CardHeader className="items-center">
        <div className="flex flex-row items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 dark:bg-[#00FFC2]/20 bg-[#0E76FD]/20 rounded-full flex items-center justify-center">
              {tokenInfo?.logoURL ? (
                <Image 
                  src={tokenInfo.logoURL}
                  alt={tokenInfo.name || 'Token'}
                  className="h-8 w-8 rounded-full dark:bg-zinc-800 bg-white"
                  width={32}
                  height={32}
                />
              ) : (
                <List className="h-4 w-4 text-foreground" />
              )}
            </div>
            <CardTitle className="flex items-center gap-2">
              Technical Specs <span className="dark:text-[#00FFC2] font-black text-[#0E76FD]">{tokenSymbol.toUpperCase()}</span>
            </CardTitle>
          </div>
          <InfoCard {...getTechnicalSpecsInfo()} />
        </div>
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
              <Badge key={category} variant="outline" className='font-semibold dark:text-[#00FFC2] text-[#0E76FD] border-none border-[#0E76FD]/0 bg-[#0E76FD]/10 dark:bg-[#00FFC2]/20'>
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
        <div className='w-full'>
          <h3 className='w-full'>
            <p className="text-sm text-muted-foreground mt-2 whitespace-pre-line w-ful">
              {specsData.description}
            </p>
          </h3>
        </div>
      </CardContent>
    </Card>
  );
}
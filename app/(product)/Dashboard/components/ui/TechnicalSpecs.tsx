// components/TechnicalSpecs.tsx
'use client';

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
import { useTechnicalSpecs, useTokenMetadata } from '../../services/dashboardService';

interface TechnicalSpecsProps {
  tokenSymbol: string;
  chainId?: number;
}

import { TechnicalSpecsData } from '../../types/dashboard';

export default function TechnicalSpecs({ tokenSymbol, chainId = 1 }: TechnicalSpecsProps) {
  const { technicalSpecs, token: tokenInfo, isLoading, error, refetch } = useTechnicalSpecs(tokenSymbol, chainId);
  const isError = !!error;

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

  if (isError) {
    const errorMessage = error?.message || 'An error occurred';
    
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
            Failed to load technical specs
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

  if (isLoading) {
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

  if (!technicalSpecs) {
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
              {technicalSpecs.tokenAddress || 'N/A'}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => copyToClipboard(technicalSpecs.tokenAddress)}
            >
              <CopyIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-col gap-2">
          <span className="text-sm text-muted-foreground">Categories</span>
          <div className="flex flex-wrap gap-2">
            {technicalSpecs.categories?.map((category) => (
              <Badge key={category} variant="outline" className='font-semibold dark:text-[#00FFC2] text-[#0E76FD] border-none border-[#0E76FD]/0 bg-[#0E76FD]/10 dark:bg-[#00FFC2]/20'>
                {category}
              </Badge>
            ))}
            {!technicalSpecs.categories?.length && (
              <span className="text-sm text-muted-foreground">Uncategorized</span>
            )}
          </div>
        </div>

        {/* Technical Specs */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Algorithm</span>
          <Badge variant="outline">{technicalSpecs.hashingAlgorithm}</Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Block Time</span>
          <span className="text-sm font-medium">
            {technicalSpecs.blockTime ? `${technicalSpecs.blockTime} min` : 'N/A'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Genesis Date</span>
          <span className="text-sm font-medium">
            {technicalSpecs.genesisDate || 'N/A'}
          </span>
        </div>

        {/* Description */}
        <div className="w-full mt-4">
          <h3 className="text-sm font-medium mb-2">Description</h3>
          <div 
            className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground"
            dangerouslySetInnerHTML={{ 
              __html: technicalSpecs.description.replace(/\n/g, '<br />')
            }} 
          />
        </div>
      </CardContent>
    </Card>
  );
}
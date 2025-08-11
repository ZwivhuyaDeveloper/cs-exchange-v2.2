// app/components/ChainTable.tsx
'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink } from "lucide-react";
import Image from "next/image";

interface Chain {
  name: string;
  chainId: number;
  nativeToken: string;
  explorer: string;
  coinGeckoId: string;
  logoURL: string;
}

interface PriceData {
  [key: string]: {
    usd: number;
  };
}

const CHAINS: Chain[] = [
  {
    name: 'Ethereum Mainnet',
    chainId: 1,
    nativeToken: 'ETH',
    explorer: 'https://etherscan.io',
    coinGeckoId: 'ethereum',
    logoURL: "https://raw.githubusercontent.com/ethereum/ethereum-org-website/master/public/assets/logos/eth-logo.svg",
  },
  {
    name: 'Polygon',
    chainId: 137,
    nativeToken: 'MATIC',
    explorer: 'https://polygonscan.com',
    coinGeckoId: 'matic-network',
    logoURL: "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/matic.svg",
  },
  {
    name: 'BNB Chain',
    chainId: 56,
    nativeToken: 'BNB',
    explorer: 'https://bscscan.com',
    coinGeckoId: 'binancecoin',
    logoURL: "https://raw.githubusercontent.com/binance-chain/bsc-genesis-contract/master/docs/bsc.svg",
  },
  {
    name: 'Avalanche',
    chainId: 43114,
    nativeToken: 'AVAX',
    explorer: 'https://snowtrace.io',
    coinGeckoId: 'avalanche-2',
    logoURL: "https://raw.githubusercontent.com/ava-labs/avalanche-docs/master/static/img/avalanche-logo-red.svg",
  },
  {
    name: 'Fantom',
    chainId: 250,
    nativeToken: 'FTM',
    explorer: 'https://ftmscan.com',
    coinGeckoId: 'fantom',
    logoURL: "https://raw.githubusercontent.com/Fantom-foundation/brand-assets/master/logo/fantom-logo-red.svg",
  },
  {
    name: 'Celo',
    chainId: 42220,
    nativeToken: 'CELO',
    explorer: 'https://celoscan.io',
    coinGeckoId: 'celo',
    logoURL: "https://raw.githubusercontent.com/celo-org/celo-monorepo/master/packages/docs/static/img/celo-logo.svg",
  },
  {
    name: 'Optimism',
    chainId: 10,
    nativeToken: 'ETH',
    explorer: 'https://optimistic.etherscan.io',
    coinGeckoId: 'ethereum',
    logoURL: "https://raw.githubusercontent.com/ethereum-optimism/brand-kit/main/main/logo/logo.svg",
  },
  {
    name: 'Arbitrum',
    chainId: 42161,
    nativeToken: 'ETH',
    explorer: 'https://arbiscan.io',
    coinGeckoId: 'ethereum',
    logoURL: "https://raw.githubusercontent.com/OffchainLabs/arbitrum/master/docs/assets/arbitrum_logo.svg",
  },
  {
    name: 'Base',
    chainId: 8453,
    nativeToken: 'ETH',
    explorer: 'https://basescan.org',
    coinGeckoId: 'ethereum',
    logoURL: "https://raw.githubusercontent.com/base-org/brand-kit/main/logo/svg/base-blue.svg",
  },
  {
    name: 'Polygon zkEVM',
    chainId: 1101,
    nativeToken: 'ETH',
    explorer: 'https://zkevm.polygonscan.com',
    coinGeckoId: 'ethereum',
    logoURL: "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/polygon.svg",
  },
  {
    name: 'zkSync Era',
    chainId: 324,
    nativeToken: 'ETH',
    explorer: 'https://explorer.zksync.io',
    coinGeckoId: 'ethereum',
    logoURL: "https://raw.githubusercontent.com/matter-labs/zksync-era-brand-kit/main/era-logo.svg",
  },
  {
    name: 'Linea',
    chainId: 59144,
    nativeToken: 'ETH',
    explorer: 'https://lineascan.build',
    coinGeckoId: 'ethereum',
    logoURL: "https://raw.githubusercontent.com/Consensys/linea-brand-assets/main/linea-logo/linea-logo.svg",
  },
];

// Create a unique list of CoinGecko IDs
const COIN_IDS = [...new Set(CHAINS.map(chain => chain.coinGeckoId))].join(',');

const fetcher = async (url: string) => {
  const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;
  const headers: HeadersInit = {};
  if (apiKey) headers["x-cg-demo-api-key"] = apiKey;
  
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error('Failed to fetch prices');
  return res.json();
};

const Networks = () => {
  const [error, setError] = useState<string | null>(null);
  
  // Fetch prices using SWR with refresh interval
  const { data: prices, error: fetchError, isLoading } = useSWR<PriceData>(
    `https://api.coingecko.com/api/v3/simple/price?ids=${COIN_IDS}&vs_currencies=usd`,
    fetcher,
    {
      refreshInterval: 60000,
      onError: (err) => setError(err.message),
      onSuccess: () => setError(null),
    }
  );

  // Format token prices
  const formatPrice = (coinGeckoId: string) => {
    if (!prices || !prices[coinGeckoId]) return 'N/A';
    
    const price = prices[coinGeckoId].usd;
    return price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 4 : 2,
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-64" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {CHAINS.map((chain) => (
            <ChainCardSkeleton key={chain.chainId} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full bg-white dark:bg-[#0F0F0F] p-5">
      <div className="flex items-center gap-3">
        <div className="h-6 w-6 bg-blue-500/20 rounded-full flex items-center justify-center">
          <span className="text-blue-500 text-xs font-bold">$</span>
        </div>
        <h1 className="dark:text-white text-black font-semibold text-md sm:text-md">
          Blockchain Networks & Token Prices
        </h1>
      </div>

      {error && (
        <div className="bg-red-500/10 text-red-500 p-3 rounded-lg text-sm">
          {error} - Showing cached data
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3">
        {CHAINS.map((chain) => (
          <ChainCard
            key={chain.chainId}
            chain={chain}
            price={prices?.[chain.coinGeckoId]?.usd}
            formattedPrice={formatPrice(chain.coinGeckoId)}
          />
        ))}
      </div>
    </div>
  );
};

// Chain card component
function ChainCard({ chain, price, formattedPrice }: { 
  chain: Chain;
  price?: number;
  formattedPrice: string;
}) {
  return (
    <div className="w-full p-4 rounded-2xl dark:bg-[#0F0F0F] bg-white border dark:border-zinc-800 border-zinc-200">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white dark:bg-zinc-900 rounded-full p-1 border dark:border-zinc-800 border-zinc-200">
            <Image 
              src={chain.logoURL || "/placeholder-token.png"}
              alt={`${chain.name} logo`}
              width={32}
              height={32}
              className="w-8 h-8 object-contain"
              onError={(e) => {
                // Fallback to a placeholder if the image fails to load
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-token.png';
              }}
            />
          </div>
          <div>
            <h2 className="text-sm font-semibold dark:text-white text-black">{chain.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                ID: {chain.chainId}
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-500">
                {chain.nativeToken}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-center">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">Price</span>
          <span className="text-sm font-semibold dark:text-white text-black">
            {price ? `$${formattedPrice}` : 'N/A'}
          </span>
        </div>
      </div>

      <a
        href={chain.explorer}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 w-full flex items-center justify-center gap-2 text-xs text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 py-2 px-3 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
      >
        <span>View Explorer</span>
        <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  );
}

// Skeleton component for loading state
function ChainCardSkeleton() {
  return (
    <div className="w-full p-4 rounded-2xl dark:bg-[#0F0F0F] bg-white border dark:border-zinc-800 border-zinc-200">
      <div className="flex items-center gap-3">
        <Skeleton className="w-8 h-8 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <div className="flex gap-2">
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-3 w-10" />
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-4 w-16" />
      </div>

      <Skeleton className="mt-4 w-full h-8 rounded-lg" />
    </div>
  );
}

export default Networks;
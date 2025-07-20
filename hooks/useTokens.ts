import { useState, useEffect } from 'react';
import { Token } from '@/services/tokenService';

interface UseTokensOptions {
  chainId?: number;
  symbol?: string;
  address?: string;
  search?: string;
}

export function useTokens(options: UseTokensOptions = {}) {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (options.chainId) params.append('chainId', options.chainId.toString());
        if (options.symbol) params.append('symbol', options.symbol);
        if (options.address) params.append('address', options.address);
        if (options.search) params.append('search', options.search);

        const response = await fetch(`/api/tokens?${params}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch tokens');
        }

        const data = await response.json();
        setTokens(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching tokens:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, [options.chainId, options.symbol, options.address, options.search]);

  return { tokens, loading, error };
}

export function useTokenBySymbol(symbol: string, chainId: number = 1) {
  const { tokens, loading, error } = useTokens({ symbol, chainId });
  return { token: tokens[0] || null, loading, error };
}

export function useTokenByAddress(address: string, chainId: number = 1) {
  const { tokens, loading, error } = useTokens({ address, chainId });
  return { token: tokens[0] || null, loading, error };
}

export function useTokensByChain(chainId: number = 1) {
  return useTokens({ chainId });
}

export function useTokenSearch(search: string) {
  return useTokens({ search });
} 
'use client';

import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';

export function RefreshButton() {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Invalidate queries to refetch data
      await queryClient.invalidateQueries({ queryKey: ['tokenPrice'] });
    } catch (error) {
      console.error('Failed to refresh prices:', error);
      // Optionally, show a toast notification to the user
    } finally {
      // Ensure the refreshing state is always reset
      setIsRefreshing(false);
    }
  };

  return (
    <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline" size="sm">
      <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
      {isRefreshing ? 'Refreshing...' : 'Refresh Prices'}
    </Button>
  );
}

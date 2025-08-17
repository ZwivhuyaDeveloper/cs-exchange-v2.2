'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SignalFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentCategory = searchParams?.get('category') || '';
  const currentSort = searchParams?.get('sort') || 'publishedAt_desc';
  
  const handleFilterChange = (filter: string, value: string | null) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    
    if (value) {
      params.set(filter, value);
    } else {
      params.delete(filter);
    }

    // Reset to page 1 when changing filters
    params.delete('page');
    router.push(`?${params.toString()}`);
  };

  const handleReset = () => {
    router.push('?');
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl p-4 mb-6 shadow-sm">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Filters</h3>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleReset}
            className="text-gray-500 hover:text-red-500 dark:text-gray-400"
          >
            <X className="h-4 w-4 mr-1" /> Clear all
          </Button>
        </div>

        {/* Category Filters */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</h4>
          <div className="flex flex-wrap gap-2">
            {['All', 'Forex', 'Crypto', 'Stocks', 'Commodities', 'Indices'].map(category => (
              <Button
                key={category}
                variant={currentCategory === category.toLowerCase() ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFilterChange(
                  'category', 
                  category === 'All' ? null : category.toLowerCase()
                )}
                className={
                  currentCategory === category.toLowerCase() 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                    : 'bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700'
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Status Filters */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</h4>
          <div className="flex flex-wrap gap-2">
            {['All', 'Active', 'Completed', 'Pending'].map(status => (
              <Button
                key={status}
                variant="outline"
                size="sm"
                onClick={() => handleFilterChange(
                  'status', 
                  status === 'All' ? null : status.toLowerCase()
                )}
                className={
                  searchParams?.get('status') === status.toLowerCase()
                    ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                    : 'bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700'
                }
              >
                {status}
              </Button>
            ))}
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sort by</h4>
            <div className="relative">
              <select
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                value={currentSort}
                className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none pr-8"
              >
                <option value="publishedAt_desc">Newest First</option>
                <option value="publishedAt_asc">Oldest First</option>
                <option value="entryPrice_asc">Entry Price (Low to High)</option>
                <option value="entryPrice_desc">Entry Price (High to Low)</option>
                <option value="riskLevel_asc">Risk Level (Low to High)</option>
                <option value="riskLevel_desc">Risk Level (High to Low)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Time Filter */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time Range</h4>
            <div className="relative">
              <select
                onChange={(e) => handleFilterChange('time', e.target.value)}
                value={searchParams?.get('time') || 'all'}
                className="w-full p-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none pr-8"
              >
                <option value="all">All Time</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
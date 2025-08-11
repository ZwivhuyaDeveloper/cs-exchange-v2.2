'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function SignalFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sort = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    
    if (sort) {
      params.set('sort', sort);
    } else {
      params.delete('sort');
    }

    // Reset to page 1 when changing sort
    params.delete('page');
    
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-between mb-4 p-2 bg-gray-50 rounded-lg">
      <div className="text-sm text-gray-600">
        {searchParams.get('category') && (
          <span>Category: <span className="font-medium">{searchParams.get('category')}</span></span>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <label htmlFor="sort" className="text-sm text-gray-600">Sort by:</label>
        <select
          id="sort"
          onChange={handleSortChange}
          value={searchParams.get('sort') || 'publishedAt_desc'}
          className="border border-gray-300 rounded px-3 py-1 text-sm"
        >
          <option value="publishedAt_desc">Newest First</option>
          <option value="publishedAt_asc">Oldest First</option>
          <option value="entryPrice_asc">Entry Price (Low to High)</option>
          <option value="entryPrice_desc">Entry Price (High to Low)</option>
          <option value="riskLevel_asc">Risk Level (Low to High)</option>
          <option value="riskLevel_desc">Risk Level (High to Low)</option>
        </select>
      </div>
    </div>
  );
}
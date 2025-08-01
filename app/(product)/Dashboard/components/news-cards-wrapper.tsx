// app/(product)/Dashboard/components/news-cards-wrapper.tsx
'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// Skeleton loader component
function NewsCardsSkeleton() {
  return (
    <div className='flex flex-col bg-white dark:bg-[#0F0F0F] p-4 space-y-4'>
      {[...Array(3)].map((_, i: number) => (
        <div key={i} className="h-32 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
      ))}
    </div>
  );
}

// Import the NewsCards component with SSR disabled
const NewsCards = dynamic(
  () => import('./news-cards'),
  { 
    ssr: false,
    loading: () => <NewsCardsSkeleton />
  }
);

// Main wrapper component
export default function NewsCardsWrapper() {
  return (
    <Suspense fallback={<NewsCardsSkeleton />}>
      <NewsCards />
    </Suspense>
  );
}
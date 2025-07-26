import { Suspense } from 'react';
import { auth } from '@clerk/nextjs/server';
import SignalsGrid from './components/SignalsGrid';
import SignalsFilters from './components/SignalsFilters';
import SignalsHeader from './components/SignalsHeader';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface SignalsPageProps {
  searchParams: {
    page?: string;
    category?: string;
    token?: string;
    direction?: string;
    status?: string;
    analyst?: string;
    featured?: string;
  };
}

function SignalsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default async function SignalsPage({ searchParams }: SignalsPageProps) {
  const { userId } = auth();

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header Section */}
      <SignalsHeader />

      {/* Filters Section */}
      <SignalsFilters searchParams={searchParams} />

      {/* Signals Grid */}
      <Suspense fallback={<SignalsLoadingSkeleton />}>
        <SignalsGrid 
          searchParams={searchParams}
          userId={userId}
        />
      </Suspense>
    </div>
  );
}

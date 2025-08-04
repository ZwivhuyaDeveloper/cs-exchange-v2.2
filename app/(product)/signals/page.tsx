import { SignalCard } from './components/SignalsCard';
import { fetchSignals } from '@/app/actions/signals';
import { Signal } from '@/app/lib/types/signal';
import { NavMenu } from '../components/layout/NavMenu';
import TickerTape from '../Dashboard/components/ui/TickerTape';
import TrendingNews from '../News/components/related-news';
import SignalsFilters from './components/SignalsFilters';
import { SignalsPagination } from './components/SignalPagination';
import { LoadingCards } from './components/LoadingCard';
import { Suspense } from 'react';
import { auth } from '@clerk/nextjs/server';
import { hasPermission } from '@/lib/auth-utils';
import { notFound, redirect } from 'next/navigation';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function SignalsPage({
  searchParams,
}: {
  searchParams: { status: string; category: string; direction: string; sort: string; page: string; };
}) {
  // Check authentication and permissions
  const { userId } = await auth();
  
  // Redirect to sign-in if not authenticated
  if (!userId) {
    redirect('/sign-in?redirect_url=' + encodeURIComponent('/signals'));
  }

  // Check if user has permission to access signals
  const hasAccess = await hasPermission('canAccessSignals');
  
  // If user doesn't have access, show 404
  if (!hasAccess) {
    notFound();
  }
  // Parse page number
  const page = parseInt(searchParams.page) || 1;
  const pageSize = 12;

  // Fetch signals with pagination
  const { data: signals, total, page: currentPage, totalPages } = await fetchSignals({
    ...searchParams,
    page,
    pageSize,
  });

  return (
    <div className="w-full  h-full dark:bg-black bg-zinc-200 flex flex-col">

      {/* Ticker */}
      <div className="w-full h-fit flex justify-center items-center py-1 px-1 md:py-1 ">
        <div className="border border-px dark:border-zinc-700 border-zinc-200 w-full">
          <TickerTape />
        </div>
      </div>

      <div className='w-full flex flex-row gap-1'>

        <div className='w-[520px] hidden sm:flex bg-white'>
          <TrendingNews />
        </div>

        <div className='w-full bg-white dark:bg-[#0f0f0f] border border-px border-zinc-200 dark:border-zinc-700 px-2'>
          <div className="mb-8 px-2 mt-3">
            <div className="flex justify-between items-center mb-2">
              <h1 className="font-bold text-gray-900 text-xl dark:text-white">Trading Signals</h1>
              <div className="text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-3 py-1 rounded-full">
                Premium Content
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-md">
              Latest trading signals and market analysis from our expert analysts.
              {total > 0 && (
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} of {total}
                </span>
              )}
            </p>
          </div>

          <div>
            <SignalsFilters />
          </div>

        <div className='mx-1 mt-4'>
          <Suspense fallback={<LoadingCards />}>
            {signals && signals.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {signals.map((signal: Signal) => (
                    <SignalCard key={signal._id} signal={signal} />
                  ))}
                </div>
                <SignalsPagination 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                />
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 dark:text-gray-400">No signals available at the moment.</div>
              </div>
            )}
          </Suspense>
    </div>
        </div>

        <div className='w-[420px] hidden sm:flex bg-white'>

        </div>

      </div>
    </div>
  );
}

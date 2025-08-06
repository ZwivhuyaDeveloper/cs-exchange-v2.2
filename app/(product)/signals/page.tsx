import { SignalCard } from './components/SignalsCard';
import { fetchSignals } from '@/app/actions/signals';
import { Signal } from '@/app/lib/types/signal';
import TickerTape from '../Dashboard/components/ui/TickerTape';
import TrendingNews from '../News/components/related-news';
import SignalsFilters from './components/SignalsFilters';
import { SignalsPagination } from './components/SignalPagination';
import { LoadingCards } from './components/LoadingCard';
import { Suspense } from 'react';
import { currentUser } from '@clerk/nextjs/server';
import PaymentGuard from '@/app/components/PaymentGuard';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function SignalsPage({
  searchParams,
}: {
  searchParams: { status: string; category: string; direction: string; sort: string; page: string; };
}) {
  // Parse page number
  const page = parseInt(searchParams.page) || 1;
  const pageSize = 12;

  // Fetch signals with pagination
  const { data: signals, total, page: currentPage, totalPages } = await fetchSignals({
    ...searchParams,
    page,
    pageSize,
  });

  const user = await currentUser();
  const metadata = user?.publicMetadata || {};
  
  if (!metadata.canAccessSignals) {
    return (
      <div className="p-6 bg-white rounded-lg shadow text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p>You don't have permission to view the Signals page</p>
        <p className="mt-2">
          Contact support to request access to this feature
        </p>
      </div>
    );
  }

  return (
  <PaymentGuard>
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
            <h1 className="font-bold text-gray-900 text-xl dark:text-white mb-2">Trading Signals</h1>
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
    </PaymentGuard>
  );
}

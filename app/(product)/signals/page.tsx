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
import PaymentGuard from '@/app/components/payment-middleware/PaymentGuard';
import { UpgradeButton } from './components/UpgradeButton';

export const revalidate = 60; // Revalidate every 60 seconds

interface ResolvedSearchParams {
  status?: string;
  category?: string;
  direction?: string;
  sort?: string;
  page?: string;
}

// Updated to handle async searchParams
export default async function SignalsPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Resolve the promise to get searchParams
  const rawSearchParams = await props.searchParams;
  
  // Convert to our expected interface
  const searchParams: ResolvedSearchParams = {
    status: rawSearchParams.status ? String(rawSearchParams.status) : undefined,
    category: rawSearchParams.category ? String(rawSearchParams.category) : undefined,
    direction: rawSearchParams.direction ? String(rawSearchParams.direction) : undefined,
    sort: rawSearchParams.sort ? String(rawSearchParams.sort) : undefined,
    page: rawSearchParams.page ? String(rawSearchParams.page) : undefined,
  };

  // Parse page number with proper type safety
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const pageSize = 12;

  // Prepare filters object with only defined values
  const filters = Object.fromEntries(
    Object.entries({
      status: searchParams.status,
      category: searchParams.category,
      direction: searchParams.direction,
      sort: searchParams.sort,
    }).filter(([_, value]) => value !== undefined)
  );

  // Fetch signals with pagination and filters
  const { data: signals, total, page: currentPage, totalPages } = await fetchSignals({
    ...filters,
    page,
    pageSize,
  });

  const user = await currentUser();
  
  // If no user is logged in, PaymentGuard will handle the redirect
  if (!user) {
    return <PaymentGuard><div>Loading...</div></PaymentGuard>;
  }
  
  // Check if user has explicit access via metadata
  const metadata = user.publicMetadata || {};
  const hasExplicitAccess = metadata.canAccessSignals === true;
  
  // If user doesn't have explicit access, show upgrade prompt
  if (!hasExplicitAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b mb-15 from-gray-50 to-gray-100 dark:from-zinc-950 dark:to-zinc-950">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-8 border border-px border-zinc-200 dark:border-zinc-700 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Premium Signals Access Required</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Unlock real-time trading signals, technical analysis, and market insights with a premium subscription.
            </p>
            <div className="flex flex-col items-center space-y-6 max-w-2xl mx-auto">

              <div className='dark:bg-[#00FFC2] bg-blue-500 w-fit h-fit dark:text-black rounded-3xl'> 
                <UpgradeButton /> 
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  7-day money back guarantee
                </p>
                <a
                  href="/pricing"
                  className="text-blue-600 dark:text-[#00FFC2] hover:underline font-medium"
                >
                  Compare all plans →
                </a>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white dark:bg-zinc-900 border border-px border-zinc-200 dark:border-zinc-700 p-6 rounded-lg shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-[#00FFC2]/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-blue-600 dark:text-[#00FFC2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Real-time Signals</h3>
              <p className="text-gray-600 dark:text-gray-400">Get instant notifications for trading opportunities.</p>
            </div>
            
            <div className="bg-white dark:bg-zinc-900 border border-px border-zinc-200 dark:border-zinc-700 p-6 rounded-lg shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-[#00FFC2]/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-blue-600 dark:text-[#00FFC2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Expert Analysis</h3>
              <p className="text-gray-600 dark:text-gray-400">Access detailed technical analysis and market insights.</p>
            </div>
            
            <div className="bg-white dark:bg-zinc-900 border border-px border-zinc-200 dark:border-zinc-700 p-6 rounded-lg shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-[#00FFC2]/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-blue-600 dark:text-[#00FFC2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">24/7 Support</h3>
              <p className="text-gray-600 dark:text-gray-400">Get help from our team of trading experts.</p>
            </div>
          </div>
        </div>
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
        <div className='w-[520px] hidden bg-white'>
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
import { SignalCard } from './components/SignalsCard';
import { fetchSignals } from '@/app/actions/signals';
import { Signal } from '@/app/lib/types/signal';
import { NavMenu } from '../components/layout/NavMenu';
import TickerTape from '../Dashboard/components/ui/TickerTape';
import TrendingNews from '../News/components/related-news';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function SignalsPage() {
  // Fetch signals with pagination
  const { data: signals } = await fetchSignals({});

  return (
    <div className="w-full  h-full dark:bg-black bg-zinc-200 flex flex-col">

      {/* Header */}
      <header className="sticky top-0 z-50 flex h-fit bg-white items-center border-none rounded-b-3xl backdrop-filter backdrop-blur-2xl dark:bg-zinc-900/90 ">
        <NavMenu />
      </header>

      {/* Ticker */}
      <div className="w-full h-fit flex justify-center items-center py-1 px-1 md:py-1 ">
        <div className="border border-px dark:border-zinc-700 border-zinc-200 w-full">
          <TickerTape />
        </div>
      </div>

      <div className='w-full flex flex-row gap-1'>

        <div className='w-[520px] bg-white'>
          <TrendingNews />
        </div>

        <div className='w-full bg-white px-2'>

          <div className="mb-8 px-2 mt-3">
            <h1 className="font-bold text-gray-900 text-xl dark:text-white mb-2">Trading Signals</h1>
            <p className="text-gray-600 dark:text-gray-300 text-md">
              Latest trading signals and market analysis from our expert analysts.
            </p>
          </div>

          <div className='mx-1 mt-4'>
            {signals && signals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {signals.map((signal: Signal) => (
                  <SignalCard key={signal._id} signal={signal} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 dark:text-gray-400">No signals available at the moment.</div>
              </div>
            )}
          </div>
        </div>

        <div className='w-[420px] bg-white'>

        </div>

      </div>
    </div>
  );
}

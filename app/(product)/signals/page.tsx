import { SignalCard } from './components/SignalsCard';
import { fetchSignals } from '@/app/actions/signals';
import { Signal } from '@/app/lib/types/signal';
import { NavMenu } from '../components/layout/NavMenu';
import TickerTape from '../Dashboard/components/ui/TickerTape';

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

      <div className='mx-6 mt-4'>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Trading Signals</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Latest trading signals and market analysis from our expert analysts.
          </p>
        </div>

        {signals && signals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
  );
}

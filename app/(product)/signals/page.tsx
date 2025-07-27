import { SignalCard } from './components/SignalsCard';
import { fetchSignals } from '@/app/actions/signals';
import { Signal } from '@/app/lib/types/signal';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function SignalsPage() {
  // Fetch signals with pagination
  const { data: signals } = await fetchSignals({});

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Trading Signals</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Latest trading signals and market analysis from our expert analysts.
        </p>
      </div>

      {signals && signals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  );
}

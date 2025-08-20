import { notFound } from 'next/navigation';
import { fetchSignalBySlug } from '@/app/actions/signals';
import { SignalHeader } from '@/app/(product)/signals/components/SignalHeader';
import { SignalMetrics } from '@/app/(product)/signals/components/SignalMetrics';
import { SignalAnalysis } from '@/app/(product)/signals/components/SignalAnalysis';
import { SignalInfoSidebar } from '@/app/(product)/signals/components/SignalInfoSidebar';
import { TechnicalAnalysis } from '@/app/(product)/signals/components/TechnicalAnalysis';
import { MarketConditions } from '@/app/(product)/signals/components/MarketConditions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface SignalPageProps {
  params: { slug: string };
}

export const revalidate = 60; // Revalidate every 60 seconds

export default async function SignalPage({ params }: SignalPageProps) {
  const { slug } = params;
  const signal = await fetchSignalBySlug(slug);

  if (!signal || !signal.token) {
    notFound();
  }


  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link 
            href="/signals" 
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Back to Signals
          </Link>
        </div>

        <SignalHeader signal={signal} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <main className="space-y-6">

            <SignalMetrics signal={signal} />

            <TechnicalAnalysis signal={signal} />

            {signal.analysis && <SignalAnalysis signal={signal} />}
          </main>

          <aside className="space-y-6">
            <MarketConditions signal={signal} />
            <SignalInfoSidebar signal={signal} />
          </aside>
        </div>
      </div>
    </div>
  );
}
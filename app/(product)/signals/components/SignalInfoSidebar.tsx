'use client';

import Image from 'next/image';
import { Signal } from '@/app/lib/types/signal';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDynamicDateTime } from '@/app/lib/dateUtils';

interface SignalInfoSidebarProps {
  signal: Signal;
}

const InfoRow = ({ label, value }: { label: string, value: string | React.ReactNode }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-zinc-500 dark:text-zinc-400">{label}</span>
    <span className="font-medium text-zinc-900 dark:text-zinc-100">{value}</span>
  </div>
);

export function SignalInfoSidebar({ signal }: SignalInfoSidebarProps) {
  const { analyst, publishedAt, timeframe, confidence, marketConditions } = signal;

  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
        <CardHeader className="flex-row items-center gap-4">
          {analyst?.image && (
            <Image 
              src={analyst.image} 
              alt={analyst.name || 'Analyst'} 
              width={48} 
              height={48} 
              className="rounded-full"
            />
          )}
          <div>
            <CardTitle>{analyst?.name || 'CS-AI'}</CardTitle>
            <CardDescription>Signal Analyst</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <InfoRow label="Published" value={publishedAt ? formatDynamicDateTime(publishedAt) : 'N/A'} />
          <InfoRow label="Timeframe" value={<Badge variant="secondary">{timeframe || 'N/A'}</Badge>} />
          <InfoRow label="Confidence" value={<Badge variant="secondary">{confidence || 'N/A'}</Badge>} />
        </CardContent>
      </Card>

      {marketConditions && (
        <Card className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
          <CardHeader>
            <CardTitle>Market Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 capitalize">
              {marketConditions.trend}
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-500/30">
        <CardHeader>
          <CardTitle className="text-yellow-900 dark:text-yellow-300">Risk Disclaimer</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Trading cryptocurrencies involves significant risk and may not be suitable for all investors. The information provided is for educational purposes only and should not be considered financial advice.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

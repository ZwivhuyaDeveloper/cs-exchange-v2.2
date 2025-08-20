'use client';

import Image from 'next/image';
import { Signal } from '@/app/lib/types/signal';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDynamicDateTime } from '@/app/lib/dateUtils';
import { CheckCircle, Star } from 'lucide-react';

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
          {analyst?.avatar ? (
            <Image 
              src={analyst.avatar} 
              alt={analyst.displayName || analyst.name || 'Analyst'} 
              width={48} 
              height={48} 
              className="rounded-full"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-lg font-bold text-gray-500 dark:text-gray-400">
                {analyst?.displayName?.[0] || analyst?.name?.[0] || 'A'}
              </span>
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">
                {analyst?.displayName || analyst?.name || 'CS-AI'}
              </CardTitle>
              {analyst?.isVerified && (
                <CheckCircle className="h-5 w-5 text-blue-500" />
              )}
            </div>
            <CardDescription className="flex items-center gap-2">
              <span>Signal Analyst</span>
              {analyst?.tier && (
                <Badge variant="outline" className="text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  {analyst.tier}
                </Badge>
              )}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {analyst?.experience && (
            <InfoRow label="Experience" value={`${analyst.experience} years`} />
          )}
          {analyst?.specializations && analyst.specializations.length > 0 && (
            <InfoRow 
              label="Specializations" 
              value={
                <div className="flex flex-wrap gap-1">
                  {analyst.specializations.slice(0, 3).map((spec, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                  {analyst.specializations.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{analyst.specializations.length - 3}
                    </Badge>
                  )}
                </div>
              } 
            />
          )}
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

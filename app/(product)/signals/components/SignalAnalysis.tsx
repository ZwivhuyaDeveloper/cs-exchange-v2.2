'use client';

import { Signal } from '@/app/lib/types/signal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SignalAnalysisProps {
  signal: Signal;
}

export function SignalAnalysis({ signal }: SignalAnalysisProps) {
  const { analysis } = signal;

  if (!analysis) {
    return null;
  }

  return (
    <Card className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
      <CardHeader>
        <CardTitle>Analysis</CardTitle>
      </CardHeader>
      <CardContent className="prose dark:prose-invert max-w-none">
        <p>{analysis}</p>
      </CardContent>
    </Card>
  );
}

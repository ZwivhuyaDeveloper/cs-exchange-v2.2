'use client';

import { Signal } from '@/app/lib/types/signal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDollar } from '@/app/lib/format';
import { Badge } from '@/components/ui/badge';
import { getRiskColor, formatRiskLevel } from '@/app/(product)/signals/utils/styling';
import { TrendingUp, TrendingDown, Target, Shield, HelpCircle } from 'lucide-react';

interface SignalMetricsProps {
  signal: Signal;
}

const MetricItem = ({ icon, label, value, subValue, valueClass = '' }: { icon: React.ReactNode, label: string, value: string, subValue?: string, valueClass?: string }) => (
  <div className="flex items-center justify-between py-3">
    <div className="flex items-center gap-3">
      <div className="text-zinc-400">{icon}</div>
      <span className="text-zinc-600 dark:text-zinc-300">{label}</span>
    </div>
    <div className="text-right">
      <span className={`font-semibold text-zinc-900 dark:text-zinc-100 ${valueClass}`}>{value}</span>
      {subValue && <p className="text-xs text-zinc-500 dark:text-zinc-400">{subValue}</p>}
    </div>
  </div>
);

export function SignalMetrics({ signal }: SignalMetricsProps) {
  const { entryPrice, stopLoss, targetPrices, riskRewardRatio, riskLevel } = signal;

  const calculatePercentage = (price: number) => {
    if (!entryPrice || !price) return null;
    const percentage = ((price - entryPrice) / entryPrice) * 100;
    return `${percentage > 0 ? '+' : ''}${percentage.toFixed(2)}%`;
  };

  return (
    <Card className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
      <CardHeader>
        <CardTitle>Trade Metrics</CardTitle>
      </CardHeader>
      <CardContent className="divide-y divide-zinc-200 dark:divide-zinc-800">
        <MetricItem 
          icon={<TrendingUp className="h-5 w-5" />} 
          label="Entry Price" 
          value={formatDollar(entryPrice || 0)} 
        />
        <MetricItem 
          icon={<Shield className="h-5 w-5" />} 
          label="Stop Loss" 
          value={formatDollar(stopLoss || 0)} 
          subValue={calculatePercentage(stopLoss || 0) || ''}
          valueClass="text-red-500"
        />
        {targetPrices?.map((price, index) => (
          <MetricItem 
            key={index} 
            icon={<Target className="h-5 w-5" />} 
            label={`Target ${index + 1}`}
            value={formatDollar(price || 0)}
            subValue={calculatePercentage(price || 0) || ''}
            valueClass="text-green-500"
          />
        ))}
        <MetricItem 
          icon={<HelpCircle className="h-5 w-5" />} 
          label="Risk/Reward Ratio" 
          value={riskRewardRatio ? `1:${riskRewardRatio.toFixed(2)}` : 'N/A'}
        />
        <MetricItem 
          icon={<TrendingDown className="h-5 w-5" />} 
          label="Risk Level" 
          value={formatRiskLevel(riskLevel || '')}
          valueClass={getRiskColor(riskLevel || '')}
        />
      </CardContent>
    </Card>
  );
}

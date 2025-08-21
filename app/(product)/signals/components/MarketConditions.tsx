import { Signal } from '@/app/lib/types/signal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Zap, Activity } from 'lucide-react';

interface MarketConditionsProps {
  signal: Signal;
}


export function MarketConditions({ signal }: MarketConditionsProps) {
  const { marketConditions } = signal;

  if (!marketConditions) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Conditions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 text-sm">
        {marketConditions.trend && (
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-zinc-500" />
            <div>
              <p className="text-zinc-500 dark:text-zinc-400">Trend</p>
              <p className="font-semibold capitalize">{marketConditions.trend}</p>
            </div>
          </div>
        )}
        {marketConditions.volatility && (
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-zinc-500" />
            <div>
              <p className="text-zinc-500 dark:text-zinc-400">Volatility</p>
              <p className="font-semibold capitalize">{marketConditions.volatility}</p>
            </div>
          </div>
        )}
        {marketConditions.volume && (
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-zinc-500" />
            <div>
              <p className="text-zinc-500 dark:text-zinc-400">Volume</p>
              <p className="font-semibold capitalize">{marketConditions.volume}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

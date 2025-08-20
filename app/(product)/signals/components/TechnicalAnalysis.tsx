import { Signal } from '@/app/lib/types/signal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart2, Calendar, TrendingUp } from 'lucide-react';

interface TechnicalAnalysisProps {
  signal: Signal;
}

export function TechnicalAnalysis({ signal }: TechnicalAnalysisProps) {
  const { technicalAnalysis } = signal;

  if (!technicalAnalysis) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Technical Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {technicalAnalysis.indicators && technicalAnalysis.indicators.length > 0 && (
          <div>
            <h3 className="font-semibold flex items-center gap-2 mb-2"><BarChart2 className="h-5 w-5" /> Indicators</h3>
            <div className="flex flex-wrap gap-2">
              {technicalAnalysis.indicators.map((indicator) => (
                <Badge key={indicator} variant="secondary">{indicator}</Badge>
              ))}
            </div>
          </div>
        )}
        {technicalAnalysis.chartPatterns && technicalAnalysis.chartPatterns.length > 0 && (
          <div>
            <h3 className="font-semibold flex items-center gap-2 mb-2"><TrendingUp className="h-5 w-5" /> Chart Patterns</h3>
            <div className="flex flex-wrap gap-2">
              {technicalAnalysis.chartPatterns.map((pattern) => (
                <Badge key={pattern} variant="secondary">{pattern}</Badge>
              ))}
            </div>
          </div>
        )}
        {technicalAnalysis.timeframes && technicalAnalysis.timeframes.length > 0 && (
          <div>
            <h3 className="font-semibold flex items-center gap-2 mb-2"><Calendar className="h-5 w-5" /> Timeframes</h3>
            <div className="flex flex-wrap gap-2">
              {technicalAnalysis.timeframes.map((timeframe) => (
                <Badge key={timeframe} variant="secondary">{timeframe}</Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// components/Edge/ProfitCalculator.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CryptoSignal } from "@/app/lib/interface";
import { fetchTokenPrice } from '@/app/lib/coingecko';

export default function GainCalculator({ signal }: { signal: CryptoSignal }) {
  const targetPrices = signal.targetPrices || [];
  
  const [investment, setInvestment] = useState<number>(1000);
  const [selectedTarget, setSelectedTarget] = useState<number>(targetPrices[0] || 0);
  const [potentialGain, setPotentialGain] = useState<number>(0);
  const [percentageChange, setPercentageChange] = useState<number>(0);
  const [isCalculable, setIsCalculable] = useState<boolean>(false);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [loadingPrice, setLoadingPrice] = useState<boolean>(true);

  // Fetch current price
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setLoadingPrice(true);
        const price = await fetchTokenPrice(signal.token?.coingeckoId ?? '');
        setCurrentPrice(price);
        
        if (price !== null) {
          setSelectedTarget(price);
        }
      } catch (error) {
        console.error('Error fetching token price:', error);
      } finally {
        setLoadingPrice(false);
      }
    };

    fetchPrice();
  }, [signal]);

  // Validate calculation
  useEffect(() => {
    const validEntryPrice = signal.entryPrice > 0;
    const validTargetPrice = selectedTarget > 0;
    const hasTargetPrices = targetPrices.length > 0 || currentPrice !== null;
    
    setIsCalculable(validEntryPrice && validTargetPrice && hasTargetPrices);
  }, [signal.entryPrice, selectedTarget, targetPrices, currentPrice]);

  // Calculate gains
  useEffect(() => {
    if (isCalculable) {
      calculateGain();
    }
  }, [investment, selectedTarget, isCalculable]);

  const calculateGain = () => {
    if (!isCalculable) return;
    
    const priceDifference = selectedTarget - signal.entryPrice;
    const percentage = (priceDifference / signal.entryPrice) * 100;
    
    let gainAmount = 0;
    if (signal.direction === 'buy') {
      gainAmount = investment * (percentage / 100);
    } else {
      gainAmount = investment * (-percentage / 100);
    }
    
    setPotentialGain(gainAmount);
    setPercentageChange(percentage);
  };

  const directionColor = signal.direction === 'buy' 
    ? 'text-green-600' 
    : 'text-red-600';
    
  const gainColor = potentialGain >= 0 
    ? 'text-green-600' 
    : 'text-red-600';

  // Combine targets with current price
  const allTargets = [
    ...targetPrices,
    ...(currentPrice !== null ? [currentPrice] : [])
  ];

  return (
    <Card className="mt-6 border rounded-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">
            Profit/Loss Calculator
          </CardTitle>
          {signal.riskLevel && (
            <Badge variant="outline" className="border-yellow-500 text-yellow-600">
              Risk: {signal.riskLevel.toUpperCase()}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {allTargets.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="investment">Investment Amount ($)</Label>
                <Input
                  type="number"
                  id="investment"
                  value={investment}
                  onChange={(e) => setInvestment(Math.abs(Number(e.target.value)))}
                  min="1"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label>Select Target Price</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {targetPrices.map((price, i) => (
                    <Button
                      key={`target-${i}`}
                      variant={selectedTarget === price ? "default" : "outline"}
                      size="sm"
                      className={`h-8 px-3 text-xs ${
                        selectedTarget === price ? 
                          (signal.direction === 'buy' 
                            ? 'bg-green-500 hover:bg-green-600' 
                            : 'bg-red-500 hover:bg-red-600') 
                          : ''
                      }`}
                      onClick={() => setSelectedTarget(price)}
                    >
                      ${price.toFixed(2)}
                    </Button>
                  ))}
                  
                  {currentPrice !== null && (
                    <Button
                      key="current-price"
                      variant={selectedTarget === currentPrice ? "default" : "outline"}
                      size="sm"
                      className={`h-8 px-3 text-xs ${
                        selectedTarget === currentPrice 
                          ? 'bg-blue-500 hover:bg-blue-600' 
                          : ''
                      }`}
                      onClick={() => setSelectedTarget(currentPrice)}
                    >
                      Current: ${currentPrice.toFixed(2)}
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex justify-between text-sm mb-2">
                <span className={gainColor}>
                  {potentialGain >= 0 ? 'Potential Profit' : 'Potential Loss'}
                </span>
                <span className={gainColor}>
                  {potentialGain >= 0 ? '+' : ''}{potentialGain.toFixed(2)} USD
                </span>
              </div>
              
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Entry: ${signal.entryPrice.toFixed(2)}</span>
                <span>Target: ${selectedTarget.toFixed(2)}</span>
              </div>
              
              <Progress 
                value={Math.abs(percentageChange)} 
                max={Math.max(100, Math.abs(percentageChange) * 1.2)}
                className={signal.direction === 'buy' ? 'bg-green-500/20' : 'bg-red-500/20'}
              />
              
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span className={directionColor}>
                  {percentageChange > 0 ? '+' : ''}{percentageChange.toFixed(2)}%
                </span>
              </div>
            </div>
          </>
        ) : loadingPrice ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="text-gray-500 mb-2">
              No target prices available for calculation
            </div>
            <Button variant="outline" disabled>
              Cannot Calculate Profit
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
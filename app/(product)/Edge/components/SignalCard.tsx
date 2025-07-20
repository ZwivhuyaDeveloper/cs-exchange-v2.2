// components/Edge/SignalCard.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CryptoSignal } from "@/app/lib/interface";
import { format } from 'date-fns';
import { fetchTokenPrice } from '@/app/lib/coingecko';

const FALLBACK_LOGO = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iY3VycmVudENvbG9yIj48cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptMCAxOGMtNC40MSAwLTgtMy41OS04LThzMy41OS04IDgtOCA4IDMuNTkgOCA4LTMuNTkgOC04IDh6Ii8+PHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==";

const TIMEFRAME_MAP = {
  short: { label: 'Short-term', color: 'bg-purple-500' },
  medium: { label: 'Medium-term', color: 'bg-blue-500' },
  long: { label: 'Long-term', color: 'bg-indigo-500' }
};

const RISK_MAP = {
  low: { label: 'Low Risk', color: 'bg-green-500' },
  medium: { label: 'Medium Risk', color: 'bg-yellow-500' },
  high: { label: 'High Risk', color: 'bg-red-500' }
};

export default function CryptoSignalCard({ signal }: { signal: CryptoSignal }) {
  // Safely handle undefined targetPrices
  const targetPrices = signal.targetPrices || [];
  const firstTarget = targetPrices.length > 0 ? targetPrices[0] : 0;
  
  const [investment, setInvestment] = useState<number>(1000);
  const [selectedTarget, setSelectedTarget] = useState<number>(firstTarget);
  const [potentialGain, setPotentialGain] = useState<number>(0);
  const [percentageChange, setPercentageChange] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [logoError, setLogoError] = useState<boolean>(false);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [loadingPrice, setLoadingPrice] = useState<boolean>(true);
  const [priceChange, setPriceChange] = useState<number>(0);

  // Fetch current price on mount
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setLoadingPrice(true);
        const price = await fetchTokenPrice(signal.token?.coingeckoId);
        setCurrentPrice(price);
        
        if (price !== null) {
          const change = ((price - signal.entryPrice) / signal.entryPrice) * 100;
          setPriceChange(signal.direction === 'buy' ? change : -change);
        }
      } catch (error) {
        console.error('Error fetching token price:', error);
      } finally {
        setLoadingPrice(false);
      }
    };

    fetchPrice();
  }, [signal]);

  // Calculate gains whenever inputs change
  useEffect(() => {
    calculateGain();
  }, [investment, selectedTarget]);

  const calculateGain = () => {
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
    ? 'bg-green-500/20 text-green-700 border-green-500' 
    : 'bg-red-500/20 text-red-700 border-red-500';
    
  const gainColor = potentialGain >= 0 
    ? 'text-green-600' 
    : 'text-red-600';
    
  const priceColor = priceChange >= 0 ? 'text-green-500' : 'text-red-500';

  // Get token logo URL with fallback
  const tokenLogo = logoError || !signal.token?.logo 
    ? FALLBACK_LOGO 
    : signal.token.logo;

  return (
    <Card className={`shadow-none rounded-none border-none overflow-hidden transition-all duration-300 w-full h-full`}>
      <CardHeader className="flex-row justify-between items-center w-full">
        <div className="grid sm:grid-rows-2 md:grid-rows-2 lg:grid-cols-2 items-center gap-3 w-full justify-between">
          <div className='flex flex-row items-center gap-2 w-full'>
            <img 
              src={tokenLogo}
              alt={signal.token?.symbol || 'Token'} 
              className="h-8 w-8 rounded-full object-contain bg-white"
              onError={() => setLogoError(true)}
            />
              <CardTitle className="font-bold sm:text-sm md:text-md lg:text-lg">{signal.token?.symbol || 'N/A'}</CardTitle>
              <span className={`px-2 rounded-full text-xs font-semibold ${directionColor}`}>
                {signal.direction.toUpperCase()}
              </span>
          </div>
            {/* Risk and Timeframe badges */}
            <div className="flex gap-2 w-full">
              {signal.timeframe && (
                <Badge className={`${TIMEFRAME_MAP[signal.timeframe].color} text-white`}>
                  {TIMEFRAME_MAP[signal.timeframe].label}
                </Badge>
              )}
              {signal.riskLevel && (
                <Badge className={`${RISK_MAP[signal.riskLevel].color} text-white`}>
                  {RISK_MAP[signal.riskLevel].label}
                </Badge>
              )}
            </div>
        </div>
        <div className="text-right w-full flex flex-row items-center gap-3 justify-between">
          <div className="mt-1">
            {loadingPrice ? (
              <Skeleton className="h-4 w-16" />
            ) : currentPrice ? (
              <div className="flex items-center gap-1">
                <span className="font-semibold">${currentPrice.toFixed(2)}</span>
                <span className={`text-xs ${priceColor}`}>
                  ({priceChange > 0 ? '+' : ''}{priceChange.toFixed(2)}%)
                </span>
              </div>
            ) : (
              <span className="text-xs text-gray-500">Price unavailable</span>
            )}
          </div>
          <div className="text-xs text-gray-500 ">
            {format(new Date(signal.publishedAt), 'MMM dd, yyyy')}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="w-full">

        
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <Label className="text-xs text-muted-foreground">Entry Price</Label>
            <p className="font-semibold">${signal.entryPrice.toFixed(2)}</p>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Stop Loss</Label>
            <p className="font-semibold">
              {signal.stopLoss ? `$${signal.stopLoss.toFixed(2)}` : 'N/A'}
            </p>
          </div>
        </div>
        
        <div className="">
          <Label className="text-xs text-muted-foreground mb-1">Target Prices</Label>
          <div className="flex flex-wrap gap-2">
            {targetPrices.map((price, i) => (
              <Button 
                key={i}
                variant={selectedTarget === price ? "default" : "outline"}
                size="sm"
                className={`h-8 px-3 text-xs ${selectedTarget === price ? 
                  (signal.direction === 'buy' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600') : ''}`}
                onClick={() => setSelectedTarget(price)}
              >
                ${price.toFixed(2)}
              </Button>
            ))}
            {currentPrice && (
              <Button 
                variant={selectedTarget === currentPrice ? "default" : "outline"}
                size="sm"
                className={`h-8 px-3 text-xs ${selectedTarget === currentPrice ? 
                  'bg-blue-500 hover:bg-blue-600' : ''}`}
                onClick={() => setSelectedTarget(currentPrice)}
              >
                Current: ${currentPrice.toFixed(2)}
              </Button>
            )}
          </div>
        </div>
        
        {/*{signal.notes && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <h4 className="text-xs font-semibold text-muted-foreground mb-1">Analysis Notes</h4>
            <p className="text-sm">{signal.notes}</p>
          </div>
        )}*/}
        
         {/*{isExpanded && (
          <div className="mt-4 space-y-4 border-t pt-4">
            <div>
              <Label htmlFor="investment" className="text-xs text-muted-foreground">
                Investment Amount ($)
              </Label>
              <Input
                type="number"
                id="investment"
                value={investment}
                onChange={(e) => setInvestment(Math.abs(Number(e.target.value)))}
                min="1"
                className="mt-1"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className={gainColor}>
                  {potentialGain >= 0 ? 'Potential Profit' : 'Potential Loss'}
                </span>
                <span className={gainColor}>
                  {potentialGain >= 0 ? '+' : ''}{potentialGain.toFixed(2)} USD
                  <span className="ml-2">
                    ({percentageChange.toFixed(2)}%)
                  </span>
                </span>
              </div>
              <Progress 
                value={Math.abs(percentageChange)} 
                className={signal.direction === 'buy' ? 'bg-green-500/20' : 'bg-red-500/20'}
              />
            </div>
          </div>
         )}*/}
      </CardContent>
      
      {/*<CardFooter className="p-4 pt-0">
        <Button 
          variant="ghost" 
          size="sm"
          className="text-xs w-full"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Hide Calculator' : 'Show Profit Calculator'}
        </Button>
      </CardFooter>*/}
    </Card>
  );
}
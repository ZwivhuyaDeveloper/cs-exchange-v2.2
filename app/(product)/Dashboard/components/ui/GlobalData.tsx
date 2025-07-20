'use client';

import { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Skeleton } from '../../../../../components/ui/skeleton';
import { Tooltip } from '@radix-ui/react-tooltip';
import { ChartContainer } from '../../../../../components/ui/chart';

export default function GlobalData() {
  const [marketCap, setMarketCap] = useState<number | null>(null);
  const [volume, setVolume] = useState<number | null>(null);
  const [percentageChange, setPercentageChange] = useState<number | null>(null);
  const [marketCapData, setMarketCapData] = useState<{ time: string; value: number }[]>([]);
  const [volumeData, setVolumeData] = useState<{ time: string; value: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;
        if (!apiKey) throw new Error("CoinGecko API key is missing");

        const response = await fetch("https://api.coingecko.com/api/v3/global", {
          headers: { "x-cg-demo-api-key": apiKey }
        });
        if (!response.ok) throw new Error("Failed to fetch global data");

        const data = await response.json();
        const globalData = data.data;
        const currentTime = new Date().toLocaleTimeString();
        const newMarketCap = globalData.total_market_cap.usd;
        const newVolume = globalData.total_volume.usd;

        setMarketCap(newMarketCap);
        setVolume(newVolume);
        setPercentageChange(globalData.market_cap_change_percentage_24h_usd);

        setMarketCapData((prev) => [...prev.slice(-9), { time: currentTime, value: newMarketCap }]);
        setVolumeData((prev) => [...prev.slice(-9), { time: currentTime, value: newVolume }]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 5 * 60 * 1000); // Every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const formatLargeNumber = (num: number) => {
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    return num.toString();
  };

  useEffect(() => {
    console.log('Market Cap Data:', marketCapData);
    console.log('Volume Data:', volumeData);
  }, [marketCapData, volumeData]);

  if (isLoading) {
    return (
      <div className="w-full h-full gap-3 p-3 flex flex-col ">
        <Skeleton className="h-6 w-1/2 bg-zinc-800" />
        <Skeleton className="h-6 w-full bg-zinc-800" />
        <Skeleton className="h-6 w-full bg-zinc-800" />
        <Skeleton className="h-6 w-full bg-zinc-800" />
      </div>
    );
  }

  return (
    <div className='grid grid-row-2  p-1 w-full h-full'>
      {/* Market Cap Section */}
      <div className='w-full h-full p-4 gap-2 flex flex-row justify-between items-center'>
        <div className='w-full h-full gap-2 flex flex-col justify-between'>
          <div className='flex flex-row gap-2 items-center'>
            <h1 className='text-zinc-300 font-normal text-[14px]'>Market Cap</h1>
            {percentageChange !== null && (
              <h1 className={`flex flex-row items-center gap-1 text-[14px] font-medium ${percentageChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {percentageChange >= 0 ? <ArrowUp width={15} height={15} /> : <ArrowDown width={15} height={15} />}
                {Math.abs(percentageChange).toFixed(2)}%
              </h1>
            )}
          </div>
          <h1 className='text-[22px] font-medium text-zinc-100'>
            {marketCap !== null ? `$${formatLargeNumber(marketCap)}` : 'Loading...'}
          </h1>
        </div>
      </div>

      {/* Volume Section */}
      <div className='w-full h-full p-4 gap-2 flex flex-row justify-between items-center'>
        <div className='w-full h-full gap-2 flex flex-col'>
          <h1 className='text-zinc-300 font-normal text-[14px]'>24h Trading Volume</h1>
          <h1 className='text-[22px] font-medium text-zinc-100'>
            {volume !== null ? `$${formatLargeNumber(volume)}` : 'Loading...'}
          </h1>
        </div>
      </div>
    </div>
  );
}
// app/dashboard/page.tsx
import { client } from "@/app/lib/sanity";
import CryptoSignalCard from "@/app/(product)/Edge/components/SignalCard";


import { Button } from "@/components/ui/button";
 // Use SIGNAL_QUERY instead

import Link from "next/link";
import { NavMenu } from "@/app/(product)/components/layout/NavMenu";
import TickerTape from "@/app/(product)/Dashboard/components/ui/TickerTape";
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { SIGNAL_QUERY } from "@/app/lib/queries";
import { CryptoSignal } from "@/app/lib/interface";
import { fetchTokenPrices } from "@/app/lib/coingecko";

type CryptoSignalWithPrice = CryptoSignal & { currentPrice: number | null };

export default async function DashboardPage() {
  // Use SIGNAL_QUERY which doesn't require parameters
  const signals = await client.fetch<CryptoSignal[]>(SIGNAL_QUERY);
  
  // Extract Coingecko IDs for batch fetching
  const coingeckoIds = signals
    .filter(signal => signal.token?.coingeckoId)
    .map(signal => signal.token.coingeckoId);
  
  const tokenPrices = await fetchTokenPrices(coingeckoIds);

  if (!signals || signals.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="text-red-500">No signals found.</div>
      </div>
    );
  }

  return (
    <main className="bg-zinc-100 dark:bg-black w-full h-full">
      {/* Navigation */}
      <header>
        <NavMenu/>
      </header>

      {/* <Ticker/> */}
      <div className="h-fit w-full  justify-center dark:bg-[#0F0F0F] bg-zinc-100 items-center flex mt-1 mb-1">
        <TickerTape/>
      </div> 
      
      <body className="">
        <div className="grid sm:grid-flow-row md: lg:grid-flow-col  gap-1 justify-center">
          <div className="sm:w-full md:w-[150px] lg:max-w-[300px] bg-white h-full"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 justify-center ">
            {signals.map(signal => (
              <Card key={signal._id} className="block rounded-none p-0 sm:w-fit md:w-fit lg:w-full shadow-none m-0">
                <CardContent className="m-0 w-full">
                  <CryptoSignalCard 
                    signal={{
                      ...signal,
                      currentPrice: tokenPrices[signal.token?.coingeckoId ?? '']
                    } as CryptoSignalWithPrice}
                  />
                </CardContent>
                <Button className="ml-12 mb-5 mt-0">
                  <Link href={`/signals/${signal.slug}`}>
                    <span>View</span>
                  </Link>
                </Button>
              </Card>
            ))}
          </div>
          <div className="sm:w-full md:w-[150px] lg:max-w-[300px] bg-white h-full"></div>
        </div>
      </body>
    </main>
  );
}
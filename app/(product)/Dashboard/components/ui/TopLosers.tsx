'use client';

import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function TopLosers() {
  return (
    <div className='flex flex-col gap-1 p-5  w-full h-full overflow-hidden bg-gradient-to-t from-cyan-700 to-black rounded-2xl justify-between ' >
      <div className='w-full h-full rounded-2xl gap-1 flex flex-col text-left '>
        
      <h1 className='font-bold text-2xl'>
          Elevate your Trading Sessions 
        </h1>

        <p className='font-normal text-[15px] text-zinc-200' >
          Sign up to access our brand new AI analysis tools!!
        </p>

      </div>
      <div className="w-full  gap-2 flex flex-row full">
        
      <div className='bg-cyan-600 w-full h-12 p-2 rounded-full items-center justify-center flex'>
          Connect wallet
        </div>
        <div className='bg-white/10 shadow-gray-900/10 shadow  w-full h-12 p-2 rounded-full items-center justify-center flex'>
            Login 
        </div>
      </div>
      
    </div>
  );
}
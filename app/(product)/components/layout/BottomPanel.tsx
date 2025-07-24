import { Dot, DotIcon } from 'lucide-react'
import React from 'react'

export default function BottomPanel() {
  return (
    <div className='w-full h-7 0'>
        <div className='flex justify-between items-center h-full px-4'>
            <div className='flex flex-row items-center  space-x-3'>
                <div className='text-xs text-zinc-400'>© 2023 Cyclespace Exchange LLC</div>
                <div className='text-xs text-zinc-400 flex flex-row w-fit h-full items-center justify-between bg-green-500/10 rounded-4xl px-2 pr-4 py-0.5'>
                    <DotIcon width={20} height={20} stroke='green' strokeWidth={10} color='green' className="" />
                    <p className='items-center'>Status</p>
                </div>
            </div>
            <div className='flex space-x-2'>
                <a href="#" className='text-xs text-zinc-400 hover:underline'>Privacy Policy</a>
                <a href="#" className='text-xs text-zinc-400 hover:underline'>Terms of Service</a>
            </div>
        </div>
    </div>
  )
}

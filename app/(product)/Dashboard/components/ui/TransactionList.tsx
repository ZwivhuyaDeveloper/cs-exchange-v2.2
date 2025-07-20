import { Separator } from '@radix-ui/react-separator'
import React from 'react'

export default function TransactionList() {
  return (
    <div className='mt-5'>
      <div>
        <Separator className='bg-zinc-700 w-full h-px' />
      </div>
      <div className='p-4'>
        <h2 className='text-lg font-medium'>Transaction History</h2>
        <ul className='list-disc pl-5 font-normal'>
          <li>Transaction 1</li>
          <li>Transaction 2</li>
          <li>Transaction 3</li>
        </ul>
      </div>
    </div>
  )
}

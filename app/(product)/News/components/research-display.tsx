import { simpleNewsCard, simpleResearchCard } from '@/app/lib/interface';
import React from 'react'
import { client, urlFor } from "@/app/lib/sanity";
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';



export const revalidate = 30; // revalidate at most 30 seconds

async function getData() {
  const query = `
  *[_type == 'research'] | order(_createdAt desc) {
    title,
      smallDescription,
      "currentSlug": slug.current,
      titleImage,
      "categoryName": category->name,
      category
  }`;

  const data = await client.fetch(query);

  return data;
}


export default async function ResearchDisplay() {
  const data: simpleResearchCard[] = await getData()
  console.log(data);

  return (
    <div className='flex flex-col h-fit bg-white dark:bg-[#0F0F0F] '>
        <div className='flex flex-row gap-1 items-center justify-between px-2'>
          <h1 className='font-semibold text-zinc-500 dark:text-white text-xl p-4'> 
            Research Analysis
          </h1>
          <span className='text-zinc-500 dark:text-white text-md px-2'>See All</span>
        </div>
        <div className='p-3 flex flex-col gap-2 mt-0 pt-0 h-fit'>
          {data.map((post, idx) => (
            <Card key={idx} className='p-3 shadow-none bg-zinc-100 dark:bg-zinc-800 border-none flex flex-row h-fit '>
              <Image
                src={urlFor(post.titleImage).url()}
                alt="image"
                width={100}
                height={100}
                className="rounded-lg h-[100px] w-[100px] object-cover"
              />
              <div className='flex flex-row h-fit'>
            <h3 className="text-sm w-full flex flex-row h-fit text-start mt-0 mb-3 text-black dark:text-white font-semibold">
              <Link href={`/analysis/${post.currentSlug}`}>{post.title}</Link>
            </h3>
              </div>
            </Card>
          ))}
        </div>

    </div>
  )
}

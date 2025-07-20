import { simpleNewsCard } from '@/app/lib/interface';
import React from 'react'
import { client, urlFor } from "@/app/lib/sanity";
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PercentDiamond, Tag, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate } from '@/app/lib/dateUtils';


export const revalidate = 30; // revalidate at most 30 seconds

async function getData() {
  const query = `
  *[_type == 'news' && category->name == "Trending"] | order(_createdAt desc) {
    title,
      smallDescription,
      "currentSlug": slug.current,
      titleImage,
      "categoryName": category->name,
      category,
      publishedAt,
      tags[]->{
        name,
        color
      },
      impacts[]->{
        name,
        color
      }

  }`;

  const data = await client.fetch(query);

  return data;
}


export default async function TrendingNews() {
  const data: simpleNewsCard[] = await getData()
  console.log(data);

  return (
    <div className='flex flex-col bg-white dark:bg-[#0F0F0F]'>
        <header className='flex flex-row gap-1 items-center justify-between px-2 mt-0 pt-0'>
          <h1 className='font-bold text-md p-4 flex flex-row gap-2'> 
            <div className="h-6 w-6 bg-orange-500/20 rounded-full flex items-center justify-center">
              <PercentDiamond className="text-orange-500" size={16} />
            </div>
            <span>Trending News</span>
          </h1>
          <span className='text-zinc-500 text-md px-2'>See All</span>
        </header>
        <div className='p-3 flex flex-col gap-2 mt-0 pt-0'>
          {data.map((post, idx) => (
            <Card key={idx} className='p-3 shadow-none dark:bg-zinc-900/90 bg-zinc-100 gap-2  border-none'>
              <div className=''>
                <div className='absolute p-3'>
                  <Badge className=' text-orange-700 font-medium backdrop-blur-2xl bg-orange-200 border-none'>{post.categoryName}</Badge>
                </div>
                <div>
                  <Image
                    src={urlFor(post.titleImage).url()}
                    alt="image"
                    width={500}
                    height={500}
                    className="rounded-lg h-[200px] object-cover"
                  />   
                </div>
              </div>
              {/* Impact and Date display */}
              <div className="justify-between flex flex-row items-center w-full mt-1">
                <div className="flex flex-row justify-between">
                  <span className="text-sm text-zinc-800">
                    {formatDate(post.publishedAt, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                {/* Impact display */}
                <div className="flex flex-row items-center gap-1 h-fit ">
                  <h3 className="text-xs font-medium">Impact:</h3>
                  {post.impacts && post.impacts.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {post.impacts.map((impact, impactIdx) => (
                        <Badge 
                          key={impactIdx}
                          className={cn(
                            "text-xs",
                            impact.color === 'blue' && "bg-blue-100 text-blue-800 border-blue-200",
                            impact.color === 'green' && "bg-green-100 text-green-800 border-green-200",
                            impact.color === 'red' && "bg-red-100 text-red-800 border-red-200",
                            impact.color === 'yellow' && "bg-yellow-100 text-yellow-800 border-yellow-200",
                            impact.color === 'purple' && "bg-purple-100 text-purple-800 border-purple-200",
                          )}
                        >
                          <Globe width={8} height={8} strokeWidth={3} className="w-8 h-8"/>
                          {impact.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
               <Link href={`/article/${post.currentSlug}`}>
                  <h3 className="text-md tracking-tight text-start mt-0  text-black dark:text-white font-semibold hover:text-blue-400 dark:hover:text-blue-400">
                    {post.title}
                  </h3>
              </Link>
              
              {/* Description with breadcrumbs */}
              <div className="mb-3 mt-0">
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                  {post.smallDescription}
                </p>
                <div className="flex items-center gap-1 mt-1 text-xs text-zinc-500">
                  <span>Home</span>
                  <span>•</span>
                  <span>News</span>
                  <span>•</span>
                  <span className="text-orange-600 dark:text-orange-400">{post.categoryName}</span>
                </div>
              </div>
              
              {/* Tags display */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {post.tags.map((tag, tagIdx) => (
                    <Badge 
                      key={tagIdx}
                      className={cn(
                        "text-xs",
                        tag.color === 'blue' && "bg-blue-100 text-blue-800 border-blue-200",
                        tag.color === 'green' && "bg-green-100 text-green-800 border-green-200",
                        tag.color === 'red' && "bg-red-100 text-red-800 border-red-200",
                        tag.color === 'yellow' && "bg-yellow-100 text-yellow-800 border-yellow-200",
                        tag.color === 'purple' && "bg-purple-100 text-purple-800 border-purple-200",
                      )}
                    >
                      <Tag width={8} height={8} strokeWidth={3} className="mr-1"/>
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              )}

            </Card>
          ))}
        </div>

    </div>
  )
}

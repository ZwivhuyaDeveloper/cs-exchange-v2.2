'use client';

import { useState, useEffect } from 'react';
import { simpleNewsCard } from '@/app/lib/interface';
import Image from 'next/image';
import Link from 'next/link';
import { client } from "@/app/lib/sanity";

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PercentDiamond, Tag, Globe } from 'lucide-react';
import { formatDate } from '@/app/lib/dateUtils';
import { urlFor } from '@/sanity/lib/image';

export default function TrendingNewsClient() {
  const [trendingNews, setTrendingNews] = useState<simpleNewsCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrendingNews = async () => {
      try {
        setLoading(true);
        console.log('Fetching trending news from:', '/api/trending-news');
        
        const response = await fetch('/api/trending-news', {
          headers: {
            'Content-Type': 'application/json',
          },
          // Disable Next.js cache to ensure fresh data
          cache: 'no-store',
        });
        
        console.log('API response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API error response:', errorText);
          throw new Error(`Failed to fetch trending news: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Received data:', data);
        
        if (!Array.isArray(data)) {
          console.error('Unexpected data format:', data);
          throw new Error('Invalid data format received from server');
        }
        
        setTrendingNews(data);
      } catch (err) {
        console.error('Error in fetchTrendingNews:', err);
        setError(err instanceof Error ? err.message : 'Failed to load trending news');
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingNews();
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <PercentDiamond className='w-5 h-5' />
          Loading Trending News...
        </h2>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2 text-red-500">
          <PercentDiamond className='w-5 h-5' />
          Error Loading News
        </h2>
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (trendingNews.length === 0) {
    return (
      <div className="p-4 text-gray-500">
        No trending news available.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#0F0F0F] p-4 rounded-none shadow">
      <header className='flex flex-row gap-1 items-center justify-between mb-4'>
        <div className='flex flex-row gap-2 items-center'>
          <div className='flex flex-row gap-1 p-1 rounded-full bg-zinc-100 dark:bg-zinc-800 items-center'>
            <PercentDiamond className='w-5 h-5 text-blue-500 dark:text-[#00FFC2]' />   
          </div>
          <h1 className='font-bold text-md flex gap-1 flex-row'>
            <span className='text-blue-500 dark:text-[#00FFC2]'>
              Trending 
            </span>
            News
          </h1>
        </div>
      </header>
      <div className='space-y-4'>
        {trendingNews.map((post, idx) => (
          <Link href={`/article/${post.currentSlug}`} key={idx} className='block'>
            <Card className='p-3 hover:bg-gray-50 dark:bg-zinc-900 dark:hover:bg-gray-800 transition-colors border-0'>
              <div className='flex items-start gap-3'>
                <div className='w-16 h-16 relative flex-shrink-0'>
                  <Image
                    src={urlFor(post.titleImage).url()}
                    alt={post.title}
                    fill
                    className='object-cover rounded-md'
                  />
                </div>
                <div className='flex-1 min-w-0'>
                  <h3 className='font-medium text-sm line-clamp-2'>{post.title}</h3>
                  <div className='flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400'>
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

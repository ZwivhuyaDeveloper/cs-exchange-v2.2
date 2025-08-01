// app/(product)/Dashboard/components/news-cards.tsx
import { simpleNewsCard } from '@/app/lib/interface';
import { client, urlFor } from "@/app/lib/sanity";
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PercentDiamond, Tag, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate } from '@/app/lib/dateUtils';

interface Tag {
    name: string;
    color: string;
  }
  
  interface Impact {
    name: string;
    color: string;
  }
  
  interface NewsPost {
    title: string;
    smallDescription: string;
    currentSlug: string;
    titleImage: any; // Consider importing the correct type from Sanity
    categoryName: string;
    publishedAt: string;
    tags: Tag[];
    impacts: Impact[];
  }

  async function getData(): Promise<NewsPost[]> {
  const query = `
  *[_type == 'news' && category->name == "Trending"] | order(_createdAt desc) [0...5] {
    title,
    smallDescription,
    "currentSlug": slug.current,
    titleImage,
    "categoryName": category->name,
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

export default async function NewsCards() {
    const data: NewsPost[] = await getData();

  return (
    <div className='flex flex-col bg-white dark:bg-[#0F0F0F] h-full overflow-y-auto'>
      <header className='flex flex-row gap-1 items-center justify-between px-4 pt-3 pb-2 border-b dark:border-zinc-800 sticky top-0 bg-white dark:bg-[#0F0F0F] z-10'>
        <h1 className='font-bold text-sm flex items-center gap-2'> 
          <div className="h-5 w-5 bg-orange-500/20 rounded-full flex items-center justify-center">
            <PercentDiamond className="text-orange-500" size={14} />
          </div>
          <span>Trending News</span>
        </h1>
        <Link href="/news" className='text-xs text-blue-500 hover:underline'>View All</Link>
      </header>
      
      <div className='p-3 flex flex-col gap-3 overflow-y-auto'>
      {data.map((post: NewsPost, idx: number) => (          <Card key={idx} className='p-3 shadow-sm dark:bg-zinc-900/50 bg-zinc-50 border-zinc-200 dark:border-zinc-800'>
            <div className='relative'>
              <div className='absolute top-2 left-2 z-10'>
                <Badge className='text-orange-700 font-medium bg-orange-200/90 backdrop-blur-sm border-none'>
                  {post.categoryName}
                </Badge>
              </div>
              <div className='rounded-lg overflow-hidden h-40 relative'>
                <Image
                  src={urlFor(post.titleImage).url()}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-zinc-500">
                {formatDate(post.publishedAt, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
              {post.impacts?.[0] && (
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-xs h-5 px-1.5",
                    post.impacts[0].color === 'blue' && "bg-blue-100 text-blue-800 border-blue-200",
                    post.impacts[0].color === 'green' && "bg-green-100 text-green-800 border-green-200",
                    post.impacts[0].color === 'red' && "bg-red-100 text-red-800 border-red-200",
                  )}
                >
                  {post.impacts[0].name}
                </Badge>
              )}
            </div>

            <Link href={`/article/${post.currentSlug}`}>
              <h3 className="text-sm font-semibold mt-2 line-clamp-2 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                {post.title}
              </h3>
            </Link>
            
            <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1 line-clamp-2">
              {post.smallDescription}
            </p>
            
            {post.tags?.[0] && (
              <div className="mt-2 flex flex-wrap gap-1">
                {post.tags.slice(0, 2).map((tag: Tag, tagIdx: number) => (
                  <Badge 
                    key={tagIdx}
                    variant="outline"
                    className={cn(
                      "text-[10px] h-5",
                      tag.color === 'blue' && "bg-blue-100 text-blue-800 border-blue-200",
                      tag.color === 'green' && "bg-green-100 text-green-800 border-green-200",
                      tag.color === 'red' && "bg-red-100 text-red-800 border-red-200",
                    )}
                  >
                    {tag.name}
                  </Badge>
                ))}
                {post.tags.length > 2 && (
                  <span className="text-xs text-zinc-500 ml-1">+{post.tags.length - 2} more</span>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
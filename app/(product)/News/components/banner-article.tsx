// app/components/News/banner-article.tsx
import { simpleNewsCard } from '@/app/lib/interface';
import { urlFor } from "@/app/lib/sanity";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import { Globe, Newspaper, NewspaperIcon, Tag } from 'lucide-react';
import { formatDate, isRecent } from "@/app/lib/dateUtils";


export default function BannerArticle({ post }: { post: simpleNewsCard }) {
  return (
    <div className="w-full p-4 bg-blue-50 border-none dark:bg-[#00FFC2]/10 shadow-xs shadow-zinc-200 dark:shadow-zinc-900 rounded-lg mb-4">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2">
          <div className='absolute p-3'>
            <Badge className="bg-blue-100 text-blue-800">
              {post.categoryName}
            </Badge>
          </div>
          <Image
            src={urlFor(post.titleImage).url()}
            alt={post.title}
            width={800}
            height={400}
            className="rounded-lg w-full h-64 object-cover shadow-lg"
          />
        </div>
        <div className="md:w-1/2 flex flex-col justify-center">
          <Badge className="w-fit mb-2 bg-[#0E76FD] dark:bg-[#00FFC2] text-white dark:text-black ">
            Featured Story
          </Badge>
          <Link href={`/article/${post.currentSlug}`} className="hover:text-blue-600 transition-colors">
            <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
          </Link>
          <p className="text-gray-600 dark:text-zinc-300 mb-4">{post.smallDescription}</p>
          <div className='gap-2 flex flex-col'>

            <div className='flex flex-row justify-between w-full h-fit'>

              <div className="flex items-center justify-between gap-4">
                {isRecent(post.publishedAt) && (
                  <span className="ml-1 animate-pulse">🆕</span>
                )}
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    {formatDate(post.publishedAt, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                    })}
                </span>
              </div>

              <div className='flex flex-row gap-1 items-center'>
                {/* Impact display */}
                <h3 className='font-medium text-sm'>Impact:</h3>
                {post.impacts && post.impacts.length > 0 && (
                    <div className="flex gap-2 ">
                    {post.impacts.map((impact, idx) => (
                        <Badge 
                        key={idx}
                        className={cn(
                            "text-sm",
                            impact.color === 'blue' && "bg-blue-300 text-blue-950 border-blue-200",
                            impact.color === 'green' && "bg-green-300 text-green-950 border-green-200",
                            impact.color === 'red' && "bg-red-300 text-red-950 border-red-200",
                            impact.color === 'yellow' && "bg-yellow-300 text-yellow-950 border-yellow-200",
                            impact.color === 'purple' && "bg-purple-300 text-purple-950 border-purple-200"
                        )}
                        >
                            <Globe width={10} height={10} strokeWidth={3} className="w-10 h-10"/>
                            {impact.name}
                        </Badge>
                    ))}
                    </div>
                )}
              </div>

            </div>

            <div className='justify-between w-full items-center '>
                {/* Tags display */}
                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, idx) => (
                        <Badge 
                        key={idx}
                        className={cn(
                            "text-sm",
                            tag.color === 'blue' && "bg-blue-300 text-blue-950 border-blue-200",
                            tag.color === 'green' && "bg-green-300 text-green-950 border-green-200",
                            tag.color === 'red' && "bg-red-300 text-red-950 border-red-200",
                            tag.color === 'yellow' && "bg-yellow-300 text-yellow-950 border-yellow-200",
                            tag.color === 'purple' && "bg-purple-300 text-purple-950 border-purple-200"
                        )}
                        >
                            <Tag width={10} height={10} strokeWidth={3} className="w-10 h-10"/>
                            {tag.name}
                        </Badge>
                    ))}
                    </div>
                )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
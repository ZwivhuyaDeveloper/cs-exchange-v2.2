// app/components/News/news-section.tsx
"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { simpleNewsCard } from "@/app/lib/interface";
import { urlFor } from "@/app/lib/sanity";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

import BannerArticle from "./banner-article";
import { cn } from "@/lib/utils";
import { formatDate, isRecent } from "@/app/lib/dateUtils";

import impact from "@/sanity/schemaTypes/impact";
import { Globe, Tag } from "lucide-react";
import SearchBar from "./search-bar";
import NewsFilter from "./news-filter";


interface NewsSectionProps {
  data: simpleNewsCard[];
}

export default function NewsSection({ data }: NewsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Memoize categories to prevent unnecessary recalculations
  const categories = useMemo(() => {
    return Array.from(
      new Set(data.map(post => post.categoryName))
    ).filter(Boolean) as string[];
  }, [data]);

  // Memoize filtered data for performance
  const filteredData = useMemo(() => {
    let result = data;
    
    // Apply category filter
    if (selectedCategory) {
      result = result.filter(post => post.categoryName === selectedCategory);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(post => 
        (post.title && post.title.toLowerCase().includes(query)) || 
        (post.categoryName && post.categoryName.toLowerCase().includes(query)) ||
        (post.tags && post.tags.some(tag => tag.name && tag.name.toLowerCase().includes(query))) ||
        (post.impacts && post.impacts.some(impact => impact.name && impact.name.toLowerCase().includes(query)))
      );
    }

    return result;
  }, [data, selectedCategory, searchQuery]);

  // Get the latest article (first item in sorted array)
  const latestArticle = useMemo(() => {
    return data.length > 0 ? data[0] : null;
  }, [data]);

  const handleFilterChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  // Conditions for showing the banner and skipping the latest article
  const showBanner = !selectedCategory && !searchQuery && latestArticle;
  const skipLatestArticle = !selectedCategory && !searchQuery;

  return (
    <div className="bg-white dark:bg-[#0F0F0F]">
      <div className="flex flex-col  justify-between items-start sm:items-center px-5 pt-4 gap-4">
        <div className="justify-between flex flex-row w-full">
          <h1 className="text-lg flex flex-row justify-between text-start text-zinc-500 font-semibold tracking-wide">
            <span className="flex flex-row gap-1 text-3xl text-black dark:text-white font-bold">
              <p className="text-blue-500">Latest</p>Headlines
            </span>
          </h1>

          <SearchBar 
            onSearch={setSearchQuery} 
            placeholder="Search by title, category, or tags..." 
          />
        </div>

        <NewsFilter 
          categories={categories} 
          onFilterChange={handleFilterChange} 
          selectedCategory={selectedCategory}
        />
        
      </div>
      
      {/* Banner for latest article - only show when no category and no search */}
      {showBanner && (
        <div className="px-5">
          <BannerArticle post={latestArticle} />
        </div>
      )}
      
      {filteredData.length === 0 ? (
        <div className="py-10 px-5 text-center">
          <h3 className="text-xl font-medium">No articles found</h3>
          <p className="text-gray-500 mt-2">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2 justify-center py-2 px-5">
          {filteredData
            // Skip the first item if we are showing the banner
            .filter(post => !skipLatestArticle || post !== latestArticle)
            .map((post, idx) => (
            <Card key={idx} className="w-fit p-3 m-0 shadow-none border-none h-full gap-2 bg-zinc-100 dark:bg-zinc-800 ">
              <div>
                <div className="absolute p-3">
                  <Badge className="w-fit bg-blue-100 text-blue-700 border-px border-none ">
                    {post.categoryName}
                  </Badge>
                </div>
                <Image
                  src={urlFor(post.titleImage).url()}
                  alt={post.title}
                  width={400}
                  height={200}
                  className="rounded-lg h-[200px] object-cover"
                />
              </div>
              <CardContent className="mt-2 mb-2 justify-between">
                <Link href={`/article/${post.currentSlug}`} className="hover:text-blue-400">
                  <h3 className="text-lg tracking-tight font-semibold w-fit">{post.title}</h3>
                </Link>
                <p className="text-sm mt-1 text-gray-600 dark:text-gray-300 w-fit">
                  {post.smallDescription}
                </p>

              <div className="justify-between flex flex-row items-center mt-2 w-full">
                <div className="flex flex-row justify-between ">
                  {isRecent(post.publishedAt) && (
                      <span className="animate-pulse"><Badge>New</Badge></span>
                    )}
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
                  {/* impact display */}
                  <div className="flex flex-row items-center gap-1">
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

                <div className="justify-between mt-7">
                {/* Tags display */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
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
                        <Tag width={10} height={10} strokeWidth={3} className="w-10 h-10"/>
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                )}
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
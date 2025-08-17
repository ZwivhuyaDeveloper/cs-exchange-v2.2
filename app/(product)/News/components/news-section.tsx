// app/components/News/news-section.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { simpleNewsCard } from "@/app/lib/interface";
import { urlFor } from "@/app/lib/sanity";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import BannerArticle from "./banner-article";
import { cn } from "@/lib/utils";
import { formatDate, isRecent } from "@/app/lib/dateUtils";
import { Globe, Tag } from "lucide-react";
import SearchBar from "./search-bar";
import NewsFilter from "./news-filter";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"; 


interface NewsSectionProps {
  data: simpleNewsCard[];
}

export default function NewsSection({ data }: NewsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Articles per page

    // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);
  
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
        (post.impacts && post.impacts.some(impact => impact.name && impact.name.toLowerCase().includes(query))) ||
        (post.author && post.impacts.some(author => author.name && author.name.toLowerCase().includes(query)))
      );
    }

    return result;
  }, [data, selectedCategory, searchQuery]);

  // Get the latest article (first item in sorted array)
  const latestArticle = useMemo(() => {
    return data.length > 0 ? data[0] : null;
  }, [data]);

    // Create data for pagination (excludes banner article when shown)
  const paginationData = useMemo(() => {
    const shouldSkipLatest = !selectedCategory && !searchQuery;
    return shouldSkipLatest && latestArticle
      ? filteredData.filter(post => post !== latestArticle)
      : filteredData;
  }, [filteredData, selectedCategory, searchQuery, latestArticle]);

  
  // Calculate pagination
  const totalPages = Math.ceil(paginationData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentArticles = paginationData.slice(startIndex, endIndex);


  const handleFilterChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  // Conditions for showing the banner and skipping the latest article
  const showBanner = !selectedCategory && !searchQuery && latestArticle;
  const skipLatestArticle = !selectedCategory && !searchQuery;

  return (
    <div className="bg-white dark:bg-[#0F0F0F] border border-px dark:border-zinc-700  ">
      <div className="flex flex-col justify-between items-start sm:items-center px-5 pt-4 gap-4">
        <div className="justify-between space-y-2 lg:space-y-0 flex flex-col lg:flex-row w-full">
          <h1 className="text-lg py-1 sm:py-1 flex flex-row justify-between text-start text-zinc-500 font-semibold tracking-wide">
            <span className="flex flex-row gap-2 text-xl sm:text-3xl text-black dark:text-white font-bold">
              <p className="text-[#0E76FD] dark:text-[#00FFC2]">Latest</p>Headlines
            </span>
          </h1>

          <SearchBar 
            onSearch={setSearchQuery} 
            placeholder="Search by title, category, or tags..." 
          />
        </div>
        <div className="w-full ">
          <NewsFilter 
            categories={categories} 
            onFilterChange={handleFilterChange} 
            selectedCategory={selectedCategory}
          />
        </div>
        
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
        <>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 justify-center py-2 px-5">
          {currentArticles.map((post, idx) => (
            <Card key={idx} className="w-fit p-3 m-0 shadow border-none shadow-zinc-200 dark:shadow-zinc-900 h-full gap-2 bg-white dark:bg-zinc-800 ">
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
              <div className="flex items-center justify-between gap-4">
                {isRecent(post.publishedAt) && (
                  <span className="ml-1 animate-pulse">🆕</span>
                )}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    {post.author?.avatar && (
                      <div className="w-6 h-6 rounded-full overflow-hidden">
                        <Image
                          src={urlFor(post.author.avatar).url()}
                          width={24}
                          height={24}
                          alt={post.author.name || 'Author'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                      {post.author?.name || 'Anonymous'}
                    </p>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {formatDate(post.publishedAt, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
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
                              impact.color === 'blue' && "bg-blue-300 text-blue-950 border-blue-200",
                              impact.color === 'green' && "bg-green-300 text-green-950 border-green-200",
                              impact.color === 'red' && "bg-red-300 text-red-950 border-red-200",
                              impact.color === 'yellow' && "bg-yellow-300 text-yellow-950 border-yellow-200",
                              impact.color === 'purple' && "bg-purple-300 text-purple-950 border-purple-200",
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
                          tag.color === 'blue' && "bg-blue-300 text-blue-950 border-blue-200",
                          tag.color === 'green' && "bg-green-300 text-green-950 border-green-200",
                          tag.color === 'red' && "bg-red-300 text-red-950 border-red-200",
                          tag.color === 'yellow' && "bg-yellow-300 text-yellow-950 border-yellow-200",
                          tag.color === 'purple' && "bg-purple-300 text-purple-950 border-purple-200",
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
        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="py-6 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => currentPage > 1 && setCurrentPage(p => Math.max(p - 1, 1))}
                    className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={currentPage === page}
                      onClick={() => setCurrentPage(page)}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext
                    onClick={() => currentPage < totalPages && setCurrentPage(p => Math.min(p + 1, totalPages))}
                    className={currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        </>

      )}
    </div>
  );
}
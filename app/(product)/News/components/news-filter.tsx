// app/components/News/news-filter.tsx
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function NewsFilter({ 
  categories,
  onFilterChange,
  selectedCategory
}: {
  categories: string[];
  onFilterChange: (category: string | null) => void;
  selectedCategory: string | null;
}) {
  // Filter out the "Trending" category from the main news section
  const [isMobile, setIsMobile] = useState(false);
  const filteredCategories = categories.filter(category => category !== "Trending");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Check if mobile view
    useEffect(() => {
      const checkIfMobile = () => {
        setIsMobile(window.innerWidth < 768); // md breakpoint
      };
      
      checkIfMobile();
      window.addEventListener('resize', checkIfMobile);
      return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollContainerRef.current.scrollBy({ 
        left: scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  if (isMobile) {
    return (
      <div className="w-full pb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full text-[#0E76FD] dark:text-[#00FFC2] justify-between border-none dark:bg-zinc-800 "
            >
              {selectedCategory || "All Categories"}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[calc(100vw-2rem)] lg:w-[200px] space-y-2 z-50  rounded-2xl bg-accent p-3 gap-2 max-h-60 overflow-y-auto">
            <DropdownMenuItem 
              onClick={() => onFilterChange(null)}
              className={!selectedCategory ? "bg-background text-[#0E76FD] rounded-2xl px-2" : ""}
            >
              All Categories
            </DropdownMenuItem>
            {filteredCategories.map((category) => (
              <DropdownMenuItem
                key={category}
                onClick={() => onFilterChange(category)}
                className={selectedCategory === category ? "bg-zinc-600 text-[#0E76FD] rounded-2xl px-2" : ""}
              >
                {category}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  
  return (
    <div className="flex flex-col w-full sm:w-auto mb-4">
      <div className="flex flex-row items-center gap-2 mt-0">
        <p className="text-sm text-gray-500 whitespace-nowrap">Filter by:</p>
        
        <div className="flex items-center flex-1 ">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll('left')}
            className="p-1 hover:text-gray-700 "
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </Button>
          
          <div 
            ref={scrollContainerRef}
            className="grid overflow-x-auto grid-rows-1 lg:flex flex-wrap  gap-2 scrollbar-hide lg:max-w-full mx-1"
          >
            {filteredCategories.map((category, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                className={cn(
                  "whitespace-nowrap rounded-full flex-shrink-0 border-none  ",
                  selectedCategory === category 
                    ? "bg-blue-500 text-white hover:bg-blue-600 border-blue-500"
                    : "bg-blue-100/80 dark:bg-blue-500/80 hover:bg-gray-100"
                )}
                onClick={() => onFilterChange(category)}
              >
                {category}
              </Button>
            ))}
          </div>
          
          <button 
            onClick={() => scroll('right')}
            className="p-1 text-gray-500 hover:text-gray-700"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        
        <Button 
          variant="outline"
          size="sm"
          className="whitespace-nowrap flex-shrink-0"
          onClick={() => onFilterChange(null)}
          disabled={!selectedCategory}
        >
          Clear Filter
        </Button>
      </div>
    </div>
  );
}
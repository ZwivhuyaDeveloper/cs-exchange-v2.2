// app/components/News/news-filter.tsx
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useEffect, useState } from "react";

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
  const filteredCategories = categories.filter(category => category !== "Trending");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);

  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftScroll(scrollLeft > 0);
    setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      // Initial check
      checkScroll();
      return () => container.removeEventListener('scroll', checkScroll);
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = direction === 'left' ? -200 : 200;
      
      container.scrollBy({ 
        left: scrollAmount, 
        behavior: 'smooth' 
      });
      
      // Update scroll buttons after scroll animation
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <div className="w-full mb-4 px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
        <p className="text-sm text-muted-foreground whitespace-nowrap mb-2 sm:mb-0">Filter by:</p>
        
        <div className="relative w-full">
          <div className="relative w-full">
            {/* Left scroll button (conditionally shown) */}
            {showLeftScroll && (
              <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-background/90 dark:bg-zinc-800/90 backdrop-blur-sm rounded-full shadow-md hover:bg-accent transition-all"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}

            {/* Categories container with horizontal scroll */}
            <div
              ref={scrollContainerRef}
              className="flex space-x-2 overflow-x-auto scrollbar-hide px-1 py-3 -mx-1 w-[calc(100%+8px)]"
              style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
            >
              <div className="pl-2 sm:pl-0 pr-2 flex space-x-2">
                {/* All Categories button */}
                <Button
                  variant={!selectedCategory ? 'default' : 'outline'}
                  size="sm"
                  className={cn(
                    'whitespace-nowrap rounded-full text-sm sm:text-base',
                    'px-3 py-1 h-auto',
                    !selectedCategory 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-transparent hover:bg-accent/50 border-border/50'
                  )}
                  onClick={() => onFilterChange(null)}
                >
                  All
                </Button>

                {/* Category buttons */}
                {filteredCategories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    className={cn(
                      'whitespace-nowrap rounded-full text-sm sm:text-base',
                      'px-3 py-1 h-auto',
                      selectedCategory === category 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-transparent hover:bg-accent/50 border-border/50'
                    )}
                    onClick={() => onFilterChange(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Right scroll button (conditionally shown) */}
            {showRightScroll && (
              <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-background/90 dark:bg-zinc-800/90 backdrop-blur-sm rounded-full shadow-md hover:bg-accent transition-all"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Clear filter button - positioned below on mobile, to the side on desktop */}
          <div className="mt-2 sm:mt-0 sm:absolute sm:right-0 sm:top-0 sm:h-full sm:flex sm:items-center">
            <Button 
              variant="ghost"
              size="sm"
              className={cn(
                'text-xs sm:text-sm text-muted-foreground hover:text-foreground',
                'h-7 px-2 sm:px-3',
                'bg-transparent hover:bg-transparent',
                'border border-border/50 rounded-full',
                !selectedCategory && 'opacity-50 cursor-not-allowed'
              )}
              onClick={() => onFilterChange(null)}
              disabled={!selectedCategory}
            >
              Clear filter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
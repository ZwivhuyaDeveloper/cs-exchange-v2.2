'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';

interface SignalsPaginationProps {
  currentPage: number;
  totalPages: number;
}

export function SignalsPagination({ currentPage, totalPages }: SignalsPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    // Handle null searchParams case
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('page', newPage.toString());
    router.push(`?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  // Generate visible page numbers (max 5)
  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const half = Math.floor(maxVisible / 2);
      let start = Math.max(1, currentPage - half);
      let end = Math.min(totalPages, currentPage + half);
      
      if (currentPage <= half + 1) {
        end = maxVisible;
      } else if (currentPage >= totalPages - half) {
        start = totalPages - maxVisible + 1;
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <Pagination className="mt-8">
    <PaginationContent>
      <PaginationItem>
        <PaginationPrevious
          onClick={() => currentPage > 1 && handlePageChange(Math.max(1, currentPage - 1))}
          className={currentPage <= 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        />
      </PaginationItem>
      
      {/* ... rest of the component ... */}
      
      <PaginationItem>
        <PaginationNext
          onClick={() => currentPage < totalPages && handlePageChange(Math.min(totalPages, currentPage + 1))}
          className={currentPage >= totalPages ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        />
      </PaginationItem>
    </PaginationContent>
  </Pagination>
);
}
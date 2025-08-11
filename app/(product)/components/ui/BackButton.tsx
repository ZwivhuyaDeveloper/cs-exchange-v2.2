'use client';

import { useRouter } from 'next/navigation';

export function BackButton({ label = 'Back to News' }: { label?: string }) {
  const router = useRouter();

  return (
    <button 
      onClick={() => router.back()}
      className="flex items-center gap-2 text-sm font-medium text-[#0E76FD] dark:text-[#00FFC2] hover:opacity-80 transition-opacity"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="w-4 h-4"
      >
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
      </svg>
      {label}
    </button>
  );
}

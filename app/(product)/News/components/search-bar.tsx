// app/components/News/search-bar.tsx
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ 
  onSearch, 
  placeholder = "Search news..." 
}: SearchBarProps) {
  const [query, setQuery] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <div className="relative w-full max-w-md">
      <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
      <Input
        type="search"
        placeholder={placeholder}
        className="pl-10 rounded-4xl shadow-none border-none bg-blue-100/70"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}
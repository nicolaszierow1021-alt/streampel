'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';

function SearchInputContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push(`/buscar`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mb-10 relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar películas, series..."
        className="w-full bg-[#1c1c21] border border-white/10 text-white rounded-full pl-5 pr-12 py-3.5 focus:outline-none focus:border-[#e50914] transition-colors shadow-lg"
      />
      <button 
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white"
      >
        <Search className="w-5 h-5" />
      </button>
    </form>
  );
}

export default function SearchInput() {
  return (
    <Suspense fallback={<div className="w-full max-w-2xl mb-10 h-14 bg-[#1c1c21] rounded-full animate-pulse border border-white/10"></div>}>
      <SearchInputContent />
    </Suspense>
  );
}

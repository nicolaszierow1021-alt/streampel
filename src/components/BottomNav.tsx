'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Home, Film, Tv, PlayCircle, Search } from 'lucide-react';
import { Suspense } from 'react';

function BottomNavContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  const isInicio = pathname === '/';
  const isPeliculas = query === 'Pelicula';
  const isSeries = query === 'Serie';
  const isAnime = query === 'Anime';
  const isBuscar = pathname === '/buscar' && !isPeliculas && !isSeries && !isAnime;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 w-full bg-[#0d0d11]/95 backdrop-blur-md border-t border-white/5 z-[60] px-2 py-2 flex justify-between items-center text-[10px] text-gray-400 pb-safe">
      <Link href="/" className={`flex flex-col items-center flex-1 py-1 ${isInicio ? 'text-[#e50914]' : 'hover:text-white transition-colors'}`}>
        <Home className={`w-5 h-5 mb-1 ${isInicio ? 'fill-current' : ''}`} />
        <span className="font-medium">Inicio</span>
      </Link>
      
      <Link href="/buscar?q=Pelicula" className={`flex flex-col items-center flex-1 py-1 ${isPeliculas ? 'text-[#e50914]' : 'hover:text-white transition-colors'}`}>
        <Film className={`w-5 h-5 mb-1 ${isPeliculas ? 'fill-current text-[#e50914]' : ''}`} />
        <span className="font-medium">Películas</span>
      </Link>
      
      <Link href="/buscar?q=Serie" className={`flex flex-col items-center flex-1 py-1 ${isSeries ? 'text-[#e50914]' : 'hover:text-white transition-colors'}`}>
        <Tv className={`w-5 h-5 mb-1 ${isSeries ? 'fill-current text-[#e50914]' : ''}`} />
        <span className="font-medium">Series</span>
      </Link>
      
      <Link href="/buscar?q=Anime" className={`flex flex-col items-center flex-1 py-1 ${isAnime ? 'text-[#e50914]' : 'hover:text-white transition-colors'}`}>
        <PlayCircle className={`w-5 h-5 mb-1 ${isAnime ? 'fill-current text-[#e50914]' : ''}`} />
        <span className="font-medium">Anime</span>
      </Link>
      
      <Link href="/buscar" className={`flex flex-col items-center flex-1 py-1 ${isBuscar ? 'text-[#e50914]' : 'hover:text-white transition-colors'}`}>
        <Search className={`w-5 h-5 mb-1 ${isBuscar ? 'text-[#e50914]' : ''}`} strokeWidth={isBuscar ? 3 : 2} />
        <span className="font-medium">Buscar</span>
      </Link>
    </div>
  );
}

export default function BottomNav() {
  return (
    <Suspense fallback={null}>
      <BottomNavContent />
    </Suspense>
  );
}

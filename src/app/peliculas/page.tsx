import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MovieCard from '@/components/MovieCard';
import { supabase } from '@/lib/supabase';
import { AVAILABLE_CATEGORIES } from '@/lib/constants';
import { Film, Play } from 'lucide-react';
import { unstable_noStore as noStore } from 'next/cache';
import Link from 'next/link';

export default async function PeliculasPage() {
  noStore();
  
  let mediaList: any[] = [];
  try {
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .eq('type', 'Película')
      .order('created_at', { ascending: false });

    if (error) throw error;
    mediaList = data || [];
  } catch (error) {
    console.error("Error fetching media:", error);
  }

  const genreCategories = AVAILABLE_CATEGORIES.filter(c => c !== "Tendencias" && c !== "Populares" && c !== "Anime");

  const mediaByCategory: Record<string, any[]> = {};
  genreCategories.forEach(cat => {
    mediaByCategory[cat] = mediaList.filter(item => {
      const itemCats = item.category ? item.category.split(',').map((c: string) => c.trim().toLowerCase()) : [];
      return itemCats.includes(cat.toLowerCase());
    });
  });

  const totalTitles = mediaList.length;
  // Solo contar géneros que tengan al menos 1 película
  const activeGenres = genreCategories.filter(cat => mediaByCategory[cat] && mediaByCategory[cat].length > 0).length;

  return (
    <main className="min-h-screen bg-[#0d0d11] pb-20 overflow-x-hidden">
      <Navbar />
      
      <div className="container mx-auto px-4 md:px-8 pt-32 max-w-[1600px]">
        
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-[#e50914] rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(229,9,20,0.4)]">
              <Film className="text-white w-6 h-6" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Películas
            </h1>
          </div>
          
          <p className="text-gray-400 max-w-3xl text-sm md:text-base leading-relaxed mb-6 font-medium">
            Disfruta de nuestra colección completa de películas. Organizadas por género para que encuentres rápidamente lo que buscas y pases un buen rato.
          </p>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#e50914]/10 border border-[#e50914]/30 px-3 py-1.5 rounded-full">
              <Film className="w-4 h-4 text-[#e50914]" />
              <span className="text-white font-bold text-sm">{totalTitles} <span className="font-medium text-gray-300">películas</span></span>
            </div>
            <div className="flex items-center gap-2 bg-[#1c1c21] border border-white/10 px-3 py-1.5 rounded-full">
              <Play className="w-4 h-4 text-[#e50914]" />
              <span className="text-white font-bold text-sm">{activeGenres} <span className="font-medium text-gray-300">categorías</span></span>
            </div>
          </div>
        </div>

        <div className="space-y-12">
          {genreCategories.map(cat => {
            const items = mediaByCategory[cat];
            if (!items || items.length === 0) return null;

            return (
              <div key={cat} className="relative group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-baseline gap-3">
                    <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">{cat}</h2>
                    <span className="text-sm font-medium text-gray-500">{items.length}</span>
                  </div>
                  <Link 
                    href={`/buscar?q=${encodeURIComponent(cat)}`}
                    className="flex items-center gap-1 text-[13px] font-bold text-gray-300 bg-[#1c1c21] hover:bg-[#2c2c31] border border-white/10 px-4 py-1.5 rounded-full transition-colors"
                  >
                    Ver todo <span className="text-gray-500 ml-1 font-normal">&gt;</span>
                  </Link>
                </div>
                
                <div className="flex overflow-x-auto gap-3 md:gap-4 pb-4 no-scrollbar snap-x relative z-10">
                  {items.map((item, idx) => (
                    <MovieCard key={item.id || idx} {...item} />
                  ))}
                </div>
              </div>
            );
          })}
          
          {genreCategories.every(cat => !mediaByCategory[cat] || mediaByCategory[cat].length === 0) && (
            <div className="text-center py-20 bg-[#141418] rounded-xl border border-white/5">
              <Film className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Aún no hay películas</h3>
              <p className="text-gray-400 text-sm">El contenido que agregues en el administrador aparecerá aquí.</p>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </main>
  );
}

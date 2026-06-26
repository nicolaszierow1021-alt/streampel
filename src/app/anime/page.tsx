import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MovieCard from '@/components/MovieCard';
import { supabase } from '@/lib/supabase';
import { AVAILABLE_CATEGORIES } from '@/lib/constants';
import { Sword, Play } from 'lucide-react';
import { unstable_noStore as noStore } from 'next/cache';
import Link from 'next/link';

export default async function AnimePage() {
  noStore();
  
  let mediaList: any[] = [];
  try {
    // Fetch all media and filter in JS because we need to check the category string
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    mediaList = (data || []).filter(item => {
      const itemCats = item.category ? item.category.split(',').map((c: string) => c.trim().toLowerCase()) : [];
      return itemCats.includes("anime");
    });
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
  const activeGenres = genreCategories.filter(cat => mediaByCategory[cat] && mediaByCategory[cat].length > 0).length;

  return (
    <main className="min-h-screen bg-[#0d0d11] pb-20 overflow-x-hidden">
      <Navbar />
      
      <div className="container mx-auto px-4 md:px-8 pt-32 max-w-[1600px]">
        
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-[#e50914] rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(229,9,20,0.4)]">
              <Sword className="text-white w-6 h-6" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Anime
            </h1>
          </div>
          
          <p className="text-gray-400 max-w-3xl text-sm md:text-base leading-relaxed mb-6 font-medium">
            Todo el mundo del anime en un solo lugar. Disfruta de las mejores series y películas de animación japonesa clasificadas para ti.
          </p>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#e50914]/10 border border-[#e50914]/30 px-3 py-1.5 rounded-full">
              <Sword className="w-4 h-4 text-[#e50914]" />
              <span className="text-white font-bold text-sm">{totalTitles} <span className="font-medium text-gray-300">animes</span></span>
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
          
          {/* Si no hay categorías de géneros activas, mostramos todo el anime como fallback */}
          {activeGenres === 0 && mediaList.length > 0 && (
             <div className="relative group">
               <div className="flex items-center justify-between mb-4">
                 <div className="flex items-baseline gap-3">
                   <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Todo el Anime</h2>
                   <span className="text-sm font-medium text-gray-500">{mediaList.length}</span>
                 </div>
               </div>
               
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
                 {mediaList.map((item, idx) => (
                   <div key={item.id || idx} className="w-full">
                     <MovieCard {...item} isGridItem={true} />
                   </div>
                 ))}
               </div>
             </div>
          )}

          {mediaList.length === 0 && (
            <div className="text-center py-20 bg-[#141418] rounded-xl border border-white/5">
              <Sword className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Aún no hay anime</h3>
              <p className="text-gray-400 text-sm">El contenido marcado con categoría "Anime" aparecerá aquí.</p>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </main>
  );
}

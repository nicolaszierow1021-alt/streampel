export const dynamic = 'force-dynamic';
import { supabase } from '@/lib/supabase';
import MovieCard from '@/components/MovieCard';
import Navbar from '@/components/Navbar';
import { unstable_noStore as noStore } from 'next/cache';

export default async function CatalogPage(props: { searchParams: Promise<{ categoria?: string }> }) {
  noStore();
  const searchParams = await props.searchParams;
  const categoryFilter = searchParams?.categoria;
  
  let mediaItems: any[] = [];
  try {
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    if (categoryFilter) {
      mediaItems = (data || []).filter((item: any) => 
        item.category && item.category.toLowerCase().split(",").map((c:string)=>c.trim()).includes(categoryFilter.toLowerCase())
      );
    } else {
      mediaItems = data || [];
    }
  } catch (error) {
    console.error("Error loading catalog:", error);
  }

  return (
    <main className="min-h-screen bg-[#0d0d11] pb-20">
      <Navbar />
      
      <div className="pt-24 px-4 md:px-8 max-w-[1600px] mx-auto">
        <div className="mb-8 border-b border-white/10 pb-4 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-black text-white">
              {categoryFilter ? `Explorar: ${categoryFilter}` : "Todo el Catálogo"}
            </h1>
            <p className="text-gray-400 mt-2">
              {mediaItems.length} {mediaItems.length === 1 ? 'título encontrado' : 'títulos encontrados'}
            </p>
          </div>
        </div>

        {mediaItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
            {mediaItems.map((item, idx) => (
              <MovieCard key={item.id || idx} {...item} isGridItem={true} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">No se encontraron películas</h2>
            <p className="text-gray-400">Intenta explorar otra categoría.</p>
          </div>
        )}
      </div>
    </main>
  );
}

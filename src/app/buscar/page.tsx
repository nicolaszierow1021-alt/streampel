import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MovieCard from '@/components/MovieCard';
import SearchInput from '@/components/SearchInput';
import { SearchX } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { unstable_noStore as noStore } from 'next/cache';

export default async function BuscarPage(props: { searchParams: Promise<{ q?: string }> }) {
  noStore();
  const searchParams = await props.searchParams;
  const query = searchParams?.q || '';
  
  let results: any[] = [];
  try {
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    const removeAccents = (str: string) => {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };
    
    const queryNormalized = removeAccents(query);

    results = (data || []).filter((item: any) => {
      const title = removeAccents(item.title || '');
      const type = removeAccents(item.type || '');
      const category = removeAccents(item.category || '');
      
      return title.includes(queryNormalized) || type.includes(queryNormalized) || category.includes(queryNormalized);
    });
  } catch (error) {
    console.error("Error al buscar:", error);
  }

  return (
    <main className="min-h-screen bg-[#0d0d11] pb-20">
      <Navbar />
      
      <div className="container mx-auto px-4 md:px-8 pt-32 max-w-[1600px]">
        <SearchInput />
        
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          {query ? (
            <>Resultados para: <span className="text-[#e50914]">"{query}"</span></>
          ) : (
            "Explorar Catálogo"
          )}
        </h1>
        <p className="text-gray-400 mb-10 border-b border-white/10 pb-4">
          {query ? `Se encontraron ${results.length} resultados.` : `Explora nuestro catálogo completo de ${results.length} títulos.`}
        </p>
        
        {results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
            {results.map((item, idx) => (
              <div key={item.id || idx} className="w-full">
                <MovieCard {...item} isGridItem={true} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <SearchX className="w-16 h-16 mx-auto mb-4 text-gray-500" />
            <h2 className="text-xl font-bold text-white mb-2">No encontramos nada</h2>
            <p className="text-gray-400">Intenta buscar con otros términos o palabras clave.</p>
          </div>
        )}
      </div>
      
      <Footer />
    </main>
  );
}

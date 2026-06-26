import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Carousel from '@/components/Carousel';
import MovieCard from '@/components/MovieCard';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { AVAILABLE_CATEGORIES } from '@/lib/constants';

export const dynamic = 'force-dynamic';
import { unstable_noStore as noStore } from 'next/cache';

const API_KEY = "c71d55c790adcb0fa9ea6ebcbc9a61a7";

export default async function Home() {
  noStore();
  let categoryGroups: { [key: string]: any[] } = {};
  let heroMovies: any[] = [];

  try {
    const { data: mediaItems, error } = await supabase
      .from('media')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    const data = { media: mediaItems || [] };
    
    // Group media by categories
    AVAILABLE_CATEGORIES.forEach(cat => {
      categoryGroups[cat] = data.media.filter((item: any) => 
        item.category && item.category.toLowerCase().split(",").map((c:string)=>c.trim()).includes(cat.toLowerCase())
      );
    });

    // Fetch full data for the first 6 media items for the Hero banner
    let count = 0;
    for (const mediaItem of data.media) {
      if (count >= 6) break;
      const type = mediaItem.type === "Serie" ? "tv" : "movie";
      try {
        const tmdbRes = await fetch(`https://api.themoviedb.org/3/${type}/${mediaItem.id}?api_key=${API_KEY}&language=es`, { cache: 'no-store' });
        const tmdbData = await tmdbRes.json();
        if (tmdbData && (tmdbData.title || tmdbData.name)) {
          tmdbData.slug = mediaItem.slug;
          tmdbData.mediaType = type;
          heroMovies.push(tmdbData);
          count++;
        }
      } catch(e) {
        console.error("Failed to fetch hero movie:", e);
      }
    }
  } catch (error) {
    console.error("Error loading media data:", error);
  }

  return (
    <main className="min-h-screen bg-[#0d0d11] pb-20 overflow-x-hidden">
      <Navbar />
      <Hero mediaList={heroMovies} />

      <div className="relative z-20 mt-4">
        
        {AVAILABLE_CATEGORIES.map(cat => {
          const items = categoryGroups[cat];
          if (!items || items.length === 0) return null;
          
          return (
            <Carousel key={cat} title={cat} viewAllLink={`/pelicula?categoria=${encodeURIComponent(cat)}`}>
              {items.map((item: any, idx: number) => (
                <MovieCard key={item.id || idx} {...item} rank={cat === "Tendencias" ? idx + 1 : undefined} />
              ))}
            </Carousel>
          );
        })}

      </div>
      
      <Footer />
    </main>
  );
}

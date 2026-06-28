import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Carousel from '@/components/Carousel';
import MovieCard from '@/components/MovieCard';
import Footer from '@/components/Footer';
import { Star } from 'lucide-react';

import PeliculaActions from './PeliculaActions';
import PeliculaPlayer from './PeliculaPlayer';
import PeliculaDownloads from './PeliculaDownloads';

const API_KEY = "c71d55c790adcb0fa9ea6ebcbc9a61a7";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w1280";
const TMDB_POSTER_BASE = "https://image.tmdb.org/t/p/w500";
const TMDB_PROFILE_BASE = "https://image.tmdb.org/t/p/w185";

async function getMediaData(slug: string) {
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    return null;
  }
  return data;
}

async function getRelatedMedia(slug: string) {
  const { data } = await supabase
    .from('media')
    .select('*')
    .neq('slug', slug)
    .order('created_at', { ascending: false })
    .limit(10);
  
  return data || [];
}

async function getTmdbData(type: 'movie' | 'tv', id: string | number) {
  try {
    const tmdbRes = await fetch(
      `https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}&language=es&append_to_response=credits,videos`
    );
    if (!tmdbRes.ok) return null;
    return await tmdbRes.json();
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const localMediaData = await getMediaData(resolvedParams.slug);

  if (!localMediaData) {
    return { title: 'No Encontrado' };
  }

  const type = localMediaData.type === "Serie" ? "tv" : "movie";
  const tmdbData = await getTmdbData(type, localMediaData.id);

  const title = localMediaData?.customData?.title || (type === "movie" ? tmdbData?.title : tmdbData?.name) || 'Película';
  const description = localMediaData?.customData?.overview || tmdbData?.overview || 'Ver en HD';
  const imageUrl = tmdbData?.poster_path ? `${TMDB_POSTER_BASE}${tmdbData.poster_path}` : undefined;

  return {
    title: `${title} - Ver Películas y Series Online`,
    description,
    openGraph: {
      title,
      description,
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
  };
}

export default async function MovieDetail({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  const localMediaData = await getMediaData(resolvedParams.slug);
  
  if (!localMediaData) {
    notFound();
  }

  const relatedMedia = await getRelatedMedia(resolvedParams.slug);
  const mediaType = localMediaData.type === "Serie" ? "tv" : "movie";
  const tmdbData = await getTmdbData(mediaType, localMediaData.id);

  if (!tmdbData) {
    notFound();
  }

  // Derived data
  const movieTitle = localMediaData?.customData?.title || (mediaType === "movie" ? tmdbData.title : tmdbData.name);
  const movieYear = mediaType === "movie" ? tmdbData.release_date?.substring(0,4) : tmdbData.first_air_date?.substring(0,4);
  const backdropImage = tmdbData.backdrop_path ? `${TMDB_IMAGE_BASE}${tmdbData.backdrop_path}` : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1920&auto=format&fit=crop";
  const posterImage = tmdbData.poster_path ? `${TMDB_POSTER_BASE}${tmdbData.poster_path}` : "https://via.placeholder.com/400x600?text=No+Image";
  const rating = tmdbData.vote_average?.toFixed(1) || "N/A";
  const overview = localMediaData?.customData?.overview || tmdbData.overview || "No hay descripción disponible para este título.";

  let runtimeStr = "";
  if (mediaType === "movie" && tmdbData.runtime) {
    const hours = Math.floor(tmdbData.runtime / 60);
    const mins = tmdbData.runtime % 60;
    runtimeStr = `${hours}h ${mins}m`;
  } else if (mediaType === "tv" && tmdbData.episode_run_time?.length > 0) {
    runtimeStr = `${tmdbData.episode_run_time[0]}m / ep`;
  } else {
    runtimeStr = mediaType === "tv" ? `${tmdbData.number_of_seasons} Temp.` : "";
  }

  const castList = tmdbData.credits?.cast?.slice(0, 10) || [];
  const director = tmdbData.credits?.crew?.find((c: any) => c.job === "Director")?.name || (mediaType === "tv" ? tmdbData.created_by?.[0]?.name : "No disponible");
  
  let trailerKey = null;
  if (tmdbData.videos?.results?.length > 0) {
    const trailer = tmdbData.videos.results.find((v: any) => v.type === "Trailer" && v.site === "YouTube");
    trailerKey = trailer ? trailer.key : tmdbData.videos.results[0].key;
  }

  const hasSeasons = !!(localMediaData?.customData?.seasonsData && localMediaData.customData.seasonsData.length > 0);
  
  // Base downloads (movies might use localMediaData.downloadLinks)
  const baseDownloads = localMediaData?.downloadLinks || [];

  return (
    <main className="min-h-screen bg-[#0d0d11] pb-20 overflow-x-hidden">
      <Navbar />
      
      {/* Cinematic Hero */}
      <div className="relative w-full h-auto min-h-[60vh] lg:min-h-[75vh] flex flex-col">
        {/* Backdrop */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d11] via-[#0d0d11]/80 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d11] via-[#0d0d11]/50 to-transparent z-10" />
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 z-0 mask-image-b"
            style={{ backgroundImage: `url("${backdropImage}")` }}
          />
        </div>

        {/* Content Container */}
        <div className="container relative z-20 mx-auto px-4 md:px-8 flex flex-col justify-end flex-1 pt-32 pb-12">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-8 lg:gap-12">
            
            {/* Poster */}
            <div className="hidden md:block w-[200px] lg:w-[260px] flex-shrink-0 rounded-xl overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.6)] border border-white/10 relative z-30 group">
              <img src={posterImage} alt={movieTitle} className="w-full h-auto aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>

            {/* Info */}
            <div className="flex-1 max-w-3xl animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4 drop-shadow-lg">
                {movieTitle}
              </h1>
              
              <div className="flex flex-wrap items-center gap-3 mb-4 text-sm md:text-base font-semibold text-gray-300">
                <span className="flex items-center gap-1 text-white bg-[#e50914]/20 px-2 py-0.5 rounded-md backdrop-blur-sm border border-[#e50914]/30">
                  <Star className="w-4 h-4 fill-current text-[#e50914]" /> {rating}
                </span>
                <span>{movieYear}</span>
                {runtimeStr && (
                  <>
                    <span className="text-gray-600">·</span>
                    <span>{runtimeStr}</span>
                  </>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {tmdbData.genres?.map((g: any) => (
                  <span key={g.id} className="text-xs font-bold text-gray-300 bg-[#1c1c21] border border-white/10 px-3 py-1 rounded-full hover:text-white hover:border-white/20 transition-colors">
                    {g.name}
                  </span>
                ))}
              </div>

              <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-8 drop-shadow-md line-clamp-3 md:line-clamp-none">
                {overview}
              </p>

              {/* Client Component for Actions */}
              <PeliculaActions 
                slug={resolvedParams.slug}
                movieTitle={movieTitle}
                movieYear={movieYear}
                posterImage={posterImage}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 md:px-8 mt-8 lg:mt-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column (Player & Main Info) */}
          <div className="flex-1 w-full overflow-hidden">
            
            {/* Client Component for Player */}
            <PeliculaPlayer 
              hasSeasons={hasSeasons}
              localMediaData={localMediaData}
              tmdbData={tmdbData}
              backdropImage={backdropImage}
              trailerKey={trailerKey}
              runtimeStr={runtimeStr}
            />

            {/* Cast & Crew */}
            {castList.length > 0 && (
              <div className="mb-10 w-full overflow-hidden">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-l-4 border-[#e50914] pl-3">
                  Reparto Principal
                </h3>
                <div className="flex overflow-x-auto gap-4 md:gap-6 pb-4 no-scrollbar snap-x">
                  {castList.map((actor: any) => (
                    <div key={actor.id} className="flex-shrink-0 w-[110px] md:w-[130px] snap-start group text-center cursor-pointer">
                      <div className="w-[100px] h-[100px] md:w-[120px] md:h-[120px] mx-auto rounded-full overflow-hidden border-2 border-[#1c1c21] group-hover:border-[#e50914] transition-all duration-300 mb-3 shadow-lg">
                        <img 
                          src={actor.profile_path ? `${TMDB_PROFILE_BASE}${actor.profile_path}` : "https://via.placeholder.com/150x150?text=No+Img"} 
                          alt={actor.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                      </div>
                      <h4 className="text-[13px] md:text-sm font-bold text-white mb-1 group-hover:text-[#e50914] transition-colors">{actor.name}</h4>
                      <p className="text-[11px] md:text-xs text-gray-400">{actor.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </div>
          
          {/* Right Column (Sidebar) */}
          <div className="w-full lg:w-[320px] flex-shrink-0 space-y-6">
            
            <div className="bg-[#141418] rounded-xl border border-white/5 p-6 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-3">Director / Creador</h3>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border border-white/10 bg-[#1c1c21] flex items-center justify-center">
                  <Star className="text-[#e50914]" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-[15px]">{director}</h4>
                  <p className="text-sm text-gray-400">Dirección</p>
                </div>
              </div>
            </div>

            <div className="bg-[#141418] rounded-xl border border-white/5 p-6 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-3">Información</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-gray-500 block mb-1">Título Original</span>
                  <span className="text-white font-medium">{tmdbData.original_title || tmdbData.original_name}</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Estreno</span>
                  <span className="text-white font-medium">{tmdbData.release_date || tmdbData.first_air_date}</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Calidad</span>
                  <span className="inline-block bg-[#e50914]/10 text-[#e50914] border border-[#e50914]/20 px-2 py-0.5 rounded text-[11px] font-black tracking-wider uppercase">HD 1080p</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Audio</span>
                  <span className="text-white font-medium">Español Latino, Inglés Sub</span>
                </div>
              </div>
            </div>

            {/* Client Component for Downloads */}
            {!hasSeasons && (
              <PeliculaDownloads 
                downloads={baseDownloads} 
                title={movieTitle} 
                hasSeasons={false} 
              />
            )}
            
            {/* Note: In a real advanced scenario, if you want downloads to react to the selected season/episode in PeliculaPlayer, 
                you'd need to lift the state or use a context. For now, since PeliculaDownloads doesn't have access to activeEpisode, 
                you might consider moving PeliculaDownloads into PeliculaPlayer if it's a TV show, or pass them down. 
                Wait! Let's check how downloads were shown for TV shows before. 
                Ah! Downloads for TV shows relied on activeEpisode.
                Let's fix this by moving the TV show downloads logic into PeliculaPlayer. */}
          </div>
        </div>
      </div>

      {/* Relacionados */}
      {relatedMedia.length > 0 && (
        <div className="container mx-auto mt-6 md:mt-12 relative z-20">
          <Carousel title="Títulos Relacionados" viewAllLink="/peliculas">
            {relatedMedia.map((item: any, idx: number) => (
              <div key={idx} className="w-[150px] md:w-[190px] lg:w-[220px] flex-shrink-0 relative">
                <MovieCard {...item} />
              </div>
            ))}
          </Carousel>
        </div>
      )}

      <Footer />
    </main>
  );
}

'use client';

import Navbar from '@/components/Navbar';
import Carousel from '@/components/Carousel';
import MovieCard from '@/components/MovieCard';
import Footer from '@/components/Footer';
import { Play, Share2, Heart, Plus, AlertCircle, Check, Pause, Star, X, Download } from 'lucide-react';
import Link from 'next/link';
import { use, useState, useEffect } from 'react';

const API_KEY = "c71d55c790adcb0fa9ea6ebcbc9a61a7";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w1280";
const TMDB_POSTER_BASE = "https://image.tmdb.org/t/p/w500";
const TMDB_PROFILE_BASE = "https://image.tmdb.org/t/p/w185";

export default function MovieDetail({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  
  const [isAdded, setIsAdded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [activeServer, setActiveServer] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [activeSeason, setActiveSeason] = useState<number>(0);
  const [activeEpisode, setActiveEpisode] = useState<number>(0);
  const [isEpisodesListOpen, setIsEpisodesListOpen] = useState<boolean>(true);
  
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState<boolean>(false);
  
  const [loading, setLoading] = useState(true);
  const [tmdbData, setTmdbData] = useState<any>(null);
  const [localMediaData, setLocalMediaData] = useState<any>(null);
  const [relatedMedia, setRelatedMedia] = useState<any[]>([]);
  const [mediaType, setMediaType] = useState<"movie" | "tv">("movie");
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [seasonDetails, setSeasonDetails] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Get the list of media to find the ID by slug
        const resMedia = await fetch('/api/media');
        const dataMedia = await resMedia.json();
        
        const allMedia = dataMedia.media || [];
        const currentMedia = allMedia.find((m: any) => m.slug === resolvedParams.slug);
        
        if (currentMedia) {
          setRelatedMedia(allMedia.filter((m: any) => m.slug !== resolvedParams.slug).slice(0, 10));
          setLocalMediaData(currentMedia);
          const type = currentMedia.type === "Serie" ? "tv" : "movie";
          setMediaType(type);
          
          // 2. Fetch full details from TMDB
          const tmdbRes = await fetch(`https://api.themoviedb.org/3/${type}/${currentMedia.id}?api_key=${API_KEY}&language=es&append_to_response=credits,videos`);
          const tmdbJson = await tmdbRes.json();
          
          setTmdbData(tmdbJson);
          
          // Find trailer
          if (tmdbJson.videos?.results?.length > 0) {
            const trailer = tmdbJson.videos.results.find((v: any) => v.type === "Trailer" && v.site === "YouTube");
            if (trailer) {
              setTrailerKey(trailer.key);
            } else {
              setTrailerKey(tmdbJson.videos.results[0].key);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching media details:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [resolvedParams.slug]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('mi-lista') || '[]');
      if (saved.some((m: any) => m.slug === resolvedParams.slug)) {
        setIsAdded(true);
      }
    } catch (e) {}
  }, [resolvedParams.slug]);

  useEffect(() => {
    if (mediaType === "tv" && tmdbData?.id && localMediaData?.customData?.seasonsData) {
      const seasonNum = localMediaData.customData.seasonsData[activeSeason]?.seasonNumber || activeSeason + 1;
      fetch(`https://api.themoviedb.org/3/tv/${tmdbData.id}/season/${seasonNum}?api_key=${API_KEY}&language=es`)
        .then(res => res.json())
        .then(data => setSeasonDetails(data))
        .catch(err => console.error(err));
    }
  }, [activeSeason, mediaType, tmdbData, localMediaData]);

  if (loading) {
    return <div className="min-h-screen bg-[#0d0d11] flex items-center justify-center"><div className="text-[#e50914] text-xl font-bold animate-pulse">Cargando...</div></div>;
  }
  
  if (!tmdbData) {
    return <div className="min-h-screen bg-[#0d0d11] flex items-center justify-center"><div className="text-white text-xl">Contenido no encontrado</div></div>;
  }

  const movieTitle = localMediaData?.customData?.title || (mediaType === "movie" ? tmdbData.title : tmdbData.name);
  const movieYear = mediaType === "movie" ? tmdbData.release_date?.substring(0,4) : tmdbData.first_air_date?.substring(0,4);
  const backdropImage = tmdbData.backdrop_path ? `${TMDB_IMAGE_BASE}${tmdbData.backdrop_path}` : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1920&auto=format&fit=crop";
  const posterImage = tmdbData.poster_path ? `${TMDB_POSTER_BASE}${tmdbData.poster_path}` : "https://via.placeholder.com/400x600?text=No+Image";
  const rating = tmdbData.vote_average?.toFixed(1) || "N/A";
  const overview = localMediaData?.customData?.overview || tmdbData.overview || "No hay descripción disponible para este título.";
  
  // Format runtime
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

  const toggleLista = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('mi-lista') || '[]');
      if (isAdded) {
        const newSaved = saved.filter((m: any) => m.slug !== resolvedParams.slug);
        localStorage.setItem('mi-lista', JSON.stringify(newSaved));
        setIsAdded(false);
      } else {
        const movieData = {
          slug: resolvedParams.slug,
          title: movieTitle,
          year: movieYear,
          imageUrl: posterImage
        };
        saved.push(movieData);
        localStorage.setItem('mi-lista', JSON.stringify(saved));
        setIsAdded(true);
      }
    } catch (e) {}
  };

  const castList = tmdbData.credits?.cast?.slice(0, 10) || [];
  const director = tmdbData.credits?.crew?.find((c: any) => c.job === "Director")?.name || (mediaType === "tv" ? tmdbData.created_by?.[0]?.name : "No disponible");

  const hasSeasons = localMediaData?.customData?.seasonsData && localMediaData.customData.seasonsData.length > 0;
  const currentSeasonData = hasSeasons ? localMediaData.customData.seasonsData[activeSeason] : null;
  const currentEpisodeData = currentSeasonData?.episodes?.[activeEpisode] || null;
  const currentWatchLinks = hasSeasons 
    ? (currentEpisodeData?.watchLinks || []) 
    : (localMediaData?.watchLinks || []);
  const currentUrl = currentWatchLinks.length > 0 ? currentWatchLinks[activeServer]?.url : null;

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
            
            {/* Poster (Hidden on small mobile, visible on tablet+) */}
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

              <div className="flex flex-wrap items-center gap-4">
                <button onClick={() => { document.getElementById('player')?.scrollIntoView({ behavior: 'smooth' }); setIsPlaying(true); }} className="flex items-center gap-2 bg-[#e50914] hover:bg-[#b30710] text-white font-bold py-3 px-8 rounded-full transition-all shadow-[0_0_20px_rgba(229,9,20,0.4)] hover:shadow-[0_0_30px_rgba(229,9,20,0.6)] hover:scale-105">
                  <Play className="w-5 h-5 fill-current" />
                  Reproducir
                </button>
                
                <button 
                  onClick={toggleLista}
                  className={`flex items-center gap-2 font-semibold py-3 px-6 rounded-full transition-all border ${isAdded ? 'bg-[#e50914] text-white border-[#e50914]' : 'bg-[#1c1c21] hover:bg-[#2c2c31] text-white border-white/10'}`}
                >
                  {isAdded ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  {isAdded ? 'En Lista' : 'Mi Lista'}
                </button>
                
                <button 
                  onClick={() => setIsLiked(!isLiked)}
                  className={`w-12 h-12 rounded-full border border-white/10 flex items-center justify-center transition-colors ${isLiked ? 'bg-[#e50914] text-white' : 'bg-[#1c1c21] hover:bg-[#2c2c31] text-white'}`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                </button>
                
                <button 
                  onClick={() => alert('Compartido con éxito')}
                  className="w-12 h-12 rounded-full border border-white/10 bg-[#1c1c21] flex items-center justify-center hover:bg-[#2c2c31] transition-colors text-white"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 md:px-8 mt-8 lg:mt-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column (Player & Main Info) */}
          <div className="flex-1 w-full overflow-hidden">
            
            {/* Player Section */}
            <div id="player" className="scroll-mt-24 mb-10 w-full">
              {/* Seasons & Episodes Selectors */}
              {hasSeasons && (
                <div className="mb-6 bg-[#101014] rounded-lg border border-white/5 overflow-hidden shadow-xl w-full">
                  {/* Season Header */}
                  <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#141418] gap-4">
                    <div className="flex items-center gap-4 overflow-x-auto no-scrollbar flex-1">
                      <div className="relative flex-shrink-0">
                        <select 
                          className="bg-[#1c1c21] text-white border border-white/10 rounded-md px-4 py-2 text-sm font-medium outline-none focus:border-[#e50914] cursor-pointer appearance-none w-48"
                          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.2em 1.2em`, paddingRight: `2.5rem` }}
                          value={activeSeason}
                          onChange={(e) => { setActiveSeason(Number(e.target.value)); setActiveEpisode(0); setActiveServer(0); setIsEpisodesListOpen(true); }}
                        >
                          {localMediaData.customData.seasonsData.map((season: any, idx: number) => (
                            <option key={idx} value={idx}>{season.title || `Temporada ${season.seasonNumber}`}</option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Integrated Server Tabs */}
                      <div className="flex items-center gap-2">
                        {currentWatchLinks.length > 0 ? (
                          currentWatchLinks.map((link: any, idx: number) => (
                            <button 
                              key={idx}
                              onClick={() => setActiveServer(idx)}
                              className={`font-semibold px-4 py-1.5 rounded-full text-[13px] whitespace-nowrap transition-colors border ${activeServer === idx ? 'bg-[#e50914] text-white shadow-[0_0_10px_rgba(229,9,20,0.3)] border-[#e50914]' : 'bg-[#1c1c21] hover:bg-[#2c2c31] text-gray-300 border-white/10'}`}
                            >
                              {link.serverName} {link.lang && `(${link.lang})`}
                            </button>
                          ))
                        ) : (
                          <button className="font-semibold px-4 py-1.5 rounded-full text-[13px] whitespace-nowrap transition-colors border bg-[#e50914] text-white shadow-[0_0_10px_rgba(229,9,20,0.3)] border-[#e50914]">
                            Tráiler
                          </button>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsEpisodesListOpen(!isEpisodesListOpen)}
                      className="flex-shrink-0 text-white hover:text-[#e50914] transition-colors p-2"
                      title={isEpisodesListOpen ? "Cerrar lista" : "Abrir lista"}
                    >
                      {isEpisodesListOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                      )}
                    </button>
                  </div>
                  
                  {/* Episodes List */}
                  {isEpisodesListOpen && (
                    currentSeasonData?.episodes?.length > 0 ? (
                      <div className="flex flex-col max-h-[500px] overflow-y-auto custom-scrollbar">
                        {currentSeasonData.episodes.map((ep: any, idx: number) => {
                          const tmdbEp = seasonDetails?.episodes?.find((e: any) => e.episode_number === ep.episodeNumber) || seasonDetails?.episodes?.[idx];
                          const airDate = tmdbEp?.air_date ? new Date(tmdbEp.air_date).toLocaleDateString('es-ES', { year: 'numeric', month: 'numeric', day: 'numeric' }) : '9/5/2025';
                          const runtime = tmdbEp?.runtime ? `${tmdbEp.runtime}m` : '45m';
                          const rating = tmdbEp?.vote_average ? tmdbEp.vote_average.toFixed(1) : '7.5';
                          
                          const isActive = activeEpisode === idx;
                          
                          return (
                            <div 
                              key={idx}
                              onClick={() => { setActiveEpisode(idx); setActiveServer(0); setIsPlaying(true); setIsEpisodesListOpen(false); document.getElementById('player')?.scrollIntoView({ behavior: 'smooth' }); }}
                              className={`flex justify-between items-center p-4 cursor-pointer transition-colors border-b border-white/5 ${isActive ? 'bg-[#1c1c21] border-l-4 border-l-[#e50914] border-b-transparent' : 'hover:bg-white/5 border-l-4 border-l-transparent'}`}
                            >
                            <div className="flex-1">
                              <div className="text-[11px] font-bold text-gray-400 mb-1">
                                {localMediaData.customData.seasonsData[activeSeason]?.seasonNumber}x{ep.episodeNumber}
                              </div>
                              <h5 className={`font-semibold text-base ${isActive ? 'text-[#e50914]' : 'text-gray-200'}`}>
                                {ep.title}
                              </h5>
                            </div>
                            <div className="text-right pl-4">
                              <div className="text-[11px] font-medium text-gray-400 mb-1">
                                {runtime} • {airDate}
                              </div>
                              <div className="text-sm font-bold text-[#ffb400]">
                                ⭐ {rating}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500 text-sm bg-[#101014]">
                      No hay capítulos disponibles para esta temporada.
                    </div>
                  ))}
                </div>
              )}

              {/* Server Tabs */}
              {!hasSeasons && (
                <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar pb-2">
                  {currentWatchLinks.length > 0 ? (
                    currentWatchLinks.map((link: any, idx: number) => (
                      <button 
                        key={idx}
                        onClick={() => setActiveServer(idx)}
                        className={`font-semibold px-6 py-2 rounded-full text-sm whitespace-nowrap transition-colors border ${activeServer === idx ? 'bg-[#e50914] text-white shadow-[0_0_15px_rgba(229,9,20,0.3)] border-[#e50914]' : 'bg-[#1c1c21] hover:bg-[#2c2c31] text-gray-300 border-white/10'}`}
                      >
                        {link.serverName} {link.lang && `(${link.lang})`}
                      </button>
                    ))
                  ) : (
                    <button className="font-semibold px-6 py-2 rounded-full text-sm whitespace-nowrap transition-colors border bg-[#e50914] text-white shadow-[0_0_15px_rgba(229,9,20,0.3)] border-[#e50914]">
                      Tráiler
                    </button>
                  )}
                </div>
              )}

              {/* Video Player Box */}
              <div className="w-full aspect-video rounded-xl overflow-hidden bg-black border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.8)] relative group">
                {isPlaying ? (
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={currentUrl ? currentUrl : (trailerKey ? `https://www.youtube.com/embed/${trailerKey}?autoplay=1` : "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1")} 
                    title="Video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="absolute inset-0 z-20"
                  ></iframe>
                ) : (
                  <>
                    <img src={backdropImage} alt="Video Thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div onClick={() => setIsPlaying(true)} className="w-20 h-20 bg-[#e50914] rounded-full flex items-center justify-center cursor-pointer shadow-[0_0_30px_rgba(229,9,20,0.6)] hover:scale-110 transition-transform duration-300 z-10">
                        <Play className="w-8 h-8 text-white fill-current ml-1" />
                      </div>
                    </div>
                  </>
                )}
                {/* Fake Controls */}
                <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent flex items-center gap-4 transition-opacity duration-300 z-30 ${isPlaying ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
                  <button onClick={() => setIsPlaying(!isPlaying)}>
                    {isPlaying ? <Pause className="w-5 h-5 text-white fill-current" /> : <Play className="w-5 h-5 text-white fill-current" />}
                  </button>
                  <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                    <div className="w-1/3 h-full bg-[#e50914]"></div>
                  </div>
                  <span className="text-white text-xs font-medium">0:00 / {runtimeStr || "2:00"}</span>
                </div>
              </div>


              
              <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                  <AlertCircle className="w-4 h-4" />
                  Reportar problema
                </button>
                <div className="flex items-center gap-2">
                  <button className="text-gray-400 hover:text-white transition-colors bg-[#1c1c21] px-3 py-1.5 text-xs font-bold uppercase rounded-md border border-white/10">Latino</button>
                  <button className="text-gray-400 hover:text-white transition-colors bg-[#1c1c21] px-3 py-1.5 text-xs font-bold uppercase rounded-md border border-white/10">1080p</button>
                </div>
              </div>
            </div>

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

            {/* Downloads Section */}
            {(() => {
              const downloads = hasSeasons 
                ? (currentSeasonData?.episodes?.[activeEpisode]?.downloadLinks || [])
                : (localMediaData?.downloadLinks || []);
                
              if (downloads.length === 0) return null;
              
              return (
                <div className="bg-[#141418] rounded-xl border border-white/5 p-6 shadow-xl mt-6 text-center">
                  <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-3 text-left">Descargas {hasSeasons && `(Cap. ${currentSeasonData?.episodes?.[activeEpisode]?.episodeNumber || activeEpisode + 1})`}</h3>
                  <button 
                    onClick={() => setIsDownloadModalOpen(true)}
                    className="w-full bg-[#e50914] hover:bg-[#b80710] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-[0_0_15px_rgba(229,9,20,0.3)]"
                  >
                    <Download size={20} />
                    Ver Enlaces de Descarga
                  </button>
                </div>
              );
            })()}

          </div>
        </div>
      </div>

      {/* Relacionados */}
      {relatedMedia.length > 0 && (
        <div className="container mx-auto mt-6 md:mt-12 relative z-20">
          <Carousel title="Títulos Relacionados" viewAllLink="/pelicula">
            {relatedMedia.map((item, idx) => (
              <div key={idx} className="w-[150px] md:w-[190px] lg:w-[220px] flex-shrink-0 relative">
                <MovieCard {...item} />
              </div>
            ))}
          </Carousel>
        </div>
      )}

      <Footer />

      {/* Download Modals */}
      {isDownloadModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#141418] rounded-xl w-full max-w-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="flex justify-between items-start p-6 border-b border-white/5 bg-[#1a1a24]">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#e50914]/10 border border-[#e50914]/20 flex items-center justify-center flex-shrink-0">
                  <Download className="text-[#e50914]" size={24} />
                </div>
                <div>
                  <h4 className="text-gray-400 text-xs font-bold tracking-wider uppercase mb-1">Descargar</h4>
                  <h2 className="text-white text-xl font-bold leading-tight">
                    {tmdbData.title || tmdbData.name}
                    {hasSeasons && ` - Cap. ${currentSeasonData?.episodes?.[activeEpisode]?.episodeNumber || activeEpisode + 1}`}
                  </h2>
                </div>
              </div>
              <button onClick={() => setIsDownloadModalOpen(false)} className="bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white p-2 rounded-full transition-colors flex-shrink-0">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              <div className="space-y-3">
                {(() => {
                  const downloads = hasSeasons 
                    ? (currentSeasonData?.episodes?.[activeEpisode]?.downloadLinks || [])
                    : (localMediaData?.downloadLinks || []);
                  
                  return downloads.map((link: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between bg-[#1a1a24] p-4 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-4">
                        <span className="bg-white/5 text-gray-400 px-2 py-1 rounded text-[10px] font-black uppercase border border-white/10">
                          {link.lang || 'HD'}
                        </span>
                        <span className="text-white font-bold">{link.serverName}</span>
                      </div>
                      <a 
                        href={`/descargar?link=${encodeURIComponent(link.url)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 border border-[#e50914]/30 text-[#e50914] hover:bg-[#e50914] hover:text-white px-4 py-2 rounded font-semibold text-sm transition-colors"
                      >
                        <Download size={16} /> Descargar
                      </a>
                    </div>
                  ));
                })()}
              </div>
            </div>
            
            <div className="p-4 border-t border-white/5 bg-[#1a1a24] text-center flex items-center justify-center gap-2 text-gray-500 text-xs">
              <AlertCircle size={14} /> Los enlaces se abren en una pestaña nueva.
            </div>
            
          </div>
        </div>
      )}

    </main>
  );
}

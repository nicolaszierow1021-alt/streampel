'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, AlertCircle } from 'lucide-react';
import PeliculaDownloads from './PeliculaDownloads';

const API_KEY = "c71d55c790adcb0fa9ea6ebcbc9a61a7";

interface PeliculaPlayerProps {
  hasSeasons: boolean;
  localMediaData: any;
  tmdbData: any;
  backdropImage: string;
  trailerKey: string | null;
  runtimeStr: string;
}

export default function PeliculaPlayer({ 
  hasSeasons, 
  localMediaData, 
  tmdbData, 
  backdropImage, 
  trailerKey, 
  runtimeStr 
}: PeliculaPlayerProps) {
  const [activeServer, setActiveServer] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSeason, setActiveSeason] = useState<number>(0);
  const [activeEpisode, setActiveEpisode] = useState<number>(0);
  const [isEpisodesListOpen, setIsEpisodesListOpen] = useState<boolean>(true);
  const [seasonDetails, setSeasonDetails] = useState<any>(null);

  useEffect(() => {
    const handlePlayMovie = () => setIsPlaying(true);
    window.addEventListener('play-movie', handlePlayMovie);
    return () => window.removeEventListener('play-movie', handlePlayMovie);
  }, []);

  useEffect(() => {
    if (hasSeasons && tmdbData?.id && localMediaData?.customData?.seasonsData) {
      const seasonNum = localMediaData.customData.seasonsData[activeSeason]?.seasonNumber || activeSeason + 1;
      fetch(`https://api.themoviedb.org/3/tv/${tmdbData.id}/season/${seasonNum}?api_key=${API_KEY}&language=es`)
        .then(res => res.json())
        .then(data => setSeasonDetails(data))
        .catch(err => console.error(err));
    }
  }, [activeSeason, hasSeasons, tmdbData, localMediaData]);

  const currentSeasonData = hasSeasons ? localMediaData.customData.seasonsData[activeSeason] : null;
  const currentEpisodeData = currentSeasonData?.episodes?.[activeEpisode] || null;
  const currentWatchLinks = hasSeasons 
    ? (currentEpisodeData?.watchLinks || []) 
    : (localMediaData?.watchLinks || []);
  const currentUrl = currentWatchLinks.length > 0 ? currentWatchLinks[activeServer]?.url : null;

  return (
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

      {/* Server Tabs (Only for Movies) */}
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
            {/* Fake Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent flex items-center gap-4 transition-opacity duration-300 z-30 opacity-0 group-hover:opacity-100">
              <button onClick={() => setIsPlaying(true)}>
                <Play className="w-5 h-5 text-white fill-current" />
              </button>
              <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                <div className="w-1/3 h-full bg-[#e50914]"></div>
              </div>
              <span className="text-white text-xs font-medium">0:00 / {runtimeStr || "2:00"}</span>
            </div>
          </>
        )}
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

      {hasSeasons && (
        <div className="mt-8">
          <PeliculaDownloads 
            downloads={currentSeasonData?.episodes?.[activeEpisode]?.downloadLinks || []}
            title={tmdbData?.name || localMediaData?.customData?.title || 'Serie'}
            hasSeasons={true}
            seasonLabel={`Cap. ${currentSeasonData?.episodes?.[activeEpisode]?.episodeNumber || activeEpisode + 1}`}
          />
        </div>
      )}
    </div>
  );
}

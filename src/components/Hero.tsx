'use client';

import Link from 'next/link';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, ChevronLeft, ChevronRight, Info, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Hero({ mediaList = [] }: { mediaList?: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (mediaList.length <= 1) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % mediaList.length);
    }, 6000); // Change every 6 seconds
    
    return () => clearInterval(interval);
  }, [mediaList.length]);

  const handleDotClick = (idx: number) => {
    if (idx === currentIndex) return;
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
  };

  if (!mediaList || mediaList.length === 0) {
    return <div className="w-full h-[85vh] min-h-[600px] bg-[#0d0d11]" />;
  }

  const media = mediaList[currentIndex];
  const title = media.mediaType === 'movie' ? media.title : media.name;
  const backdrop = media.backdrop_path ? `https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${media.backdrop_path}` : "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?q=80&w=2000&auto=format&fit=crop";
  const rating = media.vote_average?.toFixed(1) || "N/A";
  const genres = media.genres?.slice(0, 2).map((g: any) => g.name).join(' · ') || "General";
  const overview = media.overview || "Sin descripción disponible.";

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      zIndex: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95,
      zIndex: 0,
    }),
  };

  return (
    <div className="relative w-full h-[85vh] min-h-[600px] flex items-end pb-16 overflow-hidden bg-[#0d0d11]">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "tween", ease: [0.25, 1, 0.5, 1], duration: 0.8 },
            opacity: { duration: 0.6 },
            scale: { duration: 0.8, ease: [0.25, 1, 0.5, 1] }
          }}
          className="absolute inset-0 w-full h-full flex items-end pb-16"
        >
          {/* Background Image with Gradients */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d11] via-[#0d0d11]/60 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d11] via-[#0d0d11]/40 to-transparent z-10" />
            
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url("${backdrop}")` }} 
            />
          </div>

          {/* Content Container (Bottom Aligned) */}
          <div className="w-full relative z-20 px-4 md:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 w-full">
              
              {/* Mobile Layout (md:hidden) */}
              <div className="md:hidden w-full flex flex-col items-start text-left">
                <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-3 text-white drop-shadow-lg uppercase italic line-clamp-2">
                  {title}
                </h1>
                
                <div className="flex items-center gap-3 mb-3 text-[13px] font-semibold text-gray-200">
                  <span className="flex items-center gap-1 text-white">
                    <Star className="w-4 h-4 fill-current text-white" /> {rating}
                  </span>
                  <span>·</span>
                  <span>{genres}</span>
                </div>

                <p className="text-sm text-gray-200 mb-6 leading-snug drop-shadow-md line-clamp-2 w-[90%]">
                  {overview}
                </p>
                
                <div className="flex items-center gap-3 w-full">
                  <Link 
                    href={`/pelicula/${media.slug}`}
                    className="flex items-center gap-2 bg-[#1c1c1c]/90 border border-white/20 hover:bg-white/10 text-white font-medium py-2.5 px-6 rounded-full transition-colors backdrop-blur-md"
                  >
                    <Info className="w-5 h-5" />
                    Ver más
                  </Link>
                </div>
              </div>

              {/* Desktop Layout (hidden md:flex) */}
              <div className="hidden md:flex flex-col max-w-xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 text-white drop-shadow-lg uppercase italic flex flex-col gap-2 line-clamp-2">
                  <span className="text-[#e50914]">{title}</span>
                </h1>
                
                <div className="flex items-center gap-3 mb-4 text-sm font-semibold text-gray-300">
                  <span className="flex items-center gap-1 text-white bg-black/30 px-2 py-0.5 rounded backdrop-blur-sm">
                    <Star className="w-4 h-4 fill-current text-[#e50914]" /> {rating}
                  </span>
                  <span>·</span>
                  <span>{genres}</span>
                </div>

                <p className="text-sm md:text-base text-gray-300 mb-6 leading-relaxed drop-shadow-md line-clamp-3 min-h-[4rem]">
                  {overview}
                </p>
                
                <Link 
                  href={`/pelicula/${media.slug}`}
                  className="inline-flex items-center self-start gap-2 bg-[#1a1a20]/80 border border-white/20 hover:bg-white/10 text-white font-medium py-2 px-6 rounded-full transition-colors backdrop-blur-md"
                >
                  <Info className="w-4 h-4" />
                  Ver más
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Pagination indicators */}
      {mediaList.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30">
          {mediaList.map((_, idx) => (
            <button 
              key={idx} 
              onClick={() => handleDotClick(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-[#e50914]' : 'w-2 bg-white/30 hover:bg-white/60'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Play, Plus, Check, Heart, Share2 } from 'lucide-react';

interface PeliculaActionsProps {
  slug: string;
  movieTitle: string;
  movieYear: string;
  posterImage: string;
}

export default function PeliculaActions({ slug, movieTitle, movieYear, posterImage }: PeliculaActionsProps) {
  const [isAdded, setIsAdded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('mi-lista') || '[]');
      if (saved.some((m: any) => m.slug === slug)) {
        setIsAdded(true);
      }
    } catch (e) {}
  }, [slug]);

  const toggleLista = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('mi-lista') || '[]');
      if (isAdded) {
        const newSaved = saved.filter((m: any) => m.slug !== slug);
        localStorage.setItem('mi-lista', JSON.stringify(newSaved));
        setIsAdded(false);
      } else {
        const movieData = {
          slug: slug,
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

  const handlePlay = () => {
    document.getElementById('player')?.scrollIntoView({ behavior: 'smooth' });
    window.dispatchEvent(new CustomEvent('play-movie'));
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      <button 
        onClick={handlePlay} 
        className="flex items-center gap-2 bg-[#e50914] hover:bg-[#b30710] text-white font-bold py-3 px-8 rounded-full transition-all shadow-[0_0_20px_rgba(229,9,20,0.4)] hover:shadow-[0_0_30px_rgba(229,9,20,0.6)] hover:scale-105"
      >
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
  );
}

'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MovieCard from '@/components/MovieCard';
import Link from 'next/link';
import { Film } from 'lucide-react';

export default function MiListaPage() {
  const [savedMovies, setSavedMovies] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('mi-lista') || '[]');
      setSavedMovies(saved);
    } catch (e) {
      console.error("Error loading mi-lista from localStorage", e);
    }
    setIsLoaded(true);
  }, []);

  return (
    <main className="min-h-screen bg-[#0d0d11] pb-20">
      <Navbar />
      
      <div className="container mx-auto px-4 md:px-8 pt-32">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Mi Lista
        </h1>
        <p className="text-gray-400 mb-10 border-b border-white/10 pb-4">
          {savedMovies.length} títulos guardados
        </p>
        
        {!isLoaded ? (
          <div className="py-20 text-center">
            <p className="text-gray-400">Cargando...</p>
          </div>
        ) : savedMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {savedMovies.map((item, idx) => (
              <div key={idx} className="w-full">
                <MovieCard {...item} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <Film className="w-16 h-16 mx-auto mb-4 text-gray-500" />
            <h2 className="text-xl font-bold text-white mb-2">Tu lista está vacía</h2>
            <p className="text-gray-400 mb-6">Aún no has guardado ninguna película o serie.</p>
            <Link 
              href="/"
              className="inline-block bg-[#e50914] hover:bg-[#b30710] text-white font-bold py-3 px-8 rounded-full transition-colors"
            >
              Explorar contenido
            </Link>
          </div>
        )}
      </div>
      
      <Footer />
    </main>
  );
}

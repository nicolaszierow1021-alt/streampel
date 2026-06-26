'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, User, X, Play, Smartphone } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Películas', href: '/peliculas' },
    { name: 'Series', href: '/series' },
    { name: 'Anime', href: '/anime' },
    { name: 'Géneros', href: '/generos' },
    { name: 'Mi lista', href: '/mi-lista' },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-[#0d0d11]/95 backdrop-blur-md shadow-lg' : 'bg-gradient-to-b from-black/80 to-transparent'
        }`}
      >
        <div className="w-full px-4 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Logo & Desktop Nav */}
            <div className="flex items-center gap-6 lg:gap-8">
              <Link href="/" className="flex items-center gap-3 group mr-2">
                {/* Modern Glow Logo Icon */}
                <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#ff2a40] to-[#b30015] shadow-[0_0_20px_rgba(229,9,20,0.4)] group-hover:shadow-[0_0_25px_rgba(229,9,20,0.6)] group-hover:scale-105 transition-all duration-300 flex-shrink-0 overflow-hidden">
                  {/* Subtle inner reflection */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50 rounded-xl pointer-events-none"></div>
                  <Play className="w-5 h-5 text-white fill-white ml-0.5 z-10 drop-shadow-md" />
                </div>
                {/* Sleek Typography */}
                <div className="flex flex-col uppercase leading-none tracking-tight">
                  <span className="text-[18px] font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                    Pelix
                  </span>
                  <span className="text-[10px] font-bold text-[#e50914] tracking-[0.25em] mt-[3px]">
                    Stream
                  </span>
                </div>
              </Link>
              
              <nav className="hidden lg:flex items-center gap-5">
                {navLinks.map((link, idx) => (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    className={`text-[14px] font-medium transition-colors ${idx === 0 ? 'text-white font-bold' : 'text-gray-300 hover:text-white'}`}
                  >
                    {link.name}
                  </Link>
                ))}
                
                <div className="flex items-center ml-2">
                  {/* Premium App Button */}
                  <Link 
                    href="/app" 
                    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 transition-all duration-300 border border-white/10 hover:border-white/20 group shadow-lg"
                  >
                    <Smartphone className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                    <span className="text-gray-300 group-hover:text-white text-sm font-bold tracking-wide transition-colors">App</span>
                  </Link>
                </div>
              </nav>
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-4 relative">
              
              {/* Expandable Search */}
              <div className="flex items-center">
                <form 
                  onSubmit={handleSearch}
                  className={`relative flex items-center transition-all duration-300 overflow-hidden ${
                    isSearchOpen ? 'w-[200px] md:w-[260px] opacity-100 mr-2' : 'w-0 opacity-0'
                  }`}
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar películas..."
                    className="w-full bg-[#1a1a20] border border-white/10 text-white rounded-full pl-4 pr-10 py-1.5 text-sm focus:outline-none focus:border-[#e50914] transition-colors"
                  />
                  {isSearchOpen && (
                    <button 
                      type="button" 
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </form>

                <button 
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="text-gray-300 hover:text-white transition-colors p-2"
                  aria-label="Buscar"
                >
                  <Search className="w-5 h-5" strokeWidth={2} />
                </button>
              </div>
              
              <Link 
                href="/contacto"
                className="text-gray-300 hover:text-white transition-colors p-2"
                aria-label="Contacto / Telegram"
              >
                <User className="w-5 h-5" strokeWidth={2} />
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

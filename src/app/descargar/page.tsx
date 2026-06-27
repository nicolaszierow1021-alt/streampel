'use client';

import { Play, Download } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function DownloadContent() {
  const searchParams = useSearchParams();
  const link = searchParams.get('link');
  const [downloadReady, setDownloadReady] = useState(false);

  useEffect(() => {
    // Small delay to simulate link preparation (optional, adds to the "Tu enlace está preparado" feel)
    const timer = setTimeout(() => {
      setDownloadReady(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleDownload = () => {
    if (link) {
      window.location.href = link;
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d11] flex items-center justify-center p-4">
      <div className="bg-[#141418] rounded-xl w-full max-w-2xl border border-white/10 shadow-2xl p-10 flex flex-col items-center justify-center text-center relative animate-fade-in">
        <button 
          onClick={() => window.close()} 
          className="absolute top-6 right-6 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white p-2 rounded-full transition-colors"
          title="Cerrar pestaña"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
        
        <div className="w-20 h-20 rounded-2xl bg-[#e50914]/10 border border-[#e50914]/20 flex items-center justify-center mb-6">
          <Download className="text-[#e50914]" size={32} />
        </div>
        
        <h2 className="text-3xl font-black text-white mb-4">Listo para descargar</h2>
        <p className="text-gray-400 mb-8 max-w-md">Tu enlace está preparado. Haz clic para iniciar la descarga.</p>
        
        <button 
          onClick={handleDownload}
          disabled={!downloadReady || !link}
          className={`bg-[#e50914] hover:bg-[#b80710] text-white font-bold text-lg py-4 px-12 rounded-xl flex items-center justify-center gap-3 transition-transform shadow-[0_10px_30px_rgba(229,9,20,0.3)] mb-10 w-full max-w-sm mx-auto ${downloadReady ? 'hover:scale-105' : 'opacity-50 cursor-not-allowed'}`}
        >
          <Download size={24} /> {downloadReady ? 'Iniciar descarga' : 'Preparando...'}
        </button>
        
        <div className="flex items-center justify-center gap-3 text-white font-black text-xl">
          <div className="relative w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#ff2a40] to-[#b30015] shadow-[0_0_20px_rgba(229,9,20,0.4)] flex-shrink-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50 rounded-xl pointer-events-none"></div>
            <Play className="w-6 h-6 text-white fill-white ml-0.5 z-10 drop-shadow-md" />
          </div>
          <div className="flex flex-col uppercase leading-none tracking-tight text-left">
            <span className="text-[20px] font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
              Pelix
            </span>
            <span className="text-[11px] font-bold text-[#e50914] tracking-[0.25em] mt-[4px]">
              Stream
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DescargarPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0d0d11] flex items-center justify-center text-white">Cargando...</div>}>
      <DownloadContent />
    </Suspense>
  );
}

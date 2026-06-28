'use client';

import { useState } from 'react';
import { Download, X, AlertCircle } from 'lucide-react';

interface DownloadLink {
  serverName: string;
  lang?: string;
  url: string;
}

interface PeliculaDownloadsProps {
  downloads: DownloadLink[];
  title: string;
  hasSeasons: boolean;
  seasonLabel?: string;
}

export default function PeliculaDownloads({ downloads, title, hasSeasons, seasonLabel }: PeliculaDownloadsProps) {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  if (downloads.length === 0) return null;

  return (
    <div className="bg-[#141418] rounded-xl border border-white/5 p-6 shadow-xl mt-6 text-center">
      <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-3 text-left">
        Descargas {hasSeasons && seasonLabel ? `(${seasonLabel})` : ''}
      </h3>
      <button 
        onClick={() => setIsDownloadModalOpen(true)}
        className="w-full bg-[#e50914] hover:bg-[#b80710] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-[0_0_15px_rgba(229,9,20,0.3)]"
      >
        <Download size={20} />
        Ver Enlaces de Descarga
      </button>

      {/* Download Modal */}
      {isDownloadModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in text-left">
          <div className="bg-[#141418] rounded-xl w-full max-w-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="flex justify-between items-start p-6 border-b border-white/5 bg-[#1a1a24]">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#e50914]/10 border border-[#e50914]/20 flex items-center justify-center flex-shrink-0">
                  <Download className="text-[#e50914]" size={24} />
                </div>
                <div>
                  <h4 className="text-gray-400 text-xs font-bold tracking-wider uppercase mb-1">Descargar</h4>
                  <h2 className="text-white text-xl font-bold leading-tight">
                    {title}
                    {hasSeasons && seasonLabel ? ` - ${seasonLabel}` : ''}
                  </h2>
                </div>
              </div>
              <button onClick={() => setIsDownloadModalOpen(false)} className="bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white p-2 rounded-full transition-colors flex-shrink-0">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              <div className="space-y-3">
                {downloads.map((link, idx) => (
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
                ))}
              </div>
            </div>
            
            <div className="p-4 border-t border-white/5 bg-[#1a1a24] text-center flex items-center justify-center gap-2 text-gray-500 text-xs">
              <AlertCircle size={14} /> Los enlaces se abren en una pestaña nueva.
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}

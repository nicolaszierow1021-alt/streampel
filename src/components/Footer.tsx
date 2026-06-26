import Link from 'next/link';
import { Play } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 pt-8 pb-12 px-4 md:px-8 border-t border-white/5 bg-[#0d0d11]">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#ff2a40] to-[#b30015] shadow-[0_0_20px_rgba(229,9,20,0.4)] group-hover:shadow-[0_0_25px_rgba(229,9,20,0.6)] group-hover:scale-105 transition-all duration-300 flex-shrink-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50 rounded-xl pointer-events-none"></div>
              <Play className="w-5 h-5 text-white fill-white ml-0.5 z-10 drop-shadow-md" />
            </div>
            <div className="flex flex-col uppercase leading-none tracking-tight text-left">
              <span className="text-[18px] font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                Pelix
              </span>
              <span className="text-[10px] font-bold text-[#e50914] tracking-[0.25em] mt-[3px]">
                Stream
              </span>
            </div>
          </Link>
          <p className="text-sm text-gray-500">
            Películas y series online en español latino.
          </p>
        </div>
        
        <div className="flex gap-6 text-sm text-gray-400 font-medium">
          <Link href="/aviso-legal" className="hover:text-white transition">Aviso Legal</Link>
          <Link href="/dmca" className="hover:text-white transition">DMCA</Link>
          <Link href="/privacidad" className="hover:text-white transition">Política de Privacidad</Link>
          <Link href="/contacto" className="hover:text-white transition">Contacto</Link>
        </div>
      </div>
    </footer>
  );
}

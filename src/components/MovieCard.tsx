import Link from 'next/link';
import { Star } from 'lucide-react';

interface MovieCardProps {
  title: string;
  slug: string;
  imageUrl?: string;
  year?: string;
  type?: string;
  rating?: string;
  colorFrom?: string;
  colorTo?: string;
  rank?: number;
  isGridItem?: boolean;
}

export default function MovieCard({ title, slug, imageUrl, year, type, rating, colorFrom = "from-gray-700", colorTo = "to-gray-900", rank, isGridItem = false }: MovieCardProps) {
  
  if (rank) {
    // Tendencias (hv2-rank)
    return (
      <div className="flex items-end flex-shrink-0 relative snap-start">
        <span 
          className="font-inter font-extrabold leading-[0.72] tracking-[-0.05em] relative z-0 transition-all duration-200 text-[#0c0c0c] hover:text-white hover:[-webkit-text-stroke-color:white] block overflow-hidden h-[0.8em]"
          style={{ 
            fontSize: 'clamp(118px, 12.5vw, 208px)', 
            WebkitTextStroke: '2.5px #d2d2d2',
            marginRight: rank >= 10 ? '-40px' : (rank === 1 ? '-12px' : '-22px')
          }}
        >
          {rank}
        </span>
        <Link href={`/pelicula/${slug}`} className="relative z-10 block aspect-[2/3] rounded-[12px] overflow-hidden bg-[#1c1c21] border border-white/10 transition-transform duration-150 hover:-translate-y-[5px] hover:shadow-[0_16px_34px_rgba(0,0,0,0.55)]" style={{ width: 'clamp(144px, 11.6vw, 186px)' }}>
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${colorFrom} ${colorTo} p-4 flex items-center justify-center text-center`}>
              <span className="text-white font-bold text-sm drop-shadow-md">{title}</span>
            </div>
          )}
        </Link>
      </div>
    );
  }

  // Populares / Others (hv2-card)
  return (
    <div className={isGridItem ? "w-full" : "flex-shrink-0 snap-start"} style={isGridItem ? {} : { width: 'clamp(140px, 11.4vw, 182px)' }}>
      <Link href={`/pelicula/${slug}`} className="relative block aspect-[2/3] rounded-[12px] overflow-hidden bg-[#1c1c21] border border-white/10 transition-transform duration-150 hover:-translate-y-[5px] hover:shadow-[0_16px_34px_rgba(0,0,0,0.55)] group">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${colorFrom} ${colorTo} p-4 flex items-center justify-center text-center`}>
            <span className="text-white font-bold text-sm drop-shadow-md text-center">{title}</span>
          </div>
        )}
      </Link>
      
      {/* Text below poster */}
      <Link href={`/pelicula/${slug}`} className="block text-[15px] font-semibold whitespace-nowrap overflow-hidden text-ellipsis pt-[11px] px-[2px] pb-[3px] text-white hover:text-[#e50914] transition-colors">
        {title}
      </Link>
      <div className="flex items-center gap-[6px] text-[12.5px] text-[#8a8a8a] px-[2px]">
        {rating && (
          <>
            <span className="text-[#e9e9e9] text-[11px] flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" /> {rating}
            </span>
            <span className="opacity-60">·</span>
          </>
        )}
        {year && (
          <>
            <span>{year}</span>
            <span className="opacity-60">·</span>
          </>
        )}
        {type && <span>{type}</span>}
      </div>
    </div>
  );
}

'use client';

import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface CarouselProps {
  title: string;
  viewAllLink?: string;
  children: React.ReactNode;
}

export default function Carousel({ title, viewAllLink, children }: CarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    
    // allow a 1px margin of error for fractional pixel rounding
    setShowLeftArrow(scrollLeft > 1);
    setShowRightArrow(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 1);
  };

  useEffect(() => {
    handleScroll();
    
    // Also re-check on resize
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const { clientWidth } = scrollContainerRef.current;
    
    const scrollAmount = direction === 'left' ? -(clientWidth * 0.8) : (clientWidth * 0.8);
    
    scrollContainerRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative mb-[clamp(24px,2.8vw,40px)] group/carousel">
      <div className="w-full px-4 md:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[clamp(18px,1.55vw,23px)] font-[800] tracking-[-0.01em] text-white">
            {title}
          </h2>
          {viewAllLink && (
            <Link 
              href={viewAllLink} 
              className="inline-flex items-center gap-[5px] text-[13px] font-semibold text-[#cfcfcf] border border-white/10 bg-[#141414] px-[14px] py-[6px] rounded-[30px] transition-colors duration-150 hover:border-[#e50914] hover:text-white"
            >
              Ver todo
              <span className="text-[15px] leading-none">›</span>
            </Link>
          )}
        </div>
      </div>

      <div className="relative w-full">
        {/* Navigation Arrows */}
        {showLeftArrow && (
          <div className="absolute left-0 top-[42%] -translate-y-1/2 w-16 h-full z-30 flex items-center justify-start px-2 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-150 pointer-events-none">
            <button 
              onClick={() => scroll('left')}
              className="w-[44px] h-[44px] rounded-full bg-[rgba(8,8,8,0.72)] border border-[#2c2c2c] text-white flex items-center justify-center cursor-pointer transition-all duration-150 hover:bg-[rgba(28,28,28,0.92)] hover:border-[#e50914] backdrop-blur-[4px] pointer-events-auto shadow-xl"
            >
              <ChevronLeft className="w-[23px] h-[23px]" />
            </button>
          </div>
        )}

        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-[16px] overflow-x-auto px-4 md:px-8 pb-[6px] scroll-smooth no-scrollbar snap-x snap-proximity"
        >
          {children}
        </div>

        {showRightArrow && (
          <div className="absolute right-0 top-[42%] -translate-y-1/2 w-16 h-full z-30 flex items-center justify-end px-2 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-150 pointer-events-none">
            <button 
              onClick={() => scroll('right')}
              className="w-[44px] h-[44px] rounded-full bg-[rgba(8,8,8,0.72)] border border-[#2c2c2c] text-white flex items-center justify-center cursor-pointer transition-all duration-150 hover:bg-[rgba(28,28,28,0.92)] hover:border-[#e50914] backdrop-blur-[4px] pointer-events-auto shadow-xl"
            >
              <ChevronRight className="w-[23px] h-[23px]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

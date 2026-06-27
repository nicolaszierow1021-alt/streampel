'use client';

import { useState } from 'react';
import { Apple, Smartphone, Download, CheckCircle2, Play, Search, ChevronRight, X, Rocket } from 'lucide-react';
import Footer from '@/components/Footer';

export default function DTPAppDownloadPage() {
  const [showModal, setShowModal] = useState(false);

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    const link = document.createElement('a');
    link.href = '/detodopeliculas.apk';
    link.download = 'PelixStream.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const MockPhone = ({ className, screenshot, zIndex, transformClasses, floatDelay = '0s' }: any) => (
    <div 
      className={`absolute ${className} ${zIndex} ${transformClasses} group`}
      style={{ animation: `floating 6s ease-in-out infinite ${floatDelay}` }}
    >
      {/* Phone Case (Carcasa) */}
      <div className="w-[280px] h-[580px] bg-black rounded-[3.5rem] p-3 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9),0_0_30px_rgba(229,9,20,0.15)] relative group-hover:shadow-[0_0_50px_rgba(229,9,20,0.3)] transition-shadow">
        
        {/* Side Buttons */}
        <div className="absolute top-28 -left-1 w-1 h-8 bg-gray-800 rounded-l-md"></div>
        <div className="absolute top-40 -left-1 w-1 h-12 bg-gray-800 rounded-l-md"></div>
        <div className="absolute top-56 -left-1 w-1 h-12 bg-gray-800 rounded-l-md"></div>
        <div className="absolute top-40 -right-1 w-1 h-16 bg-gray-800 rounded-r-md"></div>
        
        {/* The Screen */}
        <div className="w-full h-full bg-[#0d0d11] rounded-[2.8rem] overflow-hidden relative border border-white/5">
          
          {/* Dynamic Island */}
          <div className="absolute top-3 inset-x-0 flex justify-center z-50">
            <div className="w-24 h-7 bg-black rounded-full flex items-center justify-end px-3 shadow-[inset_0_-1px_2px_rgba(255,255,255,0.1)]">
              <div className="w-2 h-2 rounded-full bg-blue-900/40"></div>
            </div>
          </div>

          {/* Glare effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent z-40 pointer-events-none opacity-30 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          {/* Full Screenshot Image */}
          <img src={screenshot} className="w-full h-full object-cover" alt="App Screenshot" />
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#13141c] text-gray-300 font-sans selection:bg-[#e50914] selection:text-white overflow-x-hidden">
      
      <style>{`
        @keyframes floating {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes progressBar {
          0% { width: 0%; }
          70% { width: 100%; }
          100% { width: 100%; }
        }
        @keyframes toggleSwitch {
          0%, 20% { left: 0.125rem; }
          40%, 80% { left: calc(100% - 1.125rem); }
          100% { left: 0.125rem; }
        }
        @keyframes toggleBg {
          0%, 20% { background-color: #374151; box-shadow: none; }
          40%, 80% { background-color: #22c55e; box-shadow: 0 0 10px rgba(34,197,94,0.3); }
          100% { background-color: #374151; box-shadow: none; }
        }
        .animate-progress-bar {
          animation: progressBar 2.5s ease-in-out infinite;
        }
        .animate-toggle-switch {
          animation: toggleSwitch 3s ease-in-out infinite;
        }
        .animate-toggle-bg {
          animation: toggleBg 3s ease-in-out infinite;
        }
      `}</style>

      {/* Custom Minimalist Navbar */}
      <header className="absolute top-0 inset-x-0 h-20 px-4 md:px-8 flex items-center justify-between z-50">
        <div className="flex items-center gap-3 group">
          {/* Main Web Logo inside Navbar */}
          <div className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-[#ff2a40] to-[#b30015] shadow-[0_0_15px_rgba(229,9,20,0.4)] group-hover:shadow-[0_0_20px_rgba(229,9,20,0.6)] flex-shrink-0 overflow-hidden transition-shadow">
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50 rounded-lg pointer-events-none"></div>
            <Play className="w-4 h-4 text-white fill-white ml-0.5 z-10" />
          </div>
          <span className="text-white font-bold text-xl tracking-wide">PelixStream</span>
        </div>
        <button 
          onClick={handleDownload}
          className="bg-[#e50914] hover:bg-[#b30015] text-white font-bold px-4 md:px-6 py-2 rounded-md transition-all shadow-[0_0_15px_rgba(229,9,20,0.4)] hover:shadow-[0_0_25px_rgba(229,9,20,0.6)]"
        >
          Descargar
        </button>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 lg:pt-40 pb-10 lg:pb-20 px-6 md:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between min-h-[90vh]">
        
        {/* Left: Text Content */}
        <div className="w-full lg:w-1/2 z-20 mt-10 lg:mt-0 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
            <div className="w-6 h-px bg-[#e50914]"></div>
            <span className="text-gray-400 text-sm font-bold tracking-widest uppercase">App para Android · Gratis</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] mb-6">
            Todo el cine, <br className="hidden sm:block" />
            en tu <span className="text-[#e50914] drop-shadow-[0_0_20px_rgba(229,9,20,0.4)]">mano.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed">
            Películas, series y anime en una app liviana y directa. Sin registro, sin vueltas: la abres y miras.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-6">
            <button 
              onClick={handleDownload}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-[#e50914] to-[#b30015] text-white hover:from-[#ff1a26] hover:to-[#cc0018] px-8 py-4 rounded-[1rem] font-bold text-lg transition-transform hover:scale-105 shadow-[0_0_20px_rgba(229,9,20,0.4)]"
            >
              <Smartphone className="w-5 h-5" />
              Android
            </button>
            <button 
              onClick={(e) => { e.preventDefault(); setShowModal(true); }}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-black hover:bg-gray-100 px-8 py-4 rounded-[1rem] font-bold text-lg transition-transform hover:scale-105 shadow-xl"
            >
              <Apple className="w-5 h-5 fill-black" />
              iPhone
            </button>
          </div>
          
          <a href="#instalar" className="inline-flex items-center justify-center gap-2 text-gray-400 hover:text-white font-semibold text-base transition-colors mb-8 group">
            Cómo se instala <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          
          <div className="text-xs text-gray-500 font-medium hidden lg:block">
            <span className="text-white font-bold">Versión 1.0.0</span> · Android 6+ · ~6 MB · Android e iPhone
          </div>
        </div>

        {/* Right: Floating Phones */}
        <div className="w-full lg:w-1/2 relative h-[500px] md:h-[650px] mt-12 lg:mt-0 perspective-1000 flex justify-center items-center scale-75 md:scale-90 lg:scale-100 origin-center z-10">
          {/* Back Phone: Details Variant (Mandalorian) */}
          <MockPhone 
            className="right-[5%] lg:right-0 top-6"
            transformClasses="rotate-12 scale-90 opacity-70 hover:opacity-100"
            zIndex="z-10"
            screenshot="/cap2 (2).png"
            floatDelay="0s"
          />
          {/* Main Phone: Home Variant (Toy Story 5) */}
          <MockPhone 
            className="right-[25%] lg:right-28 top-0"
            transformClasses="-rotate-6 scale-100"
            zIndex="z-30"
            screenshot="/cap2 (1).png"
            floatDelay="1s"
          />
        </div>
      </section>

      {/* DTP en Acción */}
      <section className="py-20 md:py-24 px-4 md:px-8 max-w-7xl mx-auto text-center border-t border-white/5 relative overflow-hidden">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
          PelixStream <span className="text-[#e50914] drop-shadow-[0_0_15px_rgba(229,9,20,0.4)]">en acción</span>
        </h2>
        <div className="w-16 h-1 bg-[#e50914] mx-auto mb-6 rounded-full shadow-[0_0_10px_rgba(229,9,20,0.5)]"></div>
        <p className="text-lg md:text-xl text-gray-400 mb-12 md:mb-20 px-4">Una interfaz cuidada, pensada para encontrar y mirar sin distracciones.</p>
        
        {/* Fanned Phones */}
        <div className="relative h-[300px] sm:h-[450px] md:h-[650px] w-full max-w-4xl mx-auto flex justify-center perspective-1000 scale-[0.4] sm:scale-75 md:scale-100 origin-top">
          <MockPhone 
            className="-ml-[350px] top-10"
            transformClasses="-rotate-[20deg] scale-90"
            zIndex="z-10"
            screenshot="/cap2 (2).png"
            floatDelay="0.5s"
          />
          <MockPhone 
            className="ml-[350px] top-10"
            transformClasses="rotate-[20deg] scale-90"
            zIndex="z-10"
            screenshot="/cap2 (2).png"
            floatDelay="1.5s"
          />
          <MockPhone 
            className="top-0"
            transformClasses="rotate-0 scale-100"
            zIndex="z-30"
            screenshot="/cap2 (1).png"
            floatDelay="0s"
          />
        </div>
      </section>

      {/* Listo en un minuto (Steps) */}
      <section id="instalar" className="py-20 md:py-24 px-6 md:px-8 max-w-6xl mx-auto text-center border-t border-white/5 scroll-mt-20">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
          Listo en un <span className="text-[#e50914] drop-shadow-[0_0_15px_rgba(229,9,20,0.4)]">minuto.</span>
        </h2>
        <div className="w-16 h-1 bg-[#e50914] mx-auto mb-6 rounded-full shadow-[0_0_10px_rgba(229,9,20,0.5)]"></div>
        <p className="text-lg md:text-xl text-gray-400 mb-12 md:mb-20">Tres pasos, y solo la primera vez.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 justify-items-center">
          
          {/* Step 1 */}
          <div className="flex flex-col items-center max-w-xs text-center group">
            <div className="w-[200px] h-[400px] bg-[#1a1b22] rounded-[2rem] border-2 border-[#2a2b34] flex flex-col items-center justify-center mb-8 relative shadow-2xl transition-all duration-500 group-hover:-translate-y-4 group-hover:shadow-[0_20px_40px_rgba(229,9,20,0.15)] group-hover:border-white/10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-[#e50914]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center mb-6 relative z-10 group-hover:border-[#e50914] group-hover:bg-[#e50914]/10 transition-colors">
                <Download className="w-5 h-5 text-white group-hover:text-[#e50914] group-hover:animate-bounce transition-colors" />
              </div>
              <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden relative z-10">
                <div className="h-full bg-[#e50914] rounded-full animate-progress-bar"></div>
              </div>
              <span className="text-[10px] text-gray-500 font-bold mt-4 relative z-10">Descargando</span>
            </div>
            <div className="text-[#e50914] text-sm font-black tracking-widest mb-3">PASO 1</div>
            <h3 className="text-2xl font-bold text-white mb-3">Descarga</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Toca Descargar app. Si el navegador avisa, elige descargar de todos modos.</p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center max-w-xs text-center group">
            <div className="w-[200px] h-[400px] bg-[#1a1b22] rounded-[2rem] border-2 border-[#2a2b34] flex flex-col items-center justify-center mb-8 relative shadow-2xl transition-all duration-500 group-hover:-translate-y-4 group-hover:shadow-[0_20px_40px_rgba(229,9,20,0.15)] group-hover:border-white/10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-[#e50914]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="w-28 h-20 bg-[#22232a] rounded-xl border border-white/5 flex flex-col items-center justify-center p-3 relative z-10 group-hover:border-white/20 transition-colors">
                <div className="w-full h-2 bg-white/10 rounded-full mb-2"></div>
                <div className="w-3/4 h-2 bg-white/10 rounded-full mb-4 self-start"></div>
                <div className="w-full flex justify-end">
                  <div className="w-10 h-5 bg-[#374151] rounded-full relative animate-toggle-bg transition-colors duration-300">
                    <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 animate-toggle-switch shadow-sm transition-all duration-300"></div>
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-gray-500 font-bold mt-4 relative z-10">Permitir fuente</span>
            </div>
            <div className="text-[#e50914] text-sm font-black tracking-widest mb-3">PASO 2</div>
            <h3 className="text-2xl font-bold text-white mb-3">Permite la fuente</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Android lo pide una vez. Lo activas y no lo vuelve a preguntar.</p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center max-w-xs text-center group">
            <div className="w-[200px] h-[400px] bg-[#1a1b22] rounded-[2rem] border-2 border-[#2a2b34] flex flex-col items-center justify-center mb-8 relative shadow-2xl transition-all duration-500 group-hover:-translate-y-4 group-hover:shadow-[0_20px_40px_rgba(229,9,20,0.15)] group-hover:border-white/10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-[#e50914]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 group-hover:scale-110 transition-transform duration-500">
                
                {/* Red Web Logo inside Step 3 */}
                <div className="w-16 h-16 bg-[#22232a] rounded-2xl border border-white/10 flex items-center justify-center shadow-lg group-hover:border-[#e50914]/50 group-hover:shadow-[0_0_15px_rgba(229,9,20,0.3)] transition-all overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#ff2a40]/10 to-[#b30015]/10 pointer-events-none group-hover:opacity-100 opacity-50 transition-opacity"></div>
                  <Play className="w-6 h-6 text-[#e50914] fill-[#e50914] ml-1 drop-shadow-md group-hover:scale-110 transition-transform" />
                </div>
                
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#22c55e] rounded-full flex items-center justify-center border-2 border-[#1a1b22] shadow-[0_0_10px_rgba(34,197,94,0.4)] z-20">
                  <CheckCircle2 className="w-4 h-4 text-[#1a1b22]" strokeWidth={3} />
                </div>
              </div>
              <span className="text-[10px] text-gray-500 font-bold mt-6 relative z-10">Instalada</span>
            </div>
            <div className="text-[#e50914] text-sm font-black tracking-widest mb-3">PASO 3</div>
            <h3 className="text-2xl font-bold text-white mb-3">Abre y mira</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Instalas, abres y ya está. Después se actualiza desde la app.</p>
          </div>

        </div>
      </section>
      
      {/* Premium Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-[#0d0d11] border border-white/10 p-8 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_30px_rgba(229,9,20,0.2)] max-w-sm w-full animate-fade-in-up flex flex-col items-center text-center overflow-hidden">
            {/* Background glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#e50914] rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
            
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="w-16 h-16 bg-gradient-to-br from-[#e50914] to-[#b30015] rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(229,9,20,0.4)] relative">
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50 rounded-2xl pointer-events-none"></div>
              <Rocket className="w-8 h-8 text-white fill-white/20" />
            </div>
            
            <h3 className="text-2xl font-black text-white tracking-tight mb-3">¡Próximamente!</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              La aplicación oficial de PelixStream está en fase final de desarrollo y estará disponible muy pronto. ¡Mantente atento!
            </p>
            
            <button 
              onClick={() => setShowModal(false)}
              className="w-full bg-white text-black hover:bg-gray-200 font-bold py-3.5 rounded-xl transition-colors shadow-lg"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}

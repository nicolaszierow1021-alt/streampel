import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AvisoLegalPage() {
  return (
    <main className="min-h-screen bg-[#0d0d11] flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 md:px-8 pt-32 flex-grow max-w-4xl">
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-8">
          Aviso <span className="text-[#e50914]">Legal</span>
        </h1>
        
        <div className="bg-[#141418] border border-white/10 rounded-2xl p-6 md:p-10 text-gray-300 space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-[#e50914]/5 blur-[80px] pointer-events-none" />
          
          <h2 className="text-xl font-bold text-white mb-2">1. Condiciones de uso</h2>
          <p>
            El uso de este sitio web implica la aceptación de los términos y condiciones aquí descritos. PelixStream es un proyecto de demostración (clon) y no aloja ningún archivo de video en sus servidores.
          </p>

          <h2 className="text-xl font-bold text-white mb-2 mt-6">2. Propiedad intelectual</h2>
          <p>
            Todo el contenido mostrado en esta página (como carteles de películas, nombres y datos de series) proviene de la API pública de The Movie Database (TMDB). Los derechos sobre estas obras pertenecen a sus respectivos creadores, productores y distribuidoras.
          </p>
          <p>
            PelixStream no reclama la propiedad de ninguno de los carteles, sinopsis o trailers exhibidos en el sitio.
          </p>

          <h2 className="text-xl font-bold text-white mb-2 mt-6">3. Enlaces externos</h2>
          <p>
            Este sitio web puede contener enlaces a sitios web de terceros o reproductores de video alojados en plataformas externas (como YouTube o servidores de video de terceros). PelixStream no tiene control sobre el contenido ni la disponibilidad de estos sitios y no se hace responsable de los mismos.
          </p>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrivacidadPage() {
  return (
    <main className="min-h-screen bg-[#0d0d11] flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 md:px-8 pt-32 flex-grow max-w-4xl">
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-8">
          Política de <span className="text-[#e50914]">Privacidad</span>
        </h1>
        
        <div className="bg-[#141418] border border-white/10 rounded-2xl p-6 md:p-10 text-gray-300 space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-[#e50914]/5 blur-[80px] pointer-events-none" />
          
          <p>
            El presente documento establece la Política de Privacidad para las aplicaciones web y servicios que ofrece <strong>PelixStream</strong>. Valoramos enormemente su privacidad y nos esforzamos por proteger su información personal.
          </p>

          <h2 className="text-xl font-bold text-white mb-2 mt-6">1. Información que Recopilamos</h2>
          <p>
            Al visitar PelixStream, es posible que recopilemos automáticamente cierta información no identificable personalmente, como el tipo de navegador, sistema operativo y dirección IP, la cual se utiliza únicamente para propósitos estadísticos y para mejorar la experiencia del usuario.
          </p>
          <p>
            Nuestra función de "Mi Lista" utiliza el almacenamiento local de su navegador (Local Storage) para guardar las películas y series que ha seleccionado. Esta información se almacena localmente en su dispositivo y no se envía ni se almacena en nuestros servidores.
          </p>

          <h2 className="text-xl font-bold text-white mb-2 mt-6">2. Uso de Cookies</h2>
          <p>
            Podemos utilizar cookies u otras tecnologías similares para almacenar sus preferencias y optimizar su navegación. Usted puede configurar su navegador para rechazar todas las cookies, sin embargo, es posible que algunas funciones del sitio no funcionen de manera óptima si lo hace.
          </p>

          <h2 className="text-xl font-bold text-white mb-2 mt-6">3. Servicios de Terceros</h2>
          <p>
            Tenga en cuenta que este sitio utiliza la API de <strong>The Movie Database (TMDB)</strong> para obtener carteles e información de las películas y series. Su interacción con este contenido puede estar sujeta a las políticas de privacidad de TMDB.
          </p>
          <p>
            Además, los reproductores de video incrustados son proporcionados por terceros, los cuales pueden recopilar su propia información y tener sus propias políticas de privacidad, sobre las cuales PelixStream no tiene control.
          </p>

          <h2 className="text-xl font-bold text-white mb-2 mt-6">4. Contacto</h2>
          <p>
            Si tiene alguna duda sobre nuestra Política de Privacidad, por favor comuníquese con nosotros a través de nuestra sección de <a href="/contacto" className="text-[#e50914] hover:underline">Contacto</a>.
          </p>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}

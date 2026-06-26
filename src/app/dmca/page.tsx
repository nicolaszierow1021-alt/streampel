import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function DMCAPage() {
  return (
    <main className="min-h-screen bg-[#0d0d11] flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 md:px-8 pt-32 flex-grow max-w-4xl">
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-8">
          Notificación <span className="text-[#e50914]">DMCA</span>
        </h1>
        
        <div className="bg-[#141418] border border-white/10 rounded-2xl p-6 md:p-10 text-gray-300 space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-[#e50914]/5 blur-[80px] pointer-events-none" />
          
          <p>
            En <strong>PelixStream</strong>, respetamos la propiedad intelectual de terceros y nos tomamos muy en serio la Ley de Derechos de Autor de la Era Digital (DMCA, por sus siglas en inglés).
          </p>

          <p>
            Queremos dejar claro que <strong>PelixStream funciona únicamente como un índice y un buscador de enlaces</strong> que ya se encuentran disponibles de manera pública en Internet. No alojamos ningún archivo de video, película, serie o material protegido por derechos de autor en nuestros servidores.
          </p>

          <h2 className="text-xl font-bold text-white mb-2 mt-6">Notificación de Infracción de Derechos de Autor</h2>
          <p>
            Si usted es el titular de los derechos de autor o un agente autorizado, y considera que algún contenido enlazado desde nuestro sitio infringe sus derechos de autor, puede enviar una notificación a nuestra página de <a href="/contacto" className="text-[#e50914] hover:underline">Contacto</a>.
          </p>

          <p>Para que podamos procesar su solicitud de manera efectiva, por favor incluya la siguiente información:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Una firma física o electrónica de la persona autorizada para actuar en nombre del titular de un derecho exclusivo que supuestamente se ha infringido.</li>
            <li>Identificación de la obra u obras protegidas por derechos de autor que se afirma han sido infringidas.</li>
            <li>Identificación del material que se afirma que está infringiendo y que debe ser eliminado o cuyo acceso debe ser inhabilitado, junto con la URL o información suficiente para que podamos localizar dicho material.</li>
            <li>Información razonablemente suficiente para permitirnos contactar al reclamante (nombre, dirección, número de teléfono y correo electrónico).</li>
            <li>Una declaración de que el reclamante cree de buena fe que el uso del material de la manera denunciada no está autorizado por el titular de los derechos de autor, su agente o la ley.</li>
            <li>Una declaración de que la información en la notificación es exacta, y bajo pena de perjurio, que el reclamante está autorizado a actuar en nombre del titular de un derecho exclusivo que supuestamente se ha infringido.</li>
          </ul>

          <p className="mt-4">
            Una vez recibida una notificación válida, procederemos a investigar y a remover el enlace en cuestión lo más rápido posible.
          </p>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}

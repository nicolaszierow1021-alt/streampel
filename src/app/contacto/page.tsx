'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Send, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate sending to Telegram API
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Keep success message visible or redirect, but for now we just show success
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <main className="min-h-screen bg-[#0d0d11] pb-20">
      <Navbar />
      
      <div className="container mx-auto px-4 md:px-8 pt-32 flex flex-col items-center">
        
        <div className="text-center mb-10 max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
            <span className="text-[#e50914]">Contacto</span> Directo
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Si tienes algún problema con un enlace, deseas hacer una petición especial o necesitas soporte técnico, envíanos un mensaje. Se enviará directamente al administrador vía Telegram.
          </p>
        </div>

        <div className="bg-[#141418] border border-white/10 rounded-2xl w-full max-w-xl shadow-2xl p-6 md:p-10 relative overflow-hidden">
          {/* Decorative background glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-[#e50914]/10 blur-[80px] pointer-events-none" />

          {isSuccess ? (
            <div className="py-16 flex flex-col items-center justify-center text-center animate-fade-in relative z-10">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">¡Mensaje Enviado!</h3>
              <p className="text-gray-400 mb-8 max-w-sm">
                Hemos recibido tu mensaje en nuestro Telegram privado correctamente. Te responderemos al correo proporcionado lo antes posible.
              </p>
              <Link 
                href="/"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-8 rounded-full transition-all border border-white/10"
              >
                Volver al Inicio
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tu Nombre</label>
                <input 
                  type="text" 
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#e50914] focus:ring-1 focus:ring-[#e50914] transition-all"
                  placeholder="Ej. Juan Pérez"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Correo Electrónico</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#e50914] focus:ring-1 focus:ring-[#e50914] transition-all"
                  placeholder="tu@correo.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Mensaje</label>
                <textarea 
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#e50914] focus:ring-1 focus:ring-[#e50914] transition-all resize-none"
                  placeholder="Escribe tu mensaje aquí..."
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full mt-8 bg-[#e50914] hover:bg-[#b30710] text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-[0_0_20px_rgba(229,9,20,0.3)] hover:shadow-[0_0_30px_rgba(229,9,20,0.5)] hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>Enviando...</>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Enviar a Telegram
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
      
      <Footer />
    </main>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://pelixstream.store'),
  title: {
    default: "PelixStream | Ver y Descargar Películas y Series Gratis",
    template: "%s | PelixStream"
  },
  description: "Disfruta de las mejores películas y series en español latino. Descarga y mira online gratis en HD desde MEGA, Google Drive y más en PelixStream.",
  keywords: ["películas gratis", "series gratis", "ver películas online", "descargar películas mega", "películas español latino", "series español latino HD", "pelixstream"],
  authors: [{ name: "PelixStream" }],
  creator: "PelixStream",
  publisher: "PelixStream",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://pelixstream.store",
    siteName: "PelixStream",
    title: "PelixStream | Ver y Descargar Películas y Series Gratis en HD",
    description: "Disfruta de las mejores películas y series en español latino. Descarga y mira online gratis en HD desde MEGA, Google Drive y más.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PelixStream | Ver y Descargar Películas y Series Gratis en HD",
    description: "Disfruta de las mejores películas y series en español latino. Descarga y mira online gratis en HD desde MEGA, Google Drive y más.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <BottomNav />
      </body>
    </html>
  );
}

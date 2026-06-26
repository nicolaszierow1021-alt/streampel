import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';

// No cache para asegurar que el SEO siempre esté actualizado si cambia la DB
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // 1. Fetch movie from Supabase by slug
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    return {
      title: 'Película no encontrada | PelixStream',
      description: 'El contenido que buscas no está disponible.',
    };
  }

  // 2. Fetch extra details from TMDB if necessary for a rich description
  // But we have enough in data usually (title, overview, year, imageUrl, type)
  const title = data.title;
  const year = data.year;
  const type = data.type?.toLowerCase() || 'película';
  const overview = data.overview || '';
  const imageUrl = data.imageUrl;

  // 3. Build highly optimized SEO tags
  const seoTitle = `Descargar y Ver ${title} (${year}) Online Latino Gratis | PelixStream`;
  const seoDescription = `Descarga ${title} (${year}) en español latino HD. Mira esta ${type} online gratis sin interrupciones. ${overview.substring(0, 100)}...`;
  const keywords = [
    `descargar ${title}`,
    `ver ${title} online`,
    `${title} español latino`,
    `${title} gratis`,
    `descargar ${title} mega`,
    `${title} completa`,
    `${title} hd`,
    `ver ${type} ${title}`
  ].join(', ');

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: keywords,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: `https://pelixstream.store/pelicula/${slug}`,
      siteName: 'PelixStream',
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 1200,
          alt: `Póster de ${title}`,
        },
      ],
      locale: 'es_ES',
      type: type === 'serie' ? 'video.tv_show' : 'video.movie',
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: [imageUrl],
    },
    alternates: {
      canonical: `https://pelixstream.store/pelicula/${slug}`,
    }
  };
}

export default function MovieLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

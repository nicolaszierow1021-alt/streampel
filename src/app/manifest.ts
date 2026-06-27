import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PelixStream',
    short_name: 'PelixStream',
    description: 'Disfruta de las mejores películas y series en español latino. Descarga y mira online gratis en HD.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/window.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/window.svg',
        sizes: '192x192 512x512',
        type: 'image/svg+xml',
      },
    ],
  }
}

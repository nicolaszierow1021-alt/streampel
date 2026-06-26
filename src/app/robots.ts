import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admincontrol', '/api/'], // Protegemos rutas sensibles
    },
    sitemap: 'https://pelixstream.store/sitemap.xml',
  };
}

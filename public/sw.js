const CACHE_NAME = 'pelixstream-pwa-cache-v2';

self.addEventListener('install', (event) => {
  // Activa el Service Worker inmediatamente
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Reclama el control inmediatamente
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Estrategia Stale-While-Revalidate muy básica o simplemente Network First
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

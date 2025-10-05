
const CACHE_NAME = 'brain-block-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(ASSETS);
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(event.request);
    if (cached) return cached;
    try {
      const res = await fetch(event.request);
      if (event.request.method === 'GET' && new URL(event.request.url).origin === self.location.origin) {
        cache.put(event.request, res.clone());
      };
      return res;
    } catch (e) {
      return cached || Response.error();
    }
  })());
});

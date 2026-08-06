const CACHE_NAME = 'rkd-webapps-cache-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Simple pass-through fetch to satisfy PWA requirements
  event.respondWith(
    fetch(event.request).catch(() => {
      return new Response("Offline mode not fully supported yet.");
    })
  );
});

const CACHE_NAME = 'ivory-cache-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './mobile.css',
  './script.js',
  './post_render_patch.js',
  './STREAMING_CONFIG.js',
  './IMAGES/logoo.png'
];

// Install Event - cache core shell assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching App Shell');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Event
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activated');
  event.waitUntil(self.clients.claim());
});

// Fetch Event - network-first / cache-fallback strategy to satisfy PWA requirements
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache successful responses for local assets
        if (response && response.status === 200 && event.request.url.startsWith(self.location.origin)) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Offline fallback
        return caches.match(event.request);
      })
  );
});

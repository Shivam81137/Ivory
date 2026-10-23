const CACHE_NAME = 'ivory-cache-v7';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './mobile.css',
  './script.js',
  './post_render_patch.js',
  './online_hub.js',
  './STREAMING_CONFIG.js',
  './daily-quote.css',
  './daily-quote.js',
  './quotes-data.js',
  './IMAGES/logoo.png'
];

// Media never goes through the cache: the browser needs to issue Range
// requests against the real file to stream it, and storing whole songs slows
// playback down (and can serve stale/truncated audio later).
const MEDIA_EXTENSIONS = /\.(mp3|m4a|mp4|webm|ogg|oga|wav|flac|aac|opus|mov)(?:$|[?#])/i;

function isMediaRequest(request) {
  if (request.headers.has('range')) return true;
  try {
    return MEDIA_EXTENSIONS.test(new URL(request.url).pathname);
  } catch (e) {
    return false;
  }
}

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

// Activate Event - drop caches from previous versions
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activated');
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch Event - network-first / cache-fallback strategy for the app shell.
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  // Audio/video must reach the network untouched so range streaming works.
  if (isMediaRequest(request)) return;

  // Cross-origin (APIs, artwork, lyrics) is left alone as well.
  let sameOrigin = false;
  try {
    sameOrigin = new URL(request.url).origin === self.location.origin;
  } catch (e) {
    sameOrigin = false;
  }
  if (!sameOrigin) return;

  event.respondWith(
    fetch(request)
      .then(response => {
        // Only successful, non-partial, same-origin shell responses are cached.
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(request, responseToCache))
            .catch(() => {});
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});

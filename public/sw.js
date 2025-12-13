// Service Worker for Job Command Center
// Provides offline capability for the app

const CACHE_NAME = 'job-command-center-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and API calls
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Don't cache API calls (LLM providers, job APIs)
  if (
    url.hostname.includes('openai.com') ||
    url.hostname.includes('anthropic.com') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('localhost:11434') ||
    url.hostname.includes('rapidapi.com') ||
    url.hostname.includes('api.adzuna.com') ||
    url.hostname.includes('data.usajobs.gov')
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return response || fetch(event.request).then((fetchResponse) => {
        // Cache successful responses for static assets
        if (fetchResponse.ok && url.origin === self.location.origin) {
          const responseClone = fetchResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return fetchResponse;
      });
    }).catch(() => {
      // Return offline fallback for navigation requests
      if (event.request.mode === 'navigate') {
        return caches.match('/index.html');
      }
      return new Response('Offline', { status: 503 });
    })
  );
});

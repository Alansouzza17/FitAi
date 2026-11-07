const CACHE = 'fitia-static-v1';
const SHELL = ['/offline.html', '/manifest.webmanifest', '/icons/fitia-192.svg', '/icons/fitia-512.svg'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('fitia-static-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  // Cache only the static app shell. Never cache API calls, Firestore data, user-specific pages, or Gemini responses.
  const isStaticAsset = /\.(?:css|js|mjs|svg|png|webp|woff2?)$/i.test(url.pathname) || url.pathname === '/manifest.webmanifest';
  if (isStaticAsset) {
    event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
      if (response.ok) { const copy = response.clone(); caches.open(CACHE).then(cache => cache.put(request, copy)); }
      return response;
    })));
    return;
  }
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match('/offline.html')));
  }
});

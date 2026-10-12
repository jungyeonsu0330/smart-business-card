const CACHE_NAME = 'cardlink-offline-v3';
const STATIC_ASSETS = [
  './',
  './sample_card.html',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './choi_eunji_qr.png',
  './최은지_명함_QR코드.png',
  './choi_eunji_mobile_pass.svg',
  './tirebank_sample_vcard_qr.png',
  './tirebank_sample_web_qr.png',
  './sample_card.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching all offline assets');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Stale-while-revalidate or cache-first for lightning fast offline load
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached asset immediately, and fetch in background to keep fresh
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
          }
        }).catch(() => {/* Offline fallback */});
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // Fallback for HTML documents to sample_card.html if offline
        if (event.request.mode === 'navigate') {
          return caches.match('./sample_card.html');
        }
      });
    })
  );
});

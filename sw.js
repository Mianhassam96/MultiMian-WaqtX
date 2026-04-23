var CACHE = 'agewise-v5';
var ASSETS = [
  '/AgeWise/',
  '/AgeWise/index.html',
  '/AgeWise/contact.html',
  '/AgeWise/style.css',
  '/AgeWise/index.js',
  '/AgeWise/favicon.svg',
  '/AgeWise/favicon-32.svg',
  '/AgeWise/manifest.json'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(c) { return c.addAll(ASSETS); })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k) { return k !== CACHE; }).map(function(k) { return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

// Network-first strategy: always try network, fall back to cache
self.addEventListener('fetch', function(e) {
  // Only handle GET requests for our own assets
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(function(response) {
      // Update cache with fresh response
      var clone = response.clone();
      caches.open(CACHE).then(function(c) { c.put(e.request, clone); });
      return response;
    }).catch(function() {
      // Network failed — serve from cache
      return caches.match(e.request).then(function(cached) {
        return cached || caches.match('/AgeWise/index.html');
      });
    })
  );
});

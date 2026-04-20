var CACHE = 'agewise-v1';
var ASSETS = [
  '/AgeWise/',
  '/AgeWise/index.html',
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

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return cached || fetch(e.request).catch(function() { return caches.match('/AgeWise/index.html'); });
    })
  );
});

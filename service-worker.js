const CACHE_NAME = 'mybuddy-cache-v1';
const urlsToCache = [
  '/',
  '/splash.html',
  '/login.html',
  '/signup.html',
  '/home.html',
  '/accounts.html',
  '/add-account.html',
  '/add-expenses.html',
  '/add-income.html',
  '/add-goal.html',
  '/expenses.html',
  '/shopping.html',
  '/stats.html',
  '/profile.html',
  '/onboarding.html',
  '/styles.css',
  '/bottom-nav.html',
  '/database.js',
  '/balance-breakdown.js',
  '/stats.js',
  '/manifest.json',
  // Cache all assets
  '/assets/profile.png',
  '/assets/bottle-outline.png',
  '/assets/bottle.png',
  '/assets/water-bottle.png',
 
  
  // Add all your other important pages and assets here
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => {
      return resp || fetch(event.request);
    })
  );
});

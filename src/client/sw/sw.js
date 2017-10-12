importScripts('workbox-sw.js');

const CACHE_NAME = 'cache-v001';
const workbox = new self.WorkboxSW();
self.workbox.logLevel = self.workbox.LOG_LEVEL.verbose;
workbox.precache([
  '/csr/1',
  '/img/frog.png',
  '/main.js',
  '/offline.html',
  '/img/pig.png',
  '/ssr/1',
  '/img/elephant.png',
])

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting())
  console.log('install');
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
  console.log('activate');
});

self.addEventListener('fetch', (event) => {
  console.log('fetch:', event.request.method, event.request.url)
  const reqUrl = new URL(event.request.url)
  const pageTargetUrls = [
    '/csr/2',
    '/ssr/2'
  ]
  const apiTargetUrls = [
    '/api/characters'
  ]
  if (pageTargetUrls.indexOf(reqUrl.pathname) >= 0){
    const fetchRequest = event.request.clone()
    const offlinePageURL = 'http://localhost:3000/offline.html'
    event.respondWith(fetch(fetchRequest).catch(() => {
      return caches.match(offlinePageURL)
    }))
  } 
  else if (reqUrl.pathname === '/api/characters') {
    const fetchRequest = event.request.clone()
    if (fetchRequest.method === 'GET' || fetchRequest.method === 'PUT'){
      event.respondWith(fetch(fetchRequest)
        .then(fetchResponse => {
          const responseForCache = fetchResponse.clone()
          caches.open(CACHE_NAME)
            .then((cache) => {
              console.log("responseForCache")
              console.log(responseForCache)
              console.log(event.request)
              cache.put(event.request.url, responseForCache);
            });
          return fetchResponse
        })
        .catch(() => {
          return caches.match(event.request)
            .then(cacheResponse => {
              return cacheResponse
            })
        }))
    }
  }
});

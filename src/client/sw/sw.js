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
const eventQueue = []

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting())
  console.log('install');
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
  console.log('activate');
});

self.addEventListener('fetch', (event) => {
  const isOnline = navigator.onLine
  const reqUrl = new URL(event.request.url)

  console.log('fetch:', event.request.method, event.request.url)
  console.log('isOnline:', isOnline)
  console.log('eventQueue:', eventQueue)

  // イベントキューの消化
  if (isOnline) {
    eventQueue.forEach(queueRequest => {
      fetch(queueRequest.clone())
        .then(queueResponse => {
          eventQueue.shift()
        })
        .catch(err => {
          console.log(err)
        })
    })
  }

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
  } else if (reqUrl.pathname === '/api/characters') {
    const fetchRequest = event.request.clone()
    if (fetchRequest.method === 'GET' || fetchRequest.method === 'PUT'){
      event.respondWith(fetch(fetchRequest)
        .then(fetchResponse => {
          const responseForCache = fetchResponse.clone()
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request.url, responseForCache);
            });
          return fetchResponse
        })
        .catch(() => {
          // イベントキューに失敗したPUTリクエストを追加
          if (isOnline == false){
            const queueRequest = event.request.clone()
            if (queueRequest.method === 'PUT') {
              eventQueue.push(queueRequest)
              console.log("eventQueue", eventQueue)
            }
          }
          // キャッシュからデータを取得
          return caches.match(event.request)
            .then(cacheResponse => {
              return cacheResponse
            })
        }))
    }
  }
});

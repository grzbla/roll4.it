const precacheName = 'v1';
const runtime = 'runtime';

const precacheUrls = [
  "index.html",

  "js/fluff.js",

  "lib/croppie.min.js",
  "lib/croppie.css",
  "lib/pouchdb.min.js",
  "lib/leaflet.css",
  "lib/leaflet.js",
  "lib/L.TileLayer.PouchDBCached.js"
];

self.addEventListener('install', event =>
{
    event.waitUntil(
        caches.open(precacheName)
        .then(cache => cache.addAll(precacheUrls))
        .then(self.skipWaiting()));
});

self.addEventListener('activate', event =>
{
    const currentCaches = [precacheName, runtime];
    event.waitUntil(
        caches.keys().then(cacheNames =>
        {
            return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
        }).then(cachesToDelete =>
        {
            return Promise.all(cachesToDelete.map(cacheToDelete =>
            {
                return caches.delete(cacheToDelete);
            }));
        }).then(() => self.clients.claim()));
});

function returnCacheResponse(cachedResponse)
{
    // console.log(cachedResponse);
    if (cachedResponse)
    {
        return cachedResponse;
    }

    return caches.open(runtime).then(cache =>
    {
        // console.log(cache);
        return fetch(event.request).then(response =>
        {
            // console.log(response);
            return cache.put(event.request, response.clone()).then(() =>
            {
                // console.log(response);
                return response;
            });
        });
    });
}

self.addEventListener('fetch', event =>
{
    console.log(event.request.url);
    console.log(self.location.origin);

    if (event.request.url == "https://roll4.it/")
    {
        // console.log("poop");
        event.respondWith(caches.match("index.html").then(returnCacheResponse));
    }
    else if (event.request.url.startsWith(self.location.origin))
    {
        event.respondWith(caches.match(event.request).then(returnCacheResponse));
    }
});

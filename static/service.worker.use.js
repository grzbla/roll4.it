var CACHE_NAME = 'This shit is cached bro.';
var shitToCache = ["nothing_here/lib/croppie.css","nothing_here/lib/croppie.min.js","nothing_here/lib/fabric.min.js","nothing_here/lib/L.TileLayer.PouchDBCached.js","nothing_here/lib/leaflet.css","nothing_here/lib/leaflet.js","nothing_here/lib/leaflet.js.map","nothing_here/lib/pouchdb-7.2.1.min.js","nothing_here/lib/pouchdb.upsert.min.js","nothing_here/lib/uuidv4.min.js","nothing_here/js/charsheet.js","nothing_here/js/charsheet.old.js","nothing_here/js/common.js","nothing_here/js/system.js","nothing_here/lib/font-awesome/css/all.min.css","nothing_here/lib/font-awesome/webfonts/fa-brands-400.woff2","nothing_here/lib/font-awesome/webfonts/fa-duotone-900.woff2","nothing_here/lib/font-awesome/webfonts/fa-light-300.woff2","nothing_here/lib/font-awesome/webfonts/fa-regular-400.woff2","nothing_here/lib/font-awesome/webfonts/fa-solid-900.woff2"];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                //console.info('Cache open function ended. Whatever that means.');

                return cache.addAll(shitToCache);
            })
    );
});

self.addEventListener('activate', function(event) {
    console.info("Service worker activated. Just saying, so you won't forget again.\nYes, I copied this shit from somewhere and don't understand it completely.");
});

self.addEventListener('fetch', function(event)
{
    event.respondWith(
        caches.match(event.request)
            .then(function(response)
            {

                if (response)
                {
                    //console.log('Found this shit in cache.', event.request);
                    return response;
                }

                //console.info('No such shit in cache. Getting shit from that shitty server.', event.request);
                return fetch(event.request);
            })
    );
});

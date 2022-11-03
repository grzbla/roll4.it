var CACHE_NAME = 'This shit is cached bro.';
var shitToCache = ["nothing_here/assets/ac.svg","nothing_here/assets/charsheet.html","nothing_here/assets/icon@164.png","nothing_here/assets/proficiency.svg","nothing_here/js/charsheet - Copy.js","nothing_here/js/charsheet.js","nothing_here/js/common.js","nothing_here/js/system.js","nothing_here/lib/croppie.css","nothing_here/lib/croppie.min.js","nothing_here/lib/fabric.min.js","nothing_here/lib/L.TileLayer.PouchDBCached.js","nothing_here/lib/leaflet.css","nothing_here/lib/leaflet.js","nothing_here/lib/leaflet.js.map","nothing_here/lib/pouchdb-7.2.1.min.js","nothing_here/lib/pouchdb.upsert.min.js","nothing_here/lib/uuidv4.min.js","nothing_here/assets/bg/apparel.png","nothing_here/assets/bg/ears.png","nothing_here/assets/bg/feet.png","nothing_here/assets/bg/finger.png","nothing_here/assets/bg/fluff.png","nothing_here/assets/bg/forearms.png","nothing_here/assets/bg/hands.png","nothing_here/assets/bg/head.png","nothing_here/assets/bg/neck.png","nothing_here/assets/bg/portrait.png","nothing_here/assets/bg/shoulders.png","nothing_here/assets/bg/waist.png","nothing_here/assets/bg/weapon.png","nothing_here/assets/bg/wrist.png","nothing_here/assets/fonts/atlas-of-the-magi.regular.ttf","nothing_here/assets/fonts/dreamwood-demo.regular.ttf","nothing_here/assets/fonts/enchanted-land.regular.otf","nothing_here/assets/fonts/fantaisie-artistique.otf","nothing_here/data/5e.tools/deities.json","nothing_here/data/5e.tools/feats.json","nothing_here/data/5e.tools/items-base.json","nothing_here/data/5e.tools/items.json","nothing_here/data/5e.tools/monsterfeatures.json","nothing_here/data/5e.tools/names.json","nothing_here/data/5e.tools/magicvariants.json","nothing_here/data/5e.tools/objects.json","nothing_here/data/5e.tools/optionalfeatures.json","nothing_here/data/5e.tools/psionics.json","nothing_here/data/5e.tools/races.json","nothing_here/data/5e.tools/recipes.json","nothing_here/data/5e.tools/rewards.json","nothing_here/data/5e.tools/skills.json","nothing_here/data/5e.tools/vehicles.json","nothing_here/js/service.worker/install.js","nothing_here/data/5e.tools/class/class-artificer.json","nothing_here/data/5e.tools/class/class-barbarian.json","nothing_here/data/5e.tools/class/class-bard.json","nothing_here/data/5e.tools/class/class-cleric.json","nothing_here/data/5e.tools/class/class-druid.json","nothing_here/data/5e.tools/class/class-fighter.json","nothing_here/data/5e.tools/class/class-generic.json","nothing_here/data/5e.tools/class/class-monk.json","nothing_here/data/5e.tools/class/class-mystic.json","nothing_here/data/5e.tools/class/class-paladin.json","nothing_here/data/5e.tools/class/class-ranger.json","nothing_here/data/5e.tools/class/class-rogue.json","nothing_here/data/5e.tools/class/class-rune-scribe.json","nothing_here/data/5e.tools/class/class-sidekick.json","nothing_here/data/5e.tools/class/class-sorcerer.json","nothing_here/data/5e.tools/class/class-warlock.json","nothing_here/data/5e.tools/class/class-wizard.json","nothing_here/data/5e.tools/class/foundry.json","nothing_here/data/5e.tools/class/index.json","nothing_here/data/5e.tools/fluff/fluff-backgrounds.json","nothing_here/data/5e.tools/fluff/fluff-charcreationoptions.json","nothing_here/data/5e.tools/fluff/fluff-conditionsdiseases.json","nothing_here/data/5e.tools/fluff/fluff-items.json","nothing_here/data/5e.tools/fluff/fluff-languages.json","nothing_here/data/5e.tools/fluff/fluff-races.json","nothing_here/data/5e.tools/fluff/fluff-recipes.json","nothing_here/data/5e.tools/fluff/fluff-vehicles.json","nothing_here/lib/font-awesome/css/all.min.css","nothing_here/lib/font-awesome/webfonts/fa-brands-400.woff2","nothing_here/lib/font-awesome/webfonts/fa-duotone-900.woff2","nothing_here/lib/font-awesome/webfonts/fa-light-300.woff2","nothing_here/lib/font-awesome/webfonts/fa-regular-400.woff2","nothing_here/lib/font-awesome/webfonts/fa-solid-900.woff2"];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.info('Cache open function ended. Whatever that means.');

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
                    console.log('Found this shit in cache.', event.request);
                    return response;
                }

                console.info('No such shit in cache. Getting shit from that shitty server.', event.request);
                return fetch(event.request);
            })
    );
});

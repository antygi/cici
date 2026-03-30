// sw.js

// Zvýšení verze donutí prohlížeč smazat starou cache a stáhnout vše znovu
const CACHE_NAME = 'studywithcici-pwa-v30';

// Kompletní seznam všeho, co aplikace potřebuje k offline běhu
const ASSETS_TO_CACHE = [
    // Základní soubory aplikace
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json',
    './ikona-192.png',
    './ikona-512.png',
    './assets/pozadi_vyska.png?v=25',

    // UI a prostředí
    './assets/pozadi.png',
    './assets/learn_okno.png',
    './assets/comment.png?v=23',
    './assets/obchod_button.png',
    './assets/friends_button.png?v=2',
    './assets/feed_button.png?v=2',
    './assets/trophy_button.png?v=2',
    './assets/notification_button.png?v=23',
    './assets/like_full.png?v=21',
    './assets/like_blank.png?v=21',


    // Skiny
    './assets/skin_default.png',
    './assets/skin_hello-kitty.png',
    './assets/skin_krava.png',
    './assets/skin_cici_mourovata.png',
    './assets/skin_cici_seda.png',
    './assets/skin_cici_negr.png',
    './assets/skin_siamska.png',
    './assets/skin_yuumi.png?v=24',

    // Trika
    './assets/triko_doktor.png',
    './assets/triko_ruzove.png',
    './assets/triko_batman.png',
    './assets/triko_pravnik.png',
    './assets/triko_ujep.png',
    './assets/triko_rytir.png',
    './assets/triko_wishsuperman.png',
    './assets/triko_baletka.png',
    './assets/triko_jinx.png?v=24',
    './assets/triko_spider.png?v=24',

    // Masky
    './assets/maska_gangster.png',
    './assets/maska_batman.png',
    './assets/maska_retard.png',
    './assets/maska_rouska.png',
    './assets/maska_dudlik.png',
    './assets/maska_wishsuperman.png',
    './assets/maska_spider.png?v=24',
    './assets/maska_jinx.png?v=24',

    // Obojky
    './assets/obojek_masle.png',
    './assets/obojek_perlicky.png',
    './assets/obojek_znamka.png',

    // Čepice
    './assets/cepice_hello-kitty.png',
    './assets/cepice_jindra.png',
    './assets/cepice_koruna.png',
    './assets/cepice_carodejnicky_klobouk.png',
    './assets/cepice_kuchar.png',
    './assets/cepice_rytir.png',
    './assets/cepice_kralici_usi.png',
    './assets/cepice_kovboj.png',
    './assets/cepice_jinx.png?v=24',



    // Zvuky
    './assets/zvoneni.mp3'
];

// INSTALACE - stažení nových souborů
self.addEventListener('install', (event) => {
    // TOTO JE KLÍČOVÉ: Donutí nového workera přeskočit frontu
    self.skipWaiting(); 
    
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// AKTIVACE - smazání starých souborů a převzetí kontroly
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // Smaže všechny cache, které se nejmenují jako aktuální CACHE_NAME
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            // TOTO JE KLÍČOVÉ: Okamžitě převezme kontrolu nad všemi otevřenými okny s hrou
            return self.clients.claim();
        })
    );
});


// 3. Fáze FETCH: Zachytávání požadavků při běhu aplikace
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                // Pokud ho najde v cache, vrátí ho okamžitě z offline paměti.
                // Pokud ne, zkusí to normálně stáhnout přes síť.
                return cachedResponse || fetch(event.request);
            })
    );
});

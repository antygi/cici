// sw.js

// Zvýšení verze donutí prohlížeč smazat starou cache a stáhnout vše znovu
const CACHE_NAME = 'studywithcici-pwa-v11';

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

    // UI a prostředí
    './assets/pozadi.png',
    './assets/learn_okno.png',
    './assets/catcoin.png',
    './assets/obchod_button.png',

    // Skiny
    './assets/skin_default.png',
    './assets/skin_hello-kitty.png',
    './assets/skin_krava.png',

    // Trika
    './assets/triko_doktor.png',
    './assets/triko_ruzove.png',

    // Masky
    './assets/maska_gangster.png',

    // Obojky
    './assets/obojek_masle.png',
    './assets/obojek_perlicky.png',

    // Čepice
    './assets/cepice_hello-kitty.png',
    './assets/cepice_jindra.png',
    './assets/cepice_koruna.png',

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

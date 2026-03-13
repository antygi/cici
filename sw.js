// sw.js

// Zvýšení verze donutí prohlížeč smazat starou cache a stáhnout vše znovu
const CACHE_NAME = 'studywithcici-pwa-v2';

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
    './assets/cepice_koruna.png'
];

// 1. Fáze INSTALACE: Service worker se nainstaluje a stáhne soubory do Cache
self.addEventListener('install', event => {
    console.log('[Service Worker] Instalace...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[Service Worker] Ukládám všechny soubory do mezipaměti');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// 2. Fáze AKTIVACE: Promazání staré cache, pokud jsme změnili CACHE_NAME
self.addEventListener('activate', event => {
    console.log('[Service Worker] Aktivace...');
    event.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(keyList.map(key => {
                if (key !== CACHE_NAME) {
                    console.log('[Service Worker] Mažu starou cache', key);
                    return caches.delete(key);
                }
            }));
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
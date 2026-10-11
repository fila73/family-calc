/**
 * Service Worker pro offline běh rodinné kalkulačky
 */

const CACHE_NAME = 'family-calc-v11';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './js/engine/kinship-engine.js',
  './js/engine/gedcom-parser.js',
  './js/i18n/index.js',
  './js/i18n/languages.js',
  './js/i18n/cs.js',
  './js/i18n/sk.js',
  './js/i18n/pl.js',
  './js/i18n/uk.js',
  './js/i18n/hr.js',
  './js/i18n/ru.js',
  './js/i18n/en.js',
  './js/i18n/de.js',
  './js/i18n/nl.js',
  './js/i18n/sv.js',
  './js/i18n/fr.js',
  './js/i18n/it.js',
  './js/i18n/es.js',
  './js/i18n/pt.js',
  './js/i18n/ro.js',
  './js/i18n/hu.js',
  './js/i18n/el.js',
  './js/i18n/tr.js',
  './js/i18n/hi.js',
  './js/i18n/ar.js',
  './js/i18n/zh.js',
  './js/i18n/ja.js',
  './js/i18n/ko.js',
  './js/i18n/vi.js',
  './js/i18n/id.js',
  './manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME) return caches.delete(k);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((networkRes) => {
        if (networkRes && networkRes.status === 200) {
          const resClone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, resClone));
        }
        return networkRes;
      })
      .catch(() => caches.match(e.request))
  );
});

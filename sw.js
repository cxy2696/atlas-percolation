/* Percolation Atlas service worker.
 *
 * Navigations are network-first (fresh content, offline fallback); static
 * assets are stale-while-revalidate.  Content JSON is network-first so a new
 * chapter is visible immediately, while the shell still works offline.
 */
const VERSION = 'atlas-v3.2.0';
const SHELL = [
  './',
  'index.html',
  'assets/css/hud.css',
  'assets/js/app.js',
  'assets/js/theme.js',
  'assets/js/i18n.js',
  'assets/js/content.js',
  'assets/js/lib/plot.js',
  'assets/js/lib/algorithm-guide.js',
  'assets/js/views/algorithms.js',
  'assets/js/views/guide.js',
  'assets/vendor/katex/katex.min.css',
  'assets/vendor/katex/katex.min.js',
  'assets/vendor/katex/contrib/auto-render.min.js',
  'assets/vendor/marked/marked.min.js',
  'assets/icon.svg',
  'manifest.webmanifest',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  const isContent = url.pathname.includes('/content/') || url.pathname.endsWith('.json');
  const isNavigation = req.mode === 'navigate';

  if (isNavigation || isContent) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((cache) => cache.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req).then((hit) => hit || caches.match('index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((hit) => {
      const network = fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((cache) => cache.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => hit);
      return hit || network;
    })
  );
});

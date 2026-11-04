/* global self, caches, fetch, URL, Response */

const CACHE_PREFIX = 'uk-immigration-pwa-';
const CACHE_NAME = `${CACHE_PREFIX}2026-11-04-v2`;
const PAGES = ['/', '/simulate', '/result', '/whatif', '/policy', '/about'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll([
        ...PAGES,
        '/manifest.webmanifest',
        '/icon-192.png',
        '/icon-512.png',
      ]);
      // Initial page assets load before the worker controls the tab.
      const assets = new Set();
      for (const page of PAGES) {
        const html = await (await cache.match(page)).text();
        for (const match of html.matchAll(
          /(?:src|href)="(\/_next\/static\/[^"]+)"/g,
        ))
          assets.add(match[1]);
      }
      await cache.addAll([...assets]);
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names
          .filter(
            (name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME,
          )
          .map((name) => caches.delete(name)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const fallback = async () =>
        (await cache.match(request)) ??
        (request.mode === 'navigate'
          ? await cache.match(url.pathname)
          : undefined);
      try {
        const response = await fetch(request);
        if (response.ok) {
          event.waitUntil(
            cache.put(request, response.clone()).catch(() => {
              // A full cache must not prevent the online response from loading.
            }),
          );
          return response;
        }
        return (await fallback()) ?? response;
      } catch {
        return (await fallback()) ?? Response.error();
      }
    })(),
  );
});

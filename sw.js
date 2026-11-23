// The site moved to immigration-simulator. Remove the old offline cache and
// this service worker, then reload open pages so they follow the redirect.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();
      const pages = await self.clients.matchAll({ type: 'window' });
      pages.forEach((page) => page.navigate(page.url));
    })(),
  );
});

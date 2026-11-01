// The site used to register a service worker for server-side Firebase auth. It no longer does; this version removes
// itself from any browser that still has the old one, so pages load straight from the network again.
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => {
  event.waitUntil(
    self.registration.unregister().then(() => self.clients.matchAll({ type: 'window' }))
      .then((clients) => clients.forEach((client) => client.navigate(client.url)))
  )
})

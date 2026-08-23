self.addEventListener('install', event => { self.skipWaiting(); });
self.addEventListener('activate', event => { event.waitUntil(self.clients.claim()); });

self.addEventListener('push', event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (_) {
    data = { title: 'Strefa Gola', body: event.data ? event.data.text() : 'Nowa informacja' };
  }
  const title = data.title || 'Strefa Gola';
  const options = {
    body: data.body || '',
    icon: data.icon || 'logo.png',
    badge: data.badge || 'logo.png',
    tag: data.tag || 'strefagola',
    data: data.data || { url: './' },
    renotify: !!data.renotify
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification?.data?.url || './';
  event.waitUntil((async () => {
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of clients) {
      if ('focus' in client) {
        await client.focus();
        if ('navigate' in client && url) try { await client.navigate(url); } catch (_) {}
        return;
      }
    }
    if (self.clients.openWindow) await self.clients.openWindow(url);
  })());
});

const CACHE_NAME = "todoflow-v1";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => { e.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", (e) => { e.respondWith(caches.match(e.request).then(r => r || fetch(e.request))); });
self.addEventListener("push", (e) => {
  const { title, body, icon, badge, vibrate, data, actions } = e.data.json();
  const options = { body, icon, badge, vibrate, data, actions,
    requireInteraction: false, tag: "todo-notify" };
  e.waitUntil(self.registration.showNotification(title, options));
});
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  if (e.action === "open") {
    e.waitUntil(clients.matchAll({ type: "window" }).then(clients => {
      if (clients.length) { clients[0].focus(); clients[0].navigate(e.notification.data.url || "/"); }
      else { clients.openWindow(e.notification.data.url || "/"); }
    }));
  }
});
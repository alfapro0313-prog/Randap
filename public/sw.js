/* Randap service worker — PWA o'rnatilishi va offline asosiy sahifa uchun */
const CACHE = "randap-v1";
const CORE = ["/", "/icon-192.png", "/icon-512.png", "/icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(CORE).catch(() => undefined))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // API, video/audio yuklash va boshqa domendan so'rovlar to'g'ridan-to'g'ri tarmoqqa
  if (
    url.origin !== self.location.origin ||
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/uploads/") ||
    req.headers.get("range")
  ) {
    return;
  }
  event.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => undefined);
        return res;
      })
      .catch(() => caches.match(req).then((r) => r || caches.match("/")))
  );
});

/* ---------- Push bildirishnomalar (Telegram uslubi) ---------- */

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { body: event.data ? event.data.text() : "" };
  }
  const title = (data && data.title) || "Randap";
  const options = {
    body: (data && data.body) || "",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    tag: (data && data.tag) || "randap",
    renotify: true,
    vibrate: [100, 50, 100],
    data: { url: (data && data.url) || "/" },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url =
    (event.notification.data && event.notification.data.url) || "/";
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((list) => {
        for (const client of list) {
          if (client.url.indexOf(self.location.origin) === 0) {
            client.navigate(url).catch(() => undefined);
            return client.focus();
          }
        }
        return self.clients.openWindow(url);
      })
  );
});

const CACHE_NAME = "kn-enterprises-v1";
const STATIC_ASSETS = [
  "/",
  "/logo.png",
  "/web-logo.png",
  "/favicon.png",
  "/icon/icon-192.png",
  "/icon/icon-512.png",
  "/manifest.json",
];

// ── Install: pre-cache all static assets ─────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting()),
  );
});

// ── Activate: delete old caches ───────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// ── Fetch: Network-first with cache fallback ──────────────────────────────────
self.addEventListener("fetch", (event) => {
  // Only cache GET requests
  if (event.request.method !== "GET") return;

  let url;
  try {
    url = new URL(event.request.url);
  } catch {
    return;
  }

  // Skip cross-origin requests (CDN fonts, Convex API, etc.)
  if (url.origin !== self.location.origin) return;

  // Skip auth callback paths — never cache these
  if (url.pathname.startsWith("/auth")) return;

  // Skip Convex API calls
  if (url.pathname.startsWith("/api")) return;

  // Navigation requests: serve cached shell on offline
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match("/")),
    );
    return;
  }

  // Network-first for all other same-origin GET requests
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Only cache successful responses
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request)),
  );
});

// ── Push Notifications ────────────────────────────────────────────────────────
self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {};
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      const isAppInFocus = clientList.some((client) => client.focused);
      if (!isAppInFocus) {
        return self.registration.showNotification(data.title ?? "K&N Enterprises", {
          body: data.body,
          icon: "/icon/icon-192.png",
          badge: "/icon/icon-192.png",
          ...data.options,
        });
      }
    }),
  );
});

// ── Notification Click ────────────────────────────────────────────────────────
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow("/");
    }),
  );
});

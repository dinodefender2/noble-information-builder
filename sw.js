/* Noble Information Builder — offline cache.
   Same-origin files only. Calls to api.anthropic.com are never touched or cached.
   Bump VERSION whenever any app file changes so installed copies pick up the update. */
const VERSION = "nib-2026-10-20a";
const SHELL = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
  "icons/apple-touch-icon.png",
  "vendor/pdf.min.js",
  "vendor/pdf.worker.min.js",
  "vendor/mammoth.browser.min.js",
  "vendor/jspdf.umd.min.js",
  "vendor/docx.umd.js",
  "vendor/AlexBrush.ttf",
  "vendor/public-sans-latin-400-normal.woff2",
  "vendor/public-sans-latin-500-normal.woff2",
  "vendor/public-sans-latin-600-normal.woff2",
  "vendor/public-sans-latin-700-normal.woff2"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // The page itself: try the network first so updates arrive, fall back to the cached copy offline.
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then(res => { const copy = res.clone(); caches.open(VERSION).then(c => c.put("index.html", copy)); return res; })
        .catch(() => caches.match("index.html"))
    );
    return;
  }

  // Libraries, fonts, icons: cache first.
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
      return res;
    }))
  );
});

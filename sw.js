/* BizCard service worker
   - Sayfa dosyaları önbelleğe alınır, uygulama çevrimdışı da açılır.
   - Webhook istekleri (n8n: toplantı formu, sohbet) ASLA önbelleğe alınmaz:
     yalnızca GET istekleri, yalnızca bu site ve jsDelivr CDN'i ele alınır.
   Dosyaları değiştirdiğinizde CACHE sürümünü artırın. */
const CACHE = "bizcard-v1";
const CDN = "https://cdn.jsdelivr.net";

const SHELL = [
  "./",
  "index.html",
  "index-react.html",
  "gizlilik-politikasi.html",
  "kvkk-aydinlatma-metni.html",
  "manifest.webmanifest",
  "bizcard-design-system/tokens.css",
  "bizcard-design-system/bizcard.css",
  "icons/icon-192.png",
  "icons/icon-512.png",
  // index-react.html'in kullandığı CDN dosyaları (sürümler oradakiyle aynı olmalı)
  `${CDN}/npm/react@18.3.1/umd/react.production.min.js`,
  `${CDN}/npm/react-dom@18.3.1/umd/react-dom.production.min.js`,
  `${CDN}/npm/@babel/standalone@7.26.4/babel.min.js`,
  `${CDN}/npm/qrcode-generator@1.4.4/qrcode.js`
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function shouldHandle(request) {
  if (request.method !== "GET") return false;            // webhook'lar POST
  const url = new URL(request.url);
  if (/\/webhook(-test)?\//.test(url.pathname)) return false; // n8n webhook adresleri
  return url.origin === self.location.origin || url.origin === CDN;
}

self.addEventListener("fetch", event => {
  const { request } = event;
  if (!shouldHandle(request)) return; // tarayıcı normal şekilde ağa gider

  // Sayfalar: önce ağ (güncel içerik), ağ yoksa önbellek
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(res => {
          if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(request, copy)); }
          return res;
        })
        .catch(() => caches.match(request).then(r => r || caches.match("./")))
    );
    return;
  }

  // Diğer dosyalar: önbellekten hemen ver, arkada güncelle
  event.respondWith(
    caches.match(request).then(cached => {
      const network = fetch(request)
        .then(res => {
          if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(request, copy)); }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});

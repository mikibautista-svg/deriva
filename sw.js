var CACHE_NAME = "deriva-v3";
var ASSETS = [
  "./", "./index.html", "./manifest.json", "./icon.svg",
  "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png"
];

self.addEventListener("install", function(event){
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){ return cache.addAll(ASSETS); })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k !== CACHE_NAME; }).map(function(k){ return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

// Red primero: si hay conexión, sirve siempre la versión más reciente (y la
// deja en caché). Si falla (sin conexión), cae a la última copia guardada.
// Así el juego se actualiza solo en cuanto hay red, y sigue funcionando
// offline con lo último que se llegó a descargar.
self.addEventListener("fetch", function(event){
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request).then(function(response){
      var copy = response.clone();
      caches.open(CACHE_NAME).then(function(cache){ cache.put(event.request, copy); });
      return response;
    }).catch(function(){
      return caches.match(event.request);
    })
  );
});

const staticCacheName = 'static-cache-v4';
const dynamicCacheName = 'dynamic-cache-v1';
const assets = [
    '/',
    '/index.html',
    '/images/icon-192.png',
    '/favicon.ico',
    '/pages/fallback.html'
];

self.addEventListener('install', event => {
    console.log('Service Worker has been installed.');
    event.waitUntil(
        caches.open(staticCacheName)
        .then(cache => {
            console.log('caching assets');
            return cache.addAll(assets);
        })
    );
})

self.addEventListener('activate', event =>{
    console.log('Service Worker has been activated.');
    event.waitUntil(
        caches.keys().then(keys => {
            console.log(keys);
            return Promise.all(keys
                .filter(key => key !== staticCacheName && key !== dynamicCacheName)
                .map(key => caches.delete(key)))
        })
    )
});


self.addEventListener('fetch', event =>{
    event.respondWith(caches.match(event.request)
    .then(cachedResponse => {
        return cachedResponse || fetch(event.request).then(fetchResponse =>{
            return caches.open(dynamicCacheName).then(cache =>{
                cache.put(event.request.url, fetchResponse.clone());
                return fetchResponse;
            })
        }); 
    }).catch(() => {
        if(event.request.url.endsWith('.html')){
            caches.match('/pages/fallback.html');
        }
    })
    );
})
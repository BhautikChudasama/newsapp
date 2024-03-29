
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js');

if (workbox) {
    workbox.googleAnalytics.initialize();
    workbox.precaching.precacheAndRoute([]);
    workbox.routing.registerRoute(
        /^https:\/\/fonts\.googleapis\.com/,
        workbox.strategies.staleWhileRevalidate({
            cacheName: 'google-fonts'
        })
    )
    workbox.routing.registerRoute(
        /^https:\/\/storage\.googleapis\.com\/firetestondiwali\.appspot\.com/,
         workbox.strategies.cacheFirst({
             cacheName: 'img',
             plugins: [
                 new workbox.expiration.Plugin({
                     maxEntries: 60,
                     maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
                 }),
             ],
         }),
    )

} else {
    console.log(`😬 UH!`);
}

self.addEventListener('message', (event) => {
    if (!event.data) {
        return;
    }

    switch (event.data) {
        case 'skipWaiting':
            self.skipWaiting();
            break;
        default:
            break;
    }
});



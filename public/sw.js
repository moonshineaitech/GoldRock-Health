/**
 * Service Worker for Push Notifications
 * Handles push events, notification clicks, and cache management
 */

const CACHE_NAME = 'goldrock-v1';
const urlsToCache = [
  '/',
  '/index.html',
];

// Install event - cache initial resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Push event - handle incoming push notifications
self.addEventListener('push', (event) => {
  let data = {
    title: 'GoldRock Health',
    body: 'You have a new notification',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/icon-192.png',
    badge: data.badge || '/badge-72.png',
    vibrate: [200, 100, 200],
    data: data.data || {},
    actions: data.actions || [],
    requireInteraction: false,
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click event - handle user interaction
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if a window is already open
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // Open new window if none found
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached response if found
        if (response) {
          return response;
        }
        // Otherwise fetch from network
        return fetch(event.request).then((response) => {
          // Don't cache non-GET requests or non-ok responses
          if (event.request.method !== 'GET' || !response || response.status !== 200) {
            return response;
          }

          // Clone the response for caching
          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        });
      })
      .catch(() => {
        // Return a basic offline response for failed navigation requests
        if (event.request.mode === 'navigate') {
          return new Response(
            '<html><body><h1>Offline</h1><p>You are currently offline. Please check your connection.</p></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        }
        // For other requests, return a generic error response
        return new Response('Network error', {
          status: 503,
          statusText: 'Service Unavailable',
        });
      })
  );
});

// Background sync event - sync queued actions when online
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-bills') {
    event.waitUntil(
      fetch('/api/sync')
        .then(response => response.json())
        .then(data => {
          // Notify client of successful sync
          return self.registration.showNotification('Sync Complete', {
            body: `${data.syncedCount} items synced successfully`,
            icon: '/icon-192.png',
          });
        })
        .catch(err => {
          console.error('Background sync failed:', err);
        })
    );
  }
});

// Message event - handle messages from client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});

// Enhanced Service Worker with Offline Support
const CACHE_NAME = 'catatdiGW-v2.0.0'
const STATIC_CACHE = 'static-v2'
const DYNAMIC_CACHE = 'dynamic-v2'
const OFFLINE_CACHE = 'offline-v2'

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/catatdigw.png',
  '/catatdigw.webp'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE && cacheName !== OFFLINE_CACHE) {
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => self.clients.claim())
  )
})

// Background sync for offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-offline-data') {
    event.waitUntil(syncOfflineData())
  }
})

// Sync offline data when back online
async function syncOfflineData() {
  try {
    // Notify all clients to sync their offline data
    const clients = await self.clients.matchAll()
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_OFFLINE_DATA'
      })
    })
  } catch (error) {
    console.error('Background sync failed:', error)
  }
}

// Fetch event - enhanced offline support
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests for API calls (let them fail gracefully)
  if (request.method !== 'GET' && url.pathname.startsWith('/api/')) {
    return
  }

  // Handle navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone()
            caches.open(DYNAMIC_CACHE).then(cache => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
        .catch(() => {
          // Return cached version or offline page
          return caches.match('/')
            .then(response => response || new Response(
              '<html><body><h1>Offline</h1><p>Please check your internet connection.</p></body></html>',
              { headers: { 'Content-Type': 'text/html' } }
            ))
        })
    )
    return
  }

  // Handle static assets
  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.match(request)
        .then(response => response || fetch(request))
    )
    return
  }

  // Handle API calls and other requests
  event.respondWith(
    fetch(request)
      .then(response => {
        // Cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone()
          caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(request, responseClone)
          })
        }
        return response
      })
      .catch(() => {
        // Return cached response if available
        return caches.match(request)
          .then(response => {
            if (response) {
              return response
            }
            
            // For API calls, return a generic offline response
            if (url.pathname.startsWith('/api/')) {
              return new Response(
                JSON.stringify({ 
                  error: 'Offline', 
                  message: 'This request will be synced when you\'re back online' 
                }),
                { 
                  status: 503,
                  headers: { 'Content-Type': 'application/json' }
                }
              )
            }
            
            return null
          })
      })
  )
})

// Handle push notifications (for future use)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: '/catatdigw.png',
      badge: '/catatdigw.png',
      tag: 'catatdiGW-notification',
      data: data.data
    }
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  event.waitUntil(
    clients.openWindow('/')
  )
})

// Message handler for communication with main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

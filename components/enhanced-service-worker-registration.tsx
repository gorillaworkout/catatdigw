"use client"

import { useEffect } from "react"

export function EnhancedServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // Register enhanced service worker
      navigator.serviceWorker
        .register("/sw-offline.js", { scope: "/" })
        .then((registration) => {
          console.log("Enhanced Service Worker registered successfully:", registration.scope)
          
          // Check for updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  // New content is available, refresh the page
                  if (confirm("Update tersedia! Refresh halaman untuk mendapatkan versi terbaru?")) {
                    window.location.reload()
                  }
                }
              })
            }
          })

          // Listen for background sync messages
          navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'SYNC_OFFLINE_DATA') {
              // Trigger sync in the main thread
              window.dispatchEvent(new CustomEvent('sync-offline-data'))
            }
          })
        })
        .catch((error) => {
          console.error("Enhanced Service Worker registration failed:", error)
          // Fallback to regular service worker
          navigator.serviceWorker
            .register("/sw.js", { scope: "/" })
            .then((registration) => {
              console.log("Fallback Service Worker registered:", registration.scope)
            })
            .catch((fallbackError) => {
              console.error("Fallback Service Worker registration failed:", fallbackError)
            })
        })

      // Handle service worker updates
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        window.location.reload()
      })

      // Register for background sync
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        navigator.serviceWorker.ready.then((registration) => {
          // Register for background sync
          return registration.sync.register('sync-offline-data')
        }).catch((error) => {
          console.log('Background sync registration failed:', error)
        })
      }
    }
  }, [])

  return null
}

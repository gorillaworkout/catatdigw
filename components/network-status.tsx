"use client"

import { useState, useEffect } from "react"
import { Wifi, WifiOff, CheckCircle, AlertCircle, X } from "lucide-react"
import { offlineSync } from "@/lib/offline-sync"
import { useAuth } from "@/hooks/use-auth"

export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [pendingCount, setPendingCount] = useState(0)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [notificationType, setNotificationType] = useState<"success" | "warning" | "info">("info")
  const [previousOnlineState, setPreviousOnlineState] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    // Set initial state
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine)
      setPreviousOnlineState(navigator.onLine)
    }

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true)
      if (!previousOnlineState) {
        setNotificationMessage("Koneksi internet kembali! Data akan disinkronkan otomatis.")
        setNotificationType("success")
        setShowNotification(true)
        setTimeout(() => setShowNotification(false), 5000)
      }
      setPreviousOnlineState(true)
    }

    const handleOffline = () => {
      setIsOnline(false)
      if (previousOnlineState) {
        setNotificationMessage("Tidak ada koneksi internet. Aplikasi tetap bisa digunakan offline!")
        setNotificationType("warning")
        setShowNotification(true)
        setTimeout(() => setShowNotification(false), 5000)
      }
      setPreviousOnlineState(false)
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)
    }

    // Check pending count periodically
    const checkPendingCount = async () => {
      if (user) {
        const count = await offlineSync.getPendingCount(user.uid)
        setPendingCount(count)
      }
    }

    checkPendingCount()
    const interval = setInterval(checkPendingCount, 5000)

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
      }
      clearInterval(interval)
    }
  }, [user, previousOnlineState])

  if (!user) return null

  return (
    <>
      {/* Network Status Indicator */}
      <div className="fixed top-16 left-4 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-border rounded-lg px-3 py-2 shadow-lg">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
          {isOnline ? (
            <Wifi className="w-4 h-4 text-green-500" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-500" />
          )}
          {pendingCount > 0 && (
            <span className="text-xs text-yellow-500 font-medium">
              {pendingCount} pending
            </span>
          )}
          {!isOnline && (
            <span className="text-xs text-red-500 font-medium">
              Offline
            </span>
          )}
        </div>
      </div>

      {/* Notification Toast */}
      {showNotification && (
        <div className="fixed top-20 right-4 z-50 max-w-sm">
          <div className={`bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-lg px-4 py-3 shadow-lg ${
            notificationType === 'success' ? 'border-green-500/50' : 
            notificationType === 'warning' ? 'border-yellow-500/50' : 
            'border-blue-500/50'
          }`}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {notificationType === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                {notificationType === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-500" />}
                {notificationType === 'info' && <AlertCircle className="w-5 h-5 text-blue-500" />}
              </div>
              <div className="flex-1">
                <p className="text-sm text-foreground font-medium">
                  {notificationMessage}
                </p>
              </div>
              <button
                onClick={() => setShowNotification(false)}
                className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

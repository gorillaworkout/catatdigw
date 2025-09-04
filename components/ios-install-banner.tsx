"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Download, Share } from "lucide-react"

export function IOSInstallBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(iOS)

    // Detect if already installed (standalone mode)
    const standalone = window.matchMedia("(display-mode: standalone)").matches || 
                      (window.navigator as any).standalone === true
    setIsStandalone(standalone)

    // Show banner for iOS if not standalone and not dismissed
    if (iOS && !standalone) {
      const dismissed = localStorage.getItem('ios-install-banner-dismissed')
      if (!dismissed) {
        setShowBanner(true)
      }
    }
  }, [])

  const handleDismiss = () => {
    setShowBanner(false)
    localStorage.setItem('ios-install-banner-dismissed', 'true')
  }

  if (!showBanner || !isIOS || isStandalone) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Download className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">Install catatdiGW</p>
              <p className="text-xs opacity-90">
                Tap <Share className="w-3 h-3 inline mx-1" /> Share → "Add to Home Screen"
              </p>
            </div>
          </div>
          <Button
            onClick={handleDismiss}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-1 h-auto"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

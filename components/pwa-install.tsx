"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, Share, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstall, setShowInstall] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(iOS)

    // Detect if already installed (standalone mode)
    const standalone = window.matchMedia("(display-mode: standalone)").matches || 
                      (window.navigator as any).standalone === true
    setIsStandalone(standalone)

    // Handle beforeinstallprompt for Android
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowInstall(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setDeferredPrompt(null)
      setShowInstall(false)
    }
  }

  // Don't show if already installed
  if (isStandalone) return null

  // Show install button for Android
  if (deferredPrompt && !isIOS) {
    return (
      <Button
        onClick={handleInstall}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50 bg-card border-border shadow-lg"
      >
        <Download className="w-4 h-4 mr-2" />
        Install App
      </Button>
    )
  }

  // Show install instructions for iOS
  if (isIOS && !isStandalone) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="fixed bottom-4 right-4 z-50 bg-card border-border shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Install App
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Install catatdiGW
            </DialogTitle>
            <DialogDescription>
              Install aplikasi ini di iPhone Anda untuk akses yang lebih mudah
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <p className="font-medium">Tap tombol Share</p>
                <p className="text-sm text-muted-foreground">
                  Di bagian bawah layar, tap tombol <Share className="w-4 h-4 inline mx-1" /> Share
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <p className="font-medium">Pilih "Add to Home Screen"</p>
                <p className="text-sm text-muted-foreground">
                  Scroll ke bawah dan pilih "Add to Home Screen"
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <p className="font-medium">Tap "Add"</p>
                <p className="text-sm text-muted-foreground">
                  Konfirmasi dengan tap "Add" di pojok kanan atas
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Tips:</strong> Setelah diinstall, aplikasi akan muncul di home screen dan bisa dibuka seperti aplikasi native lainnya.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return null
}

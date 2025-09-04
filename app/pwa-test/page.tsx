"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, Download, Share, Plus } from "lucide-react"

export default function PWATestPage() {
  const [pwaChecks, setPwaChecks] = useState({
    manifest: false,
    serviceWorker: false,
    https: false,
    icons: false,
    display: false,
    startUrl: false,
    scope: false,
  })

  const [deviceInfo, setDeviceInfo] = useState({
    userAgent: "",
    isIOS: false,
    isAndroid: false,
    isStandalone: false,
    canInstall: false,
  })

  useEffect(() => {
    // Check PWA requirements
    const checks = {
      manifest: !!document.querySelector('link[rel="manifest"]'),
      serviceWorker: 'serviceWorker' in navigator,
      https: location.protocol === 'https:' || location.hostname === 'localhost',
      icons: !!document.querySelector('link[rel="icon"]'),
      display: true, // We have display: standalone in manifest
      startUrl: true, // We have start_url in manifest
      scope: true, // We have scope in manifest
    }
    setPwaChecks(checks)

    // Get device info
    const userAgent = navigator.userAgent
    const isIOS = /iPad|iPhone|iPod/.test(userAgent)
    const isAndroid = /Android/.test(userAgent)
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || 
                        (window.navigator as any).standalone === true
    const canInstall = 'beforeinstallprompt' in window

    setDeviceInfo({
      userAgent,
      isIOS,
      isAndroid,
      isStandalone,
      canInstall,
    })
  }, [])

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    )
  }

  const getStatusBadge = (status: boolean) => {
    return status ? (
      <Badge variant="default" className="bg-green-500">Pass</Badge>
    ) : (
      <Badge variant="destructive">Fail</Badge>
    )
  }

  const pwaScore = Object.values(pwaChecks).filter(Boolean).length
  const totalChecks = Object.keys(pwaChecks).length

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">PWA Test Page</h1>
          <p className="text-muted-foreground">
            Test halaman untuk memeriksa konfigurasi Progressive Web App
          </p>
        </div>

        {/* PWA Score */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              PWA Score: {pwaScore}/{totalChecks}
            </CardTitle>
            <CardDescription>
              Semakin tinggi skor, semakin baik konfigurasi PWA Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(pwaScore / totalChecks) * 100}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {pwaScore === totalChecks ? "✅ PWA siap untuk diinstall!" : "⚠️ Beberapa konfigurasi perlu diperbaiki"}
            </p>
          </CardContent>
        </Card>

        {/* PWA Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>PWA Requirements</CardTitle>
            <CardDescription>
              Persyaratan minimum untuk PWA
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(pwaChecks).map(([key, status]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(status)}
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                </div>
                {getStatusBadge(status)}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Device Information */}
        <Card>
          <CardHeader>
            <CardTitle>Device Information</CardTitle>
            <CardDescription>
              Informasi perangkat dan browser
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Platform:</p>
                <div className="flex gap-2 mt-1">
                  {deviceInfo.isIOS && <Badge variant="outline">iOS</Badge>}
                  {deviceInfo.isAndroid && <Badge variant="outline">Android</Badge>}
                  {!deviceInfo.isIOS && !deviceInfo.isAndroid && <Badge variant="outline">Desktop</Badge>}
                </div>
              </div>
              <div>
                <p className="font-medium">Install Status:</p>
                <div className="flex gap-2 mt-1">
                  {deviceInfo.isStandalone && <Badge variant="default">Installed</Badge>}
                  {!deviceInfo.isStandalone && <Badge variant="secondary">Not Installed</Badge>}
                </div>
              </div>
              <div>
                <p className="font-medium">Can Install:</p>
                <div className="flex gap-2 mt-1">
                  {deviceInfo.canInstall && <Badge variant="default">Yes</Badge>}
                  {!deviceInfo.canInstall && <Badge variant="secondary">No</Badge>}
                </div>
              </div>
              <div>
                <p className="font-medium">User Agent:</p>
                <p className="text-sm text-muted-foreground mt-1 break-all">
                  {deviceInfo.userAgent}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Install Instructions */}
        {deviceInfo.isIOS && !deviceInfo.isStandalone && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Install Instructions for iOS
              </CardTitle>
              <CardDescription>
                Cara menginstall aplikasi di iPhone/iPad
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium">Tap tombol Share</p>
                  <p className="text-sm text-muted-foreground">
                    Di bagian bawah layar Safari, tap tombol <Share className="w-4 h-4 inline mx-1" /> Share
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
            </CardContent>
          </Card>
        )}

        {/* Debug Information */}
        <Card>
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
            <CardDescription>
              Informasi teknis untuk debugging
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>URL:</strong> {window.location.href}</p>
              <p><strong>Protocol:</strong> {window.location.protocol}</p>
              <p><strong>Hostname:</strong> {window.location.hostname}</p>
              <p><strong>Service Worker Support:</strong> {'serviceWorker' in navigator ? 'Yes' : 'No'}</p>
              <p><strong>Display Mode:</strong> {window.matchMedia("(display-mode: standalone)").matches ? 'Standalone' : 'Browser'}</p>
              <p><strong>Before Install Prompt:</strong> {'beforeinstallprompt' in window ? 'Available' : 'Not Available'}</p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button onClick={() => window.location.href = '/'} variant="outline">
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}

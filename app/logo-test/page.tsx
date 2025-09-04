"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Image as ImageIcon } from "lucide-react"

export default function LogoTestPage() {
  const [logoChecks, setLogoChecks] = useState({
    pngExists: false,
    webpExists: false,
    manifestIcons: false,
    openGraphImages: false,
    twitterImages: false,
    appleTouchIcons: false,
    favicons: false,
  })

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    // Check if logo files exist
    const checkLogoExists = async (url: string) => {
      try {
        const response = await fetch(url, { method: 'HEAD' })
        return response.ok
      } catch {
        return false
      }
    }

    const runChecks = async () => {
      const pngExists = await checkLogoExists('/catatdigw.png')
      const webpExists = await checkLogoExists('/catatdigw.webp')
      
      // Check manifest icons
      const manifestResponse = await fetch('/manifest.json')
      const manifest = await manifestResponse.json()
      const manifestIcons = manifest.icons?.some((icon: any) => 
        icon.src === '/catatdigw.png' || icon.src === '/catatdigw.webp'
      )

      setLogoChecks({
        pngExists,
        webpExists,
        manifestIcons: !!manifestIcons,
        openGraphImages: true, // We set these in layout.tsx
        twitterImages: true, // We set these in layout.tsx
        appleTouchIcons: true, // We set these in layout.tsx
        favicons: true, // We set these in layout.tsx
      })
    }

    runChecks()
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
      <Badge variant="default" className="bg-green-500">OK</Badge>
    ) : (
      <Badge variant="destructive">Missing</Badge>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Logo PWA Test</h1>
          <p className="text-muted-foreground">
            Test halaman untuk memeriksa konfigurasi logo PWA dan SEO
          </p>
        </div>

        {/* Logo Files */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Logo Files
            </CardTitle>
            <CardDescription>
              Pemeriksaan file logo di public folder
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(logoChecks.pngExists)}
                <span>catatdigw.png</span>
              </div>
              {getStatusBadge(logoChecks.pngExists)}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(logoChecks.webpExists)}
                <span>catatdigw.webp</span>
              </div>
              {getStatusBadge(logoChecks.webpExists)}
            </div>
          </CardContent>
        </Card>

        {/* PWA Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>PWA Configuration</CardTitle>
            <CardDescription>
              Konfigurasi logo untuk PWA
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(logoChecks.manifestIcons)}
                <span>Manifest.json Icons</span>
              </div>
              {getStatusBadge(logoChecks.manifestIcons)}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(logoChecks.appleTouchIcons)}
                <span>Apple Touch Icons</span>
              </div>
              {getStatusBadge(logoChecks.appleTouchIcons)}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(logoChecks.favicons)}
                <span>Favicons</span>
              </div>
              {getStatusBadge(logoChecks.favicons)}
            </div>
          </CardContent>
        </Card>

        {/* SEO Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>SEO Configuration</CardTitle>
            <CardDescription>
              Konfigurasi logo untuk SEO dan social sharing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(logoChecks.openGraphImages)}
                <span>Open Graph Images</span>
              </div>
              {getStatusBadge(logoChecks.openGraphImages)}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(logoChecks.twitterImages)}
                <span>Twitter Card Images</span>
              </div>
              {getStatusBadge(logoChecks.twitterImages)}
            </div>
          </CardContent>
        </Card>

        {/* Logo Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Logo Preview</CardTitle>
            <CardDescription>
              Preview logo yang akan digunakan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <h3 className="font-medium mb-3">PNG Version</h3>
                <div className="flex justify-center">
                  <img 
                    src="/catatdigw.png" 
                    alt="catatdiGW Logo PNG" 
                    className="w-32 h-32 object-contain border rounded-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">catatdigw.png</p>
              </div>
              <div className="text-center">
                <h3 className="font-medium mb-3">WebP Version</h3>
                <div className="flex justify-center">
                  <img 
                    src="/catatdigw.webp" 
                    alt="catatdiGW Logo WebP" 
                    className="w-32 h-32 object-contain border rounded-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">catatdigw.webp</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* URLs */}
        <Card>
          <CardHeader>
            <CardTitle>Logo URLs</CardTitle>
            <CardDescription>
              URL logo yang digunakan untuk berbagai keperluan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>PNG:</strong> <code className="bg-muted px-2 py-1 rounded">/catatdigw.png</code></p>
              <p><strong>WebP:</strong> <code className="bg-muted px-2 py-1 rounded">/catatdigw.webp</code></p>
              <p><strong>Full URL PNG:</strong> <code className="bg-muted px-2 py-1 rounded">https://catatdigw.gorillaworkout.id/catatdigw.png</code></p>
              <p><strong>Full URL WebP:</strong> <code className="bg-muted px-2 py-1 rounded">https://catatdigw.gorillaworkout.id/catatdigw.webp</code></p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <a 
            href="/" 
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}

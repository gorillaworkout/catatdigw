"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, CheckCircle, AlertCircle, Globe, Smartphone } from "lucide-react"

export function DomainDetector() {
  const [domainInfo, setDomainInfo] = useState({
    currentDomain: "",
    userAgent: "",
    isIOS: false,
    isAndroid: false,
    isStandalone: false,
    isLocalhost: false,
  })

  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    const currentDomain = window.location.hostname
    const userAgent = navigator.userAgent
    const isIOS = /iPad|iPhone|iPod/.test(userAgent)
    const isAndroid = /Android/.test(userAgent)
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || 
                        (window.navigator as any).standalone === true
    const isLocalhost = currentDomain === 'localhost' || currentDomain === '127.0.0.1'

    setDomainInfo({
      currentDomain,
      userAgent,
      isIOS,
      isAndroid,
      isStandalone,
      isLocalhost,
    })
  }, [])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const getFirebaseDomains = () => {
    const domains = []
    
    // Production domain
    if (domainInfo.currentDomain === 'catatdigw.gorillaworkout.id') {
      domains.push('catatdigw.gorillaworkout.id')
    }
    
    // Localhost for development
    if (domainInfo.isLocalhost) {
      domains.push('localhost')
      domains.push('127.0.0.1')
    }
    
    // Vercel preview domains
    domains.push('*.vercel.app')
    
    return domains
  }

  const getRequiredDomains = () => {
    const domains = getFirebaseDomains()
    
    // Add specific domains for different environments
    if (domainInfo.isLocalhost) {
      domains.push('localhost:3000')
      domains.push('127.0.0.1:3000')
    }
    
    return domains
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Domain Information
          </CardTitle>
          <CardDescription>
            Informasi domain dan device untuk konfigurasi Firebase
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Current Domain:</p>
              <div className="flex items-center gap-2 mt-1">
                <code className="bg-muted px-2 py-1 rounded text-sm">
                  {domainInfo.currentDomain}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(domainInfo.currentDomain)}
                >
                  {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            
            <div>
              <p className="font-medium">Platform:</p>
              <div className="flex gap-2 mt-1">
                {domainInfo.isIOS && <Badge variant="outline">iOS</Badge>}
                {domainInfo.isAndroid && <Badge variant="outline">Android</Badge>}
                {!domainInfo.isIOS && !domainInfo.isAndroid && <Badge variant="outline">Desktop</Badge>}
                {domainInfo.isStandalone && <Badge variant="default">PWA</Badge>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Firebase Domain Configuration
          </CardTitle>
          <CardDescription>
            Domain yang harus ditambahkan ke Firebase Console
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              🔧 Langkah-langkah:
            </h4>
            <ol className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 list-decimal list-inside">
              <li>Buka <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="underline">Firebase Console</a></li>
              <li>Pilih project "catatdigw-432d4"</li>
              <li>Pergi ke Authentication → Settings</li>
              <li>Scroll ke "Authorized domains"</li>
              <li>Klik "Add domain"</li>
              <li>Tambahkan domain di bawah ini:</li>
            </ol>
          </div>

          <div>
            <h4 className="font-medium mb-3">Domain yang harus ditambahkan:</h4>
            <div className="space-y-2">
              {getRequiredDomains().map((domain, index) => (
                <div key={index} className="flex items-center gap-2">
                  <code className="bg-muted px-3 py-2 rounded text-sm flex-1">
                    {domain}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(domain)}
                  >
                    {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {domainInfo.isIOS && (
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-2">
                <Smartphone className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    📱 Khusus untuk iPhone:
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Pastikan domain <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">catatdigw.gorillaworkout.id</code> sudah ditambahkan ke Firebase Console. 
                    Error "unauthorized domain" biasanya terjadi karena domain belum diizinkan di Firebase.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Debug Information</CardTitle>
          <CardDescription>
            Informasi teknis untuk debugging
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>Full URL:</strong> <code className="bg-muted px-2 py-1 rounded">{typeof window !== 'undefined' ? window.location.href : 'Loading...'}</code></p>
            <p><strong>Protocol:</strong> <code className="bg-muted px-2 py-1 rounded">{typeof window !== 'undefined' ? window.location.protocol : 'Loading...'}</code></p>
            <p><strong>Hostname:</strong> <code className="bg-muted px-2 py-1 rounded">{domainInfo.currentDomain}</code></p>
            <p><strong>User Agent:</strong> <code className="bg-muted px-2 py-1 rounded text-xs break-all">{domainInfo.userAgent}</code></p>
            <p><strong>Display Mode:</strong> <code className="bg-muted px-2 py-1 rounded">{domainInfo.isStandalone ? 'Standalone' : 'Browser'}</code></p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

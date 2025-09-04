"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, RefreshCw, ExternalLink } from "lucide-react"

interface FirebaseErrorDialogProps {
  error: string | null
  onRetry?: () => void
}

export function FirebaseErrorDialog({ error, onRetry }: FirebaseErrorDialogProps) {
  const [open, setOpen] = useState(false)

  if (!error) return null

  const getErrorType = (error: string) => {
    if (error.includes("environment variables")) return "configuration"
    if (error.includes("network")) return "network"
    if (error.includes("popup")) return "popup"
    if (error.includes("too many requests")) return "rate-limit"
    return "general"
  }

  const errorType = getErrorType(error)

  const getErrorIcon = () => {
    switch (errorType) {
      case "configuration":
        return <AlertTriangle className="h-4 w-4" />
      case "network":
        return <RefreshCw className="h-4 w-4" />
      case "popup":
        return <ExternalLink className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getErrorTitle = () => {
    switch (errorType) {
      case "configuration":
        return "Konfigurasi Firebase Error"
      case "network":
        return "Koneksi Jaringan Error"
      case "popup":
        return "Popup Login Error"
      case "rate-limit":
        return "Terlalu Banyak Percobaan"
      default:
        return "Firebase Authentication Error"
    }
  }

  const getErrorDescription = () => {
    switch (errorType) {
      case "configuration":
        return "Environment variables Firebase tidak dikonfigurasi dengan benar. Silakan hubungi administrator atau coba refresh halaman."
      case "network":
        return "Tidak dapat terhubung ke server Firebase. Periksa koneksi internet Anda dan coba lagi."
      case "popup":
        return "Popup login diblokir atau ditutup. Silakan izinkan popup untuk domain ini dan coba lagi."
      case "rate-limit":
        return "Terlalu banyak percobaan login. Silakan tunggu beberapa menit sebelum mencoba lagi."
      default:
        return "Terjadi kesalahan saat melakukan autentikasi. Silakan coba lagi atau hubungi support jika masalah berlanjut."
    }
  }

  const getErrorActions = () => {
    switch (errorType) {
      case "configuration":
        return (
          <div className="flex gap-2">
            <Button onClick={() => window.location.reload()} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Halaman
            </Button>
            <Button onClick={() => setOpen(false)}>
              Tutup
            </Button>
          </div>
        )
      case "network":
        return (
          <div className="flex gap-2">
            {onRetry && (
              <Button onClick={onRetry} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Coba Lagi
              </Button>
            )}
            <Button onClick={() => setOpen(false)}>
              Tutup
            </Button>
          </div>
        )
      case "popup":
        return (
          <div className="flex gap-2">
            {onRetry && (
              <Button onClick={onRetry} variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                Coba Login Lagi
              </Button>
            )}
            <Button onClick={() => setOpen(false)}>
              Tutup
            </Button>
          </div>
        )
      default:
        return (
          <div className="flex gap-2">
            {onRetry && (
              <Button onClick={onRetry} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Coba Lagi
              </Button>
            )}
            <Button onClick={() => setOpen(false)}>
              Tutup
            </Button>
          </div>
        )
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Firebase Error
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getErrorIcon()}
            {getErrorTitle()}
          </DialogTitle>
          <DialogDescription>
            {getErrorDescription()}
          </DialogDescription>
        </DialogHeader>
        
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>Detail Error:</strong> {error}
          </AlertDescription>
        </Alert>

        <div className="flex justify-end">
          {getErrorActions()}
        </div>
      </DialogContent>
    </Dialog>
  )
}

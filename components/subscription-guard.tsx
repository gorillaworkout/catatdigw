"use client"

import { useSubscription } from "@/hooks/use-subscription"
import { LoadingSkeleton } from "./loading-skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock } from "lucide-react"

interface SubscriptionGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  showNotification?: boolean
}

export function SubscriptionGuard({ children, fallback, showNotification = true }: SubscriptionGuardProps) {
  const { isActive, loading } = useSubscription()

  if (loading) {
    return <LoadingSkeleton />
  }

  // Jika subscription tidak aktif, tampilkan fallback atau pesan subscription expired
  if (!isActive) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="space-y-4">
        {showNotification && (
          <Alert variant="destructive" className="border-red-200 bg-red-50">
            <Lock className="h-4 w-4" />
            <AlertDescription className="font-medium">
              Subscription Anda telah berakhir
            </AlertDescription>
            <AlertDescription className="text-sm mt-1">
              Fitur ini memerlukan subscription aktif. Silakan hubungi admin untuk memperpanjang subscription Anda.
            </AlertDescription>
          </Alert>
        )}
      </div>
    )
  }

  return <>{children}</>
}

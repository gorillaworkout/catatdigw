"use client"

import { useSubscription } from "@/hooks/use-subscription"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, X, MessageCircle } from "lucide-react"
import { useState } from "react"
import { config } from "@/lib/config"

export function SubscriptionBanner() {
  const { subscription, isActive, getRemainingDays } = useSubscription()
  const [isDismissed, setIsDismissed] = useState(false)

  const remainingDays = getRemainingDays()

  // Don't show banner if dismissed or subscription is active with more than 3 days remaining
  if (isDismissed || (isActive && remainingDays > 3)) {
    return null
  }

  const handleContactWhatsApp = () => {
    const message = encodeURIComponent(
      `Halo! Saya ingin memperpanjang subscription saya.\n\n` +
      `Detail subscription:\n` +
      `- Status: ${subscription?.status || 'Unknown'}\n` +
      `- Sisa hari: ${remainingDays} hari\n\n` +
      `Mohon informasi paket dan cara pembayarannya. Terima kasih!`
    )
    
    const whatsappUrl = `https://wa.me/${config.whatsapp.number}?text=${message}`
    window.open(whatsappUrl, '_blank')
  }

  const getBannerContent = () => {
    if (!isActive) {
      return {
        title: "Subscription Anda telah berakhir",
        description: "Untuk melanjutkan menggunakan fitur lengkap aplikasi, silakan hubungi admin untuk memperpanjang subscription.",
        variant: "destructive" as const,
        icon: AlertTriangle,
      }
    }

    if (remainingDays === 0) {
      return {
        title: "Subscription berakhir hari ini",
        description: "Subscription Anda akan berakhir hari ini. Hubungi admin untuk memperpanjang subscription.",
        variant: "destructive" as const,
        icon: AlertTriangle,
      }
    }

    if (remainingDays <= 1) {
      return {
        title: "Subscription akan berakhir besok",
        description: `Subscription Anda akan berakhir dalam ${remainingDays} hari. Hubungi admin untuk memperpanjang subscription.`,
        variant: "destructive" as const,
        icon: AlertTriangle,
      }
    }

    return {
      title: "Subscription akan berakhir segera",
      description: `Subscription Anda akan berakhir dalam ${remainingDays} hari. Hubungi admin untuk memperpanjang subscription.`,
      variant: "default" as const,
      icon: AlertTriangle,
    }
  }

  const content = getBannerContent()
  const IconComponent = content.icon

  return (
    <Alert variant={content.variant} className="mb-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <IconComponent className="h-5 w-5 mt-0.5" />
          <div className="flex-1">
            <AlertDescription className="font-medium mb-1">
              {content.title}
            </AlertDescription>
            <AlertDescription className="text-sm">
              {content.description}
            </AlertDescription>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant={content.variant === "destructive" ? "destructive" : "default"}
            onClick={handleContactWhatsApp}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Hubungi Admin
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsDismissed(true)}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Alert>
  )
}

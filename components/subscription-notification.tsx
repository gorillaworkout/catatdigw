"use client"

import { useSubscription } from "@/hooks/use-subscription"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Lock, AlertTriangle, X, Clock, Crown, CheckCircle } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { config } from "@/lib/config"
import { cn } from "@/lib/utils"

interface SubscriptionNotificationProps {
  className?: string
  variant?: "compact"
  onDismiss?: () => void
}

export function SubscriptionNotification({ 
  className, 
  variant = "compact",
  onDismiss 
}: SubscriptionNotificationProps) {
  const { subscription, isActive, getRemainingDays } = useSubscription()
  const [isDismissed, setIsDismissed] = useState(false)
  const { toast } = useToast()

  const remainingDays = getRemainingDays()

  // Don't show if dismissed or subscription is active with more than urgent warning days remaining
  if (isDismissed || (isActive && remainingDays > config.subscription.urgentWarningDays)) {
    return null
  }

  const handleDismiss = () => {
    setIsDismissed(true)
    onDismiss?.()
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

  const getNotificationContent = () => {
    if (!isActive) {
      return {
        title: "Subscription berakhir",
        description: "Hubungi kami untuk pembayaran",
        variant: "destructive" as const,
        icon: Lock,
        actionText: "WhatsApp",
        showWarning: true,
      }
    }

    if (remainingDays === 0) {
      return {
        title: "Subscription berakhir hari ini",
        description: "Hubungi kami untuk pembayaran",
        variant: "destructive" as const,
        icon: AlertTriangle,
        actionText: "WhatsApp",
        showWarning: true,
      }
    }

    if (remainingDays <= config.subscription.urgentWarningDays) {
      return {
        title: "Subscription akan berakhir segera",
        description: `${remainingDays} hari tersisa`,
        variant: "destructive" as const,
        icon: AlertTriangle,
        actionText: "WhatsApp",
        showWarning: true,
      }
    }

    return {
      title: "Subscription akan berakhir",
      description: `${remainingDays} hari tersisa`,
      variant: "default" as const,
      icon: Clock,
      actionText: "WhatsApp",
      showWarning: false,
    }
  }

  const content = getNotificationContent()
  const IconComponent = content.icon

  // Compact variant (inline notification)
  return (
    <div className={cn("mb-4 lg:mb-6", className)}>
      <Card className="border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20">
        <CardContent className="p-3 lg:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 lg:gap-3">
            <div className="flex items-start gap-2 lg:gap-3 flex-1">
              <div className="flex-shrink-0 mt-0.5">
                <IconComponent className="h-4 w-4 lg:h-5 lg:w-5 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 lg:gap-2 mb-1">
                  <div className="font-semibold text-sm lg:text-base text-red-600">
                    {content.title}
                  </div>
                  {content.showWarning && (
                    <Badge variant="destructive" className="text-xs w-fit">
                      Penting
                    </Badge>
                  )}
                </div>
                <p className="text-xs lg:text-sm text-muted-foreground">
                  {content.description}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button 
                size="sm" 
                variant="destructive"
                onClick={handleContactWhatsApp}
                className="whitespace-nowrap text-xs lg:text-sm"
              >
                <MessageCircle className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                {content.actionText}
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDismiss}
                className="h-8 w-8 lg:h-9 lg:w-9 p-0"
              >
                <X className="h-3 w-3 lg:h-4 lg:w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useSubscription } from "@/hooks/use-subscription"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, AlertTriangle, X, Clock, Lock, Crown } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { config } from "@/lib/config"

interface SubscriptionNotificationCardProps {
  className?: string
}

export function SubscriptionNotificationCard({ className }: SubscriptionNotificationCardProps) {
  const { subscription, isActive, getRemainingDays } = useSubscription()
  const [isDismissed, setIsDismissed] = useState(false)

  const remainingDays = getRemainingDays()

  // Don't show notification if dismissed or subscription is active with more than warning days remaining
  if (isDismissed || (isActive && remainingDays > config.subscription.warningDays)) {
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

  const getNotificationContent = () => {
    if (!isActive) {
      return {
        title: "Subscription Anda telah berakhir",
        description: "Untuk mengakses fitur lengkap, silakan hubungi admin untuk memperpanjang subscription.",
        variant: "destructive" as const,
        icon: Lock,
        actionText: "Hubungi Admin",
        showWarning: true,
        bgGradient: "from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20",
        borderColor: "border-red-200 dark:border-red-800",
        textColor: "text-red-800 dark:text-red-200",
      }
    }

    if (remainingDays === 0) {
      return {
        title: "Subscription berakhir hari ini",
        description: "Subscription Anda akan berakhir hari ini. Hubungi admin untuk memperpanjang subscription.",
        variant: "destructive" as const,
        icon: AlertTriangle,
        actionText: "Hubungi Admin",
        showWarning: true,
        bgGradient: "from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20",
        borderColor: "border-orange-200 dark:border-orange-800",
        textColor: "text-orange-800 dark:text-orange-200",
      }
    }

    if (remainingDays <= config.subscription.urgentWarningDays) {
      return {
        title: "Subscription akan berakhir segera",
        description: `Subscription Anda akan berakhir dalam ${remainingDays} hari. Hubungi admin untuk memperpanjang subscription.`,
        variant: "destructive" as const,
        icon: AlertTriangle,
        actionText: "Hubungi Admin",
        showWarning: true,
        bgGradient: "from-yellow-50 to-yellow-100 dark:from-yellow-950/20 dark:to-yellow-900/20",
        borderColor: "border-yellow-200 dark:border-yellow-800",
        textColor: "text-yellow-800 dark:text-yellow-200",
      }
    }

    return {
      title: "Subscription akan berakhir",
      description: `Subscription Anda akan berakhir dalam ${remainingDays} hari. Hubungi admin untuk memperpanjang subscription.`,
      variant: "default" as const,
      icon: Clock,
      actionText: "Hubungi Admin",
      showWarning: false,
      bgGradient: "from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      textColor: "text-blue-800 dark:text-blue-200",
    }
  }

  const content = getNotificationContent()
  const IconComponent = content.icon

  return (
    <Card className={cn(
      "relative overflow-hidden border-2 shadow-lg",
      content.borderColor,
      content.bgGradient,
      className
    )}>
      <div className="absolute inset-0 bg-gradient-to-r opacity-10"></div>
      
      <CardContent className="relative p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Content Section */}
          <div className="flex items-start gap-4 lg:gap-6 flex-1">
            <div className="flex-shrink-0">
              <div className={cn(
                "p-3 lg:p-4 rounded-full shadow-sm",
                content.variant === "destructive" 
                  ? "bg-red-100 dark:bg-red-900/30" 
                  : "bg-blue-100 dark:bg-blue-900/30"
              )}>
                <IconComponent className={cn("h-6 w-6 lg:h-8 lg:w-8", content.textColor)} />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:gap-3 mb-3 lg:mb-4">
                <h3 className={cn("font-bold text-lg lg:text-xl leading-tight", content.textColor)}>
                  {content.title}
                </h3>
                {content.showWarning && (
                  <Badge variant="destructive" className="text-xs lg:text-sm px-2 lg:px-3 py-1 w-fit">
                    Penting
                  </Badge>
                )}
              </div>
              
              <p className={cn("text-sm lg:text-base leading-relaxed", content.textColor)}>
                {content.description}
              </p>
              
              {subscription && (
                <div className="mt-4 lg:mt-6 flex flex-wrap gap-4 lg:gap-6 text-xs lg:text-sm">
                  <div className={cn("flex items-center gap-2", content.textColor)}>
                    <Crown className="h-3 w-3 lg:h-4 lg:w-4" />
                    <span className="font-medium">Status: {subscription.status}</span>
                  </div>
                  <div className={cn("flex items-center gap-2", content.textColor)}>
                    <Clock className="h-3 w-3 lg:h-4 lg:w-4" />
                    <span className="font-medium">Sisa: {remainingDays} hari</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Action Section */}
          <div className="flex items-center gap-3 lg:gap-4 flex-shrink-0">
            <Button 
              size="lg" 
              variant={content.variant === "destructive" ? "destructive" : "default"}
              className="whitespace-nowrap font-medium px-4 lg:px-6 text-sm lg:text-base"
              onClick={handleContactWhatsApp}
            >
              <MessageCircle className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
              {content.actionText}
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsDismissed(true)}
              className={cn("h-10 w-10 lg:h-12 lg:w-12 p-0 flex-shrink-0", content.textColor)}
            >
              <X className="h-4 w-4 lg:h-5 lg:w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

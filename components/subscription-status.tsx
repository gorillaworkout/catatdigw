"use client"

import { useSubscription } from "@/hooks/use-subscription"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageCircle, Clock, AlertTriangle, CheckCircle } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { config } from "@/lib/config"

export function SubscriptionStatus() {
  const { subscription, isActive, loading, getRemainingDays, getSubscriptionStatusText } = useSubscription()
  const { toast } = useToast()

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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Status Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const remainingDays = getRemainingDays()
  const statusText = getSubscriptionStatusText()

  return (
    <Card className="bg-card border-border hover:shadow-md transition-all duration-200">
      <CardHeader className="px-6">
        <CardTitle className="flex items-center gap-3 text-xl font-semibold">
          {isActive ? (
            <CheckCircle className="h-6 w-6 text-green-600" />
          ) : (
            <AlertTriangle className="h-6 w-6 text-red-600" />
          )}
          Status Subscription
        </CardTitle>
        <CardDescription className="text-base">
          Kelola subscription Anda untuk akses penuh ke fitur aplikasi
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-6">
        <div className="flex items-center justify-between">
          <span className="text-base text-muted-foreground">Status:</span>
          <Badge variant={isActive ? "default" : "destructive"} className="text-sm px-3 py-1">
            {isActive ? "Aktif" : "Berakhir"}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-base text-muted-foreground">Sisa Waktu:</span>
          <span className="text-base font-semibold">
            {remainingDays > 0 ? `${remainingDays} hari` : "Habis"}
          </span>
        </div>

        {subscription && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-base text-muted-foreground">Mulai:</span>
              <span className="text-base font-medium">
                {subscription.startDate.toDate().toLocaleDateString("id-ID")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base text-muted-foreground">Berakhir:</span>
              <span className="text-base font-medium">
                {subscription.endDate.toDate().toLocaleDateString("id-ID")}
              </span>
            </div>
          </>
        )}

        <div className="pt-4">
          <p className="text-base text-muted-foreground mb-4">{statusText}</p>
          
          {!isActive && (
            <Button 
              className="w-full" 
              variant="outline"
              onClick={handleContactWhatsApp}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Hubungi WhatsApp untuk Pembayaran
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

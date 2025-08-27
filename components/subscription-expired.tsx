"use client"

import { useSubscription } from "@/hooks/use-subscription"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lock, MessageCircle } from "lucide-react"
import { config } from "@/lib/config"

export function SubscriptionExpired() {
  const { subscription, getRemainingDays } = useSubscription()

  const remainingDays = getRemainingDays()

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

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <Lock className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-xl">Akses Terbatas</CardTitle>
          <CardDescription>
            Subscription Anda telah berakhir. Hubungi admin untuk memperpanjang subscription.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {subscription && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-red-600">Berakhir</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sisa Waktu:</span>
                <span className="font-medium">{remainingDays > 0 ? `${remainingDays} hari` : "Habis"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Berakhir:</span>
                <span className="font-medium">
                  {subscription.endDate.toDate().toLocaleDateString("id-ID")}
                </span>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="rounded-lg bg-gray-50 p-3">
              <h4 className="font-medium text-sm mb-2">Fitur yang tidak tersedia:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Menambah pengeluaran baru</li>
                <li>• Menambah pendapatan baru</li>
                <li>• Mengedit transaksi</li>
                <li>• Menambah rekening baru</li>
                <li>• Menambah kategori baru</li>
              </ul>
            </div>

            <div className="rounded-lg bg-green-50 p-3">
              <h4 className="font-medium text-sm mb-2 text-green-800">Fitur yang masih tersedia:</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Melihat dashboard</li>
                <li>• Melihat laporan</li>
                <li>• Melihat riwayat transaksi</li>
                <li>• Melihat rekening</li>
              </ul>
            </div>
          </div>

          <Button 
            className="w-full" 
            size="lg"
            onClick={handleContactWhatsApp}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Hubungi Admin
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useSubscription } from "@/hooks/use-subscription"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Lock, AlertTriangle } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { SubscriptionGuardButton } from "@/components/subscription-guard-button"

export function SubscriptionExpired() {
  const { subscription, extendSubscription, getRemainingDays } = useSubscription()
  const [isExtending, setIsExtending] = useState(false)
  const [daysToAdd, setDaysToAdd] = useState("30")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const remainingDays = getRemainingDays()

  const handleExtendSubscription = async () => {
    if (!daysToAdd || parseInt(daysToAdd) <= 0) {
      toast({
        title: "Error",
        description: "Jumlah hari harus lebih dari 0",
        variant: "destructive",
      })
      return
    }

    try {
      setIsExtending(true)
      await extendSubscription(parseInt(daysToAdd))
      toast({
        title: "Berhasil",
        description: `Subscription diperpanjang ${daysToAdd} hari`,
      })
      setIsDialogOpen(false)
      setDaysToAdd("30")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal memperpanjang subscription",
        variant: "destructive",
      })
    } finally {
      setIsExtending(false)
    }
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
            Subscription Anda telah berakhir. Perpanjang subscription untuk mengakses fitur lengkap.
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

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <SubscriptionGuardButton className="w-full" size="lg" tooltipText="Subscription berakhir. Hubungi WhatsApp untuk pembayaran.">
                <Calendar className="h-4 w-4 mr-2" />
                Perpanjang Subscription
              </SubscriptionGuardButton>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Perpanjang Subscription</DialogTitle>
                <DialogDescription>
                  Masukkan jumlah hari untuk memperpanjang subscription Anda dan mengakses fitur lengkap.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="days">Jumlah Hari</Label>
                  <Input
                    id="days"
                    type="number"
                    min="1"
                    value={daysToAdd}
                    onChange={(e) => setDaysToAdd(e.target.value)}
                    placeholder="30"
                  />
                </div>
                <SubscriptionGuardButton 
                  onClick={handleExtendSubscription} 
                  disabled={isExtending}
                  className="w-full"
                  size="lg"
                  tooltipText="Subscription berakhir. Hubungi WhatsApp untuk pembayaran."
                >
                  {isExtending ? "Memproses..." : "Perpanjang Sekarang"}
                </SubscriptionGuardButton>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}

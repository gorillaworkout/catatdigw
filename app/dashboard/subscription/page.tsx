import { Suspense } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { SubscriptionStatus } from "@/components/subscription-status"

import { SubscriptionIntegrityChecker } from "@/components/subscription-integrity-checker"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageCircle, CheckCircle, AlertTriangle, Lock, Clock, Calendar } from "lucide-react"
import { config } from "@/lib/config"

export const metadata = {
  title: "Subscription - catatdiGW",
  description: "Kelola subscription Anda untuk akses penuh ke fitur aplikasi",
}

export default function SubscriptionPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Subscription</h1>
          <p className="text-muted-foreground">Kelola subscription Anda untuk akses penuh ke fitur aplikasi</p>
        </div>

        <Suspense fallback={<DashboardSkeleton />}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SubscriptionStatus />
            <SubscriptionIntegrityChecker />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Paket Subscription
                </CardTitle>
                <CardDescription>
                  Pilih paket yang sesuai dengan kebutuhan Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Trial 7 Hari</h3>
                      <Badge variant="secondary">Gratis</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Coba semua fitur aplikasi selama 7 hari secara gratis
                    </p>
                    <ul className="text-sm space-y-1">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        Menambah pengeluaran & pendapatan
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        Transfer antar rekening
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        Laporan keuangan lengkap
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        Analisis dan grafik
                      </li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Premium</h3>
                      <Badge variant="default">Berbayar</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Akses penuh ke semua fitur tanpa batasan waktu
                    </p>
                    <ul className="text-sm space-y-1">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        Semua fitur trial
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        Backup data otomatis
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        Export data ke Excel/PDF
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        Dukungan prioritas
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Cara Perpanjang Subscription</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-medium mt-0.5">
                        1
                      </div>
                      <p>Klik tombol "Hubungi WhatsApp" di atas</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-medium mt-0.5">
                        2
                      </div>
                      <p>Kirim pesan dengan detail subscription Anda</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-medium mt-0.5">
                        3
                      </div>
                      <p>Lakukan pembayaran sesuai instruksi admin</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-medium mt-0.5">
                        4
                      </div>
                      <p>Admin akan memperpanjang subscription setelah pembayaran</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Kontak Pembayaran
                </CardTitle>
                <CardDescription>
                  Hubungi kami untuk informasi pembayaran dan perpanjangan subscription
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">WhatsApp Support</h3>
                      <Badge variant="default">Online</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Hubungi kami melalui WhatsApp untuk informasi pembayaran dan dukungan
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-3 w-3 text-green-600" />
                        Respon cepat dalam 1-2 jam
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-3 w-3 text-green-600" />
                        Informasi paket dan harga
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-3 w-3 text-green-600" />
                        Instruksi pembayaran
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-3 w-3 text-green-600" />
                        Konfirmasi pembayaran
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Informasi Kontak</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      <span>WhatsApp: {config.whatsapp.displayNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Jam kerja: {config.whatsapp.businessHours}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Fitur Terbatas
                </CardTitle>
                <CardDescription>
                  Fitur yang tidak tersedia saat subscription berakhir
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    Menambah pengeluaran baru
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    Menambah pendapatan baru
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    Mengedit transaksi
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    Menambah rekening baru
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    Menambah kategori baru
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    Transfer antar rekening
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Fitur Tersedia
                </CardTitle>
                <CardDescription>
                  Fitur yang masih dapat diakses saat subscription berakhir
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Melihat dashboard
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Melihat laporan keuangan
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Melihat riwayat transaksi
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Melihat rekening
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Melihat grafik dan analisis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Mengakses pengaturan
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </Suspense>
      </div>
    </DashboardLayout>
  )
}

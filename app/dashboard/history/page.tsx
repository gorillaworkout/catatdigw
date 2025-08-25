import type { Metadata } from "next"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { History, Download, Upload, Shield, Clock, Database, AlertCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Riwayat & Backup - catatandiGW",
  description: "Kelola riwayat aktivitas dan backup data keuangan Anda",
}

export default function HistoryPage() {
  const backupHistory = [
    { id: 1, date: "2024-11-15", type: "Auto", size: "2.3 MB", status: "success" },
    { id: 2, date: "2024-11-10", type: "Manual", size: "2.1 MB", status: "success" },
    { id: 3, date: "2024-11-05", type: "Auto", size: "1.9 MB", status: "success" },
  ]

  const activityLog = [
    { id: 1, action: "Menambah pengeluaran", detail: "Makan siang - Rp 25.000", time: "2 jam yang lalu" },
    { id: 2, action: "Mengubah kategori", detail: "Transport → Transportasi", time: "5 jam yang lalu" },
    { id: 3, action: "Menambah rekening", detail: "BCA Saving", time: "1 hari yang lalu" },
    { id: 4, action: "Export laporan", detail: "Laporan bulanan PDF", time: "2 hari yang lalu" },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Riwayat & Backup</h1>
          <p className="text-muted-foreground">Kelola riwayat aktivitas dan backup data Anda</p>
        </div>

        {/* Backup Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Status Backup
              </CardTitle>
              <CardDescription>Informasi backup otomatis dan manual</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Backup otomatis terakhir: 15 November 2024, 14:30 WIB</AlertDescription>
              </Alert>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Backup berikutnya dalam:</span>
                  <Badge variant="outline">2 hari 14 jam</Badge>
                </div>
                <Progress value={65} className="h-2" />
                <p className="text-xs text-muted-foreground">Backup otomatis dilakukan setiap 5 hari sekali</p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Backup Sekarang
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Restore Data
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistik Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Transaksi</span>
                  <span className="font-semibold">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Ukuran Database</span>
                  <span className="font-semibold">2.3 MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Backup Tersedia</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Terakhir Sync</span>
                  <span className="font-semibold">2 menit lalu</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Backup History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Riwayat Backup
            </CardTitle>
            <CardDescription>Daftar backup yang telah dibuat</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {backupHistory.map((backup) => (
                <div key={backup.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Database className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{backup.date}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant={backup.type === "Auto" ? "default" : "secondary"}>{backup.type}</Badge>
                        <span className="text-sm text-muted-foreground">{backup.size}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Berhasil
                    </Badge>
                    <Button size="sm" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Log */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Log Aktivitas
            </CardTitle>
            <CardDescription>Riwayat aktivitas terbaru Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activityLog.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="p-2 bg-blue-500/10 rounded-lg mt-0.5">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.detail}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

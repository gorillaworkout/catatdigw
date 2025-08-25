"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Download, Upload, Trash2, Database, Shield, AlertTriangle } from "lucide-react"

export function DataManagement() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)

  const handleExportData = async () => {
    setLoading(true)
    setExportProgress(0)

    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setLoading(false)
          toast({
            title: "Data berhasil diekspor",
            description: "File backup telah diunduh ke perangkat Anda",
          })
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleImportData = () => {
    // Trigger file input
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json,.csv"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        toast({
          title: "Import dimulai",
          description: `Mengimpor data dari ${file.name}`,
        })
      }
    }
    input.click()
  }

  const handleDeleteAllData = () => {
    toast({
      title: "Konfirmasi diperlukan",
      description: "Fitur ini memerlukan konfirmasi tambahan untuk keamanan",
      variant: "destructive",
    })
  }

  return (
    <div className="space-y-6">
      {/* Data Export */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Download className="h-5 w-5" />
            Export Data
          </CardTitle>
          <CardDescription>Unduh semua data keuangan Anda sebagai backup</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-card-foreground">1,247</div>
              <div className="text-sm text-muted-foreground">Total Transaksi</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-card-foreground">8</div>
              <div className="text-sm text-muted-foreground">Rekening</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-card-foreground">16</div>
              <div className="text-sm text-muted-foreground">Kategori</div>
            </div>
          </div>

          {loading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Mengekspor data...</span>
                <span>{exportProgress}%</span>
              </div>
              <Progress value={exportProgress} className="w-full" />
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={handleExportData} disabled={loading} className="bg-primary hover:bg-primary/90">
              <Download className="h-4 w-4 mr-2" />
              {loading ? "Mengekspor..." : "Export ke JSON"}
            </Button>
            <Button variant="outline" onClick={handleExportData} disabled={loading}>
              Export ke CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Import */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Upload className="h-5 w-5" />
            Import Data
          </CardTitle>
          <CardDescription>Impor data dari backup atau aplikasi lain</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-blue-500" />
              <span className="font-medium text-card-foreground">Format yang Didukung</span>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• JSON - Format backup catatandiGW</li>
              <li>• CSV - Data dari aplikasi keuangan lain</li>
              <li>• Excel - File spreadsheet (.xlsx)</li>
            </ul>
          </div>

          <Button onClick={handleImportData} variant="outline" className="w-full bg-transparent">
            <Upload className="h-4 w-4 mr-2" />
            Pilih File untuk Import
          </Button>
        </CardContent>
      </Card>

      {/* Storage Usage */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Database className="h-5 w-5" />
            Penggunaan Storage
          </CardTitle>
          <CardDescription>Monitor penggunaan ruang penyimpanan data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-card-foreground">Transaksi</span>
              <span className="text-sm text-muted-foreground">2.4 MB</span>
            </div>
            <Progress value={60} className="w-full" />

            <div className="flex justify-between items-center">
              <span className="text-sm text-card-foreground">Lampiran</span>
              <span className="text-sm text-muted-foreground">1.2 MB</span>
            </div>
            <Progress value={30} className="w-full" />

            <div className="flex justify-between items-center">
              <span className="text-sm text-card-foreground">Cache</span>
              <span className="text-sm text-muted-foreground">0.8 MB</span>
            </div>
            <Progress value={20} className="w-full" />
          </div>

          <div className="pt-4 border-t border-border">
            <div className="flex justify-between items-center">
              <span className="font-medium text-card-foreground">Total Penggunaan</span>
              <span className="font-medium text-card-foreground">4.4 MB / 100 MB</span>
            </div>
          </div>

          <Button variant="outline" className="w-full bg-transparent">
            Bersihkan Cache
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-card border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>Tindakan yang tidak dapat dibatalkan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <h4 className="font-medium text-destructive mb-2">Hapus Semua Data</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Tindakan ini akan menghapus semua transaksi, rekening, dan pengaturan Anda secara permanen. Data yang
              dihapus tidak dapat dikembalikan.
            </p>
            <Button variant="destructive" onClick={handleDeleteAllData}>
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus Semua Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

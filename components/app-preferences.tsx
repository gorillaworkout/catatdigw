"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Save } from "lucide-react"

export function AppPreferences() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const [preferences, setPreferences] = useState({
    currency: "IDR",
    language: "id",
    dateFormat: "dd/mm/yyyy",
    theme: "dark",
    notifications: {
      email: true,
      push: true,
      budgetAlerts: true,
      monthlyReports: true,
      transactionReminders: false,
    },
    privacy: {
      showBalance: true,
      shareData: false,
      analytics: true,
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Preferensi berhasil disimpan",
      description: "Pengaturan aplikasi Anda telah diperbarui",
    })

    setLoading(false)
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value },
    }))
  }

  const handlePrivacyChange = (key: string, value: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      privacy: { ...prev.privacy, [key]: value },
    }))
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Settings */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Pengaturan Umum</CardTitle>
            <CardDescription>Kustomisasi tampilan dan format aplikasi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-card-foreground">Mata Uang</Label>
                <Select
                  value={preferences.currency}
                  onValueChange={(value) => setPreferences((prev) => ({ ...prev, currency: value }))}
                >
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="IDR" className="text-popover-foreground">
                      Indonesian Rupiah (IDR)
                    </SelectItem>
                    <SelectItem value="USD" className="text-popover-foreground">
                      US Dollar (USD)
                    </SelectItem>
                    <SelectItem value="EUR" className="text-popover-foreground">
                      Euro (EUR)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-card-foreground">Bahasa</Label>
                <Select
                  value={preferences.language}
                  onValueChange={(value) => setPreferences((prev) => ({ ...prev, language: value }))}
                >
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="id" className="text-popover-foreground">
                      Bahasa Indonesia
                    </SelectItem>
                    <SelectItem value="en" className="text-popover-foreground">
                      English
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-card-foreground">Format Tanggal</Label>
                <Select
                  value={preferences.dateFormat}
                  onValueChange={(value) => setPreferences((prev) => ({ ...prev, dateFormat: value }))}
                >
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="dd/mm/yyyy" className="text-popover-foreground">
                      DD/MM/YYYY
                    </SelectItem>
                    <SelectItem value="mm/dd/yyyy" className="text-popover-foreground">
                      MM/DD/YYYY
                    </SelectItem>
                    <SelectItem value="yyyy-mm-dd" className="text-popover-foreground">
                      YYYY-MM-DD
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-card-foreground">Tema</Label>
                <Select
                  value={preferences.theme}
                  onValueChange={(value) => setPreferences((prev) => ({ ...prev, theme: value }))}
                >
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="dark" className="text-popover-foreground">
                      Dark Mode
                    </SelectItem>
                    <SelectItem value="light" className="text-popover-foreground">
                      Light Mode
                    </SelectItem>
                    <SelectItem value="system" className="text-popover-foreground">
                      System Default
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Notifikasi</CardTitle>
            <CardDescription>Kelola preferensi notifikasi Anda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-card-foreground">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Terima notifikasi melalui email</p>
              </div>
              <Switch
                checked={preferences.notifications.email}
                onCheckedChange={(checked) => handleNotificationChange("email", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-card-foreground">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Terima notifikasi push di browser</p>
              </div>
              <Switch
                checked={preferences.notifications.push}
                onCheckedChange={(checked) => handleNotificationChange("push", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-card-foreground">Budget Alerts</Label>
                <p className="text-sm text-muted-foreground">Peringatan saat mendekati batas budget</p>
              </div>
              <Switch
                checked={preferences.notifications.budgetAlerts}
                onCheckedChange={(checked) => handleNotificationChange("budgetAlerts", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-card-foreground">Monthly Reports</Label>
                <p className="text-sm text-muted-foreground">Laporan keuangan bulanan</p>
              </div>
              <Switch
                checked={preferences.notifications.monthlyReports}
                onCheckedChange={(checked) => handleNotificationChange("monthlyReports", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-card-foreground">Transaction Reminders</Label>
                <p className="text-sm text-muted-foreground">Pengingat untuk mencatat transaksi</p>
              </div>
              <Switch
                checked={preferences.notifications.transactionReminders}
                onCheckedChange={(checked) => handleNotificationChange("transactionReminders", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Privasi</CardTitle>
            <CardDescription>Kontrol privasi dan keamanan data Anda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-card-foreground">Show Balance</Label>
                <p className="text-sm text-muted-foreground">Tampilkan saldo di dashboard</p>
              </div>
              <Switch
                checked={preferences.privacy.showBalance}
                onCheckedChange={(checked) => handlePrivacyChange("showBalance", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-card-foreground">Share Anonymous Data</Label>
                <p className="text-sm text-muted-foreground">Bantu kami meningkatkan aplikasi</p>
              </div>
              <Switch
                checked={preferences.privacy.shareData}
                onCheckedChange={(checked) => handlePrivacyChange("shareData", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-card-foreground">Analytics</Label>
                <p className="text-sm text-muted-foreground">Izinkan pengumpulan data analytics</p>
              </div>
              <Switch
                checked={preferences.privacy.analytics}
                onCheckedChange={(checked) => handlePrivacyChange("analytics", checked)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90">
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Menyimpan..." : "Simpan Preferensi"}
          </Button>
        </div>
      </form>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Shield, Key, Smartphone, AlertTriangle } from "lucide-react"
import { SubscriptionGuardButton } from "@/components/subscription-guard-button"

export function SecuritySettings() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    biometricEnabled: true,
    sessionTimeout: "30",
    loginAlerts: true,
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Password tidak cocok",
        description: "Password baru dan konfirmasi password harus sama",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Password berhasil diubah",
      description: "Password Anda telah diperbarui",
    })

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
    setLoading(false)
  }

  const handleSecurityToggle = (key: string, value: boolean) => {
    setSecuritySettings((prev) => ({ ...prev, [key]: value }))
    toast({
      title: "Pengaturan keamanan diperbarui",
      description: `${key} telah ${value ? "diaktifkan" : "dinonaktifkan"}`,
    })
  }

  return (
    <div className="space-y-6">
      {/* Password Change */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Key className="h-5 w-5" />
            Ubah Password
          </CardTitle>
          <CardDescription>Perbarui password untuk keamanan akun yang lebih baik</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-card-foreground">
                Password Saat Ini
              </Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                className="bg-background border-border"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-card-foreground">
                  Password Baru
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                  className="bg-background border-border"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-card-foreground">
                  Konfirmasi Password Baru
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  className="bg-background border-border"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <SubscriptionGuardButton type="submit" disabled={loading} className="bg-primary hover:bg-primary/90" tooltipText="Subscription berakhir. Hubungi WhatsApp untuk pembayaran.">
                {loading ? "Mengubah..." : "Ubah Password"}
              </SubscriptionGuardButton>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Shield className="h-5 w-5" />
            Autentikasi Dua Faktor
          </CardTitle>
          <CardDescription>Tambahkan lapisan keamanan ekstra untuk akun Anda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-card-foreground">Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">Gunakan aplikasi authenticator untuk verifikasi login</p>
            </div>
            <Switch
              checked={securitySettings.twoFactorEnabled}
              onCheckedChange={(checked) => handleSecurityToggle("twoFactorEnabled", checked)}
            />
          </div>

          {securitySettings.twoFactorEnabled && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Smartphone className="h-4 w-4 text-primary" />
                <span className="font-medium text-card-foreground">Setup Required</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Scan QR code dengan aplikasi authenticator seperti Google Authenticator atau Authy
              </p>
              <SubscriptionGuardButton size="sm" className="bg-primary hover:bg-primary/90" tooltipText="Subscription berakhir. Hubungi WhatsApp untuk pembayaran.">
                Setup 2FA
              </SubscriptionGuardButton>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Preferences */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <AlertTriangle className="h-5 w-5" />
            Preferensi Keamanan
          </CardTitle>
          <CardDescription>Konfigurasi pengaturan keamanan tambahan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-card-foreground">Biometric Login</Label>
              <p className="text-sm text-muted-foreground">Gunakan fingerprint atau face recognition</p>
            </div>
            <Switch
              checked={securitySettings.biometricEnabled}
              onCheckedChange={(checked) => handleSecurityToggle("biometricEnabled", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-card-foreground">Login Alerts</Label>
              <p className="text-sm text-muted-foreground">Notifikasi saat ada login dari perangkat baru</p>
            </div>
            <Switch
              checked={securitySettings.loginAlerts}
              onCheckedChange={(checked) => handleSecurityToggle("loginAlerts", checked)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-card-foreground">Session Timeout (menit)</Label>
            <Input
              type="number"
              value={securitySettings.sessionTimeout}
              onChange={(e) => setSecuritySettings((prev) => ({ ...prev, sessionTimeout: e.target.value }))}
              className="bg-background border-border w-32"
              min="5"
              max="120"
            />
            <p className="text-sm text-muted-foreground">Otomatis logout setelah tidak aktif</p>
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Sesi Aktif</CardTitle>
          <CardDescription>Kelola perangkat yang terhubung ke akun Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <div className="font-medium text-card-foreground">Current Session</div>
                <div className="text-sm text-muted-foreground">Chrome on Windows • Jakarta, Indonesia</div>
                <div className="text-xs text-muted-foreground">Last active: Now</div>
              </div>
              <div className="text-xs text-green-500 font-medium">Active</div>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <div className="font-medium text-card-foreground">Mobile App</div>
                <div className="text-sm text-muted-foreground">Android • Jakarta, Indonesia</div>
                <div className="text-xs text-muted-foreground">Last active: 2 hours ago</div>
              </div>
              <Button variant="outline" size="sm" className="text-destructive bg-transparent">
                Revoke
              </Button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <Button variant="outline" className="w-full bg-transparent">
              Logout All Other Sessions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

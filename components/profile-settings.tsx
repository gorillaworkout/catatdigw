"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { Camera, Save } from "lucide-react"
import { SubscriptionGuardButton } from "@/components/subscription-guard-button"

export function ProfileSettings() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    bio: "",
    location: "",
    website: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Profil berhasil diperbarui",
      description: "Informasi profil Anda telah disimpan",
    })

    setLoading(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Informasi Profil</CardTitle>
          <CardDescription>Kelola informasi profil dan akun Anda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={user?.photoURL || "/placeholder.svg?height=80&width=80"}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
              <Button
                size="sm"
                className="absolute -bottom-1 -right-1 rounded-full w-8 h-8 p-0 bg-primary hover:bg-primary/90"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <h3 className="font-medium text-card-foreground">Foto Profil</h3>
              <p className="text-sm text-muted-foreground">Klik ikon kamera untuk mengubah foto profil</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-card-foreground">
                  Nama Lengkap
                </Label>
                <Input
                  id="displayName"
                  value={profileData.displayName}
                  onChange={(e) => handleInputChange("displayName", e.target.value)}
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-card-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="bg-background border-border"
                  disabled
                />
                <p className="text-xs text-muted-foreground">Email tidak dapat diubah</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-card-foreground">
                  Nomor Telepon
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+62 812 3456 7890"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="text-card-foreground">
                  Lokasi
                </Label>
                <Input
                  id="location"
                  placeholder="Jakarta, Indonesia"
                  value={profileData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className="bg-background border-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website" className="text-card-foreground">
                Website
              </Label>
              <Input
                id="website"
                type="url"
                placeholder="https://example.com"
                value={profileData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-card-foreground">
                Bio
              </Label>
              <Textarea
                id="bio"
                placeholder="Ceritakan sedikit tentang diri Anda..."
                value={profileData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                className="bg-background border-border resize-none"
                rows={4}
              />
            </div>

            <div className="flex justify-end">
              <SubscriptionGuardButton type="submit" disabled={loading} className="bg-primary hover:bg-primary/90" tooltipText="Subscription berakhir. Hubungi WhatsApp untuk pembayaran.">
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </SubscriptionGuardButton>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

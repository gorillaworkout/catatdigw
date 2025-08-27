"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { verifySubscriptionIntegrity } from "@/lib/firestore"
import { Shield, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react"
import { SubscriptionGuardButton } from "@/components/subscription-guard-button"

export function SubscriptionIntegrityChecker() {
  const [loading, setLoading] = useState(false)
  const [integrityData, setIntegrityData] = useState<any>(null)
  const { toast } = useToast()
  const { user } = useAuth()

  const checkIntegrity = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "User belum login",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const result = await verifySubscriptionIntegrity(user.uid)
      setIntegrityData(result)
      
      if (result.isConsistent) {
        toast({
          title: "Integritas Terjaga",
          description: "Data subscription tidak berubah secara otomatis",
        })
      } else {
        toast({
          title: "Peringatan",
          description: "Data subscription tidak konsisten",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal memeriksa integritas",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  if (!integrityData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Verifikasi Integritas Subscription
          </CardTitle>
          <CardDescription>
            Periksa apakah data subscription Anda berubah secara otomatis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SubscriptionGuardButton onClick={checkIntegrity} disabled={loading} tooltipText="Subscription berakhir. Hubungi WhatsApp untuk pembayaran.">
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Memeriksa...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Periksa Integritas
              </>
            )}
          </SubscriptionGuardButton>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {integrityData.isConsistent ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-red-600" />
          )}
          Hasil Verifikasi Integritas
        </CardTitle>
        <CardDescription>
          Status integritas data subscription Anda
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Status:</span>
          <Badge variant={integrityData.isConsistent ? "default" : "destructive"}>
            {integrityData.isConsistent ? "Terjaga" : "Tidak Konsisten"}
          </Badge>
        </div>

        {integrityData.currentData && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Data Subscription Saat Ini:</h4>
            <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-1">
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-medium">{integrityData.currentData.status}</span>
              </div>
              <div className="flex justify-between">
                <span>Aktif:</span>
                <span className="font-medium">{integrityData.currentData.isActive ? "Ya" : "Tidak"}</span>
              </div>
              <div className="flex justify-between">
                <span>Mulai:</span>
                <span className="font-medium">
                  {integrityData.currentData.startDate?.toDate().toLocaleDateString("id-ID") || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Berakhir:</span>
                <span className="font-medium">
                  {integrityData.currentData.endDate?.toDate().toLocaleDateString("id-ID") || "N/A"}
                </span>
              </div>
            </div>
          </div>
        )}

        <SubscriptionGuardButton onClick={checkIntegrity} disabled={loading} variant="outline" className="w-full" tooltipText="Subscription berakhir. Hubungi WhatsApp untuk pembayaran.">
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Memeriksa Ulang...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Periksa Ulang
            </>
          )}
        </SubscriptionGuardButton>
      </CardContent>
    </Card>
  )
}

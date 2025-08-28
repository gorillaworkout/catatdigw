"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CreditCard, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { useInstallments } from "@/hooks/use-installments"
import Link from "next/link"

export function InstallmentSummary() {
  const { installments, loading } = useInstallments()

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Ringkasan Cicilan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-20 bg-muted/50 rounded-lg animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  const activeInstallments = installments.filter((i: any) => i.status === "active")
  const overdueInstallments = installments.filter((i: any) => i.status === "overdue")
  const completedInstallments = installments.filter((i: any) => i.status === "completed")

  const totalActiveAmount = activeInstallments.reduce((sum, i) => sum + Number(i.remainingAmount || 0), 0)
  const totalOverdueAmount = overdueInstallments.reduce((sum, i) => sum + Number(i.remainingAmount || 0), 0)
  const totalCompletedAmount = completedInstallments.reduce((sum, i) => sum + Number(i.totalAmount || 0), 0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  // Get upcoming installments (due within 30 days)
  const now = new Date()
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
  const upcomingInstallments = activeInstallments.filter((i: any) => {
    const dueDate = new Date(i.dueDate)
    return dueDate <= thirtyDaysFromNow && dueDate >= now
  })

  if (installments.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Ringkasan Cicilan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">Belum ada cicilan yang dibuat</p>
            <Link href="/dashboard/installments">
              <Button size="sm">
                Buat Cicilan Pertama
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Ringkasan Cicilan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-card-foreground">
              {activeInstallments.length}
            </div>
            <div className="text-sm text-muted-foreground">Aktif</div>
            <div className="text-xs text-muted-foreground">
              {formatCurrency(totalActiveAmount)}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">
              {overdueInstallments.length}
            </div>
            <div className="text-sm text-muted-foreground">Terlambat</div>
            <div className="text-xs text-red-500">
              {formatCurrency(totalOverdueAmount)}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">
              {completedInstallments.length}
            </div>
            <div className="text-sm text-muted-foreground">Lunas</div>
            <div className="text-xs text-green-500">
              {formatCurrency(totalCompletedAmount)}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-500">
              {upcomingInstallments.length}
            </div>
            <div className="text-sm text-muted-foreground">Jatuh Tempo</div>
            <div className="text-xs text-orange-500">
              Dalam 30 hari
            </div>
          </div>
        </div>

        {/* Overdue Installments Warning */}
        {overdueInstallments.length > 0 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="font-medium text-red-800">Cicilan Terlambat</span>
            </div>
            <p className="text-sm text-red-700 mb-2">
              Anda memiliki {overdueInstallments.length} cicilan yang terlambat dengan total {formatCurrency(totalOverdueAmount)}
            </p>
            <Link href="/dashboard/installments">
              <Button size="sm" variant="destructive">
                Lihat Detail
              </Button>
            </Link>
          </div>
        )}

        {/* Upcoming Installments */}
        {upcomingInstallments.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <span className="font-medium text-card-foreground">Jatuh Tempo Dalam 30 Hari</span>
            </div>
            <div className="space-y-2">
              {upcomingInstallments.slice(0, 3).map((installment: any) => (
                <div key={installment.id} className="flex items-center justify-between p-2 bg-orange-50 border border-orange-200 rounded-lg">
                  <div>
                    <p className="font-medium text-sm text-orange-800">{installment.title}</p>
                    <p className="text-xs text-orange-600">
                      Jatuh tempo: {new Date(installment.dueDate).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-orange-800">
                      {formatCurrency(installment.remainingAmount)}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {installment.paidInstallments}/{installment.numberOfInstallments}
                    </Badge>
                  </div>
                </div>
              ))}
              {upcomingInstallments.length > 3 && (
                <p className="text-xs text-muted-foreground text-center">
                  Dan {upcomingInstallments.length - 3} cicilan lainnya
                </p>
              )}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-2 pt-2">
          <Link href="/dashboard/installments" className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              Lihat Semua Cicilan
            </Button>
          </Link>
          <Link href="/dashboard/installments" className="flex-1">
            <Button size="sm" className="w-full">
              Tambah Cicilan
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}


"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, CreditCard, Wallet, PiggyBank, Building2, Smartphone } from "lucide-react"
import { useUserCollection } from "@/hooks/use-firestore"
import { Skeleton } from "@/components/ui/skeleton"
import { AddAccountModal } from "@/components/add-account-modal"

// Account type to icon mapping
const getAccountIcon = (type: string) => {
  switch (type) {
    case "bank":
      return { icon: Building2, color: "text-blue-500" }
    case "cash":
      return { icon: Wallet, color: "text-green-500" }
    case "credit":
      return { icon: CreditCard, color: "text-red-500" }
    case "investment":
      return { icon: PiggyBank, color: "text-purple-500" }
    case "ewallet":
      return { icon: Smartphone, color: "text-orange-500" }
    default:
      return { icon: Wallet, color: "text-gray-500" }
  }
}

export function AccountsList() {
  const { data: accounts, loading, error } = useUserCollection<any>("accounts")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleAccountUpdated = () => {
    // The useUserCollection hook will automatically refresh the data
    // via onSnapshot, so no manual refresh is needed
  }

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-card-foreground text-lg sm:text-xl">Daftar Rekening</CardTitle>
              <CardDescription className="text-sm sm:text-base">Kelola semua akun keuangan Anda</CardDescription>
            </div>
            <Button size="sm" className="bg-primary hover:bg-primary/90 disabled:opacity-50 w-full sm:w-auto" disabled>
              <Plus className="h-4 w-4 mr-2" />
              Tambah
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg flex-shrink-0" />
                <div>
                  <Skeleton className="h-4 w-20 sm:w-24 mb-2" />
                  <Skeleton className="h-3 w-16 sm:w-16" />
                </div>
              </div>
              <Skeleton className="h-4 w-16 sm:w-20" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-card-foreground text-lg sm:text-xl">Daftar Rekening</CardTitle>
              <CardDescription className="text-sm sm:text-base">Kelola semua akun keuangan Anda</CardDescription>
            </div>
            <AddAccountModal onAccountUpdated={handleAccountUpdated} />
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <p className="text-sm text-red-500">Gagal memuat data rekening: {error}</p>
        </CardContent>
      </Card>
    )
  }

  if (accounts.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-card-foreground text-lg sm:text-xl">Daftar Rekening</CardTitle>
              <CardDescription className="text-sm sm:text-base">Kelola semua akun keuangan Anda</CardDescription>
            </div>
            <AddAccountModal onAccountUpdated={handleAccountUpdated} />
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <p className="text-sm text-muted-foreground text-center py-8">
            Belum ada rekening. Tambahkan rekening pertama Anda untuk memulai.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-card-foreground text-lg sm:text-xl">Daftar Rekening</CardTitle>
            <CardDescription className="text-sm sm:text-base">Kelola semua akun keuangan Anda</CardDescription>
          </div>
          <AddAccountModal onAccountUpdated={handleAccountUpdated} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
        {accounts.map((account) => {
          const { icon: Icon, color } = getAccountIcon(account.type)
          return (
            <div key={account.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center space-x-3">
                <div className="bg-background p-2 rounded-lg flex-shrink-0">
                  <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-card-foreground text-sm sm:text-base truncate">{account.name}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground capitalize truncate">{account.type}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <p className="font-semibold text-card-foreground text-sm sm:text-base">{formatCurrency(account.balance || 0)}</p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownRight, MoreHorizontal } from "lucide-react"
import { useRecentTransactions } from "@/hooks/use-firestore"
import { Skeleton } from "@/components/ui/skeleton"

export function RecentTransactions() {
  const { data: transactions, loading, error } = useRecentTransactions(5)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    })
  }

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-card-foreground text-lg sm:text-xl">Transaksi Terbaru</CardTitle>
              <CardDescription className="text-sm sm:text-base">5 transaksi terakhir</CardDescription>
            </div>
            <Button variant="ghost" size="sm" disabled className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg" />
                <div>
                  <Skeleton className="h-4 w-24 sm:w-32 mb-2" />
                  <Skeleton className="h-3 w-20 sm:w-24" />
                </div>
              </div>
              <div className="text-right">
                <Skeleton className="h-4 w-16 sm:w-20 mb-2" />
                <Skeleton className="h-3 w-10 sm:w-12" />
              </div>
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
              <CardTitle className="text-card-foreground text-lg sm:text-xl">Transaksi Terbaru</CardTitle>
              <CardDescription className="text-sm sm:text-base">5 transaksi terakhir</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <p className="text-sm text-red-500">Gagal memuat transaksi: {error}</p>
        </CardContent>
      </Card>
    )
  }

  if (transactions.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-card-foreground text-lg sm:text-xl">Transaksi Terbaru</CardTitle>
              <CardDescription className="text-sm sm:text-base">5 transaksi terakhir</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <p className="text-sm text-muted-foreground text-center py-8">
            Belum ada transaksi. Mulai mencatat pengeluaran dan pemasukan Anda.
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
            <CardTitle className="text-card-foreground text-lg sm:text-xl">Transaksi Terbaru</CardTitle>
            <CardDescription className="text-sm sm:text-base">5 transaksi terakhir</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg flex-shrink-0 ${transaction.type === "income" ? "bg-green-500/10" : "bg-red-500/10"}`}>
                {transaction.type === "income" ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-card-foreground text-sm sm:text-base truncate">{transaction.description}</p>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  {transaction.categoryName || transaction.category} • {transaction.accountName || transaction.account}
                </p>
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-2">
              <p className={`font-semibold text-sm sm:text-base ${transaction.type === "income" ? "text-green-500" : "text-red-500"}`}>
                {transaction.type === "income" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">{formatDate(transaction.date)}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

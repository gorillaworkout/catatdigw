"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Edit, Trash2, TrendingUp } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useIncome } from "@/hooks/use-income"

const categoryColors: Record<string, string> = {
  Gaji: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Freelance: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  Bisnis: "bg-green-500/10 text-green-500 border-green-500/20",
  Investasi: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  Dividen: "bg-teal-500/10 text-teal-500 border-teal-500/20",
  Bonus: "bg-pink-500/10 text-pink-500 border-pink-500/20",
  Hadiah: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  Lainnya: "bg-gray-500/10 text-gray-500 border-gray-500/20",
}

export function IncomesList() {
  const { incomes, loading } = useIncome()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(incomes.length / itemsPerPage)

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
      year: "numeric",
    })
  }

  const paginatedIncomes = incomes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="h-6 w-32 bg-muted animate-pulse rounded" />
            <div className="h-4 w-20 bg-muted animate-pulse rounded" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-8 w-8 bg-muted animate-pulse rounded-lg flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="h-4 w-32 bg-muted animate-pulse rounded mb-2" />
                        <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                      </div>
                    </div>
                  </div>
                  <div className="h-6 w-20 bg-muted animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (incomes.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-card-foreground text-lg sm:text-xl">Daftar Pendapatan</CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <div className="text-muted-foreground">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">Belum ada pendapatan</p>
            <p className="text-sm">Tambahkan pendapatan pertama Anda untuk memulai</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-card-foreground text-lg sm:text-xl">Daftar Pendapatan</CardTitle>
          <div className="text-sm text-muted-foreground">{incomes.length} transaksi</div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {paginatedIncomes.map((income) => (
            <div key={income.id} className="p-3 sm:p-4 hover:bg-muted/50 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="bg-green-500/10 p-2 rounded-lg flex-shrink-0">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-card-foreground truncate text-sm sm:text-base">{income.description}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                        <Badge
                          variant="outline"
                          className={`text-xs ${categoryColors[income.categoryName || 'Lainnya'] || categoryColors["Lainnya"]}`}
                        >
                          {income.categoryName || 'Lainnya'}
                        </Badge>
                        <span className="hidden sm:inline text-sm text-muted-foreground">•</span>
                        <span className="text-xs sm:text-sm text-muted-foreground">{income.accountName || 'Tidak diketahui'}</span>
                        <span className="hidden sm:inline text-sm text-muted-foreground">•</span>
                        <span className="text-xs sm:text-sm text-muted-foreground">{formatDate(income.date)}</span>
                      </div>
                      {income.notes && (
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1 truncate">{income.notes}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <div className="text-right">
                    <div className="text-base sm:text-lg font-semibold text-green-500">+{formatCurrency(income.amount)}</div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover border-border">
                      <DropdownMenuItem className="text-popover-foreground">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-t border-border gap-3">
            <div className="text-sm text-muted-foreground text-center sm:text-left">
              Halaman {currentPage} dari {totalPages}
            </div>
            <div className="flex gap-2 justify-center sm:justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="bg-background border-border text-xs sm:text-sm px-3 py-1 h-8 sm:h-9"
              >
                Sebelumnya
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="bg-background border-border text-xs sm:text-sm px-3 py-1 h-8 sm:h-9"
              >
                Selanjutnya
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

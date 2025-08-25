"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Edit, Trash2, Receipt } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useUserCollection, orderBy } from "@/hooks/use-firestore"

type Expense = {
  id: string
  amount: number
  description: string
  categoryName?: string
  categoryId?: string
  accountName?: string
  accountId?: string
  date: string
  notes?: string
}

const categoryColors: Record<string, string> = {
  "Makanan & Minuman": "bg-green-500/10 text-green-500 border-green-500/20",
  Transportasi: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Hiburan: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  Kesehatan: "bg-red-500/10 text-red-500 border-red-500/20",
  Tagihan: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  Belanja: "bg-pink-500/10 text-pink-500 border-pink-500/20",
  Lainnya: "bg-gray-500/10 text-gray-500 border-gray-500/20",
}

export function ExpensesList() {
  const { data: expenses, loading } = useUserCollection<Expense>("expenses", [orderBy("date", "desc")])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(expenses.length / itemsPerPage)

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

  const paginatedExpenses = expenses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-card-foreground">Daftar Pengeluaran</CardTitle>
          <div className="text-sm text-muted-foreground">{loading ? "Memuat..." : `${expenses.length} transaksi`}</div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {paginatedExpenses.map((expense) => (
            <div key={expense.id} className="p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-red-500/10 p-2 rounded-lg">
                      <Receipt className="h-4 w-4 text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-card-foreground truncate">{expense.description}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="outline"
                          className={categoryColors[expense.categoryName || "Lainnya"] || categoryColors["Lainnya"]}
                        >
                          {expense.categoryName || "Lainnya"}
                        </Badge>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{expense.accountName || expense.accountId}</span>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{formatDate(expense.date)}</span>
                      </div>
                      {expense.notes && <p className="text-sm text-muted-foreground mt-1 truncate">{expense.notes}</p>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-lg font-semibold text-red-500">-{formatCurrency(expense.amount)}</div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
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
          <div className="flex items-center justify-between p-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              Halaman {currentPage} dari {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="bg-background border-border"
              >
                Sebelumnya
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="bg-background border-border"
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

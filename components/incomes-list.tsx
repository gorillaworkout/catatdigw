"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Edit, Trash2, TrendingUp } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data
const incomes = [
  {
    id: 1,
    description: "Gaji Bulanan",
    amount: 8500000,
    category: "Gaji",
    account: "BCA Tabungan",
    date: "2024-06-28",
    notes: "Gaji bulan Juni dari perusahaan",
  },
  {
    id: 2,
    description: "Freelance Web Development",
    amount: 2500000,
    category: "Freelance",
    account: "BCA Tabungan",
    date: "2024-06-25",
    notes: "Project website untuk klien startup",
  },
  {
    id: 3,
    description: "Dividen Saham",
    amount: 450000,
    category: "Dividen",
    account: "Investasi",
    date: "2024-06-20",
    notes: "Dividen dari portfolio saham",
  },
  {
    id: 4,
    description: "Bonus Kinerja",
    amount: 1200000,
    category: "Bonus",
    account: "BCA Tabungan",
    date: "2024-06-15",
    notes: "Bonus kinerja Q2 2024",
  },
  {
    id: 5,
    description: "Penjualan Online",
    amount: 850000,
    category: "Bisnis",
    account: "BCA Tabungan",
    date: "2024-06-12",
    notes: "Penjualan produk di marketplace",
  },
  {
    id: 6,
    description: "Hadiah Ulang Tahun",
    amount: 500000,
    category: "Hadiah",
    account: "Cash",
    date: "2024-06-10",
    notes: "Hadiah uang dari keluarga",
  },
]

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

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-card-foreground">Daftar Pendapatan</CardTitle>
          <div className="text-sm text-muted-foreground">{incomes.length} transaksi</div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {paginatedIncomes.map((income) => (
            <div key={income.id} className="p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-green-500/10 p-2 rounded-lg">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-card-foreground truncate">{income.description}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="outline"
                          className={categoryColors[income.category] || categoryColors["Lainnya"]}
                        >
                          {income.category}
                        </Badge>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{income.account}</span>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{formatDate(income.date)}</span>
                      </div>
                      {income.notes && <p className="text-sm text-muted-foreground mt-1 truncate">{income.notes}</p>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-lg font-semibold text-green-500">+{formatCurrency(income.amount)}</div>
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

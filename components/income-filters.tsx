"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Filter, X, Calendar } from "lucide-react"

const categories = [
  "Semua Kategori",
  "Gaji",
  "Freelance",
  "Bisnis",
  "Investasi",
  "Dividen",
  "Bonus",
  "Hadiah",
  "Lainnya",
]

const accounts = ["Semua Rekening", "BCA Tabungan", "Cash", "Investasi"]

const sortOptions = [
  { value: "date-desc", label: "Tanggal Terbaru" },
  { value: "date-asc", label: "Tanggal Terlama" },
  { value: "amount-desc", label: "Jumlah Terbesar" },
  { value: "amount-asc", label: "Jumlah Terkecil" },
]

export function IncomeFilters() {
  const [filters, setFilters] = useState({
    search: "",
    category: "Semua Kategori",
    account: "Semua Rekening",
    dateFrom: "",
    dateTo: "",
    sort: "date-desc",
  })

  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "Semua Kategori",
      account: "Semua Rekening",
      dateFrom: "",
      dateTo: "",
      sort: "date-desc",
    })
    setShowAdvanced(false)
  }

  const hasActiveFilters =
    filters.search !== "" ||
    filters.category !== "Semua Kategori" ||
    filters.account !== "Semua Rekening" ||
    filters.dateFrom !== "" ||
    filters.dateTo !== ""

  return (
    <Card className="bg-card border-border mb-6">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Search and basic filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari pendapatan..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10 bg-background border-border"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="bg-background border-border"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              {hasActiveFilters && (
                <Button variant="outline" size="sm" onClick={clearFilters} className="bg-background border-border">
                  <X className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* Advanced filters */}
          {showAdvanced && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border">
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">Kategori</label>
                <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {categories.map((category) => (
                      <SelectItem key={category} value={category} className="text-popover-foreground">
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">Rekening</label>
                <Select value={filters.account} onValueChange={(value) => handleFilterChange("account", value)}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {accounts.map((account) => (
                      <SelectItem key={account} value={account} className="text-popover-foreground">
                        {account}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">Dari Tanggal</label>
                <div className="relative">
                  <Input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                    className="bg-background border-border"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">Sampai Tanggal</label>
                <div className="relative">
                  <Input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                    className="bg-background border-border"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>
          )}

          {/* Sort */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Urutkan:</span>
              <Select value={filters.sort} onValueChange={(value) => handleFilterChange("sort", value)}>
                <SelectTrigger className="w-40 bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-popover-foreground">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {hasActiveFilters && <span className="text-sm text-muted-foreground">Filter aktif</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

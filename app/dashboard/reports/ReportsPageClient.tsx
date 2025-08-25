"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Table, CalendarIcon, TrendingUp, TrendingDown } from "lucide-react"
import { format } from "date-fns"
import { useState } from "react"

export default function ReportsPageClient() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  })
  const [reportType, setReportType] = useState("comprehensive")

  const reportTypes = [
    { value: "comprehensive", label: "Laporan Komprehensif" },
    { value: "income", label: "Laporan Pendapatan" },
    { value: "expense", label: "Laporan Pengeluaran" },
    { value: "balance", label: "Neraca Keuangan" },
    { value: "cashflow", label: "Arus Kas" },
  ]

  const recentReports = [
    { id: 1, name: "Laporan Bulanan Oktober 2024", type: "PDF", date: "2024-11-01", size: "2.3 MB" },
    { id: 2, name: "Analisis Pengeluaran Q3 2024", type: "Excel", date: "2024-10-15", size: "1.8 MB" },
    { id: 3, name: "Laporan Tahunan 2024", type: "PDF", date: "2024-10-01", size: "4.1 MB" },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Laporan Keuangan</h1>
          <p className="text-muted-foreground">Generate dan download laporan keuangan dalam berbagai format</p>
        </div>

        {/* Report Generator */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generate Laporan Baru
            </CardTitle>
            <CardDescription>Pilih jenis laporan dan periode untuk generate laporan keuangan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Jenis Laporan</label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Periode</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from && dateRange.to
                        ? `${format(dateRange.from, "dd MMM yyyy")} - ${format(dateRange.to, "dd MMM yyyy")}`
                        : "Pilih periode"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={{ from: dateRange.from, to: dateRange.to }}
                      onSelect={(range) => range && setDateRange(range)}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex gap-3">
              <Button className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                <Table className="mr-2 h-4 w-4" />
                Download Excel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Report Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Preview Laporan</CardTitle>
              <CardDescription>Ringkasan data yang akan disertakan dalam laporan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Pendapatan</span>
                    <div className="flex items-center gap-1 text-green-600">
                      <TrendingUp className="h-4 w-4" />
                      <span className="font-semibold">Rp 15.750.000</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Pengeluaran</span>
                    <div className="flex items-center gap-1 text-red-600">
                      <TrendingDown className="h-4 w-4" />
                      <span className="font-semibold">Rp 8.250.000</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm font-medium">Saldo Bersih</span>
                    <span className="font-bold text-green-600">Rp 7.500.000</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Jumlah Transaksi</span>
                    <span className="font-semibold">247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Kategori Aktif</span>
                    <span className="font-semibold">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Rekening</span>
                    <span className="font-semibold">5</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Laporan Terbaru</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{report.name}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{report.type}</Badge>
                      <span className="text-xs text-muted-foreground">{report.size}</span>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

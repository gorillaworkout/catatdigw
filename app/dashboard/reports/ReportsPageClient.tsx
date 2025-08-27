"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Table, CalendarIcon, TrendingUp, TrendingDown } from "lucide-react"
import { format } from "date-fns"
import { useState } from "react"
import { SubscriptionGuardButton } from "@/components/subscription-guard-button"

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
            <SubscriptionGuardButton className="flex-1" tooltipText="Subscription berakhir. Perpanjang subscription untuk mengunduh laporan PDF.">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </SubscriptionGuardButton>
            <SubscriptionGuardButton variant="outline" className="flex-1 bg-transparent" tooltipText="Subscription berakhir. Perpanjang subscription untuk mengunduh laporan Excel.">
              <Table className="mr-2 h-4 w-4" />
              Download Excel
            </SubscriptionGuardButton>
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            Laporan Terbaru
          </CardTitle>
          <CardDescription>Laporan yang telah di-generate sebelumnya</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{report.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {report.date} • {report.size}
                    </p>
                  </div>
                </div>
                <Badge variant="outline">{report.type}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

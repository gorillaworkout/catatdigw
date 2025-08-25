"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts"
import { useIncome } from "@/hooks/use-income"

export function IncomeCharts() {
  const { 
    incomes, 
    loading, 
    getIncomeByCategory, 
    getMonthlyIncomeData, 
    getDailyIncomeTrend 
  } = useIncome()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value)
  }

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
          <Card className="bg-card border-border overflow-hidden">
            <CardHeader className="pb-3 sm:pb-6">
              <div className="h-6 w-32 bg-muted animate-pulse rounded mb-2" />
              <div className="h-4 w-48 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              <div className="w-full h-56 sm:h-64 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (incomes.length === 0) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <Card className="bg-card border-border">
          <CardContent className="p-8 text-center">
            <div className="text-muted-foreground">
              <BarChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Belum ada data untuk ditampilkan</p>
              <p className="text-sm">Tambahkan pendapatan untuk melihat grafik dan analisis</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Get category breakdown with colors
  const categoryData = getIncomeByCategory()
  const categoryBreakdown = categoryData.map((item, index) => {
    const colors = ["#3b82f6", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b", "#06b6d4", "#84cc16", "#f97316"]
    return {
      name: item.name,
      value: item.value,
      color: colors[index % colors.length]
    }
  })

  // Get monthly data for the last 6 months
  const monthlyIncome = getMonthlyIncomeData(6)

  // Get daily trend for the last 30 days
  const dailyTrend = getDailyIncomeTrend(30)

  return (
    <div className="space-y-4 sm:space-y-6">

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Category Breakdown */}
        <Card className="bg-card border-border overflow-hidden">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-card-foreground text-lg sm:text-xl">Breakdown Kategori</CardTitle>
            <CardDescription className="text-sm sm:text-base">Pendapatan berdasarkan kategori bulan ini</CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <ChartContainer
              config={{
                value: {
                  label: "Jumlah",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="w-full h-56 sm:h-64 aspect-auto overflow-hidden"
            >
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />} />
              </PieChart>
            </ChartContainer>
            <div className="mt-3 sm:mt-4 space-y-2">
              {categoryBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-card-foreground truncate">{item.name}</span>
                  </div>
                  <span className="text-muted-foreground font-medium">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card className="bg-card border-border overflow-hidden">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-card-foreground text-lg sm:text-xl">Trend Bulanan</CardTitle>
            <CardDescription className="text-sm sm:text-base">Pendapatan 6 bulan terakhir</CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <ChartContainer
              config={{
                value: {
                  label: "Jumlah",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="w-full h-56 sm:h-64 aspect-auto overflow-hidden"
            >
              <BarChart data={monthlyIncome}>
                <XAxis dataKey="month" />
                <YAxis />
                <Bar dataKey="amount" fill="#3b82f6" />
                <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Daily Trend */}
      <Card className="bg-card border-border overflow-hidden">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-card-foreground text-lg sm:text-xl">Trend Harian</CardTitle>
          <CardDescription className="text-sm sm:text-base">Pendapatan 30 hari terakhir</CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <ChartContainer
            config={{
              value: {
                label: "Jumlah",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="w-full h-56 sm:h-64 aspect-auto overflow-hidden"
          >
            <LineChart data={dailyTrend}>
              <XAxis dataKey="date" />
              <YAxis />
              <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2} />
              <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}

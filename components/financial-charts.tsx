"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"

// Mock data
const monthlyData = [
  { month: "Jan", income: 7500000, expenses: 3200000 },
  { month: "Feb", income: 8200000, expenses: 2800000 },
  { month: "Mar", income: 7800000, expenses: 3500000 },
  { month: "Apr", income: 9100000, expenses: 3100000 },
  { month: "May", income: 8500000, expenses: 3250000 },
  { month: "Jun", income: 8800000, expenses: 2900000 },
]

const categoryData = [
  { name: "Makanan", value: 1200000, color: "#3b82f6" },
  { name: "Transportasi", value: 800000, color: "#ef4444" },
  { name: "Hiburan", value: 600000, color: "#f59e0b" },
  { name: "Belanja", value: 450000, color: "#10b981" },
  { name: "Lainnya", value: 200000, color: "#8b5cf6" },
]

const trendData = [
  { date: "1 Jun", balance: 12500000 },
  { date: "8 Jun", balance: 13200000 },
  { date: "15 Jun", balance: 14100000 },
  { date: "22 Jun", balance: 15200000 },
  { date: "29 Jun", balance: 15750000 },
]

export function FinancialCharts() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Income vs Expenses Chart */}
      <Card className="bg-card border-border overflow-hidden">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-card-foreground text-lg sm:text-xl">Pendapatan vs Pengeluaran</CardTitle>
          <CardDescription className="text-sm sm:text-base">Perbandingan bulanan dalam 6 bulan terakhir</CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <ChartContainer
            config={{
              income: { label: "Pendapatan", color: "hsl(var(--chart-1))" },
              expenses: { label: "Pengeluaran", color: "hsl(var(--chart-2))" },
            }}
            className="w-full h-64 sm:h-80 aspect-auto overflow-hidden"
          >
            <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <XAxis
                dataKey="month"
                fontSize={12}
                tick={{ fontSize: "12px" }}
              />
              <YAxis
                tickFormatter={(value) => `${value / 1000000}M`}
                fontSize={12}
                tick={{ fontSize: "12px" }}
                width={40}
              />
              <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />} />
              <Bar dataKey="income" fill="var(--color-income)" radius={4} />
              <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Category Breakdown */}
        <Card className="bg-card border-border overflow-hidden">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-card-foreground text-lg sm:text-xl">Kategori Pengeluaran</CardTitle>
            <CardDescription className="text-sm sm:text-base">Breakdown pengeluaran bulan ini</CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <ChartContainer
              config={{
                value: { label: "Jumlah", color: "hsl(var(--chart-2))" },
              }}
              className="w-full h-56 sm:h-64 aspect-auto overflow-hidden"
            >
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />} />
              </PieChart>
            </ChartContainer>
            <div className="mt-3 sm:mt-4 space-y-2">
              {categoryData.map((item, index) => (
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

        {/* Balance Trend */}
        <Card className="bg-card border-border overflow-hidden">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-card-foreground text-lg sm:text-xl">Tren Saldo</CardTitle>
            <CardDescription className="text-sm sm:text-base">Perkembangan saldo dalam 1 bulan terakhir</CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <ChartContainer
              config={{
                balance: { label: "Saldo", color: "hsl(var(--chart-1))" },
              }}
              className="w-full h-56 sm:h-64 aspect-auto overflow-hidden"
            >
              <LineChart data={trendData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <XAxis
                  dataKey="date"
                  fontSize={12}
                  tick={{ fontSize: "12px" }}
                />
                <YAxis
                  tickFormatter={(value) => `${value / 1000000}M`}
                  fontSize={12}
                  tick={{ fontSize: "12px" }}
                  width={40}
                />
                <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />} />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="var(--color-balance)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-balance)", strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

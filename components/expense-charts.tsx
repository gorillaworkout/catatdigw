"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts"

// Mock data
const monthlyExpenses = [
  { month: "Jan", amount: 2800000 },
  { month: "Feb", amount: 3200000 },
  { month: "Mar", amount: 2900000 },
  { month: "Apr", amount: 3500000 },
  { month: "May", amount: 3100000 },
  { month: "Jun", amount: 3250000 },
]

const categoryBreakdown = [
  { name: "Makanan & Minuman", value: 1200000, color: "#10b981" },
  { name: "Transportasi", value: 800000, color: "#3b82f6" },
  { name: "Hiburan", value: 600000, color: "#8b5cf6" },
  { name: "Tagihan", value: 450000, color: "#f59e0b" },
  { name: "Belanja", value: 200000, color: "#ef4444" },
]

const dailyTrend = [
  { date: "1", amount: 150000 },
  { date: "5", amount: 320000 },
  { date: "10", amount: 180000 },
  { date: "15", amount: 450000 },
  { date: "20", amount: 280000 },
  { date: "25", amount: 380000 },
  { date: "30", amount: 220000 },
]

export function ExpenseCharts() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Monthly Expenses Trend */}
      <Card className="bg-card border-border overflow-hidden">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-card-foreground text-lg sm:text-xl">Tren Pengeluaran Bulanan</CardTitle>
          <CardDescription className="text-sm sm:text-base">Pengeluaran dalam 6 bulan terakhir</CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <ChartContainer
            config={{
              amount: {
                label: "Pengeluaran",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="w-full h-64 sm:h-80 aspect-auto overflow-hidden"
          >
            <BarChart data={monthlyExpenses} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <XAxis dataKey="month" fontSize={12} tick={{ fontSize: "12px" }} />
              <YAxis tickFormatter={(value) => `${value / 1000000}M`} fontSize={12} tick={{ fontSize: "12px" }} width={40} />
              <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />} />
              <Bar dataKey="amount" fill="var(--color-amount)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Category Breakdown */}
        <Card className="bg-card border-border overflow-hidden">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-card-foreground text-lg sm:text-xl">Breakdown Kategori</CardTitle>
            <CardDescription className="text-sm sm:text-base">Pengeluaran berdasarkan kategori bulan ini</CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <ChartContainer
              config={{
                value: {
                  label: "Jumlah",
                  color: "hsl(var(--chart-2))",
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

        {/* Daily Trend */}
        <Card className="bg-card border-border overflow-hidden">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-card-foreground text-lg sm:text-xl">Tren Harian</CardTitle>
            <CardDescription className="text-sm sm:text-base">Pengeluaran harian bulan ini</CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <ChartContainer
              config={{
                amount: {
                  label: "Pengeluaran",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="w-full h-56 sm:h-64 aspect-auto overflow-hidden"
            >
              <LineChart data={dailyTrend} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <XAxis dataKey="date" fontSize={12} tick={{ fontSize: "12px" }} />
                <YAxis tickFormatter={(value) => `${value / 1000}K`} fontSize={12} tick={{ fontSize: "12px" }} width={40} />
                <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />} />
                {/* Use a bold line without dots for clarity */}
                <Line type="monotone" dataKey="amount" stroke="var(--color-amount)" strokeWidth={3} dot={false} activeDot={{ r: 5 }} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts"

// Mock data
const monthlyIncome = [
  { month: "Jan", amount: 7500000 },
  { month: "Feb", amount: 8200000 },
  { month: "Mar", amount: 7800000 },
  { month: "Apr", amount: 9100000 },
  { month: "May", amount: 8500000 },
  { month: "Jun", amount: 8800000 },
]

const categoryBreakdown = [
  { name: "Gaji", value: 8500000, color: "#3b82f6" },
  { name: "Freelance", value: 2500000, color: "#8b5cf6" },
  { name: "Bonus", value: 1200000, color: "#ec4899" },
  { name: "Bisnis", value: 850000, color: "#10b981" },
  { name: "Dividen", value: 450000, color: "#f59e0b" },
]

const dailyTrend = [
  { date: "1", amount: 0 },
  { date: "10", amount: 500000 },
  { date: "15", amount: 1700000 },
  { date: "20", amount: 2150000 },
  { date: "25", amount: 4650000 },
  { date: "28", amount: 13150000 },
]

export function IncomeCharts() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value)
  }

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
      </div>
    </div>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { XAxis, YAxis, PieChart, Pie, Cell, LineChart, Line } from "recharts"
import { where, orderBy } from "firebase/firestore"
import { useThisMonthRange, useUserCollection } from "@/hooks/use-firestore"

type Expense = {
  amount: number
  category?: string
  date?: string | number
}

export function ExpenseCharts() {
  const { start, end } = useThisMonthRange()
  const { data: expenses, loading } = useUserCollection<Expense>("expenses", [
    where("date", ">=", start.toISOString()),
    where("date", "<", end.toISOString()),
    orderBy("date", "asc"),
  ])

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
      {/* <Card className="bg-card border-border overflow-hidden">
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
      </Card> */}

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
                  data={(() => {
                    const categoryMap = new Map<string, number>()
                    expenses.forEach((e) => {
                      const cat = e.category || "Tanpa Kategori"
                      categoryMap.set(cat, (categoryMap.get(cat) || 0) + (Number(e.amount) || 0))
                    })
                    const palette = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#14b8a6", "#a855f7", "#f97316"]
                    return Array.from(categoryMap.entries()).map(([name, value], i) => ({ name, value, color: palette[i % palette.length] }))
                  })()}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(() => {
                    const categoryMap = new Map<string, number>()
                    expenses.forEach((e) => {
                      const cat = e.category || "Tanpa Kategori"
                      categoryMap.set(cat, (categoryMap.get(cat) || 0) + (Number(e.amount) || 0))
                    })
                    const palette = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#14b8a6", "#a855f7", "#f97316"]
                    const breakdown = Array.from(categoryMap.entries()).map(([name, value], i) => ({ name, value, color: palette[i % palette.length] }))
                    return breakdown.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)
                  })()}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />} />
              </PieChart>
            </ChartContainer>
            <div className="mt-3 sm:mt-4 space-y-2">
              {(() => {
                const categoryMap = new Map<string, number>()
                expenses.forEach((e) => {
                  const cat = e.category || "Tanpa Kategori"
                  categoryMap.set(cat, (categoryMap.get(cat) || 0) + (Number(e.amount) || 0))
                })
                const palette = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#14b8a6", "#a855f7", "#f97316"]
                const breakdown = Array.from(categoryMap.entries()).map(([name, value], i) => ({ name, value, color: palette[i % palette.length] }))
                if (loading) return <div className="text-xs sm:text-sm text-muted-foreground">Memuat...</div>
                if (breakdown.length === 0) return <div className="text-xs sm:text-sm text-muted-foreground">Belum ada data bulan ini</div>
                return breakdown.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-card-foreground truncate">{item.name}</span>
                    </div>
                    <span className="text-muted-foreground font-medium">{formatCurrency(item.value)}</span>
                  </div>
                ))
              })()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

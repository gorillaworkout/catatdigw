"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, LineChart, Line, PieChart, Pie, Cell } from "recharts"
import { useUserCollection, useThisMonthRange } from "@/hooks/use-firestore"
import { orderBy, where } from "firebase/firestore"

export function FinancialCharts() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value)
  }

  // 6 bulan terakhir income vs expenses (agregasi client-side)
  const now = new Date()
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  const { data: incomes } = useUserCollection<any>("income", [
    where("date", ">=", sixMonthsAgo.toISOString()),
    where("date", "<", nextMonth.toISOString()),
    orderBy("date", "asc"),
  ])
  const { data: expenses } = useUserCollection<any>("expenses", [
    where("date", ">=", sixMonthsAgo.toISOString()),
    where("date", "<", nextMonth.toISOString()),
    orderBy("date", "asc"),
  ])

  const monthKeys = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(sixMonthsAgo.getFullYear(), sixMonthsAgo.getMonth() + i, 1)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
  })
  const monthLabels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  const monthly = monthKeys.map((key) => ({ key, month: monthLabels[Number(key.split("-")[1]) - 1], income: 0, expenses: 0 }))
  incomes.forEach((i: any) => {
    const d = new Date(i.date)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    const row = monthly.find((m) => m.key === key)
    if (row) row.income += Number(i.amount || 0)
  })
  expenses.forEach((e: any) => {
    const d = new Date(e.date)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    const row = monthly.find((m) => m.key === key)
    if (row) row.expenses += Number(e.amount || 0)
  })

  // Breakdown kategori bulan ini
  const { start, end } = useThisMonthRange()
  const { data: expensesThisMonth } = useUserCollection<any>("expenses", [
    where("date", ">=", start.toISOString()),
    where("date", "<", end.toISOString()),
    orderBy("date", "asc"),
  ])
  const categoryMap = new Map<string, number>()
  expensesThisMonth.forEach((e) => {
    const name = e.categoryName || "Tanpa Kategori"
    categoryMap.set(name, (categoryMap.get(name) || 0) + Number(e.amount || 0))
  })
  const palette = ["#3b82f6", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6", "#14b8a6", "#f97316", "#22c55e"]
  const categoryData = Array.from(categoryMap.entries()).map(([name, value], i) => ({ name, value, color: palette[i % palette.length] }))

  // Tren saldo: total saldo akun saat ini (flat). Tanpa dummy, tampilkan garis datar.
  const { data: accounts } = useUserCollection<any>("accounts")
  const totalBalance = accounts.reduce((sum, a) => sum + Number(a.balance || 0), 0)
  const days = Array.from({ length: 5 }, (_, i) => i) // ringkas: 5 titik datar
  const trendData = days.map((i) => ({ date: `${i + 1}`, balance: totalBalance }))

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
            <BarChart data={monthly} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
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

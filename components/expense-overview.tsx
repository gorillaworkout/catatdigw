"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingDown, Calendar, Target, PieChart } from "lucide-react"

// Mock data
const expenseData = {
  thisMonth: 3250000,
  lastMonth: 2890000,
  thisYear: 28500000,
  budget: 4000000,
  categories: 8,
  transactions: 45,
}

export function ExpenseOverview() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const monthlyChange = ((expenseData.thisMonth - expenseData.lastMonth) / expenseData.lastMonth) * 100
  const budgetUsed = (expenseData.thisMonth / expenseData.budget) * 100

  const cards = [
    {
      title: "Pengeluaran Bulan Ini",
      value: formatCurrency(expenseData.thisMonth),
      icon: TrendingDown,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      change: `${monthlyChange > 0 ? "+" : ""}${monthlyChange.toFixed(1)}%`,
      changeType: monthlyChange > 0 ? ("negative" as const) : ("positive" as const),
      description: "dari bulan lalu",
    },
    {
      title: "Budget Terpakai",
      value: `${budgetUsed.toFixed(1)}%`,
      icon: Target,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      change: formatCurrency(expenseData.budget - expenseData.thisMonth),
      changeType: "neutral" as const,
      description: "sisa budget",
    },
    {
      title: "Pengeluaran Tahun Ini",
      value: formatCurrency(expenseData.thisYear),
      icon: Calendar,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      change: `${expenseData.transactions} transaksi`,
      changeType: "neutral" as const,
      description: "total transaksi",
    },
    {
      title: "Kategori Aktif",
      value: expenseData.categories.toString(),
      icon: PieChart,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      change: "8 kategori",
      changeType: "neutral" as const,
      description: "digunakan bulan ini",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">{card.title}</CardTitle>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{card.value}</div>
            <p className="text-xs text-muted-foreground">
              <span
                className={
                  card.changeType === "positive"
                    ? "text-green-500"
                    : card.changeType === "negative"
                      ? "text-red-500"
                      : "text-muted-foreground"
                }
              >
                {card.change}
              </span>{" "}
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Wallet, PieChart } from "lucide-react"

// Mock data - in real app, this would come from your database
const mockData = {
  totalBalance: 15750000,
  totalIncome: 8500000,
  totalExpenses: 3250000,
  savingsRate: 62,
}

export function DashboardOverview() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const cards = [
    {
      title: "Total Saldo",
      value: formatCurrency(mockData.totalBalance),
      icon: Wallet,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      change: "+12.5%",
      changeType: "positive" as const,
    },
    {
      title: "Total Pendapatan",
      value: formatCurrency(mockData.totalIncome),
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      change: "+8.2%",
      changeType: "positive" as const,
    },
    {
      title: "Total Pengeluaran",
      value: formatCurrency(mockData.totalExpenses),
      icon: TrendingDown,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      change: "-3.1%",
      changeType: "negative" as const,
    },
    {
      title: "Tingkat Tabungan",
      value: `${mockData.savingsRate}%`,
      icon: PieChart,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      change: "+5.3%",
      changeType: "positive" as const,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {cards.map((card, index) => (
        <Card key={index} className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-card-foreground">{card.title}</CardTitle>
            <div className={`p-1.5 sm:p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-3 w-3 sm:h-4 sm:w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-card-foreground">{card.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className={card.changeType === "positive" ? "text-green-500" : "text-red-500"}>{card.change}</span>{" "}
              dari bulan lalu
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Calendar, Target, PieChart } from "lucide-react"

// Mock data
const incomeData = {
  thisMonth: 8500000,
  lastMonth: 7800000,
  thisYear: 85000000,
  target: 10000000,
  sources: 5,
  transactions: 12,
}

export function IncomeOverview() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const monthlyChange = ((incomeData.thisMonth - incomeData.lastMonth) / incomeData.lastMonth) * 100
  const targetAchieved = (incomeData.thisMonth / incomeData.target) * 100

  const cards = [
    {
      title: "Pendapatan Bulan Ini",
      value: formatCurrency(incomeData.thisMonth),
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      change: `${monthlyChange > 0 ? "+" : ""}${monthlyChange.toFixed(1)}%`,
      changeType: monthlyChange > 0 ? ("positive" as const) : ("negative" as const),
      description: "dari bulan lalu",
    },
    {
      title: "Target Tercapai",
      value: `${targetAchieved.toFixed(1)}%`,
      icon: Target,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      change: formatCurrency(incomeData.target - incomeData.thisMonth),
      changeType: "neutral" as const,
      description: "sisa target",
    },
    {
      title: "Pendapatan Tahun Ini",
      value: formatCurrency(incomeData.thisYear),
      icon: Calendar,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      change: `${incomeData.transactions} transaksi`,
      changeType: "neutral" as const,
      description: "total transaksi",
    },
    {
      title: "Sumber Pendapatan",
      value: incomeData.sources.toString(),
      icon: PieChart,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      change: "5 sumber",
      changeType: "neutral" as const,
      description: "aktif bulan ini",
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

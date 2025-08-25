"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Calendar, Target, PieChart } from "lucide-react"
import { useIncome } from "@/hooks/use-income"

export function IncomeOverview() {
  const { 
    incomes, 
    loading, 
    getTotalIncome, 
    getIncomesByMonth, 
    getIncomesByYear 
  } = useIncome()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              <div className="h-8 w-8 bg-muted animate-pulse rounded-lg" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-20 bg-muted animate-pulse rounded mb-2" />
              <div className="h-3 w-32 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1
  const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1
  const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear

  const thisMonthIncomes = getIncomesByMonth(currentYear, currentMonth)
  const lastMonthIncomes = getIncomesByMonth(lastMonthYear, lastMonth)
  const thisYearIncomes = getIncomesByYear(currentYear)

  const thisMonthTotal = getTotalIncome(thisMonthIncomes)
  const lastMonthTotal = getTotalIncome(lastMonthIncomes)
  const thisYearTotal = getTotalIncome(thisYearIncomes)
  
  // Target is set to 10% more than last month's income, or 10M if no last month data
  const target = lastMonthTotal > 0 ? lastMonthTotal * 1.1 : 10000000
  const targetAchieved = target > 0 ? (thisMonthTotal / target) * 100 : 0
  const monthlyChange = lastMonthTotal > 0 ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 : 0

  // Get unique categories for this month
  const uniqueCategories = new Set(thisMonthIncomes.map(income => income.categoryName || 'Lainnya')).size

  const cards = [
    {
      title: "Pendapatan Bulan Ini",
      value: formatCurrency(thisMonthTotal),
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
      change: formatCurrency(target - thisMonthTotal),
      changeType: "neutral" as const,
      description: "sisa target",
    },
    {
      title: "Pendapatan Tahun Ini",
      value: formatCurrency(thisYearTotal),
      icon: Calendar,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      change: `${thisYearIncomes.length} transaksi`,
      changeType: "neutral" as const,
      description: "total transaksi",
    },
    {
      title: "Sumber Pendapatan",
      value: uniqueCategories.toString(),
      icon: PieChart,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      change: `${uniqueCategories} sumber`,
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

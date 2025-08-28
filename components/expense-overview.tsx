"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingDown, Calendar, Target, PieChart, CreditCard } from "lucide-react"
import { orderBy, where } from "firebase/firestore"
import { useThisMonthRange, useUserCollection } from "@/hooks/use-firestore"

export function ExpenseOverview() {
  const { start, end } = useThisMonthRange()
  const { data: expensesThisMonth } = useUserCollection<any>("expenses", [
    where("date", ">=", start.toISOString()),
    where("date", "<", end.toISOString()),
    orderBy("date", "asc"),
  ])
  const thisMonth = expensesThisMonth.reduce((sum, e) => sum + Number(e.amount || 0), 0)

  const lastMonthStart = new Date(start.getFullYear(), start.getMonth() - 1, 1)
  const lastMonthEnd = new Date(start.getFullYear(), start.getMonth(), 1)
  const { data: expensesLastMonth } = useUserCollection<any>("expenses", [
    where("date", ">=", lastMonthStart.toISOString()),
    where("date", "<", lastMonthEnd.toISOString()),
    orderBy("date", "asc"),
  ])
  const lastMonth = expensesLastMonth.reduce((sum, e) => sum + Number(e.amount || 0), 0)

  const yearStart = new Date(start.getFullYear(), 0, 1)
  const nextYearStart = new Date(start.getFullYear() + 1, 0, 1)
  const { data: expensesThisYear } = useUserCollection<any>("expenses", [
    where("date", ">=", yearStart.toISOString()),
    where("date", "<", nextYearStart.toISOString()),
    orderBy("date", "asc"),
  ])
  const thisYear = expensesThisYear.reduce((sum, e) => sum + Number(e.amount || 0), 0)

  const categoriesUsed = new Set<string>()
  expensesThisMonth.forEach((e) => categoriesUsed.add(e.categoryId || e.categoryName || "-"))
  const activeCategories = categoriesUsed.has("-") ? categoriesUsed.size - 1 : categoriesUsed.size

  // Calculate installment payments
  const installmentPaymentsThisMonth = expensesThisMonth.filter((e: any) => e.installmentPaymentId)
  const installmentAmountThisMonth = installmentPaymentsThisMonth.reduce((sum, e) => sum + Number(e.amount || 0), 0)
  const installmentPaymentsThisYear = expensesThisYear.filter((e: any) => e.installmentPaymentId)
  const installmentAmountThisYear = installmentPaymentsThisYear.reduce((sum, e) => sum + Number(e.amount || 0), 0)

  const budget = 0 // default 0 jika belum ada fitur budget
  const transactions = expensesThisMonth.length
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const monthlyChange = lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : 0
  const budgetUsed = budget > 0 ? (thisMonth / budget) * 100 : 0

  const cards = [
    {
      title: "Pengeluaran Bulan Ini",
      value: formatCurrency(thisMonth),
      icon: TrendingDown,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      change: `${monthlyChange > 0 ? "+" : ""}${monthlyChange.toFixed(1)}%`,
      changeType: monthlyChange > 0 ? ("negative" as const) : ("positive" as const),
      description: "dari bulan lalu",
    },
    {
      title: "Pembayaran Cicilan",
      value: formatCurrency(installmentAmountThisMonth),
      icon: CreditCard,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      change: `${installmentPaymentsThisMonth.length} pembayaran`,
      changeType: "neutral" as const,
      description: "bulan ini",
    },
    {
      title: "Pengeluaran Tahun Ini",
      value: formatCurrency(thisYear),
      icon: Calendar,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      change: `${transactions} transaksi`,
      changeType: "neutral" as const,
      description: "total transaksi",
    },
    {
      title: "Cicilan Tahun Ini",
      value: formatCurrency(installmentAmountThisYear),
      icon: CreditCard,
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
      change: `${installmentPaymentsThisYear.length} pembayaran`,
      changeType: "neutral" as const,
      description: "tahun ini",
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

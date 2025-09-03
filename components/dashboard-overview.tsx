"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Wallet, PieChart, Plus, CreditCard } from "lucide-react"
import { useUserCollection } from "@/hooks/use-firestore"
import { AddAccountModal } from "@/components/add-account-modal"
import { SubscriptionGuardButtonDashboard } from "@/components/subscription-guard-button-dashboard"

export function DashboardOverview() {
  const { data: accounts } = useUserCollection<any>("accounts")
  const { data: incomes } = useUserCollection<any>("income")
  const { data: expenses } = useUserCollection<any>("expenses")

  const totalBalance = accounts.reduce((sum, a) => sum + Number(a.balance || 0), 0)
  const totalIncome = incomes.reduce((sum, i) => sum + Number(i.amount || 0), 0)
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0)
  
  // Calculate installment payments
  const installmentPayments = expenses.filter((e: any) => e.installmentPaymentId)
  const totalInstallmentPayments = installmentPayments.reduce((sum, e) => sum + Number(e.amount || 0), 0)
  const installmentCount = installmentPayments.length
  
  const savingsRate = totalIncome > 0 ? Math.max(0, Math.round(((totalIncome - totalExpenses) / totalIncome) * 100)) : 0
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleAccountUpdated = () => {
    // The useUserCollection hook will automatically refresh the data
    // via onSnapshot, so no manual refresh is needed
  }

  const cards = [
    { title: "Total Saldo", value: formatCurrency(totalBalance), icon: Wallet, color: "text-blue-500", bgColor: "bg-blue-500/10", change: "", changeType: "positive" as const },
    { title: "Total Pendapatan", value: formatCurrency(totalIncome), icon: TrendingUp, color: "text-green-500", bgColor: "bg-green-500/10", change: "", changeType: "positive" as const },
    { title: "Total Pengeluaran", value: formatCurrency(totalExpenses), icon: TrendingDown, color: "text-red-500", bgColor: "bg-red-500/10", change: "", changeType: "negative" as const },
    { title: "Pembayaran Cicilan", value: formatCurrency(totalInstallmentPayments), icon: CreditCard, color: "text-indigo-500", bgColor: "bg-indigo-500/10", change: `${installmentCount} pembayaran`, changeType: "neutral" as const },
  ]

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {cards.map((card, index) => (
          <Card key={index} className="bg-card border-border hover:shadow-md transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 px-4 sm:px-6 pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-card-foreground leading-tight">{card.title}</CardTitle>
              <div className={`p-2 sm:p-2.5 rounded-xl ${card.bgColor} flex-shrink-0`}>
                <card.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-6">
              <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-card-foreground mb-2 break-words leading-tight">{card.value}</div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-tight">
                <span className={card.changeType === "positive" ? "text-green-500" : "text-red-500"}>{card.change}</span>{" "}
                dari bulan lalu
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

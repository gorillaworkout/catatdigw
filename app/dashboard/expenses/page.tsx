import { Suspense } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ExpenseOverview } from "@/components/expense-overview"
import { ExpenseFilters } from "@/components/expense-filters"
import { ExpensesList } from "@/components/expenses-list"
import { ExpenseCharts } from "@/components/expense-charts"
import { AddExpenseModal } from "@/components/add-expense-modal"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import { SubscriptionGuard } from "@/components/subscription-guard"
import { SubscriptionNotification } from "@/components/subscription-notification"

export const metadata = {
  title: "Pengeluaran - catatdiGW",
  description: "Kelola dan analisis pengeluaran Anda dengan mudah",
}

export default function ExpensesPage() {
  return (
    <DashboardLayout>
      <div className="min-h-screen space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground tracking-tight">Pengeluaran</h1>
            <p className="text-lg text-muted-foreground">Kelola dan analisis pengeluaran Anda dengan detail</p>
          </div>
          <div className="flex items-center gap-3">
            <AddExpenseModal />
          </div>
        </div>

        <Suspense fallback={<DashboardSkeleton />}>
          <SubscriptionNotification variant="compact" />
          <SubscriptionGuard showNotification={false}>
            {/* Overview Section */}
            <div className="w-full">
              <ExpenseOverview />
            </div>
            
            {/* Filters and List Section */}
            <div className="w-full space-y-8">
              <ExpenseFilters />
              <ExpensesList />
            </div>
            
            {/* Charts Section */}
            <div className="w-full">
              <ExpenseCharts />
            </div>
          </SubscriptionGuard>
        </Suspense>
      </div>
    </DashboardLayout>
  )
}

import { Suspense } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ExpenseOverview } from "@/components/expense-overview"
import { ExpenseFilters } from "@/components/expense-filters"
import { ExpensesList } from "@/components/expenses-list"
import { ExpenseCharts } from "@/components/expense-charts"
import { AddExpenseModal } from "@/components/add-expense-modal"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"

export const metadata = {
  title: "Pengeluaran - catatdiGW",
  description: "Kelola dan analisis pengeluaran Anda dengan mudah",
}

export default function ExpensesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Pengeluaran</h1>
            <p className="text-muted-foreground">Kelola dan analisis pengeluaran Anda</p>
          </div>
          <AddExpenseModal />
        </div>

        <Suspense fallback={<DashboardSkeleton />}>
          <ExpenseOverview />
          <div className="w-full">
            <ExpenseCharts />
          </div>
          <div className="w-full space-y-6">
            <ExpenseFilters />
            <ExpensesList />
          </div>
        </Suspense>
      </div>
    </DashboardLayout>
  )
}

import { Suspense } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { IncomeOverview } from "@/components/income-overview"
import { IncomeFilters } from "@/components/income-filters"
import { IncomesList } from "@/components/incomes-list"
import { IncomeCharts } from "@/components/income-charts"
import { AddIncomeModal } from "@/components/add-income-modal"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"

export const metadata = {
  title: "Pendapatan - catatdiGW",
  description: "Kelola dan analisis pendapatan Anda dengan mudah",
}

export default function IncomePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Pendapatan</h1>
            <p className="text-muted-foreground">Kelola dan analisis pendapatan Anda</p>
          </div>
          <AddIncomeModal />
        </div>

        <Suspense fallback={<DashboardSkeleton />}>
          <IncomeOverview />
          <div className="w-full">
            <IncomeCharts />
          </div>
          <div className="w-full space-y-6">
            <IncomeFilters />
            <IncomesList />
          </div>
        </Suspense>
      </div>
    </DashboardLayout>
  )
}

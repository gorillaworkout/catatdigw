import { Suspense } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { IncomeOverview } from "@/components/income-overview"
import { IncomeFilters } from "@/components/income-filters"
import { IncomesList } from "@/components/incomes-list"
import { IncomeCharts } from "@/components/income-charts"
import { AddIncomeModal } from "@/components/add-income-modal"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import { SubscriptionGuard } from "@/components/subscription-guard"
import { SubscriptionNotification } from "@/components/subscription-notification"

export const metadata = {
  title: "Pendapatan - catatdiGW",
  description: "Kelola dan analisis pendapatan Anda dengan mudah",
}

export default function IncomePage() {
  return (
    <DashboardLayout>
      <div className="min-h-screen space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground tracking-tight">Pendapatan</h1>
            <p className="text-lg text-muted-foreground">Kelola dan analisis pendapatan Anda dengan detail</p>
          </div>
          <div className="flex items-center gap-3">
            <AddIncomeModal />
          </div>
        </div>

        <Suspense fallback={<DashboardSkeleton />}>
          <SubscriptionNotification variant="compact" />
          <SubscriptionGuard showNotification={false}>
            {/* Overview Section */}
            <div className="w-full">
              <IncomeOverview />
            </div>
            
            {/* Filters and List Section */}
            <div className="w-full space-y-8">
              <IncomeFilters />
              <IncomesList />
            </div>
            
            {/* Charts Section */}
            <div className="w-full">
              <IncomeCharts />
            </div>
          </SubscriptionGuard>
        </Suspense>
      </div>
    </DashboardLayout>
  )
}

import { Suspense } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardOverview } from "@/components/dashboard-overview"
import { RecentTransactions } from "@/components/recent-transactions"
import { AccountsList } from "@/components/accounts-list"
import { FinancialCharts } from "@/components/financial-charts"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"

export const metadata = {
  title: "Dashboard - catatdiGW",
  description: "Dashboard keuangan dengan statistik dan analisis lengkap",
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h1>
          <div className="text-xs sm:text-sm text-muted-foreground">
            Terakhir diperbarui: {new Date().toLocaleDateString("id-ID")}
          </div>
        </div>

        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardOverview />
          <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
            <AccountsList />
            <RecentTransactions />
          </div>
          <div className="w-full">
            <FinancialCharts />
          </div>
        </Suspense>
      </div>
    </DashboardLayout>
  )
}

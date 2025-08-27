import { Suspense } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardOverview } from "@/components/dashboard-overview"
import { RecentTransactions } from "@/components/recent-transactions"
import { AccountsList } from "@/components/accounts-list"
import { FinancialCharts } from "@/components/financial-charts"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import { SubscriptionStatus } from "@/components/subscription-status"
import { SubscriptionNotification } from "@/components/subscription-notification"

export const metadata = {
  title: "Dashboard - catatdiGW",
  description: "Dashboard keuangan dengan statistik dan analisis lengkap",
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="min-h-screen space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground tracking-tight">Dashboard</h1>
            <p className="text-lg text-muted-foreground">Ringkasan keuangan dan analisis lengkap</p>
          </div>
          <div className="text-sm text-muted-foreground">
            Terakhir diperbarui: {new Date().toLocaleDateString("id-ID")}
          </div>
        </div>

        <Suspense fallback={<DashboardSkeleton />}>
          <SubscriptionNotification variant="compact" />
          <DashboardOverview />
          
          {/* Accounts and Subscription Status */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <AccountsList />
            </div>
            <SubscriptionStatus />
          </div>
          
          {/* Recent Transactions and Charts */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <RecentTransactions />
            <div className="w-full">
              <FinancialCharts />
            </div>
          </div>
        </Suspense>
      </div>
    </DashboardLayout>
  )
}

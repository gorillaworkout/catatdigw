import { Suspense } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AdminSubscriptionManager } from "@/components/admin-subscription-manager"
import { AdminDataCleanup } from "@/components/admin-data-cleanup"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"

export const metadata = {
  title: "Admin - catatdiGW",
  description: "Panel admin untuk mengelola subscription user",
}

export default function AdminPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground">Kelola subscription dan data user</p>
        </div>

        <Suspense fallback={<DashboardSkeleton />}>
          <div className="grid gap-6">
            <AdminSubscriptionManager />
            <AdminDataCleanup />
          </div>
        </Suspense>
      </div>
    </DashboardLayout>
  )
}

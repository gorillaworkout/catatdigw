import { Suspense } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { SettingsTabs } from "@/components/settings-tabs"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import { SubscriptionGuard } from "@/components/subscription-guard"
import { SubscriptionNotification } from "@/components/subscription-notification"

export const metadata = {
  title: "Pengaturan - catatdiGW",
  description: "Kelola pengaturan akun dan aplikasi Anda",
}

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pengaturan</h1>
          <p className="text-muted-foreground">Kelola pengaturan akun dan aplikasi Anda</p>
        </div>

        <Suspense fallback={<DashboardSkeleton />}>
          <SubscriptionNotification variant="compact" />
          <SubscriptionGuard showNotification={false}>
            <SettingsTabs />
          </SubscriptionGuard>
        </Suspense>
      </div>
    </DashboardLayout>
  )
}

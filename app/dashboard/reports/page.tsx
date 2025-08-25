import type { Metadata } from "next"
import ReportsPageClient from "./ReportsPageClient"
import { DashboardLayout } from "@/components/dashboard-layout"

export const metadata: Metadata = {
  title: "Laporan Keuangan - catatdiGW",
  description: "Generate dan download laporan keuangan dalam format PDF atau Excel",
}

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="w-full">
        <ReportsPageClient />
      </div>
    </DashboardLayout>
  )
}

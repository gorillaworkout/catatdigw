"use client"

import type React from "react"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { useAuth } from "@/hooks/use-auth"
import { LoadingSkeleton } from "@/components/loading-skeleton"
import { redirect } from "next/navigation"
import { AnimatedDiv } from "@/components/animated-div"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, loading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  if (loading) {
    return <LoadingSkeleton />
  }

  if (!user) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className={cn("transition-[padding] duration-200 ease-linear", sidebarCollapsed ? "lg:pl-16" : "lg:pl-64")}> 
        <DashboardHeader setSidebarOpen={setSidebarOpen} toggleSidebarCollapsed={() => setSidebarCollapsed((v) => !v)} isSidebarCollapsed={sidebarCollapsed} />
        <AnimatedDiv direction="bottom" delay={0.2}>
          <main className="p-3 sm:p-4 lg:p-6">{children}</main>
        </AnimatedDiv>
      </div>
    </div>
  )
}

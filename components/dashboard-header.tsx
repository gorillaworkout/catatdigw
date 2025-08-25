"use client"

import { Button } from "@/components/ui/button"
import { Menu, Bell, Search, LogOut, Home, PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"

interface DashboardHeaderProps {
  setSidebarOpen: (open: boolean) => void
  toggleSidebarCollapsed?: () => void
  isSidebarCollapsed?: boolean
}

export function DashboardHeader({ setSidebarOpen, toggleSidebarCollapsed, isSidebarCollapsed }: DashboardHeaderProps) {
  const { logout } = useAuth()
  return (
    <header className="bg-background border-b border-border lg:border-l-0">
      <div className="flex items-center justify-between px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* <Button variant="ghost" size="sm" className="lg:hidden p-2" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button> */}
          {/* {toggleSidebarCollapsed && (
            <Button variant="ghost" size="sm" className="hidden lg:inline-flex p-2" onClick={toggleSidebarCollapsed}>
              {isSidebarCollapsed ? <PanelLeftOpen className="h-4 w-4 sm:h-5 sm:w-5" /> : <PanelLeftClose className="h-4 w-4 sm:h-5 sm:w-5" />}
            </Button>
          )} */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Cari transaksi..." className="pl-10 w-48 sm:w-64" />
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <Link href="/" className="hidden sm:inline-flex">
            <Button variant="ghost" size="sm" className="p-2">
              <Home className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
          <Button variant="ghost" size="sm" className="relative p-2">
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full text-xs" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2" onClick={logout}>
            <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}

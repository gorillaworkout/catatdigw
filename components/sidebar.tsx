"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import {
  BarChart3,
  TrendingDown,
  TrendingUp,
  Settings,
  FileText,
  HelpCircle,
  History,
  Wallet,
  X,
  MessageSquare,
} from "lucide-react"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatedDiv } from "@/components/animated-div"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Pengeluaran", href: "/dashboard/expenses", icon: TrendingDown },
  { name: "Pendapatan", href: "/dashboard/income", icon: TrendingUp },
  { name: "Pengaturan", href: "/dashboard/settings", icon: Settings },
  { name: "Laporan Keuangan", href: "/dashboard/reports", icon: FileText },
  { name: "Bantuan & FAQ", href: "/dashboard/help", icon: HelpCircle },
  { name: "FAQ", href: "/faq", icon: MessageSquare }, // Added dedicated FAQ page
  { name: "Riwayat & Backup", href: "/dashboard/history", icon: History },
]

interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
  collapsed?: boolean
  setCollapsed?: (collapsed: boolean) => void
}

export function Sidebar({ open, setOpen, collapsed = false, setCollapsed }: SidebarProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        </div>
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
          open ? "w-64" : collapsed ? "w-20" : "w-64",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Compact brand header at very top (no animation) */}
          <div className="px-3 py-2 border-b border-sidebar-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-sidebar-primary rounded-md p-1.5">
                  <Wallet className="h-4 w-4 text-sidebar-primary-foreground" />
                </div>
                {(!collapsed || open) && (
                  <span className="text-base font-semibold text-sidebar-foreground">catatandiGW</span>
                )}
              </div>
              {/* Close on mobile */}
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="inline-flex h-8 w-8 p-0 text-sidebar-foreground border-sidebar-border hover:bg-sidebar-accent bg-background/60"
                  onClick={() => setCollapsed && setCollapsed(!collapsed)}
                  aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  {collapsed ? (
                    <PanelLeftOpen className="h-4 w-4" />
                  ) : (
                    <PanelLeftClose className="h-4 w-4" />
                  )}
                </Button>
                <Button variant="ghost" size="sm" className="lg:hidden h-8 w-8 p-0" onClick={() => setOpen(false)} aria-label="Close sidebar">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation */}

          <nav className="flex-1 p-2 space-y-1">
            {navigation.map((item, index) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    collapsed && !open && "justify-center",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                  onClick={() => setOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {(!collapsed || open) && <span>{item.name}</span>}
                </Link>
              )
            })}
          </nav>

          <div className="p-3 border-t border-sidebar-border">
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={logout}
            >
              {!collapsed ? "Keluar" : "⎋"}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

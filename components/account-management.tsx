"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, CreditCard, Wallet, PiggyBank, Building, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { useUserCollection } from "@/hooks/use-firestore"
import { useAuth } from "@/hooks/use-auth"
import { deleteAccount as deleteAccountFs } from "@/lib/firestore"
import { formatIDR } from "@/lib/utils"
import { AddAccountModal } from "@/components/add-account-modal"

const accountTypes = [
  { value: "bank", label: "Bank Account", icon: Building },
  { value: "cash", label: "Cash", icon: Wallet },
  { value: "credit", label: "Credit Card", icon: CreditCard },
  { value: "investment", label: "Investment", icon: PiggyBank },
  { value: "ewallet", label: "E-Wallet", icon: Wallet },
]

type Account = { id: string; name: string; type: string; balance: number; accountNumber?: string; description?: string; isActive?: boolean }

export function AccountManagement() {
  const { data: accounts } = useUserCollection<Account>("accounts")
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  const { toast } = useToast()
  const { user } = useAuth()

  const formatCurrency = (amount: number) => formatIDR(amount)

  const getAccountIcon = (type: string) => {
    const accountType = accountTypes.find((t) => t.value === type)
    return accountType?.icon || Wallet
  }

  const getAccountTypeLabel = (type: string) => {
    const accountType = accountTypes.find((t) => t.value === type)
    return accountType?.label || "Unknown"
  }

  const handleEdit = (account: Account) => {
    setEditingAccount(account)
  }

  const handleDelete = async (accountId: string) => {
    try {
      if (!user) throw new Error("Harus login")
      await deleteAccountFs(user.uid, accountId)
      toast({ title: "Rekening berhasil dihapus", description: "Rekening telah dihapus dari daftar" })
    } catch (err: any) {
      toast({ title: "Gagal menghapus rekening", description: err?.message || String(err) })
    }
  }

  const toggleAccountStatus = (accountId: string) => {
    // Note: This function needs to be implemented with proper state management
    // For now, it's a placeholder since we're using useUserCollection which doesn't provide setAccounts
    console.log("Toggle account status for:", accountId)
  }

  const handleAccountUpdated = () => {
    // Reset editing state when account is updated
    setEditingAccount(null)
    // The useUserCollection hook will automatically refresh the data
    // via onSnapshot, so no manual refresh is needed
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader className="px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-card-foreground text-lg sm:text-xl">Manajemen Rekening</CardTitle>
              <CardDescription className="text-sm sm:text-base">Kelola semua rekening keuangan Anda</CardDescription>
            </div>
            <AddAccountModal 
              onAccountUpdated={handleAccountUpdated}
              title="Tambah Rekening Baru"
              description="Tambahkan rekening baru ke daftar Anda"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
          {accounts.map((account) => {
            const IconComponent = getAccountIcon(account.type)
            return (
              <div
                key={account.id}
                className={`p-3 sm:p-4 rounded-lg border transition-colors ${
                  account.isActive ? "bg-muted/50 border-border" : "bg-muted/20 border-border opacity-60"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="bg-primary/10 p-2 sm:p-3 rounded-lg flex-shrink-0">
                      <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                        <h3 className="font-semibold text-card-foreground text-sm sm:text-base truncate">{account.name}</h3>
                        <Badge variant={account.isActive ? "default" : "secondary"} className="text-xs w-fit">
                          {account.isActive ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-1">{getAccountTypeLabel(account.type)}</p>
                      {account.accountNumber && (
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">{account.accountNumber}</p>
                      )}
                      {account.description && (
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1 truncate">{account.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <div className="text-right">
                      <div className={`text-base sm:text-lg font-bold ${account.balance >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {formatCurrency(account.balance)}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover border-border">
                        <DropdownMenuItem onClick={() => handleEdit(account)} className="text-popover-foreground">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(account.id)} className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Edit Modal - rendered outside the list to prevent conflicts */}
      {editingAccount && (
        <AddAccountModal 
          editingAccount={editingAccount}
          onAccountUpdated={handleAccountUpdated}
          title="Edit Rekening"
          description="Perbarui informasi rekening"
        />
      )}
    </div>
  )
}

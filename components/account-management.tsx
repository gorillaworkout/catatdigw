"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, CreditCard, Wallet, PiggyBank, Building, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { useUserCollection } from "@/hooks/use-firestore"
import { useAuth } from "@/hooks/use-auth"
import { createAccount, deleteAccount as deleteAccountFs, updateAccount as updateAccountFs } from "@/lib/firestore"
import { formatIDR, parseIDR } from "@/lib/utils"

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
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    balance: "",
    accountNumber: "",
    description: "",
  })

  const formatCurrency = (amount: number) => formatIDR(amount)

  const getAccountIcon = (type: string) => {
    const accountType = accountTypes.find((t) => t.value === type)
    return accountType?.icon || Wallet
  }

  const getAccountTypeLabel = (type: string) => {
    const accountType = accountTypes.find((t) => t.value === type)
    return accountType?.label || "Unknown"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!user) throw new Error("Harus login")
      if (editingAccount) {
        await updateAccountFs(user.uid, editingAccount.id, {
          name: formData.name,
          type: formData.type as any,
          balance: Number(formData.balance || 0),
          accountNumber: formData.accountNumber,
          description: formData.description,
        })
        toast({ title: "Rekening berhasil diperbarui", description: `${formData.name} telah diperbarui` })
      } else {
        await createAccount(user.uid, {
          name: formData.name,
          type: formData.type as any,
          balance: Number(formData.balance || 0),
          accountNumber: formData.accountNumber,
          description: formData.description,
          isActive: true,
        })
        toast({ title: "Rekening berhasil ditambahkan", description: `${formData.name} telah ditambahkan` })
      }
      setFormData({ name: "", type: "", balance: "", accountNumber: "", description: "" })
      setEditingAccount(null)
      setIsDialogOpen(false)
    } catch (err: any) {
      toast({ title: "Gagal menyimpan rekening", description: err?.message || String(err) })
    }
  }

  const handleEdit = (account: Account) => {
    setEditingAccount(account)
    setFormData({
      name: account.name,
      type: account.type,
      balance: String(account.balance ?? 0),
      accountNumber: account.accountNumber || "",
      description: account.description || "",
    })
    setIsDialogOpen(true)
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

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-card-foreground">Manajemen Rekening</CardTitle>
              <CardDescription>Kelola semua rekening keuangan Anda</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => {
                    setEditingAccount(null)
                    setFormData({
                      name: "",
                      type: "",
                      balance: "",
                      accountNumber: "",
                      description: "",
                    })
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Rekening
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="text-card-foreground">
                    {editingAccount ? "Edit Rekening" : "Tambah Rekening Baru"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingAccount ? "Perbarui informasi rekening" : "Tambahkan rekening baru ke daftar Anda"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-card-foreground">
                        Nama Rekening *
                      </Label>
                      <Input
                        id="name"
                        placeholder="Contoh: BCA Tabungan"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        required
                        className="bg-background border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-card-foreground">Jenis Rekening *</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value: string) => setFormData((prev) => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger className="bg-background border-border">
                          <SelectValue placeholder="Pilih jenis" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          {accountTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value} className="text-popover-foreground">
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="balance" className="text-card-foreground">
                        Saldo Awal
                      </Label>
                      <Input id="balance" inputMode="numeric" placeholder="Rp 0" value={formatIDR(formData.balance)} onChange={(e) => setFormData((prev) => ({ ...prev, balance: String(parseIDR(e.target.value)) }))} className="bg-background border-border" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber" className="text-card-foreground">
                        Nomor Rekening
                      </Label>
                      <Input
                        id="accountNumber"
                        placeholder="1234567890"
                        value={formData.accountNumber}
                        onChange={(e) => setFormData((prev) => ({ ...prev, accountNumber: e.target.value }))}
                        className="bg-background border-border"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-card-foreground">
                      Deskripsi
                    </Label>
                    <Input
                      id="description"
                      placeholder="Deskripsi rekening..."
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      className="bg-background border-border"
                    />
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Batal
                    </Button>
                    <Button type="submit" className="bg-primary hover:bg-primary/90">
                      {editingAccount ? "Perbarui" : "Tambah"} Rekening
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {accounts.map((account) => {
            const IconComponent = getAccountIcon(account.type)
            return (
              <div
                key={account.id}
                className={`p-4 rounded-lg border transition-colors ${
                  account.isActive ? "bg-muted/50 border-border" : "bg-muted/20 border-border opacity-60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-card-foreground">{account.name}</h3>
                        <Badge variant={account.isActive ? "default" : "secondary"} className="text-xs">
                          {account.isActive ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{getAccountTypeLabel(account.type)}</p>
                      {account.accountNumber && (
                        <p className="text-sm text-muted-foreground">{account.accountNumber}</p>
                      )}
                      {account.description && (
                        <p className="text-sm text-muted-foreground mt-1">{account.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className={`text-lg font-bold ${account.balance >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {formatCurrency(account.balance)}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
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

      {/* Account Summary */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Ringkasan Rekening</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-card-foreground">{accounts.filter((a) => a.isActive).length}</div>
              <div className="text-sm text-muted-foreground">Rekening Aktif</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">
                {formatCurrency(accounts.filter((a) => (a.balance || 0) > 0).reduce((sum, a) => sum + (a.balance || 0), 0))}
              </div>
              <div className="text-sm text-muted-foreground">Total Aset</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">
                {formatCurrency(Math.abs(accounts.filter((a) => (a.balance || 0) < 0).reduce((sum, a) => sum + (a.balance || 0), 0)))}
              </div>
              <div className="text-sm text-muted-foreground">Total Hutang</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(accounts.reduce((sum, a) => sum + (a.balance || 0), 0))}
              </div>
              <div className="text-sm text-muted-foreground">Net Worth</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

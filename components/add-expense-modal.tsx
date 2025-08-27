"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SubscriptionGuardButton } from "@/components/subscription-guard-button"
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
import { Plus, Calendar, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useUserCollection } from "@/hooks/use-firestore"
import { useAuth } from "@/hooks/use-auth"
import { useSubscription } from "@/hooks/use-subscription"
import { addExpenseWithBalanceCheck } from "@/lib/firestore"
import { parseIDR, formatIDR } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"

type Category = { id: string; name: string; type: "expense" | "income" }
type Account = { id: string; name: string; balance?: number }

export function AddExpenseModal() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()
  const { isActive: subscriptionActive } = useSubscription()
  const { data: allCategories } = useUserCollection<Category>("categories")
  const { data: accounts } = useUserCollection<Account>("accounts")
  
  // Filter only expense categories
  const expenseCategories = allCategories.filter(category => category.type === "expense")

  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    category: "",
    account: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  })

  // Get selected account details
  const selectedAccount = accounts.find(account => account.id === formData.account)
  const currentBalance = selectedAccount?.balance || 0
  const expenseAmount = parseIDR(formData.amount)
  const hasInsufficientFunds = expenseAmount > 0 && expenseAmount > currentBalance
  const isLargeExpense = expenseAmount > currentBalance * 0.5 // More than 50% of balance

  // Debug information (can be removed in production)
  const debugInfo = {
    rawAmount: formData.amount,
    parsedAmount: expenseAmount,
    accountBalance: currentBalance,
    hasInsufficientFunds,
    canSubmit: expenseAmount > 0 && !hasInsufficientFunds && formData.description && formData.category && formData.account
  }

  // Refresh data when modal opens to ensure latest balances
  useEffect(() => {
    if (open) {
      // The useUserCollection hook automatically updates via onSnapshot
      // No need for manual refresh
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check subscription status
    if (!subscriptionActive) {
      toast({ 
        title: "Subscription Berakhir", 
        description: "Subscription Anda telah berakhir. Silakan perpanjang subscription untuk menambah pengeluaran.",
        variant: "destructive"
      })
      return
    }
    
    // Check if amount is valid
    if (expenseAmount <= 0) {
      toast({ 
        title: "Jumlah tidak valid", 
        description: "Jumlah pengeluaran harus lebih dari 0",
        variant: "destructive"
      })
      return
    }

    // Check if account has sufficient balance
    if (hasInsufficientFunds) {
      toast({ 
        title: "Saldo tidak mencukupi", 
        description: `Saldo rekening ${selectedAccount?.name} hanya ${formatIDR(currentBalance)}`,
        variant: "destructive"
      })
      return
    }

    // Additional validation
    if (!formData.description.trim()) {
      toast({ 
        title: "Deskripsi kosong", 
        description: "Harap isi deskripsi pengeluaran",
        variant: "destructive"
      })
      return
    }

    if (!formData.category) {
      toast({ 
        title: "Kategori belum dipilih", 
        description: "Harap pilih kategori pengeluaran",
        variant: "destructive"
      })
      return
    }

    if (!formData.account) {
      toast({ 
        title: "Rekening belum dipilih", 
        description: "Harap pilih rekening untuk pengeluaran",
        variant: "destructive"
      })
      return
    }

    // Final balance verification before submission
    if (currentBalance < expenseAmount) {
      toast({ 
        title: "Saldo tidak mencukupi", 
        description: `Saldo rekening ${selectedAccount?.name} tidak mencukupi untuk transaksi ini`,
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      if (!user) throw new Error("Harus login")
      const category = expenseCategories.find((c) => c.id === formData.category)
      const account = accounts.find((a) => a.id === formData.account)
      
      console.log("Submitting expense:", {
        amount: expenseAmount,
        description: formData.description,
        categoryId: formData.category,
        accountId: formData.account,
        currentBalance,
        expectedNewBalance: currentBalance - expenseAmount
      })
      
      await addExpenseWithBalanceCheck(user.uid, {
        amount: expenseAmount,
        description: formData.description,
        categoryId: formData.category,
        categoryName: category?.name,
        accountId: formData.account,
        accountName: account?.name,
        date: formData.date,
        notes: formData.notes,
      })
      toast({
        title: "Pengeluaran berhasil ditambahkan",
        description: `${formData.description} sebesar ${formatIDR(expenseAmount)}`,
      })
      setFormData({
        amount: "",
        description: "",
        category: "",
        account: "",
        date: new Date().toISOString().split("T")[0],
        notes: "",
      })
      setOpen(false)
    } catch (err: any) {
      console.error("Error adding expense:", err)
      toast({ 
        title: "Gagal menambahkan pengeluaran", 
        description: err?.message || String(err),
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAmountChange = (value: string) => {
    // Use the parseIDR utility for consistent parsing
    const numericValue = value.replace(/[^\d]/g, "")
    
    if (numericValue === "") {
      setFormData(prev => ({ ...prev, amount: "" }))
      return
    }
    
    // Format as Indonesian Rupiah using the utility function
    const formattedValue = formatIDR(numericValue)
    
    setFormData(prev => ({ ...prev, amount: formattedValue }))
  }

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!open) {
      setFormData({
        amount: "",
        description: "",
        category: "",
        account: "",
        date: new Date().toISOString().split("T")[0],
        notes: "",
      })
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <SubscriptionGuardButton className="bg-primary hover:bg-primary/90" tooltipText="Subscription berakhir. Hubungi WhatsApp untuk pembayaran.">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Pengeluaran
        </SubscriptionGuardButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">Tambah Pengeluaran Baru</DialogTitle>
          <DialogDescription>Catat pengeluaran Anda dengan detail yang lengkap</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Account Balance Summary */}
          {selectedAccount && (
            <div className="p-3 bg-muted/30 rounded-lg border">
              <div className="text-sm text-muted-foreground mb-1">Saldo Rekening</div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-card-foreground">{selectedAccount.name}</span>
                <span className={`text-lg font-bold ${currentBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatIDR(currentBalance)}
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-card-foreground">
                Jumlah *
              </Label>
              <Input
                id="amount"
                type="text"
                placeholder="Rp 0"
                value={formData.amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                required
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date" className="text-card-foreground">
                Tanggal *
              </Label>
              <div className="relative">
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  required
                  className="bg-background border-border"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-card-foreground">
              Deskripsi *
            </Label>
            <Input
              id="description"
              placeholder="Contoh: Belanja groceries di supermarket"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              required
              className="bg-background border-border"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-card-foreground">Kategori *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {expenseCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id} className="text-popover-foreground">
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-card-foreground">Rekening *</Label>
              <Select value={formData.account} onValueChange={(value) => handleInputChange("account", value)}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Pilih rekening" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id} className="text-popover-foreground">
                      <div className="flex items-center justify-between w-full">
                        <span>{account.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {formatIDR(account.balance || 0)}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Show selected account balance and insufficient funds warning */}
          {selectedAccount && (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                Saldo rekening <span className="font-medium">{selectedAccount.name}</span>: 
                <span className={`ml-1 font-semibold ${currentBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatIDR(currentBalance)}
                </span>
              </div>
              
              {expenseAmount > 0 && (
                <div className="text-sm text-muted-foreground">
                  Saldo setelah pengeluaran: 
                  <span className={`ml-1 font-semibold ${(currentBalance - expenseAmount) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatIDR(currentBalance - expenseAmount)}
                  </span>
                </div>
              )}

              {hasInsufficientFunds && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Saldo tidak mencukupi! Anda memerlukan tambahan {formatIDR(expenseAmount - currentBalance)} untuk transaksi ini.
                  </AlertDescription>
                </Alert>
              )}

              {isLargeExpense && !hasInsufficientFunds && (
                <Alert className="border-yellow-200 bg-yellow-50 text-yellow-800">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p>Pengeluaran besar! Anda akan mengeluarkan lebih dari setengah dari saldo rekening.</p>
                      <p className="text-xs text-yellow-700">
                        Saldo saat ini: {formatIDR(currentBalance)} | 
                        Setelah pengeluaran: {formatIDR(currentBalance - expenseAmount)}
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-card-foreground">
              Catatan (Opsional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Tambahkan catatan tambahan..."
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              className="bg-background border-border resize-none"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Batal
            </Button>
            <SubscriptionGuardButton 
              type="submit" 
              disabled={loading || hasInsufficientFunds || expenseAmount <= 0} 
              className="bg-primary hover:bg-primary/90"
            >
              {loading ? "Menyimpan..." : "Simpan Pengeluaran"}
            </SubscriptionGuardButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

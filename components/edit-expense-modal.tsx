"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Edit, Calendar, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useUserCollection } from "@/hooks/use-firestore"
import { useAuth } from "@/hooks/use-auth"
import { updateExpenseWithBalanceCheck } from "@/lib/firestore"
import { parseIDR, formatIDR } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

type Category = { id: string; name: string; type: "expense" | "income" }
type Account = { id: string; name: string; balance?: number }
type Expense = {
  id: string
  amount: number
  description: string
  categoryId: string
  categoryName?: string
  accountId: string
  accountName?: string
  date: string
  notes?: string
}

interface EditExpenseModalProps {
  expense: Expense
  onExpenseUpdated: () => void
  onClose?: () => void
}

export function EditExpenseModal({ expense, onExpenseUpdated, onClose }: EditExpenseModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()
  const { data: allCategories } = useUserCollection<Category>("categories")
  const { data: accounts } = useUserCollection<Account>("accounts")
  
  // Filter only expense categories
  const expenseCategories = allCategories.filter(category => category.type === "expense")

  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    category: "",
    account: "",
    date: "",
    notes: "",
  })

  // Initialize form data when expense changes
  useEffect(() => {
    if (expense) {
      setFormData({
        amount: formatIDR(expense.amount),
        description: expense.description,
        category: expense.categoryId,
        account: expense.accountId,
        date: expense.date,
        notes: expense.notes || "",
      })
      setOpen(true) // Auto-open when expense is set
    } else {
      setOpen(false) // Close when expense is null
      setShowConfirmation(false)
    }
  }, [expense])

  // Handle modal close
  const handleClose = () => {
    setOpen(false)
    setShowConfirmation(false)
    if (onClose) {
      onClose()
    }
  }

  // Get selected account details
  const selectedAccount = accounts.find(account => account.id === formData.account)
  const currentBalance = selectedAccount?.balance || 0
  const expenseAmount = parseIDR(formData.amount)
  const originalAmount = expense.amount
  const hasInsufficientFunds = expenseAmount > 0 && (currentBalance + originalAmount) < expenseAmount
  const hasChanges = 
    expenseAmount !== originalAmount ||
    formData.description !== expense.description ||
    formData.category !== expense.categoryId ||
    formData.account !== expense.accountId ||
    formData.date !== expense.date ||
    formData.notes !== (expense.notes || "")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if there are any changes
    if (!hasChanges) {
      toast({
        title: "Tidak ada perubahan",
        description: "Tidak ada perubahan yang perlu disimpan",
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

    // Check if account has sufficient balance (considering original amount restoration)
    if (hasInsufficientFunds) {
      const balanceAfterRestore = currentBalance + originalAmount
      const shortfall = expenseAmount - balanceAfterRestore
      toast({ 
        title: "Saldo tidak mencukupi", 
        description: `Saldo setelah pengembalian: ${formatIDR(balanceAfterRestore)}, Kekurangan: ${formatIDR(shortfall)}`,
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

    // Show confirmation dialog for significant changes
    if (expenseAmount !== originalAmount || formData.account !== expense.accountId) {
      setShowConfirmation(true)
      return
    }

    // Proceed with update
    await performUpdate()
  }

  const performUpdate = async () => {
    setLoading(true)
    try {
      if (!user) throw new Error("Harus login")
      const category = expenseCategories.find((c) => c.id === formData.category)
      const account = accounts.find((a) => a.id === formData.account)
      
      await updateExpenseWithBalanceCheck(user.uid, expense.id, {
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
        title: "Pengeluaran berhasil diperbarui",
        description: `${formData.description} sebesar ${formatIDR(expenseAmount)}`,
      })
      
      handleClose()
      onExpenseUpdated()
    } catch (err: any) {
      console.error("Error updating expense:", err)
      toast({ 
        title: "Gagal memperbarui pengeluaran", 
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

  return (
    <>
      <Dialog open={open} onOpenChange={(newOpen) => {
        if (!newOpen) {
          handleClose()
        }
      }}>
        <DialogContent className="sm:max-w-[500px] bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-card-foreground">Edit Pengeluaran</DialogTitle>
            <DialogDescription>Perbarui detail pengeluaran Anda</DialogDescription>
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
                <div className="text-xs text-muted-foreground mt-1">
                  Saldo setelah pengembalian: {formatIDR(currentBalance + originalAmount)}
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

            {/* Show balance changes and warnings */}
            {selectedAccount && expenseAmount > 0 && (
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  Saldo setelah pengeluaran: 
                  <span className={`ml-1 font-semibold ${(currentBalance + originalAmount - expenseAmount) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatIDR(currentBalance + originalAmount - expenseAmount)}
                  </span>
                </div>

                {hasInsufficientFunds && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Saldo tidak mencukupi! Anda memerlukan tambahan {formatIDR(expenseAmount - (currentBalance + originalAmount))} untuk transaksi ini.
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
              <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
                Batal
              </Button>
              <Button 
                type="submit" 
                disabled={loading || hasInsufficientFunds || expenseAmount <= 0 || !hasChanges} 
                className="bg-primary hover:bg-primary/90"
              >
                {loading ? "Memperbarui..." : "Perbarui Pengeluaran"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Significant Changes */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-card-foreground">Konfirmasi Perubahan</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Anda akan melakukan perubahan signifikan pada pengeluaran ini:
              <br />
              <br />
              {expenseAmount !== originalAmount && (
                <>
                  <span className="font-medium text-card-foreground">Jumlah:</span> {formatIDR(originalAmount)} → {formatIDR(expenseAmount)}
                  <br />
                </>
              )}
              {formData.account !== expense.accountId && (
                <>
                  <span className="font-medium text-card-foreground">Rekening:</span> {expense.accountName || expense.accountId} → {accounts.find(a => a.id === formData.account)?.name || formData.account}
                  <br />
                </>
              )}
              <br />
              <span className="font-medium text-card-foreground">
                Saldo rekening akan disesuaikan secara otomatis.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading} onClick={handleClose} className="bg-background border-border">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={performUpdate}
              disabled={loading}
              className="bg-primary hover:bg-primary/90"
            >
              {loading ? "Memperbarui..." : "Konfirmasi & Perbarui"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

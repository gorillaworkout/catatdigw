"use client"

import type React from "react"

import { useState } from "react"
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
import { Plus, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useIncome } from "@/hooks/use-income"
import { useAccounts } from "@/hooks/use-accounts"
import { useUserCollection } from "@/hooks/use-firestore"
import { parseIDR, formatIDR } from "@/lib/utils"

export function AddIncomeModal() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { addIncome } = useIncome()
  const { accounts } = useAccounts()
  const { data: categories } = useUserCollection<any>("categories")

  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    categoryId: "",
    accountId: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const selectedCategory = categories.find((cat: any) => cat.id === formData.categoryId)
      const selectedAccount = accounts.find((acc: any) => acc.id === formData.accountId)
      const incomeAmount = parseIDR(formData.amount)

      if (incomeAmount <= 0) {
        toast({
          title: "Jumlah tidak valid",
          description: "Jumlah pendapatan harus lebih dari 0",
          variant: "destructive"
        })
        setLoading(false)
        return
      }

      await addIncome({
        amount: incomeAmount,
        description: formData.description,
        categoryId: formData.categoryId,
        categoryName: selectedCategory?.name,
        accountId: formData.accountId,
        accountName: selectedAccount?.name,
        date: formData.date,
        notes: formData.notes,
      })

      setFormData({
        amount: "",
        description: "",
        categoryId: "",
        accountId: "",
        date: new Date().toISOString().split("T")[0],
        notes: "",
      })
      setOpen(false)
    } catch (error) {
      console.error("Error adding income:", error)
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Pendapatan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">Tambah Pendapatan Baru</DialogTitle>
          <DialogDescription>Catat pendapatan Anda dengan detail yang lengkap</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="Contoh: Gaji bulanan dari perusahaan"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              required
              className="bg-background border-border"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-card-foreground">Kategori *</Label>
              <Select value={formData.categoryId} onValueChange={(value) => handleInputChange("categoryId", value)}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {categories.map((category: any) => (
                    <SelectItem key={category.id} value={category.id} className="text-popover-foreground">
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-card-foreground">Rekening *</Label>
              <Select value={formData.accountId} onValueChange={(value) => handleInputChange("accountId", value)}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Pilih rekening" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {accounts.map((account: any) => (
                    <SelectItem key={account.id} value={account.id} className="text-popover-foreground">
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

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
            <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white">
              {loading ? "Menyimpan..." : "Simpan Pendapatan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

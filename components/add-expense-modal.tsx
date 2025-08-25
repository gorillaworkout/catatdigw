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
import { useUserCollection } from "@/hooks/use-firestore"
import { useAuth } from "@/hooks/use-auth"
import { addExpenseWithBalanceCheck } from "@/lib/firestore"

type Category = { id: string; name: string }
type Account = { id: string; name: string; balance?: number }

export function AddExpenseModal() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()
  const { data: categories } = useUserCollection<Category>("categories")
  const { data: accounts } = useUserCollection<Account>("accounts")

  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    category: "",
    account: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (!user) throw new Error("Harus login")
      const category = categories.find((c) => c.id === formData.category)
      const account = accounts.find((a) => a.id === formData.account)
      await addExpenseWithBalanceCheck(user.uid, {
        amount: Number(formData.amount),
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
        description: `${formData.description} sebesar ${new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(Number(formData.amount))}`,
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
      toast({ title: "Gagal menambahkan pengeluaran", description: err?.message || String(err) })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Pengeluaran
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">Tambah Pengeluaran Baru</DialogTitle>
          <DialogDescription>Catat pengeluaran Anda dengan detail yang lengkap</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-card-foreground">
                Jumlah *
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="0"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
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
                  {categories.map((category) => (
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
            <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90">
              {loading ? "Menyimpan..." : "Simpan Pengeluaran"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

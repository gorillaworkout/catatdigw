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

const categories = ["Gaji", "Freelance", "Bisnis", "Investasi", "Dividen", "Bonus", "Hadiah", "Lainnya"]

const accounts = [
  { id: "bca", name: "BCA Tabungan" },
  { id: "cash", name: "Cash" },
  { id: "investment", name: "Investasi" },
]

export function AddIncomeModal() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

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

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Pendapatan berhasil ditambahkan",
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
    setLoading(false)
    setOpen(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category} className="text-popover-foreground">
                      {category}
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
            <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white">
              {loading ? "Menyimpan..." : "Simpan Pendapatan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

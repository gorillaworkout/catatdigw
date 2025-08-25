"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Plus, CreditCard, Wallet, PiggyBank, Building } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { useAccounts, type Account as AccountType } from "@/hooks/use-accounts"
import { formatIDR, parseIDR } from "@/lib/utils"

const accountTypes = [
  { value: "bank", label: "Bank Account", icon: Building },
  { value: "cash", label: "Cash", icon: Wallet },
  { value: "credit", label: "Credit Card", icon: CreditCard },
  { value: "investment", label: "Investment", icon: PiggyBank },
  { value: "ewallet", label: "E-Wallet", icon: Wallet },
]

interface AddAccountModalProps {
  editingAccount?: AccountType | null
  onAccountUpdated?: () => void
  trigger?: React.ReactNode
  title?: string
  description?: string
}

export function AddAccountModal({ 
  editingAccount, 
  onAccountUpdated, 
  trigger,
  title = "Tambah Rekening Baru",
  description = "Tambahkan rekening baru ke daftar Anda"
}: AddAccountModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()
  const { addAccount, updateAccount } = useAccounts()

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    balance: "",
    accountNumber: "",
    description: "",
  })

  // Initialize form data when editingAccount changes
  useEffect(() => {
    if (editingAccount) {
      setFormData({
        name: editingAccount.name,
        type: editingAccount.type,
        balance: String(editingAccount.balance ?? 0),
        accountNumber: editingAccount.accountNumber || "",
        description: editingAccount.description || "",
      })
    } else {
      setFormData({
        name: "",
        type: "",
        balance: "",
        accountNumber: "",
        description: "",
      })
    }
  }, [editingAccount])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name.trim()) {
      toast({ 
        title: "Nama rekening kosong", 
        description: "Harap isi nama rekening",
        variant: "destructive"
      })
      return
    }

    if (!formData.type) {
      toast({ 
        title: "Jenis rekening belum dipilih", 
        description: "Harap pilih jenis rekening",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      if (!user) throw new Error("Harus login")
      
      if (editingAccount) {
        await updateAccount(editingAccount.id, {
          name: formData.name.trim(),
          type: formData.type as any,
          balance: parseIDR(formData.balance),
          accountNumber: formData.accountNumber.trim(),
          description: formData.description.trim(),
        })
      } else {
        await addAccount({
          name: formData.name.trim(),
          type: formData.type as any,
          balance: parseIDR(formData.balance),
          accountNumber: formData.accountNumber.trim(),
          description: formData.description.trim(),
        })
      }
      
      // Reset form and close modal
      setFormData({ name: "", type: "", balance: "", accountNumber: "", description: "" })
      setOpen(false)
      
      // Call callback if provided
      if (onAccountUpdated) {
        onAccountUpdated()
      }
    } catch (err: any) {
      console.error("Error saving account:", err)
      toast({ 
        title: "Gagal menyimpan rekening", 
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

  const handleBalanceChange = (value: string) => {
    // Use the parseIDR utility for consistent parsing
    const numericValue = value.replace(/[^\d]/g, "")
    
    if (numericValue === "") {
      setFormData(prev => ({ ...prev, balance: "" }))
      return
    }
    
    // Format as Indonesian Rupiah using the utility function
    const formattedValue = formatIDR(numericValue)
    
    setFormData(prev => ({ ...prev, balance: formattedValue }))
  }

  const handleClose = () => {
    setOpen(false)
    // Reset form when closing
    setFormData({ name: "", type: "", balance: "", accountNumber: "", description: "" })
  }

  const isEditing = !!editingAccount
  const modalTitle = isEditing ? "Edit Rekening" : title
  const modalDescription = isEditing ? "Perbarui informasi rekening" : description
  const submitButtonText = loading ? "Menyimpan..." : (isEditing ? "Perbarui" : "Tambah") + " Rekening"

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            {isEditing ? "Edit" : "Tambah"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">{modalTitle}</DialogTitle>
          <DialogDescription>{modalDescription}</DialogDescription>
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
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-card-foreground">Jenis Rekening *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: string) => handleInputChange("type", value)}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Pilih jenis" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {accountTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value} className="text-popover-foreground">
                      <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4" />
                        {type.label}
                      </div>
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
              <Input 
                id="balance" 
                type="text"
                placeholder="Rp 0" 
                value={formData.balance} 
                onChange={(e) => handleBalanceChange(e.target.value)} 
                className="bg-background border-border" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountNumber" className="text-card-foreground">
                Nomor Rekening
              </Label>
              <Input
                id="accountNumber"
                placeholder="1234567890"
                value={formData.accountNumber}
                onChange={(e) => handleInputChange("accountNumber", e.target.value)}
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
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="bg-background border-border"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
              Batal
            </Button>
            <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90">
              {submitButtonText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

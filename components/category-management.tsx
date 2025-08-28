"use client"

import type React from "react"

import { useMemo, useState } from "react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { useUserCollection } from "@/hooks/use-firestore"
import { createCategory, deleteCategory as deleteCategoryFs, updateCategory as updateCategoryFs } from "@/lib/firestore"
import { SubscriptionGuardButton } from "@/components/subscription-guard-button"

type Category = { id: string; name: string; color: string; type: "expense" | "income"; isDefault?: boolean }

const colorOptions = [
  "#3b82f6", // blue
  "#10b981", // green
  "#ef4444", // red
  "#8b5cf6", // purple
  "#f59e0b", // orange
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#eab308", // yellow
  "#6b7280", // gray
]

export function CategoryManagement() {
  const { user } = useAuth()
  const { data: allCategories } = useUserCollection<Category>("categories")
  const expenseCategories = useMemo(() => allCategories.filter((c) => c.type === "expense"), [allCategories])
  const incomeCategories = useMemo(() => allCategories.filter((c) => c.type === "income"), [allCategories])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("expense")
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    color: colorOptions[0],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!user) throw new Error("Harus login")
      const type = activeTab as "expense" | "income"
      if (editingCategory) {
        await updateCategoryFs(user.uid, editingCategory.id, { name: formData.name, color: formData.color })
        toast({ title: "Kategori berhasil diperbarui", description: `${formData.name} telah diperbarui` })
      } else {
        await createCategory(user.uid, { name: formData.name, color: formData.color, type })
        toast({ title: "Kategori berhasil ditambahkan", description: `${formData.name} telah ditambahkan` })
      }
      setFormData({ name: "", color: colorOptions[0] })
      setEditingCategory(null)
      setIsDialogOpen(false)
    } catch (err: any) {
      toast({ title: "Gagal menyimpan kategori", description: err?.message || String(err) })
    }
  }

  const handleEdit = (category: any) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      color: category.color,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (categoryId: string) => {
    try {
      if (!user) throw new Error("Harus login")
      await deleteCategoryFs(user.uid, categoryId)
      toast({ title: "Kategori berhasil dihapus", description: "Kategori telah dihapus" })
    } catch (err: any) {
      toast({ title: "Gagal menghapus kategori", description: err?.message || String(err) })
    }
  }

  const CategoryList = ({ categories, type }: { categories: any[]; type: string }) => (
    <div className="space-y-3">
      {categories.map((category) => (
        <div key={category.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-card-foreground">{category.name}</span>
                {category.isDefault && (
                  <Badge variant="secondary" className="text-xs">
                    Default
                  </Badge>
                )}
              </div>
              {/* Transaksi per kategori dihilangkan karena tidak dihitung di sisi client */}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover border-border">
              <DropdownMenuItem className="text-popover-foreground" asChild>
                <SubscriptionGuardButton 
                  variant="ghost" 
                  className="w-full justify-start h-auto p-2 text-popover-foreground hover:bg-accent"
                  onClick={() => handleEdit(category)}
                  tooltipText="Subscription berakhir. Hubungi WhatsApp untuk pembayaran."
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </SubscriptionGuardButton>
              </DropdownMenuItem>
              {!category.isDefault && (
                <DropdownMenuItem className="text-destructive" asChild>
                  <SubscriptionGuardButton 
                    variant="ghost" 
                    className="w-full justify-start h-auto p-2 text-destructive hover:bg-accent"
                    onClick={() => handleDelete(category.id)}
                    tooltipText="Subscription berakhir. Hubungi WhatsApp untuk pembayaran."
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Hapus
                  </SubscriptionGuardButton>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-card-foreground">Manajemen Kategori</CardTitle>
              <CardDescription>Kelola kategori untuk pengeluaran dan pendapatan</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <SubscriptionGuardButton
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => {
                    setEditingCategory(null)
                    setFormData({ name: "", color: colorOptions[0] })
                  }}
                  tooltipText="Subscription berakhir. Hubungi WhatsApp untuk pembayaran."
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Kategori
                </SubscriptionGuardButton>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[400px] bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="text-card-foreground">
                    {editingCategory ? "Edit Kategori" : "Tambah Kategori Baru"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingCategory ? "Perbarui informasi kategori" : "Buat kategori baru untuk transaksi"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-card-foreground">
                      Nama Kategori *
                    </Label>
                    <Input
                      id="name"
                      placeholder="Contoh: Makanan & Minuman"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      required
                      className="bg-background border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-card-foreground">Warna Kategori</Label>
                    <div className="flex flex-wrap gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`w-8 h-8 rounded-full border-2 ${
                            formData.color === color ? "border-foreground" : "border-transparent"
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setFormData((prev) => ({ ...prev, color }))}
                        />
                      ))}
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Batal
                    </Button>
                    <SubscriptionGuardButton type="submit" className="bg-primary hover:bg-primary/90" tooltipText="Subscription berakhir. Hubungi WhatsApp untuk pembayaran.">
                      {editingCategory ? "Perbarui" : "Tambah"} Kategori
                    </SubscriptionGuardButton>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-1 bg-muted">
              <TabsTrigger value="expense">Kategori Pengeluaran</TabsTrigger>
              <TabsTrigger value="income">Kategori Pendapatan</TabsTrigger>
            </TabsList>
            <TabsContent value="expense" className="mt-6">
              <CategoryList categories={expenseCategories} type="expense" />
            </TabsContent>
            <TabsContent value="income" className="mt-6">
              <CategoryList categories={incomeCategories} type="income" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

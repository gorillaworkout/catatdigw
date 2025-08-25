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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

// Mock data
const initialExpenseCategories = [
  { id: 1, name: "Makanan & Minuman", color: "#10b981", isDefault: true, transactionCount: 45 },
  { id: 2, name: "Transportasi", color: "#3b82f6", isDefault: true, transactionCount: 23 },
  { id: 3, name: "Belanja", color: "#ef4444", isDefault: true, transactionCount: 18 },
  { id: 4, name: "Hiburan", color: "#8b5cf6", isDefault: true, transactionCount: 12 },
  { id: 5, name: "Kesehatan", color: "#f59e0b", isDefault: true, transactionCount: 8 },
  { id: 6, name: "Pendidikan", color: "#06b6d4", isDefault: true, transactionCount: 5 },
  { id: 7, name: "Tagihan", color: "#ec4899", isDefault: true, transactionCount: 15 },
  { id: 8, name: "Lainnya", color: "#6b7280", isDefault: true, transactionCount: 7 },
]

const initialIncomeCategories = [
  { id: 1, name: "Gaji", color: "#3b82f6", isDefault: true, transactionCount: 12 },
  { id: 2, name: "Freelance", color: "#8b5cf6", isDefault: true, transactionCount: 8 },
  { id: 3, name: "Bisnis", color: "#10b981", isDefault: true, transactionCount: 15 },
  { id: 4, name: "Investasi", color: "#f59e0b", isDefault: true, transactionCount: 6 },
  { id: 5, name: "Dividen", color: "#06b6d4", isDefault: true, transactionCount: 4 },
  { id: 6, name: "Bonus", color: "#ec4899", isDefault: true, transactionCount: 3 },
  { id: 7, name: "Hadiah", color: "#eab308", isDefault: true, transactionCount: 2 },
  { id: 8, name: "Lainnya", color: "#6b7280", isDefault: true, transactionCount: 5 },
]

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
  const [expenseCategories, setExpenseCategories] = useState(initialExpenseCategories)
  const [incomeCategories, setIncomeCategories] = useState(initialIncomeCategories)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("expense")
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    color: colorOptions[0],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const categories = activeTab === "expense" ? expenseCategories : incomeCategories
    const setCategories = activeTab === "expense" ? setExpenseCategories : setIncomeCategories

    if (editingCategory) {
      // Update existing category
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editingCategory.id ? { ...cat, name: formData.name, color: formData.color } : cat,
        ),
      )
      toast({
        title: "Kategori berhasil diperbarui",
        description: `${formData.name} telah diperbarui`,
      })
    } else {
      // Add new category
      const newCategory = {
        id: Math.max(...categories.map((c) => c.id)) + 1,
        name: formData.name,
        color: formData.color,
        isDefault: false,
        transactionCount: 0,
      }
      setCategories((prev) => [...prev, newCategory])
      toast({
        title: "Kategori berhasil ditambahkan",
        description: `${formData.name} telah ditambahkan`,
      })
    }

    // Reset form
    setFormData({ name: "", color: colorOptions[0] })
    setEditingCategory(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (category: any) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      color: category.color,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (categoryId: number) => {
    const categories = activeTab === "expense" ? expenseCategories : incomeCategories
    const setCategories = activeTab === "expense" ? setExpenseCategories : setIncomeCategories

    const category = categories.find((c) => c.id === categoryId)
    if (category?.isDefault) {
      toast({
        title: "Tidak dapat menghapus",
        description: "Kategori default tidak dapat dihapus",
        variant: "destructive",
      })
      return
    }

    setCategories((prev) => prev.filter((cat) => cat.id !== categoryId))
    toast({
      title: "Kategori berhasil dihapus",
      description: "Kategori telah dihapus dari daftar",
    })
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
              <div className="text-sm text-muted-foreground">{category.transactionCount} transaksi</div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover border-border">
              <DropdownMenuItem onClick={() => handleEdit(category)} className="text-popover-foreground">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              {!category.isDefault && (
                <DropdownMenuItem onClick={() => handleDelete(category.id)} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Hapus
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
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => {
                    setEditingCategory(null)
                    setFormData({ name: "", color: colorOptions[0] })
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Kategori
                </Button>
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
                    <Button type="submit" className="bg-primary hover:bg-primary/90">
                      {editingCategory ? "Perbarui" : "Tambah"} Kategori
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 bg-muted">
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

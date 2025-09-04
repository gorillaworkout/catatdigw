"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/use-auth"
import { useOffline } from "@/hooks/use-offline"
import { Wifi, WifiOff } from "lucide-react"

interface OfflineExpenseFormProps {
  onSuccess?: () => void
}

export function OfflineExpenseForm({ onSuccess }: OfflineExpenseFormProps) {
  const { user } = useAuth()
  const { isOnline, addTransaction } = useOffline()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    account: "",
    date: new Date().toISOString().split('T')[0]
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date)
      }

      await addTransaction(user.uid, expenseData, 'expense')
      
      // Reset form
      setFormData({
        description: "",
        amount: "",
        category: "",
        account: "",
        date: new Date().toISOString().split('T')[0]
      })

      onSuccess?.()
    } catch (error) {
      console.error('Failed to add expense:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="w-5 h-5 text-green-500" />
          ) : (
            <WifiOff className="w-5 h-5 text-red-500" />
          )}
          Add Expense {isOnline ? "(Online)" : "(Offline)"}
        </CardTitle>
        <CardDescription>
          {isOnline 
            ? "This expense will be saved directly to the server."
            : "This expense will be saved locally and synced when you're back online."
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter expense description"
              required
            />
          </div>

          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="shopping">Shopping</SelectItem>
                <SelectItem value="bills">Bills</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="account">Account</Label>
            <Select value={formData.account} onValueChange={(value) => setFormData({ ...formData, account: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="bank">Bank Account</SelectItem>
                <SelectItem value="credit">Credit Card</SelectItem>
                <SelectItem value="ewallet">E-Wallet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : isOnline ? "Save Expense" : "Save Offline"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

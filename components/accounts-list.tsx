"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, CreditCard, Wallet, PiggyBank } from "lucide-react"

// Mock data
const accounts = [
  {
    id: 1,
    name: "BCA Tabungan",
    type: "bank",
    balance: 8500000,
    icon: CreditCard,
    color: "text-blue-500",
  },
  {
    id: 2,
    name: "Cash",
    type: "cash",
    balance: 1250000,
    icon: Wallet,
    color: "text-green-500",
  },
  {
    id: 3,
    name: "Investasi",
    type: "investment",
    balance: 6000000,
    icon: PiggyBank,
    color: "text-purple-500",
  },
]

export function AccountsList() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-card-foreground">Daftar Rekening</CardTitle>
            <CardDescription>Kelola semua akun keuangan Anda</CardDescription>
          </div>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Tambah
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {accounts.map((account) => (
          <div key={account.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center space-x-3">
              <div className="bg-background p-2 rounded-lg">
                <account.icon className={`h-5 w-5 ${account.color}`} />
              </div>
              <div>
                <p className="font-medium text-card-foreground">{account.name}</p>
                <p className="text-sm text-muted-foreground capitalize">{account.type}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-card-foreground">{formatCurrency(account.balance)}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

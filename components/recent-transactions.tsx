"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownRight, MoreHorizontal } from "lucide-react"

// Mock data
const transactions = [
  {
    id: 1,
    type: "expense",
    description: "Belanja Groceries",
    category: "Makanan",
    amount: 350000,
    date: "2024-06-29",
    account: "BCA Tabungan",
  },
  {
    id: 2,
    type: "income",
    description: "Gaji Bulanan",
    category: "Salary",
    amount: 8500000,
    date: "2024-06-28",
    account: "BCA Tabungan",
  },
  {
    id: 3,
    type: "expense",
    description: "Bensin Motor",
    category: "Transportasi",
    amount: 50000,
    date: "2024-06-27",
    account: "Cash",
  },
  {
    id: 4,
    type: "expense",
    description: "Netflix Subscription",
    category: "Hiburan",
    amount: 186000,
    date: "2024-06-26",
    account: "BCA Tabungan",
  },
  {
    id: 5,
    type: "income",
    description: "Freelance Project",
    category: "Freelance",
    amount: 2500000,
    date: "2024-06-25",
    account: "BCA Tabungan",
  },
]

export function RecentTransactions() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    })
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-card-foreground">Transaksi Terbaru</CardTitle>
            <CardDescription>5 transaksi terakhir</CardDescription>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${transaction.type === "income" ? "bg-green-500/10" : "bg-red-500/10"}`}>
                {transaction.type === "income" ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
              </div>
              <div>
                <p className="font-medium text-card-foreground">{transaction.description}</p>
                <p className="text-sm text-muted-foreground">
                  {transaction.category} • {transaction.account}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-semibold ${transaction.type === "income" ? "text-green-500" : "text-red-500"}`}>
                {transaction.type === "income" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </p>
              <p className="text-sm text-muted-foreground">{formatDate(transaction.date)}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

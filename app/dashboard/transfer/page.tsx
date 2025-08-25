"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUserCollection } from "@/hooks/use-firestore"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { parseIDR, formatIDR } from "@/lib/utils"
import { transferFunds } from "@/lib/firestore"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Info, ArrowRight, ArrowLeftRight, Calendar } from "lucide-react"

type Account = { id: string; name: string; balance?: number }
type Transfer = {
  id: string
  fromAccountId: string
  fromAccountName: string
  toAccountId: string
  toAccountName: string
  amount: number
  date: string
  notes: string
  createdAt: any
}

export default function TransferPage() {
  const { data: accounts } = useUserCollection<Account>("accounts")
  const { data: transfers } = useUserCollection<Transfer>("transfers")
  const { user } = useAuth()
  const { toast } = useToast()

  const [form, setForm] = useState({
    from: "",
    to: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  })
  const [loading, setLoading] = useState(false)

  const handleAmountChange = (value: string) => {
    const numeric = value.replace(/[^\d]/g, "")
    if (numeric === "") {
      setForm(prev => ({ ...prev, amount: "" }))
      return
    }
    setForm(prev => ({ ...prev, amount: formatIDR(numeric) }))
  }

  // Get selected accounts data
  const fromAccount = accounts.find(acc => acc.id === form.from)
  const toAccount = accounts.find(acc => acc.id === form.to)
  const fromBalance = fromAccount?.balance || 0
  const transferAmount = parseIDR(form.amount)
  const hasInsufficientFunds = transferAmount > 0 && transferAmount > fromBalance
  const canSubmit = form.from && form.to && form.from !== form.to && transferAmount > 0 && !hasInsufficientFunds

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    
    if (!form.from || !form.to) {
      toast({ title: "Rekening belum dipilih", description: "Pilih rekening asal dan tujuan", variant: "destructive" })
      return
    }
    
    if (form.from === form.to) {
      toast({ title: "Rekening sama", description: "Pilih rekening tujuan yang berbeda", variant: "destructive" })
      return
    }
    
    if (transferAmount <= 0) {
      toast({ title: "Jumlah tidak valid", description: "Masukkan jumlah lebih dari 0", variant: "destructive" })
      return
    }

    if (hasInsufficientFunds) {
      toast({ 
        title: "Saldo tidak mencukupi", 
        description: `Saldo rekening ${fromAccount?.name} hanya ${formatIDR(fromBalance)}`, 
        variant: "destructive" 
      })
      return
    }

    setLoading(true)
    try {
      await transferFunds(user.uid, {
        fromAccountId: form.from,
        toAccountId: form.to,
        amount: transferAmount,
        date: form.date,
        notes: form.notes,
      })
      toast({ title: "Pindah dana berhasil", description: `${formatIDR(transferAmount)} dipindahkan dari ${fromAccount?.name} ke ${toAccount?.name}` })
      setForm({ from: "", to: "", amount: "", date: new Date().toISOString().split("T")[0], notes: "" })
    } catch (err: any) {
      toast({ title: "Gagal pindah dana", description: err?.message || String(err), variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Pindah Dana</h1>
            <p className="text-muted-foreground">Pindahkan saldo antar rekening</p>
          </div>
        </div>

        <Card className="bg-card border-border max-w-2xl">
          <CardHeader>
            <CardTitle className="text-card-foreground">Form Pindah Dana</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-card-foreground">Dari Rekening *</Label>
                  <Select value={form.from} onValueChange={(v) => setForm(prev => ({ ...prev, from: v, to: v === form.to ? "" : form.to }))}>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Pilih rekening asal" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {accounts.map((a) => (
                        <SelectItem key={a.id} value={a.id} className="text-popover-foreground">
                          {a.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fromAccount && (
                    <div className="text-sm text-muted-foreground">
                      Saldo: <span className="font-medium text-foreground">{formatIDR(fromBalance)}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-card-foreground">Ke Rekening *</Label>
                  <Select value={form.to} onValueChange={(v) => setForm(prev => ({ ...prev, to: v }))}>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Pilih rekening tujuan" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {accounts
                        .filter(acc => acc.id !== form.from) // Exclude source account
                        .map((a) => (
                          <SelectItem key={a.id} value={a.id} className="text-popover-foreground">
                            {a.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {toAccount && (
                    <div className="text-sm text-muted-foreground">
                      Saldo: <span className="font-medium text-foreground">{formatIDR(toAccount.balance || 0)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-card-foreground">Jumlah *</Label>
                  <Input
                    id="amount"
                    type="text"
                    placeholder="Rp 0"
                    value={form.amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    required
                    className="bg-background border-border"
                  />
                  {transferAmount > 0 && fromAccount && (
                    <div className="text-sm text-muted-foreground">
                      Saldo setelah transfer: <span className="font-medium text-foreground">{formatIDR(fromBalance - transferAmount)}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-card-foreground">Tanggal *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm(prev => ({ ...prev, date: e.target.value }))}
                    required
                    className="bg-background border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-card-foreground">Catatan (Opsional)</Label>
                <Input
                  id="notes"
                  type="text"
                  placeholder="Misal: Pindah dana rutin"
                  value={form.notes}
                  onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                  className="bg-background border-border"
                />
              </div>

              {/* Validation Alerts */}
              {form.from && form.to && form.from === form.to && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Rekening asal dan tujuan tidak boleh sama. Pilih rekening yang berbeda.
                  </AlertDescription>
                </Alert>
              )}

              {hasInsufficientFunds && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Saldo rekening {fromAccount?.name} tidak mencukupi untuk transfer {formatIDR(transferAmount)}. 
                    Saldo tersedia: {formatIDR(fromBalance)}
                  </AlertDescription>
                </Alert>
              )}

              {form.from && form.to && form.from !== form.to && transferAmount > 0 && !hasInsufficientFunds && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Transfer {formatIDR(transferAmount)} dari {fromAccount?.name} ke {toAccount?.name}. 
                    Saldo {fromAccount?.name} akan berkurang menjadi {formatIDR(fromBalance - transferAmount)}.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end">
                <Button type="submit" disabled={!canSubmit || loading} className="bg-primary text-primary-foreground">
                  {loading ? "Memproses..." : "Pindahkan Dana"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Transfer History List */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5" />
              Riwayat Pindah Dana
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {transfers.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-muted-foreground">
                  <ArrowLeftRight className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">Belum ada riwayat pindah dana</p>
                  <p className="text-sm">Lakukan transfer pertama untuk melihat riwayat di sini</p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {transfers.map((transfer) => (
                  <div key={transfer.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="bg-blue-500/10 p-2 rounded-lg">
                            <ArrowRight className="h-4 w-4 text-blue-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-card-foreground">{transfer.fromAccountName}</span>
                              <ArrowRight className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium text-card-foreground">{transfer.toAccountName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(transfer.date)}</span>
                              {transfer.notes && (
                                <>
                                  <span>•</span>
                                  <span>{transfer.notes}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-blue-500">
                          {formatIDR(transfer.amount)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}



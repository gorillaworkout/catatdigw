"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CreditCard, DollarSign, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { useUserCollection } from "@/hooks/use-firestore"
import { useInstallments } from "@/hooks/use-installments"
import { SubscriptionGuardButton } from "@/components/subscription-guard-button"

type InstallmentSelectorProps = {
  onInstallmentSelected?: (installment: any, paymentAmount: number) => void
  selectedInstallmentId?: string
  disabled?: boolean
}

export function InstallmentSelector({ 
  onInstallmentSelected, 
  selectedInstallmentId, 
  disabled = false 
}: InstallmentSelectorProps) {
  const { user } = useAuth()
  const { data: allAccounts } = useUserCollection<any>("accounts")
  const { installments, payInstallmentAmount } = useInstallments()
  const { toast } = useToast()
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedInstallment, setSelectedInstallment] = useState<any>(null)
  const [paymentAmount, setPaymentAmount] = useState("")
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0])
  const [paymentAccountId, setPaymentAccountId] = useState("")
  const [paymentNotes, setPaymentNotes] = useState("")
  const [loading, setLoading] = useState(false)
  
  const activeAccounts = allAccounts.filter((a: any) => a.isActive !== false)
  const activeInstallments = installments.filter((i: any) => i.status === "active" && i.remainingAmount > 0)
  
  const selectedInstallmentData = installments.find((i: any) => i.id === selectedInstallmentId)

  const handleInstallmentSelect = (installmentId: string) => {
    const installment = installments.find((i: any) => i.id === installmentId)
    if (installment) {
      setSelectedInstallment(installment)
      setPaymentAmount(String(installment.installmentAmount))
      setPaymentDate(new Date().toISOString().split('T')[0])
      setPaymentAccountId(installment.accountId)
    }
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedInstallment || !user) return
    
    setLoading(true)
    try {
      const paymentInput = {
        installmentId: selectedInstallment.id,
        paymentNumber: selectedInstallment.paidInstallments + 1,
        amount: Number(paymentAmount),
        paymentDate: paymentDate,
        accountId: paymentAccountId,
        accountName: activeAccounts.find((a: any) => a.id === paymentAccountId)?.name,
        notes: paymentNotes,
      }

      await payInstallmentAmount(paymentInput)
      
      // Call the callback if provided
      if (onInstallmentSelected) {
        onInstallmentSelected(selectedInstallment, Number(paymentAmount))
      }
      
      toast({ 
        title: "Pembayaran cicilan berhasil", 
        description: `Pembayaran ${selectedInstallment.title} telah dicatat` 
      })
      
      setIsDialogOpen(false)
      resetForm()
    } catch (err: any) {
      toast({ 
        title: "Gagal melakukan pembayaran", 
        description: err?.message || String(err),
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setSelectedInstallment(null)
    setPaymentAmount("")
    setPaymentDate(new Date().toISOString().split('T')[0])
    setPaymentAccountId("")
    setPaymentNotes("")
  }

  const InstallmentCard = ({ installment }: { installment: any }) => (
    <div 
      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
        selectedInstallment?.id === installment.id 
          ? "border-primary bg-primary/5" 
          : "border-border hover:border-primary/50"
      }`}
      onClick={() => handleInstallmentSelect(installment.id)}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-card-foreground">{installment.title}</h3>
        <Badge variant="secondary" className="text-xs">
          {installment.paidInstallments}/{installment.numberOfInstallments}
        </Badge>
      </div>
      
      <div className="space-y-1 text-sm text-muted-foreground">
        <div className="flex justify-between">
          <span>Total:</span>
          <span>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(installment.totalAmount)}</span>
        </div>
        <div className="flex justify-between">
          <span>Sisa:</span>
          <span className="font-medium text-card-foreground">
            {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(installment.remainingAmount)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Per Cicilan:</span>
          <span>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(installment.installmentAmount)}</span>
        </div>
        <div className="flex justify-between">
          <span>Jatuh Tempo:</span>
          <span>{new Date(installment.dueDate).toLocaleDateString("id-ID")}</span>
        </div>
      </div>
      
      {installment.description && (
        <p className="text-xs text-muted-foreground mt-2">{installment.description}</p>
      )}
    </div>
  )

  return (
    <div className="space-y-2">
      <Label className="text-card-foreground">Bayar Cicilan (Opsional)</Label>
      
      {selectedInstallmentData ? (
        <div className="p-3 border border-border rounded-lg bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-card-foreground">{selectedInstallmentData.title}</p>
              <p className="text-sm text-muted-foreground">
                Sisa: {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(selectedInstallmentData.remainingAmount)}
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onInstallmentSelected?.(null, 0)}
            >
              Hapus
            </Button>
          </div>
        </div>
      ) : (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <SubscriptionGuardButton
              variant="outline"
              className="w-full justify-start"
              disabled={disabled}
              tooltipText="Subscription berakhir. Hubungi WhatsApp untuk pembayaran."
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Pilih Cicilan untuk Dibayar
            </SubscriptionGuardButton>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-card border-border max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-card-foreground">Bayar Cicilan</DialogTitle>
              <DialogDescription>
                Pilih cicilan yang ingin dibayar dan tentukan jumlah pembayaran
              </DialogDescription>
            </DialogHeader>
            
            {activeInstallments.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Tidak ada cicilan aktif yang perlu dibayar</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-card-foreground">Pilih Cicilan</Label>
                  <div className="grid gap-3">
                    {activeInstallments.map((installment) => (
                      <InstallmentCard key={installment.id} installment={installment} />
                    ))}
                  </div>
                </div>

                {selectedInstallment && (
                  <form onSubmit={handlePaymentSubmit} className="space-y-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label className="text-card-foreground">Detail Pembayaran</Label>
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <p className="font-medium">{selectedInstallment.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Cicilan ke-{selectedInstallment.paidInstallments + 1} dari {selectedInstallment.numberOfInstallments}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="paymentAmount" className="text-card-foreground">
                          Jumlah Pembayaran *
                        </Label>
                        <Input
                          id="paymentAmount"
                          type="number"
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(e.target.value)}
                          required
                          max={selectedInstallment.remainingAmount}
                          className="bg-background border-border"
                        />
                        <p className="text-xs text-muted-foreground">
                          Maksimal: {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(selectedInstallment.remainingAmount)}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="paymentDate" className="text-card-foreground">
                          Tanggal Pembayaran *
                        </Label>
                        <Input
                          id="paymentDate"
                          type="date"
                          value={paymentDate}
                          onChange={(e) => setPaymentDate(e.target.value)}
                          required
                          className="bg-background border-border"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="paymentAccount" className="text-card-foreground">
                        Rekening Pembayaran *
                      </Label>
                      <Select value={paymentAccountId} onValueChange={setPaymentAccountId}>
                        <SelectTrigger className="bg-background border-border">
                          <SelectValue placeholder="Pilih rekening" />
                        </SelectTrigger>
                        <SelectContent>
                          {activeAccounts.map((account: any) => (
                            <SelectItem key={account.id} value={account.id}>
                              {account.name} - {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(account.balance || 0)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="paymentNotes" className="text-card-foreground">
                        Catatan
                      </Label>
                      <Textarea
                        id="paymentNotes"
                        placeholder="Catatan pembayaran (opsional)"
                        value={paymentNotes}
                        onChange={(e) => setPaymentNotes(e.target.value)}
                        className="bg-background border-border"
                      />
                    </div>

                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Batal
                      </Button>
                      <SubscriptionGuardButton 
                        type="submit" 
                        className="bg-primary hover:bg-primary/90"
                        disabled={loading}
                        tooltipText="Subscription berakhir. Hubungi WhatsApp untuk pembayaran."
                      >
                        {loading ? "Memproses..." : "Bayar Cicilan"}
                      </SubscriptionGuardButton>
                    </DialogFooter>
                  </form>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}


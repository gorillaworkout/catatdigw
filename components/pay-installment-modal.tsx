"use client"

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
import { DollarSign } from "lucide-react"
import { SubscriptionGuardButton } from "@/components/subscription-guard-button"
import { formatIDR, parseIDR } from "@/lib/utils"
import { usePaymentModal } from "@/hooks/use-payment-modal"

type PayInstallmentModalProps = {
  trigger?: React.ReactNode
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  onSuccess?: () => void
}

export function PayInstallmentModal({ 
  trigger,
  variant = "outline",
  size = "default",
  className = "",
  onSuccess
}: PayInstallmentModalProps) {
  const {
    isDialogOpen,
    selectedInstallment,
    paymentData,
    loading,
    activeAccounts,
    activeInstallments,
    getPaymentOptions,
    handleInstallmentSelect,
    handlePaymentSubmit,
    handleDialogOpenChange,
    isPaymentFormValid,
    setPaymentData,
  } = usePaymentModal()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await handlePaymentSubmit(e)
    if (onSuccess) {
      onSuccess()
    }
  }

  if (activeInstallments.length === 0) {
    return null // Don't show button if no active installments
  }

  const defaultTrigger = (
    <Button
      variant={variant}
      size={size}
      className={className}
    >
      <DollarSign className="h-4 w-4 mr-2" />
      Bayar Cicilan
    </Button>
  )

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] max-h-[90vh] bg-card border-border flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-card-foreground">
            Bayar Cicilan
          </DialogTitle>
          <DialogDescription>
            {selectedInstallment && `Bayar cicilan: ${selectedInstallment.title}`}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 flex-1 overflow-y-auto pr-2">
          {/* Installment Selection */}
          <div className="space-y-2">
            <Label className="text-card-foreground font-medium">
              Pilih Cicilan <span className="text-red-500">*</span>
            </Label>
            <Select
              value={selectedInstallment?.id || ""}
              onValueChange={handleInstallmentSelect}
            >
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Pilih cicilan..." />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {activeInstallments.map((installment: any) => (
                  <SelectItem key={installment.id} value={installment.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{installment.title}</span>
                      <span className="text-sm text-muted-foreground">
                        Sisa: {installment.remainingAmount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedInstallment && (
            <>
              {/* Check if installment is completed */}
              {selectedInstallment.paidInstallments >= selectedInstallment.numberOfInstallments ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl mb-2">✅</div>
                      <p className="font-medium text-green-800">Cicilan Sudah Lunas</p>
                      <p className="text-sm text-green-600">
                        Cicilan {selectedInstallment.title} sudah selesai dibayar ({selectedInstallment.paidInstallments}/{selectedInstallment.numberOfInstallments})
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Payment Options */}
                  <div className="space-y-3">
                <Label className="text-card-foreground font-medium">
                  Pilih Jenis Pembayaran <span className="text-red-500">*</span>
                </Label>
                <div className="grid gap-3">
                  {getPaymentOptions().map((option) => (
                    <div
                      key={option.value}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        paymentData.paymentType === option.value || 
                        (option.value.startsWith('multiple_') && paymentData.paymentType === 'multiple' && 
                         paymentData.numberOfPayments === parseInt(option.value.split('_')[1]))
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => {
                        if (option.value === 'single') {
                          setPaymentData(prev => ({
                            ...prev,
                            paymentType: 'single',
                            numberOfPayments: 1,
                            amount: formatIDR(option.amount),
                            customMonths: ""
                          }))
                        } else if (option.value === 'full') {
                          setPaymentData(prev => ({
                            ...prev,
                            paymentType: 'full',
                            numberOfPayments: selectedInstallment.numberOfInstallments - selectedInstallment.paidInstallments,
                            amount: formatIDR(option.amount),
                            customMonths: ""
                          }))
                        } else if (option.value.startsWith('multiple_')) {
                          const months = parseInt(option.value.split('_')[1])
                          setPaymentData(prev => ({
                            ...prev,
                            paymentType: 'multiple',
                            numberOfPayments: months,
                            amount: formatIDR(option.amount),
                            customMonths: ""
                          }))
                        } else if (option.value === 'custom') {
                          setPaymentData(prev => ({
                            ...prev,
                            paymentType: 'custom',
                            numberOfPayments: 1,
                            amount: "",
                            customMonths: ""
                          }))
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-card-foreground">{option.label}</p>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-card-foreground">
                            {option.value === 'custom' ? 'Custom' : formatIDR(option.amount)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Payment Input */}
              {paymentData.paymentType === 'custom' && (
                <div className="space-y-3">
                  <Label htmlFor="customMonths" className="text-card-foreground">
                    Jumlah Bulan <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="customMonths"
                    type="number"
                    min="1"
                    max={selectedInstallment.numberOfInstallments - selectedInstallment.paidInstallments}
                    placeholder="Masukkan jumlah bulan"
                    value={paymentData.customMonths}
                    onChange={(e) => {
                      const months = parseInt(e.target.value) || 0
                      const maxMonths = selectedInstallment.numberOfInstallments - selectedInstallment.paidInstallments
                      const validMonths = Math.min(Math.max(months, 1), maxMonths)
                      
                      const totalAmount = selectedInstallment.installmentAmount * validMonths
                      
                      setPaymentData(prev => ({
                        ...prev,
                        customMonths: String(validMonths),
                        numberOfPayments: validMonths,
                        amount: formatIDR(totalAmount)
                      }))
                    }}
                    className="bg-background border-border w-full"
                  />
                  {paymentData.customMonths && (
                    <p className="text-sm text-muted-foreground">
                      Total: {formatIDR(selectedInstallment.installmentAmount * parseInt(paymentData.customMonths))}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="paymentAmount" className="text-card-foreground">
                  Jumlah Pembayaran <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="paymentAmount"
                  placeholder="Rp 0"
                  value={paymentData.amount}
                  readOnly
                  disabled
                  className="bg-muted border-border w-full cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground">
                  Jumlah pembayaran otomatis dihitung berdasarkan pilihan jenis pembayaran
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentDate" className="text-card-foreground">
                  Tanggal Pembayaran <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="paymentDate"
                  type="date"
                  value={paymentData.paymentDate}
                  onChange={(e) => setPaymentData((prev) => ({ ...prev, paymentDate: e.target.value }))}
                  required
                  className={`bg-background border-border w-full ${!paymentData.paymentDate ? 'border-red-300 focus:border-red-500' : ''} [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:contrast-100`}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentAccountId" className="text-card-foreground">
                  Rekening Pembayaran <span className="text-red-500">*</span>
                </Label>
                <Select value={paymentData.accountId} onValueChange={(value) => setPaymentData((prev) => ({ ...prev, accountId: value }))}>
                  <SelectTrigger className={`bg-background border-border w-full ${!paymentData.accountId ? 'border-red-300 focus:border-red-500' : ''}`}>
                    <SelectValue placeholder="Pilih rekening" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeAccounts.map((account: any) => {
                      const accountBalance = account.balance || 0
                      const paymentAmount = parseIDR(paymentData.amount)
                      const isSufficient = accountBalance >= paymentAmount
                      
                      return (
                        <SelectItem key={account.id} value={account.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{account.name} :</span>
                            <span className={`text-xs ${isSufficient ? 'text-green-600' : 'text-red-600'}`}>
                              {formatIDR(accountBalance)}
                            </span>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
                
                {/* Balance Check */}
                {paymentData.accountId && paymentData.amount && (
                  <div className="mt-2">
                    {(() => {
                      const selectedAccount = activeAccounts.find((a: any) => a.id === paymentData.accountId)
                      const accountBalance = selectedAccount?.balance || 0
                      const paymentAmount = parseIDR(paymentData.amount)
                      const isSufficient = accountBalance >= paymentAmount
                      
                      return (
                        <div className={`p-2 rounded-lg text-sm ${
                          isSufficient 
                            ? 'bg-green-50 border border-green-200 text-green-800' 
                            : 'bg-red-50 border border-red-200 text-red-800'
                        }`}>
                          <div className="flex items-center justify-between">
                            <span>Saldo Rekening:</span>
                            <span className="font-medium">{formatIDR(accountBalance)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Jumlah Pembayaran:</span>
                            <span className="font-medium">{formatIDR(paymentAmount)}</span>
                          </div>
                          <div className="flex items-center justify-between font-medium">
                            <span>Status:</span>
                            <span>{isSufficient ? '✅ Cukup' : '❌ Tidak Cukup'}</span>
                          </div>
                          {!isSufficient && (
                            <p className="text-xs mt-1">
                              Kurang: {formatIDR(paymentAmount - accountBalance)}
                            </p>
                          )}
                        </div>
                      )
                    })()}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentNotes" className="text-card-foreground">
                  Catatan
                </Label>
                <Textarea
                  id="paymentNotes"
                  placeholder="Catatan pembayaran (opsional)"
                  value={paymentData.notes}
                  onChange={(e) => setPaymentData((prev) => ({ ...prev, notes: e.target.value }))}
                  className="bg-background border-border w-full"
                />
              </div>
                </>
              )}
            </>
          )}

          {/* Form Buttons */}
          <div className="flex-shrink-0 pt-4 border-t border-border flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => handleDialogOpenChange(false)}>
              Batal
            </Button>
            <SubscriptionGuardButton
              type="submit"
              disabled={!isPaymentFormValid() || loading}
            >
              {loading ? "Memproses..." : "Bayar Cicilan"}
            </SubscriptionGuardButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

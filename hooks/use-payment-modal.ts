import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { useUserCollection } from "@/hooks/use-firestore"
import { useInstallments } from "@/hooks/use-installments"
import { formatIDR, parseIDR } from "@/lib/utils"

type Installment = {
  id: string
  title: string
  description?: string
  totalAmount: number
  numberOfInstallments: number
  installmentAmount: number
  interestRate: number
  monthlyInterest: number
  totalWithInterest: number
  startDate: string
  dueDate: string
  accountId: string
  accountName?: string
  categoryId: string
  categoryName?: string
  status: "active" | "completed" | "overdue"
  notes?: string
  paidInstallments: number
  totalPaid: number
  remainingAmount: number
}

export function usePaymentModal() {
  const { user } = useAuth()
  const { data: allAccounts } = useUserCollection<any>("accounts")
  const { installments, payInstallmentAmount } = useInstallments()
  const { toast } = useToast()
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedInstallment, setSelectedInstallment] = useState<Installment | null>(null)
  const [paymentData, setPaymentData] = useState({
    amount: "",
    paymentDate: new Date().toISOString().split('T')[0],
    accountId: "",
    notes: "",
    paymentType: "single" as "single" | "multiple" | "full" | "custom",
    numberOfPayments: 1,
    customMonths: "",
  })
  const [loading, setLoading] = useState(false)
  
  const activeAccounts = allAccounts.filter((a: any) => a.isActive !== false)
  const activeInstallments = installments.filter((i: any) => 
    i.status === "active" && 
    i.remainingAmount > 0 && 
    i.paidInstallments < i.numberOfInstallments
  )

  // Get available payment options
  const getPaymentOptions = () => {
    if (!selectedInstallment) return []
    
    // Check if installment is already completed
    if (selectedInstallment.paidInstallments >= selectedInstallment.numberOfInstallments) {
      return []
    }
    
    const options = []
    const remainingInstallments = selectedInstallment.numberOfInstallments - selectedInstallment.paidInstallments
    
    // Single payment (default)
    options.push({
      value: "single",
      label: "Bayar 1 Bulan",
      amount: selectedInstallment.installmentAmount,
      description: `Bayar cicilan ke-${selectedInstallment.paidInstallments + 1}`
    })
    
    // Quick payment options (3 months only)
    if (3 <= remainingInstallments) {
      const totalAmount = selectedInstallment.installmentAmount * 3
      options.push({
        value: `multiple_3`,
        label: `Bayar 3 Bulan`,
        amount: totalAmount,
        description: `Bayar cicilan ke-${selectedInstallment.paidInstallments + 1} sampai ke-${selectedInstallment.paidInstallments + 3}`
      })
    }
    
    // Custom payment option for longer installments
    if (remainingInstallments > 3) {
      options.push({
        value: "custom",
        label: "Bayar Custom",
        amount: 0,
        description: `Pilih jumlah bulan yang ingin dibayar (1-${remainingInstallments} bulan)`
      })
    }
    
    // Full payment - use calculated amount for consistency
    if (remainingInstallments > 1) {
      const calculatedRemainingAmount = selectedInstallment.installmentAmount * remainingInstallments
      options.push({
        value: "full",
        label: "Lunaskan Semua",
        amount: calculatedRemainingAmount,
        description: `Bayar semua cicilan yang tersisa (${remainingInstallments} bulan)`
      })
    }
    
    return options
  }

  const handleInstallmentSelect = (installmentId: string) => {
    const installment = installments.find((i: any) => i.id === installmentId)
    if (installment) {
      // Check if installment is already completed
      if (installment.paidInstallments >= installment.numberOfInstallments) {
        toast({ 
          title: "Cicilan sudah lunas", 
          description: "Cicilan ini sudah selesai dibayar",
          variant: "destructive"
        })
        return
      }
      
      setSelectedInstallment(installment)
      setPaymentData({
        amount: formatIDR(installment.installmentAmount),
        paymentDate: new Date().toISOString().split('T')[0],
        accountId: installment.accountId,
        notes: "",
        paymentType: "single",
        numberOfPayments: 1,
        customMonths: "",
      })
    }
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedInstallment || !user) return
    
    // Check if installment is already completed
    if (selectedInstallment.paidInstallments >= selectedInstallment.numberOfInstallments) {
      toast({ 
        title: "Cicilan sudah lunas", 
        description: "Cicilan ini sudah selesai dibayar",
        variant: "destructive"
      })
      return
    }
    
    setLoading(true)
    try {
      const paymentInput = {
        installmentId: selectedInstallment.id,
        paymentNumber: selectedInstallment.paidInstallments + 1,
        amount: parseIDR(paymentData.amount),
        paymentDate: paymentData.paymentDate,
        accountId: paymentData.accountId,
        accountName: activeAccounts.find((a: any) => a.id === paymentData.accountId)?.name,
        notes: paymentData.notes,
      }

      await payInstallmentAmount(paymentInput)
      
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
    setPaymentData({
      amount: "",
      paymentDate: new Date().toISOString().split('T')[0],
      accountId: "",
      notes: "",
      paymentType: "single",
      numberOfPayments: 1,
      customMonths: "",
    })
  }

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      resetForm()
    }
  }

  const isPaymentFormValid = () => {
    return !!(
      selectedInstallment &&
      selectedInstallment.paidInstallments < selectedInstallment.numberOfInstallments &&
      paymentData.amount &&
      parseIDR(paymentData.amount) > 0 &&
      paymentData.paymentDate &&
      paymentData.accountId
    )
  }

  return {
    // State
    isDialogOpen,
    selectedInstallment,
    paymentData,
    loading,
    activeAccounts,
    activeInstallments,
    
    // Functions
    getPaymentOptions,
    handleInstallmentSelect,
    handlePaymentSubmit,
    resetForm,
    handleDialogOpenChange,
    isPaymentFormValid,
    setPaymentData,
  }
}

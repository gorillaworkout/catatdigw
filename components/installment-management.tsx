"use client"

import type React from "react"
import { useMemo, useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, MoreHorizontal, CreditCard, Calendar, DollarSign } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { useUserCollection } from "@/hooks/use-firestore"
import { useInstallments } from "@/hooks/use-installments"
import { SubscriptionGuardButton } from "@/components/subscription-guard-button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

export function InstallmentManagement() {
  const { user } = useAuth()
  const { data: allCategories } = useUserCollection<any>("categories")
  const { data: allAccounts } = useUserCollection<any>("accounts")
  const { 
    installments, 
    loading, 
    addInstallment, 
    updateInstallmentData, 
    removeInstallment,
    payInstallmentAmount,
    getPaymentsForInstallment
  } = useInstallments()
  
  const expenseCategories = useMemo(() => allCategories.filter((c: any) => c.type === "expense"), [allCategories])
  const activeAccounts = useMemo(() => allAccounts.filter((a: any) => a.isActive !== false), [allAccounts])
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [editingInstallment, setEditingInstallment] = useState<Installment | null>(null)
  const [selectedInstallment, setSelectedInstallment] = useState<Installment | null>(null)
  const [detailInstallment, setDetailInstallment] = useState<Installment | null>(null)
  const [paymentHistory, setPaymentHistory] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    totalAmount: "",
    numberOfInstallments: "",
    installmentAmount: "",
    interestRate: "",
    monthlyInterest: "",
    totalWithInterest: "",
    startDate: "",
    dueDate: "",
    accountId: "",
    categoryId: "",
    notes: "",
  })

  const [paymentData, setPaymentData] = useState({
    amount: "",
    paymentDate: "",
    accountId: "",
    notes: "",
    paymentType: "single" as "single" | "multiple" | "full" | "custom",
    numberOfPayments: 1,
    customMonths: "",
  })

  // Calculate installment amount automatically
  useEffect(() => {
    const totalAmount = parseIDR(formData.totalAmount)
    const numberOfInstallments = Number(formData.numberOfInstallments) || 0
    const interestRate = Number(formData.interestRate) || 0

    if (totalAmount > 0 && numberOfInstallments > 0) {
      const monthlyInterest = (totalAmount * interestRate) / 100
      const totalWithInterest = totalAmount + (monthlyInterest * numberOfInstallments)
      const installmentAmount = totalWithInterest / numberOfInstallments

      setFormData(prev => ({
        ...prev,
        monthlyInterest: formatIDR(monthlyInterest),
        totalWithInterest: formatIDR(totalWithInterest),
        installmentAmount: formatIDR(installmentAmount)
      }))
    }
  }, [formData.totalAmount, formData.numberOfInstallments, formData.interestRate])

  const handleTotalAmountChange = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, "")
    
    if (numericValue === "") {
      setFormData(prev => ({ ...prev, totalAmount: "" }))
      return
    }
    
    const formattedValue = formatIDR(numericValue)
    setFormData(prev => ({ ...prev, totalAmount: formattedValue }))
  }

  const handleInterestRateChange = (value: string) => {
    const numericValue = value.replace(/[^\d.]/g, "")
    setFormData(prev => ({ ...prev, interestRate: numericValue }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Double check validation before submitting
    if (!isFormValid()) {
      toast({ 
        title: "Form tidak lengkap", 
        description: "Mohon lengkapi semua field yang wajib diisi",
        variant: "destructive"
      })
      return
    }
    
    try {
      if (!user) throw new Error("Harus login")
      
      const installmentData = {
        title: formData.title.trim(),
        description: formData.description,
        totalAmount: parseIDR(formData.totalAmount),
        numberOfInstallments: Number(formData.numberOfInstallments),
        installmentAmount: parseIDR(formData.installmentAmount),
        interestRate: Number(formData.interestRate) || 0,
        monthlyInterest: parseIDR(formData.monthlyInterest),
        totalWithInterest: parseIDR(formData.totalWithInterest),
        startDate: formData.startDate,
        dueDate: formData.dueDate,
        accountId: formData.accountId,
        accountName: activeAccounts.find((a: any) => a.id === formData.accountId)?.name,
        categoryId: formData.categoryId,
        categoryName: expenseCategories.find((c: any) => c.id === formData.categoryId)?.name,
        status: "active" as const,
        notes: formData.notes,
      }

      if (editingInstallment) {
        await updateInstallmentData(editingInstallment.id, installmentData)
        toast({ title: "Cicilan berhasil diperbarui", description: `${formData.title} telah diperbarui` })
      } else {
        await addInstallment(installmentData)
        toast({ title: "Cicilan berhasil ditambahkan", description: `${formData.title} telah ditambahkan` })
      }
      
      resetForm()
      setIsDialogOpen(false)
    } catch (err: any) {
      console.error("Error submitting installment:", err)
      toast({ 
        title: "Gagal menyimpan cicilan", 
        description: err?.message || String(err),
        variant: "destructive"
      })
    }
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate payment form
    if (!paymentData.amount || !paymentData.paymentDate || !paymentData.accountId) {
      toast({ 
        title: "Form pembayaran tidak lengkap", 
        description: "Mohon lengkapi semua field yang wajib diisi",
        variant: "destructive"
      })
      return
    }
    
    try {
      if (!user || !selectedInstallment) throw new Error("Harus login dan cicilan dipilih")
      
      // Handle multiple payments
      if (paymentData.paymentType === "multiple" || paymentData.paymentType === "full" || paymentData.paymentType === "custom") {
        const numberOfPayments = paymentData.paymentType === "full" 
          ? selectedInstallment.numberOfInstallments - selectedInstallment.paidInstallments
          : paymentData.numberOfPayments
        
        // Process multiple payments - each payment is the installment amount
        for (let i = 0; i < numberOfPayments; i++) {
          const paymentInput = {
            installmentId: selectedInstallment.id,
            paymentNumber: selectedInstallment.paidInstallments + 1 + i,
            amount: selectedInstallment.installmentAmount,
            paymentDate: paymentData.paymentDate,
            accountId: paymentData.accountId,
            accountName: activeAccounts.find((a: any) => a.id === paymentData.accountId)?.name,
            notes: paymentData.notes,
          }
          
          await payInstallmentAmount(paymentInput)
        }
        
        const paymentText = paymentData.paymentType === "full" 
          ? "semua cicilan yang tersisa"
          : `${numberOfPayments} bulan`
        
        toast({ 
          title: "Pembayaran berhasil", 
          description: `Pembayaran ${paymentText} untuk cicilan ${selectedInstallment.title} telah dicatat` 
        })
      } else {
        // Single payment
        const paymentInput = {
          installmentId: selectedInstallment.id,
          paymentNumber: selectedInstallment.paidInstallments + 1,
          amount: selectedInstallment.installmentAmount,
          paymentDate: paymentData.paymentDate,
          accountId: paymentData.accountId,
          accountName: activeAccounts.find((a: any) => a.id === paymentData.accountId)?.name,
          notes: paymentData.notes,
        }

        await payInstallmentAmount(paymentInput)
        toast({ 
          title: "Pembayaran berhasil", 
          description: `Pembayaran cicilan ${selectedInstallment.title} telah dicatat` 
        })
      }
      
      // Refresh payment history if detail modal is open
      if (detailInstallment && detailInstallment.id === selectedInstallment.id) {
        try {
          const history = await getPaymentsForInstallment(selectedInstallment.id)
          setPaymentHistory(history)
        } catch (error) {
          console.error("Error refreshing payment history:", error)
        }
      }
      
      resetPaymentForm()
      setIsPaymentDialogOpen(false)
    } catch (err: any) {
      toast({ 
        title: "Gagal melakukan pembayaran", 
        description: err?.message || String(err),
        variant: "destructive"
      })
    }
  }

  const handleEdit = (installment: Installment) => {
    setEditingInstallment(installment)
    setFormData({
      title: installment.title,
      description: installment.description || "",
      totalAmount: formatIDR(installment.totalAmount),
      numberOfInstallments: String(installment.numberOfInstallments),
      installmentAmount: formatIDR(installment.installmentAmount),
      interestRate: String(installment.interestRate || 0),
      monthlyInterest: formatIDR(installment.monthlyInterest || 0),
      totalWithInterest: formatIDR(installment.totalWithInterest || installment.totalAmount),
      startDate: installment.startDate,
      dueDate: installment.dueDate,
      accountId: installment.accountId,
      categoryId: installment.categoryId,
      notes: installment.notes || "",
    })
    setIsDialogOpen(true)
  }

  const handlePayment = (installment: Installment) => {
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
    setIsPaymentDialogOpen(true)
    
    // Debug calculations
    setTimeout(() => {
      debugInstallmentCalculations()
    }, 100)
  }

  const handleViewDetails = async (installment: Installment) => {
    setDetailInstallment(installment)
    setIsDetailDialogOpen(true)
    
    // Load payment history
    try {
      if (user) {
        const history = await getPaymentsForInstallment(installment.id)
        setPaymentHistory(history)
      }
    } catch (error) {
      console.error("Error loading payment history:", error)
      setPaymentHistory([])
    }
  }

  const handleDelete = async (installmentId: string) => {
    try {
      if (!user) throw new Error("Harus login")
      await removeInstallment(installmentId)
      toast({ title: "Cicilan berhasil dihapus", description: "Cicilan telah dihapus" })
    } catch (err: any) {
      toast({ title: "Gagal menghapus cicilan", description: err?.message || String(err) })
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      totalAmount: "",
      numberOfInstallments: "",
      installmentAmount: "",
      interestRate: "",
      monthlyInterest: "",
      totalWithInterest: "",
      startDate: "",
      dueDate: "",
      accountId: "",
      categoryId: "",
      notes: "",
    })
    setEditingInstallment(null)
  }

  const resetPaymentForm = () => {
    setPaymentData({
      amount: "",
      paymentDate: "",
      accountId: "",
      notes: "",
      paymentType: "single",
      numberOfPayments: 1,
      customMonths: "",
    })
    setSelectedInstallment(null)
  }

  const filteredInstallments = useMemo(() => {
    if (activeTab === "all") return installments
    
    return installments.filter((i: Installment) => {
      // Check if installment is completed based on both status and payment count
      const isCompleted = i.status === "completed" || i.paidInstallments >= i.numberOfInstallments
      
      switch (activeTab) {
        case "active":
          // Show active installments that are not completed
          return i.status === "active" && !isCompleted
        case "completed":
          // Show completed installments
          return isCompleted
        case "overdue":
          // Show overdue installments that are not completed
          return i.status === "overdue" && !isCompleted
        default:
          return i.status === activeTab
      }
    })
  }, [installments, activeTab])

  // Form validation function
  const isFormValid = () => {
    return !!(
      formData.title?.trim() &&
      formData.accountId &&
      formData.categoryId &&
      formData.startDate &&
      formData.dueDate &&
      formData.totalAmount &&
      parseIDR(formData.totalAmount) > 0 &&
      formData.numberOfInstallments &&
      Number(formData.numberOfInstallments) > 0 &&
      formData.installmentAmount &&
      parseIDR(formData.installmentAmount) > 0
    )
  }

  // Payment form validation function
  const isPaymentFormValid = () => {
    if (!paymentData.paymentType || !paymentData.paymentDate || !paymentData.accountId) {
      return false
    }
    
    // Check if custom payment has valid months
    if (paymentData.paymentType === 'custom' && (!paymentData.customMonths || parseInt(paymentData.customMonths) < 1)) {
      return false
    }
    
    // Check if amount is valid (should always be valid since it's auto-calculated)
    if (!paymentData.amount || parseIDR(paymentData.amount) <= 0) {
      return false
    }
    
    // Check if account has sufficient balance
    const selectedAccount = activeAccounts.find((a: any) => a.id === paymentData.accountId)
    const accountBalance = selectedAccount?.balance || 0
    const paymentAmount = parseIDR(paymentData.amount)
    
    return accountBalance >= paymentAmount
  }

  // Calculate payment amount based on payment type
  const calculatePaymentAmount = () => {
    if (!selectedInstallment) return 0
    
    switch (paymentData.paymentType) {
      case "single":
        return selectedInstallment.installmentAmount
      case "multiple":
        return selectedInstallment.installmentAmount * paymentData.numberOfPayments
      case "full":
        // Use calculated remaining amount to ensure consistency
        const remainingInstallments = selectedInstallment.numberOfInstallments - selectedInstallment.paidInstallments
        return selectedInstallment.installmentAmount * remainingInstallments
      case "custom":
        return selectedInstallment.installmentAmount * paymentData.numberOfPayments
      default:
        return selectedInstallment.installmentAmount
    }
  }

  // Debug function to verify calculations
  const debugInstallmentCalculations = () => {
    if (!selectedInstallment) return
    
    console.log("=== DEBUG INSTALLMENT CALCULATIONS ===")
    console.log("Total Amount:", selectedInstallment.totalAmount)
    console.log("Number of Installments:", selectedInstallment.numberOfInstallments)
    console.log("Installment Amount:", selectedInstallment.installmentAmount)
    console.log("Remaining Amount:", selectedInstallment.remainingAmount)
    console.log("Paid Installments:", selectedInstallment.paidInstallments)
    console.log("Remaining Installments:", selectedInstallment.numberOfInstallments - selectedInstallment.paidInstallments)
    
    const remainingInstallments = selectedInstallment.numberOfInstallments - selectedInstallment.paidInstallments
    const calculatedRemaining = selectedInstallment.installmentAmount * remainingInstallments
    console.log("Calculated Remaining (installment * remaining):", calculatedRemaining)
    console.log("Difference:", selectedInstallment.remainingAmount - calculatedRemaining)
    console.log("=====================================")
  }

  // Get available payment options
  const getPaymentOptions = () => {
    if (!selectedInstallment) return []
    
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

  // Helper function to check if installment is completed
  const isInstallmentCompleted = (installment: Installment) => {
    return installment.status === "completed" || installment.paidInstallments >= installment.numberOfInstallments
  }

  const InstallmentList = ({ installments: installmentList }: { installments: Installment[] }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {installmentList.map((installment) => (
        <Card 
          key={installment.id} 
          className={`relative overflow-hidden transition-all duration-500 cursor-pointer ${
            isInstallmentCompleted(installment) 
              ? 'bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 border-2 border-emerald-200 shadow-lg hover:shadow-2xl hover:scale-[1.03] hover:border-emerald-300' 
              : 'bg-card border-border hover:shadow-md'
          }`}
        >
          {/* Elegant completion overlay for completed installments */}
          {isInstallmentCompleted(installment) && (
            <>
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full -translate-y-16 translate-x-16 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-400 to-emerald-500 rounded-full translate-y-12 -translate-x-12 animate-pulse" style={{animationDelay: '1s'}}></div>
              </div>
              
              {/* Completion ribbon */}
              <div className="absolute top-0 right-0 pointer-events-none">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-semibold px-4 py-2 rounded-bl-lg shadow-lg transform rotate-0 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse"></div>
                  <div className="flex items-center gap-1 relative z-10">
                    <span className="text-sm animate-bounce" style={{animationDelay: '0.5s'}}>✨</span>
                    <span>LUNAS</span>
                    <span className="text-sm animate-bounce" style={{animationDelay: '1s'}}>✨</span>
                  </div>
                </div>
              </div>
              
              {/* Success icon overlay */}
              <div className="absolute top-4 left-4 w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg animate-pulse pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full blur-sm opacity-50"></div>
                <svg className="w-5 h-5 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </>
          )}
          
          <CardHeader className={`pb-3 ${isInstallmentCompleted(installment) ? 'pt-12' : ''} relative z-10`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className={`text-lg font-semibold line-clamp-1 ${
                  isInstallmentCompleted(installment) 
                    ? 'text-emerald-800 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent' 
                    : 'text-card-foreground'
                }`}>
                  {installment.title}
                </CardTitle>
                {installment.description && (
                  <CardDescription className={`text-sm line-clamp-2 mt-1 ${
                    isInstallmentCompleted(installment) 
                      ? 'text-emerald-600' 
                      : 'text-muted-foreground'
                  }`}>
                    {installment.description}
                  </CardDescription>
                )}
              </div>
              {!isInstallmentCompleted(installment) && (
                <Badge 
                  variant={installment.status === "overdue" ? "destructive" : "secondary"}
                  className="text-xs ml-2 flex-shrink-0"
                >
                  {installment.status === "overdue" ? "Terlambat" : "Aktif"}
                </Badge>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="pt-0 relative z-10">
            <div className="space-y-3">
              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className={`font-medium ${
                    isInstallmentCompleted(installment) ? 'text-emerald-700' : 'text-muted-foreground'
                  }`}>
                    {isInstallmentCompleted(installment) ? '✅ Selesai' : 'Progress'}
                  </span>
                  <span className={`font-semibold ${
                    isInstallmentCompleted(installment) ? 'text-emerald-700' : 'text-card-foreground'
                  }`}>
                    {installment.paidInstallments}/{installment.numberOfInstallments}
                  </span>
                </div>
                <div className={`w-full rounded-full h-3 ${
                  isInstallmentCompleted(installment) ? 'bg-emerald-100' : 'bg-muted'
                }`}>
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      isInstallmentCompleted(installment) 
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg' 
                        : 'bg-primary'
                    }`}
                    style={{ 
                      width: `${Math.min((installment.paidInstallments / installment.numberOfInstallments) * 100, 100)}%` 
                    }}
                  />
                </div>
                {isInstallmentCompleted(installment) && (
                  <div className="flex items-center justify-center mt-2">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
                      <span className="animate-bounce inline-block mr-1">🎉</span>
                      Pembayaran Lengkap
                    </div>
                  </div>
                )}
              </div>

              {/* Key Info */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="space-y-1">
                  <p className={`${
                    isInstallmentCompleted(installment) ? 'text-emerald-600' : 'text-muted-foreground'
                  }`}>
                    {isInstallmentCompleted(installment) ? '✅ Total' : 'Total'}
                  </p>
                  <p className={`font-semibold ${
                    isInstallmentCompleted(installment) ? 'text-emerald-700' : 'text-card-foreground'
                  }`}>
                    {formatIDR(installment.totalAmount)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className={`${
                    isInstallmentCompleted(installment) ? 'text-emerald-600' : 'text-muted-foreground'
                  }`}>
                    {isInstallmentCompleted(installment) ? '🎯 Sisa' : 'Sisa'}
                  </p>
                  <p className={`font-semibold ${
                    isInstallmentCompleted(installment) ? 'text-emerald-700' : 'text-card-foreground'
                  }`}>
                    {isInstallmentCompleted(installment) ? 'Rp 0' : formatIDR(installment.remainingAmount)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className={`${
                    isInstallmentCompleted(installment) ? 'text-emerald-600' : 'text-muted-foreground'
                  }`}>
                    {isInstallmentCompleted(installment) ? '💰 Per Cicilan' : 'Per Cicilan'}
                  </p>
                  <p className={`font-semibold ${
                    isInstallmentCompleted(installment) ? 'text-emerald-700' : 'text-card-foreground'
                  }`}>
                    {formatIDR(installment.installmentAmount)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className={`${
                    isInstallmentCompleted(installment) ? 'text-emerald-600' : 'text-muted-foreground'
                  }`}>
                    {isInstallmentCompleted(installment) ? '📅 Jatuh Tempo' : 'Jatuh Tempo'}
                  </p>
                  <p className={`font-semibold ${
                    isInstallmentCompleted(installment) ? 'text-emerald-700' : 'text-card-foreground'
                  }`}>
                    {new Date(installment.dueDate).toLocaleDateString("id-ID", { 
                      day: 'numeric', 
                      month: 'short' 
                    })}
                  </p>
                </div>
              </div>

              {/* Interest Info (if any) */}
              {installment.interestRate > 0 && (
                <div className={`pt-2 border-t ${
                  isInstallmentCompleted(installment) ? 'border-emerald-200' : 'border-border'
                }`}>
                  <p className={`text-xs mb-1 ${
                    isInstallmentCompleted(installment) ? 'text-emerald-600' : 'text-muted-foreground'
                  }`}>
                    Bunga: {installment.interestRate}% per bulan
                  </p>
                  <p className={`text-xs ${
                    isInstallmentCompleted(installment) ? 'text-emerald-600' : 'text-muted-foreground'
                  }`}>
                    Total + Bunga: {formatIDR(installment.totalWithInterest || installment.totalAmount)}
                  </p>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="pt-0 relative z-10">
            <div className="flex items-center justify-between w-full">
              <Button 
                variant={isInstallmentCompleted(installment) ? "default" : "outline"}
                size="sm" 
                className={`flex-1 mr-2 relative z-20 ${
                  isInstallmentCompleted(installment) 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300' 
                    : ''
                }`}
                onClick={() => handleViewDetails(installment)}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                {isInstallmentCompleted(installment) ? 'Lihat Detail' : 'Detail'}
              </Button>
              
              {/* Show completion notification for completed installments */}
              {isInstallmentCompleted(installment) ? (
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer pointer-events-none">
                    <div className="flex items-center gap-1">
                      <span className="text-sm animate-pulse">🏆</span>
                      <span>SELESAI</span>
                    </div>
                  </div>
                </div>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover border-border">
                    <DropdownMenuItem 
                      className="text-popover-foreground"
                      onClick={() => handlePayment(installment)}
                    >
                      <DollarSign className="h-4 w-4 mr-2" />
                      Bayar Cicilan
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-popover-foreground"
                      onClick={() => handleEdit(installment)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => handleDelete(installment.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-card-foreground">Manajemen Cicilan</CardTitle>
                <CardDescription>Kelola cicilan dan pembayaran</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-muted/50 rounded-lg animate-pulse" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-card-foreground">Manajemen Cicilan</CardTitle>
              <CardDescription>Kelola cicilan dan pembayaran</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => {
                    resetForm()
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Cicilan
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] bg-card border-border flex flex-col">
                <DialogHeader className="flex-shrink-0">
                  <DialogTitle className="text-card-foreground">
                    {editingInstallment ? "Edit Cicilan" : "Tambah Cicilan Baru"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingInstallment ? "Perbarui informasi cicilan" : "Buat cicilan baru"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 flex-1 overflow-y-auto pr-2">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-card-foreground">
                      Judul Cicilan <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      placeholder="Contoh: KPR Rumah"
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                      required
                      className={`bg-background border-border w-full ${!formData.title?.trim() ? 'border-red-300 focus:border-red-500' : ''}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-card-foreground">
                      Deskripsi
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Deskripsi cicilan (opsional)"
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      className="bg-background border-border w-full"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="totalAmount" className="text-card-foreground">
                        Total Jumlah <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="totalAmount"
                        placeholder="Rp 0"
                        value={formData.totalAmount}
                        onChange={(e) => handleTotalAmountChange(e.target.value)}
                        required
                        className={`bg-background border-border w-full ${!formData.totalAmount || parseIDR(formData.totalAmount) <= 0 ? 'border-red-300 focus:border-red-500' : ''}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="numberOfInstallments" className="text-card-foreground">
                        Jumlah Cicilan <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="numberOfInstallments"
                        type="number"
                        placeholder="12"
                        value={formData.numberOfInstallments}
                        onChange={(e) => setFormData((prev) => ({ ...prev, numberOfInstallments: e.target.value }))}
                        required
                        className={`bg-background border-border w-full ${!formData.numberOfInstallments || Number(formData.numberOfInstallments) <= 0 ? 'border-red-300 focus:border-red-500' : ''}`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="interestRate" className="text-card-foreground">
                        Bunga per Bulan (%)
                      </Label>
                      <Input
                        id="interestRate"
                        type="number"
                        step="0.01"
                        placeholder="0"
                        value={formData.interestRate}
                        onChange={(e) => handleInterestRateChange(e.target.value)}
                        className="bg-background border-border w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="monthlyInterest" className="text-card-foreground">
                        Bunga per Bulan
                      </Label>
                      <Input
                        id="monthlyInterest"
                        placeholder="Rp 0"
                        value={formData.monthlyInterest}
                        readOnly
                        className="bg-muted border-border w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="totalWithInterest" className="text-card-foreground">
                        Total + Bunga
                      </Label>
                      <Input
                        id="totalWithInterest"
                        placeholder="Rp 0"
                        value={formData.totalWithInterest}
                        readOnly
                        className="bg-muted border-border w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="installmentAmount" className="text-card-foreground">
                        Jumlah per Cicilan *
                      </Label>
                      <Input
                        id="installmentAmount"
                        placeholder="Rp 0"
                        value={formData.installmentAmount}
                        readOnly
                        className="bg-muted border-border w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate" className="text-card-foreground">
                        Tanggal Mulai <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                        required
                        className={`bg-background border-border w-full ${!formData.startDate ? 'border-red-300 focus:border-red-500' : ''} [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:contrast-100`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dueDate" className="text-card-foreground">
                        Jatuh Tempo <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
                        required
                        className={`bg-background border-border w-full ${!formData.dueDate ? 'border-red-300 focus:border-red-500' : ''} [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:contrast-100`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="accountId" className="text-card-foreground">
                        Rekening <span className="text-red-500">*</span>
                      </Label>
                      <Select value={formData.accountId} onValueChange={(value) => setFormData((prev) => ({ ...prev, accountId: value }))}>
                        <SelectTrigger className={`bg-background border-border w-full ${!formData.accountId ? 'border-red-300 focus:border-red-500' : ''}`}>
                          <SelectValue placeholder="Pilih rekening" />
                        </SelectTrigger>
                        <SelectContent>
                          {activeAccounts.map((account: any) => (
                            <SelectItem key={account.id} value={account.id}>
                              {account.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="categoryId" className="text-card-foreground">
                        Kategori <span className="text-red-500">*</span>
                      </Label>
                      <Select value={formData.categoryId} onValueChange={(value) => setFormData((prev) => ({ ...prev, categoryId: value }))}>
                        <SelectTrigger className={`bg-background border-border w-full ${!formData.categoryId ? 'border-red-300 focus:border-red-500' : ''}`}>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          {expenseCategories.map((category: any) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-card-foreground">
                      Catatan
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="Catatan tambahan (opsional)"
                      value={formData.notes}
                      onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                      className="bg-background border-border w-full"
                    />
                  </div>

                  <DialogFooter className="flex-shrink-0 pt-4 border-t border-border">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Batal
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!isFormValid()}
                    >
                      {editingInstallment ? "Perbarui" : "Tambah"} Cicilan
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
              <TabsTrigger value="all" className="text-xs sm:text-sm">Semua</TabsTrigger>
              <TabsTrigger value="active" className="text-xs sm:text-sm">Aktif</TabsTrigger>
              <TabsTrigger value="completed" className="text-xs sm:text-sm">Lunas</TabsTrigger>
              <TabsTrigger value="overdue" className="text-xs sm:text-sm">Terlambat</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-6">
              <InstallmentList installments={filteredInstallments} />
            </TabsContent>
            <TabsContent value="active" className="mt-6">
              <InstallmentList installments={filteredInstallments} />
            </TabsContent>
            <TabsContent value="completed" className="mt-6">
              <InstallmentList installments={filteredInstallments} />
            </TabsContent>
            <TabsContent value="overdue" className="mt-6">
              <InstallmentList installments={filteredInstallments} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[400px] max-h-[90vh] bg-card border-border flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-card-foreground">
              Bayar Cicilan
            </DialogTitle>
            <DialogDescription>
              {selectedInstallment && `Bayar cicilan: ${selectedInstallment.title}`}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePaymentSubmit} className="space-y-4 flex-1 overflow-y-auto pr-2">
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
                          numberOfPayments: selectedInstallment ? selectedInstallment.numberOfInstallments - selectedInstallment.paidInstallments : 1,
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
                  max={selectedInstallment ? selectedInstallment.numberOfInstallments - selectedInstallment.paidInstallments : 1}
                  placeholder="Masukkan jumlah bulan"
                  value={paymentData.customMonths}
                  onChange={(e) => {
                    const months = parseInt(e.target.value) || 0
                    const maxMonths = selectedInstallment ? selectedInstallment.numberOfInstallments - selectedInstallment.paidInstallments : 1
                    const validMonths = Math.min(Math.max(months, 1), maxMonths)
                    
                    const totalAmount = selectedInstallment ? selectedInstallment.installmentAmount * validMonths : 0
                    
                    setPaymentData(prev => ({
                      ...prev,
                      customMonths: String(validMonths),
                      numberOfPayments: validMonths,
                      amount: formatIDR(totalAmount)
                    }))
                  }}
                  className="bg-background border-border w-full"
                />
                {paymentData.customMonths && selectedInstallment && (
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

            <DialogFooter className="flex-shrink-0 pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
                Batal
              </Button>
              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isPaymentFormValid()}
              >
                Bayar Cicilan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] bg-card border-border flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-card-foreground">
              Detail Cicilan
            </DialogTitle>
            <DialogDescription>
              {detailInstallment && `Informasi lengkap cicilan: ${detailInstallment.title}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-6">
            {detailInstallment && (
              <>
                {/* Basic Info */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-card-foreground">{detailInstallment.title}</h3>
                    <Badge 
                      variant={isInstallmentCompleted(detailInstallment) ? "default" : detailInstallment.status === "overdue" ? "destructive" : "secondary"}
                      className={`text-sm ${
                        isInstallmentCompleted(detailInstallment) ? 'bg-green-600 hover:bg-green-700' : ''
                      }`}
                    >
                      {isInstallmentCompleted(detailInstallment) ? "✅ Lunas" : detailInstallment.status === "overdue" ? "Terlambat" : "Aktif"}
                    </Badge>
                  </div>
                  
                  {detailInstallment.description && (
                    <p className="text-sm text-muted-foreground">{detailInstallment.description}</p>
                  )}
                </div>

                {/* Progress Section */}
                <div className="space-y-3">
                  <h4 className="font-medium text-card-foreground">Progress Pembayaran</h4>
                  
                  {/* Completion celebration message */}
                  {isInstallmentCompleted(detailInstallment) && (
                    <div className="bg-green-100 border border-green-300 rounded-lg p-4 text-center">
                      <div className="text-2xl mb-2">🎉</div>
                      <h5 className="font-semibold text-green-800 mb-1">Selamat!</h5>
                      <p className="text-sm text-green-700">
                        Cicilan ini telah lunas sepenuhnya. Terima kasih telah menyelesaikan pembayaran tepat waktu!
                      </p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium text-card-foreground">
                        {detailInstallment.paidInstallments} dari {detailInstallment.numberOfInstallments} cicilan
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-300 ${
                          isInstallmentCompleted(detailInstallment) ? 'bg-green-500' : 'bg-primary'
                        }`}
                        style={{ 
                          width: `${Math.min((detailInstallment.paidInstallments / detailInstallment.numberOfInstallments) * 100, 100)}%` 
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {Math.round((detailInstallment.paidInstallments / detailInstallment.numberOfInstallments) * 100)}% selesai
                    </p>
                  </div>
                </div>

                {/* Financial Info */}
                <div className="space-y-3">
                  <h4 className="font-medium text-card-foreground">Informasi Keuangan</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Total Pinjaman</p>
                      <p className="text-lg font-semibold text-card-foreground">{formatIDR(detailInstallment.totalAmount)}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Sisa Hutang</p>
                      <p className={`text-lg font-semibold ${
                        isInstallmentCompleted(detailInstallment) ? 'text-green-600' : 'text-card-foreground'
                      }`}>
                        {isInstallmentCompleted(detailInstallment) ? 'Rp 0' : formatIDR(detailInstallment.remainingAmount)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Jumlah per Cicilan</p>
                      <p className="text-lg font-semibold text-card-foreground">{formatIDR(detailInstallment.installmentAmount)}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Total Dibayar</p>
                      <p className="text-lg font-semibold text-card-foreground">{formatIDR(detailInstallment.totalPaid)}</p>
                    </div>
                  </div>
                  
                  {/* Completion summary for completed installments */}
                  {isInstallmentCompleted(detailInstallment) && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                      <h5 className="font-semibold text-green-800 mb-2">Ringkasan Penyelesaian</h5>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-green-700">Total Cicilan:</p>
                          <p className="font-semibold text-green-800">{detailInstallment.numberOfInstallments} bulan</p>
                        </div>
                        <div>
                          <p className="text-green-700">Cicilan Dibayar:</p>
                          <p className="font-semibold text-green-800">{detailInstallment.paidInstallments} bulan</p>
                        </div>
                        <div>
                          <p className="text-green-700">Tanggal Selesai:</p>
                          <p className="font-semibold text-green-800">
                            {paymentHistory.length > 0 
                              ? new Date(paymentHistory[paymentHistory.length - 1].paymentDate).toLocaleDateString("id-ID", {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })
                              : 'Tidak diketahui'
                            }
                          </p>
                        </div>
                        <div>
                          <p className="text-green-700">Status:</p>
                          <p className="font-semibold text-green-800">✅ Lunas Sepenuhnya</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Interest Info */}
                {detailInstallment.interestRate > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-card-foreground">Informasi Bunga</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Bunga per Bulan</p>
                        <p className="text-lg font-semibold text-card-foreground">{detailInstallment.interestRate}%</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Bunga per Bulan</p>
                        <p className="text-lg font-semibold text-card-foreground">{formatIDR(detailInstallment.monthlyInterest || 0)}</p>
                      </div>
                      <div className="space-y-2 col-span-2">
                        <p className="text-sm text-muted-foreground">Total + Bunga</p>
                        <p className="text-lg font-semibold text-card-foreground">{formatIDR(detailInstallment.totalWithInterest || detailInstallment.totalAmount)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Schedule Info */}
                <div className="space-y-3">
                  <h4 className="font-medium text-card-foreground">Jadwal Pembayaran</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Tanggal Mulai</p>
                      <p className="text-lg font-semibold text-card-foreground">
                        {new Date(detailInstallment.startDate).toLocaleDateString("id-ID", { 
                          weekday: 'long',
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Jatuh Tempo</p>
                      <p className="text-lg font-semibold text-card-foreground">
                        {new Date(detailInstallment.dueDate).toLocaleDateString("id-ID", { 
                          weekday: 'long',
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Account & Category Info */}
                <div className="space-y-3">
                  <h4 className="font-medium text-card-foreground">Informasi Rekening & Kategori</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Rekening</p>
                      <p className="text-lg font-semibold text-card-foreground">{detailInstallment.accountName || 'Tidak diketahui'}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Kategori</p>
                      <p className="text-lg font-semibold text-card-foreground">{detailInstallment.categoryName || 'Tidak diketahui'}</p>
                    </div>
                  </div>
                </div>

                {/* Payment History */}
                <div className="space-y-3">
                  <h4 className="font-medium text-card-foreground">Riwayat Pembayaran</h4>
                  {paymentHistory.length > 0 ? (
                    <div className="space-y-2">
                      {paymentHistory.map((payment, index) => (
                        <div key={index} className="p-3 bg-muted/30 rounded-lg border border-border">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-card-foreground">
                                Pembayaran #{payment.paymentNumber}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(payment.paymentDate).toLocaleDateString("id-ID", {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                              {payment.notes && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Catatan: {payment.notes}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-card-foreground">
                                {formatIDR(payment.amount)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {payment.accountName}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-muted/30 rounded-lg border border-border text-center">
                      <p className="text-sm text-muted-foreground">
                        Belum ada riwayat pembayaran
                      </p>
                    </div>
                  )}
                </div>

                {/* Notes */}
                {detailInstallment.notes && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-card-foreground">Catatan</h4>
                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                      {detailInstallment.notes}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          <DialogFooter className="flex-shrink-0 pt-4 border-t border-border">
            <Button 
              variant="outline" 
              onClick={() => setIsDetailDialogOpen(false)}
            >
              Tutup
            </Button>
            {detailInstallment && (
              <>
                {/* Show completion notification for completed installments */}
                {isInstallmentCompleted(detailInstallment) ? (
                  <div className="flex items-center">
                    <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                      ✅ Cicilan Telah Lunas
                    </Badge>
                  </div>
                ) : (
                  <>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setIsDetailDialogOpen(false)
                        handlePayment(detailInstallment)
                      }}
                    >
                      <DollarSign className="h-4 w-4 mr-2" />
                      Bayar Cicilan
                    </Button>
                    <Button 
                      onClick={() => {
                        setIsDetailDialogOpen(false)
                        handleEdit(detailInstallment)
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Cicilan
                    </Button>
                  </>
                )}
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

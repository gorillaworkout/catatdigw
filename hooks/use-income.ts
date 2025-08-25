"use client"

import { useUserCollection } from "@/hooks/use-firestore"
import { useAuth } from "@/hooks/use-auth"
import { addIncomeWithBalanceUpdate } from "@/lib/firestore"
import { useToast } from "@/hooks/use-toast"
import { orderBy, where } from "firebase/firestore"

export type Income = {
  id: string
  amount: number
  description: string
  categoryId: string
  categoryName?: string
  accountId: string
  accountName?: string
  date: string
  notes?: string
  createdAt: any
  updatedAt: any
}

export function useIncome() {
  const { data: incomes, loading, error } = useUserCollection<Income>("income", [
    orderBy("date", "desc")
  ])
  const { user } = useAuth()
  const { toast } = useToast()

  const addIncome = async (incomeData: Omit<Income, "id" | "createdAt" | "updatedAt">) => {
    if (!user) throw new Error("Harus login")
    
    try {
      await addIncomeWithBalanceUpdate(user.uid, {
        amount: incomeData.amount,
        description: incomeData.description,
        categoryId: incomeData.categoryId,
        categoryName: incomeData.categoryName,
        accountId: incomeData.accountId,
        accountName: incomeData.accountName,
        date: incomeData.date,
        notes: incomeData.notes,
      })
      toast({
        title: "Pendapatan berhasil ditambahkan",
        description: `${incomeData.description} sebesar ${new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(incomeData.amount)}`,
      })
    } catch (err: any) {
      toast({
        title: "Gagal menambahkan pendapatan",
        description: err?.message || String(err),
        variant: "destructive"
      })
      throw err
    }
  }

  const getIncomesByDateRange = (startDate: string, endDate: string) => {
    return incomes.filter(income => {
      const incomeDate = new Date(income.date)
      const start = new Date(startDate)
      const end = new Date(endDate)
      return incomeDate >= start && incomeDate <= end
    })
  }

  const getIncomesByMonth = (year: number, month: number) => {
    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0]
    const endDate = new Date(year, month, 0).toISOString().split('T')[0]
    return getIncomesByDateRange(startDate, endDate)
  }

  const getIncomesByYear = (year: number) => {
    const startDate = new Date(year, 0, 1).toISOString().split('T')[0]
    const endDate = new Date(year, 11, 31).toISOString().split('T')[0]
    return getIncomesByDateRange(startDate, endDate)
  }

  const getTotalIncome = (incomesList: Income[] = incomes) => {
    return incomesList.reduce((sum, income) => sum + (income.amount || 0), 0)
  }

  const getIncomeByCategory = (incomesList: Income[] = incomes) => {
    const categoryMap = new Map<string, number>()
    incomesList.forEach(income => {
      const categoryName = income.categoryName || 'Lainnya'
      categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + income.amount)
    })
    return Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }))
  }

  const getMonthlyIncomeData = (months: number = 6) => {
    const now = new Date()
    const monthlyData = []
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const monthIncomes = getIncomesByMonth(year, month)
      const total = getTotalIncome(monthIncomes)
      
      monthlyData.push({
        month: date.toLocaleDateString('id-ID', { month: 'short' }),
        amount: total,
        year,
        monthNumber: month
      })
    }
    
    return monthlyData
  }

  const getDailyIncomeTrend = (days: number = 30) => {
    const now = new Date()
    const dailyData = []
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
      const dateString = date.toISOString().split('T')[0]
      const dayIncomes = incomes.filter(income => income.date === dateString)
      const total = getTotalIncome(dayIncomes)
      
      dailyData.push({
        date: date.getDate().toString(),
        amount: total
      })
    }
    
    return dailyData
  }

  return {
    incomes,
    loading,
    error,
    addIncome,
    getIncomesByDateRange,
    getIncomesByMonth,
    getIncomesByYear,
    getTotalIncome,
    getIncomeByCategory,
    getMonthlyIncomeData,
    getDailyIncomeTrend
  }
}

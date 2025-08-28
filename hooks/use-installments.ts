"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { 
  getInstallments, 
  getInstallment, 
  createInstallment, 
  updateInstallment, 
  deleteInstallment,
  payInstallment,
  getInstallmentPayments,
  type InstallmentInput,
  type InstallmentPaymentInput
} from "@/lib/firestore"

export function useInstallments() {
  const { user } = useAuth()
  const [installments, setInstallments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadInstallments()
    }
  }, [user])

  const loadInstallments = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      setError(null)
      const data = await getInstallments(user.uid)
      setInstallments(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addInstallment = async (input: InstallmentInput) => {
    if (!user) throw new Error("User belum login")
    
    try {
      await createInstallment(user.uid, input)
      await loadInstallments()
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const updateInstallmentData = async (installmentId: string, input: Partial<InstallmentInput>) => {
    if (!user) throw new Error("User belum login")
    
    try {
      await updateInstallment(user.uid, installmentId, input)
      await loadInstallments()
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const removeInstallment = async (installmentId: string) => {
    if (!user) throw new Error("User belum login")
    
    try {
      await deleteInstallment(user.uid, installmentId)
      await loadInstallments()
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const payInstallmentAmount = async (input: InstallmentPaymentInput) => {
    if (!user) throw new Error("User belum login")
    
    try {
      await payInstallment(user.uid, input)
      await loadInstallments()
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const getInstallmentById = async (installmentId: string) => {
    if (!user) return null
    
    try {
      return await getInstallment(user.uid, installmentId)
    } catch (err: any) {
      setError(err.message)
      return null
    }
  }

  const getPaymentsForInstallment = async (installmentId: string) => {
    if (!user) return []
    
    try {
      return await getInstallmentPayments(user.uid, installmentId)
    } catch (err: any) {
      setError(err.message)
      return []
    }
  }

  return {
    installments,
    loading,
    error,
    addInstallment,
    updateInstallmentData,
    removeInstallment,
    payInstallmentAmount,
    getInstallmentById,
    getPaymentsForInstallment,
    refresh: loadInstallments,
  }
}


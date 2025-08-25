"use client"

import { useUserCollection } from "@/hooks/use-firestore"
import { useAuth } from "@/hooks/use-auth"
import { createAccount, updateAccount, deleteAccount } from "@/lib/firestore"
import { useToast } from "@/hooks/use-toast"

export type Account = {
  id: string
  name: string
  type: "bank" | "cash" | "credit" | "investment" | "ewallet"
  balance: number
  accountNumber?: string
  description?: string
  isActive?: boolean
}

export function useAccounts() {
  const { data: accounts, loading, error } = useUserCollection<Account>("accounts")
  const { user } = useAuth()
  const { toast } = useToast()

  const addAccount = async (accountData: Omit<Account, "id" | "isActive">) => {
    if (!user) throw new Error("Harus login")
    
    try {
      await createAccount(user.uid, {
        ...accountData,
        isActive: true,
      })
      toast({
        title: "Rekening berhasil ditambahkan",
        description: `${accountData.name} telah ditambahkan`,
      })
    } catch (err: any) {
      toast({
        title: "Gagal menambahkan rekening",
        description: err?.message || String(err),
        variant: "destructive"
      })
      throw err
    }
  }

  const updateAccountData = async (accountId: string, updates: Partial<Account>) => {
    if (!user) throw new Error("Harus login")
    
    try {
      await updateAccount(user.uid, accountId, updates)
      toast({
        title: "Rekening berhasil diperbarui",
        description: "Data rekening telah diperbarui",
      })
    } catch (err: any) {
      toast({
        title: "Gagal memperbarui rekening",
        description: err?.message || String(err),
        variant: "destructive"
      })
      throw err
    }
  }

  const removeAccount = async (accountId: string) => {
    if (!user) throw new Error("Harus login")
    
    try {
      await deleteAccount(user.uid, accountId)
      toast({
        title: "Rekening berhasil dihapus",
        description: "Rekening telah dihapus dari daftar",
      })
    } catch (err: any) {
      toast({
        title: "Gagal menghapus rekening",
        description: err?.message || String(err),
        variant: "destructive"
      })
      throw err
    }
  }

  const getTotalBalance = () => {
    return accounts.reduce((sum, account) => sum + (account.balance || 0), 0)
  }

  const getActiveAccounts = () => {
    return accounts.filter(account => account.isActive !== false)
  }

  const getAccountById = (id: string) => {
    return accounts.find(account => account.id === id)
  }

  return {
    accounts,
    loading,
    error,
    addAccount,
    updateAccount: updateAccountData,
    deleteAccount: removeAccount,
    getTotalBalance,
    getActiveAccounts,
    getAccountById,
  }
}

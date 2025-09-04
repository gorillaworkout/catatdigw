"use client"

import { useState, useEffect } from "react"
import { offlineSync } from "@/lib/offline-sync"
import { offlineStorage } from "@/lib/offline-storage"

export function useOffline() {
  const [isOnline, setIsOnline] = useState(true)
  const [pendingCount, setPendingCount] = useState(0)
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    // Set initial state
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine)
    }

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
      }
    }
  }, [])

  // Add transaction with offline support
  const addTransaction = async (
    userId: string,
    transaction: any,
    type: 'expense' | 'income' | 'installment'
  ) => {
    await offlineSync.addTransaction(userId, transaction, type)
    updatePendingCount(userId)
  }

  // Update transaction with offline support
  const updateTransaction = async (
    userId: string,
    id: string,
    update: any,
    type: 'expense' | 'income' | 'installment'
  ) => {
    await offlineSync.updateTransaction(userId, id, update, type)
    updatePendingCount(userId)
  }

  // Delete transaction with offline support
  const deleteTransaction = async (
    userId: string,
    id: string,
    type: 'expense' | 'income' | 'installment'
  ) => {
    await offlineSync.deleteTransaction(userId, id, type)
    updatePendingCount(userId)
  }

  // Sync pending data
  const syncPendingData = async (userId: string) => {
    if (isSyncing) return

    setIsSyncing(true)
    try {
      await offlineSync.syncPendingData(userId)
      updatePendingCount(userId)
    } catch (error) {
      console.error('Sync failed:', error)
    } finally {
      setIsSyncing(false)
    }
  }

  // Update pending count
  const updatePendingCount = async (userId: string) => {
    const count = await offlineSync.getPendingCount(userId)
    setPendingCount(count)
  }

  // Get pending transactions for display
  const getPendingTransactions = async (userId: string) => {
    return await offlineStorage.getPendingTransactions(userId)
  }

  // Get pending updates for display
  const getPendingUpdates = async (userId: string) => {
    return await offlineStorage.getPendingUpdates(userId)
  }

  // Get pending deletes for display
  const getPendingDeletes = async (userId: string) => {
    return await offlineStorage.getPendingDeletes(userId)
  }

  // Clear all pending data
  const clearPendingData = async (userId: string) => {
    await offlineSync.clearPendingData(userId)
    setPendingCount(0)
  }

  return {
    isOnline,
    pendingCount,
    isSyncing,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    syncPendingData,
    getPendingTransactions,
    getPendingUpdates,
    getPendingDeletes,
    clearPendingData,
    updatePendingCount
  }
}

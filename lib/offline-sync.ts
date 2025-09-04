import { offlineStorage } from './offline-storage'
import { 
  addExpenseWithBalanceCheck, 
  addIncomeWithBalanceUpdate, 
  createInstallment,
  updateExpenseWithBalanceCheck,
  updateInstallment,
  deleteExpenseWithBalanceRestore,
  deleteInstallment
} from './firestore'

class OfflineSync {
  private isOnline = typeof window !== 'undefined' ? navigator.onLine : true
  private syncInProgress = false

  constructor() {
    if (typeof window !== 'undefined') {
      this.setupNetworkListeners()
    }
  }

  private setupNetworkListeners(): void {
    if (typeof window === 'undefined') return
    
    window.addEventListener('online', () => {
      this.isOnline = true
      this.syncPendingData()
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
    })
  }

  // Check if device is online
  isDeviceOnline(): boolean {
    return this.isOnline
  }

  // Sync all pending data when online
  async syncPendingData(userId?: string): Promise<void> {
    if (!this.isOnline || this.syncInProgress) return

    this.syncInProgress = true

    try {
      if (userId) {
        await this.syncUserData(userId)
      } else {
        // If no userId provided, we can't sync
        console.warn('No userId provided for sync')
      }
    } catch (error) {
      console.error('Sync failed:', error)
    } finally {
      this.syncInProgress = false
    }
  }

  private async syncUserData(userId: string): Promise<void> {
    console.log('Starting sync for user:', userId)

    // Sync pending transactions
    await this.syncPendingTransactions(userId)
    
    // Sync pending updates
    await this.syncPendingUpdates(userId)
    
    // Sync pending deletes
    await this.syncPendingDeletes(userId)

    console.log('Sync completed for user:', userId)
  }

  private async syncPendingTransactions(userId: string): Promise<void> {
    const pendingTransactions = await offlineStorage.getPendingTransactions(userId)
    
    for (const transaction of pendingTransactions) {
      try {
        switch (transaction.type) {
          case 'expense':
            await addExpenseWithBalanceCheck(userId, transaction)
            break
          case 'income':
            await addIncomeWithBalanceUpdate(userId, transaction)
            break
          case 'installment':
            await createInstallment(userId, transaction)
            break
        }
        
        // Remove from pending after successful sync
        await offlineStorage.removePendingTransaction(transaction.id)
        console.log('Synced transaction:', transaction.type, transaction.id)
      } catch (error) {
        console.error('Failed to sync transaction:', error)
        // Keep in pending for retry later
      }
    }
  }

  private async syncPendingUpdates(userId: string): Promise<void> {
    const pendingUpdates = await offlineStorage.getPendingUpdates(userId)
    
    for (const update of pendingUpdates) {
      try {
        switch (update.type) {
          case 'expense':
            await updateExpenseWithBalanceCheck(userId, update.id, update)
            break
          case 'income':
            // Note: Income updates not implemented in firestore.ts yet
            console.warn('Income updates not implemented yet')
            break
          case 'installment':
            await updateInstallment(userId, update.id, update)
            break
        }
        
        // Remove from pending after successful sync
        await offlineStorage.removePendingUpdate(update.id)
        console.log('Synced update:', update.type, update.id)
      } catch (error) {
        console.error('Failed to sync update:', error)
        // Keep in pending for retry later
      }
    }
  }

  private async syncPendingDeletes(userId: string): Promise<void> {
    const pendingDeletes = await offlineStorage.getPendingDeletes(userId)
    
    for (const deleteItem of pendingDeletes) {
      try {
        switch (deleteItem.type) {
          case 'expense':
            await deleteExpenseWithBalanceRestore(userId, deleteItem.id)
            break
          case 'income':
            // Note: Income deletes not implemented in firestore.ts yet
            console.warn('Income deletes not implemented yet')
            break
          case 'installment':
            await deleteInstallment(userId, deleteItem.id)
            break
        }
        
        // Remove from pending after successful sync
        await offlineStorage.removePendingDelete(deleteItem.id)
        console.log('Synced delete:', deleteItem.type, deleteItem.id)
      } catch (error) {
        console.error('Failed to sync delete:', error)
        // Keep in pending for retry later
      }
    }
  }

  // Add transaction with offline support
  async addTransaction(
    userId: string, 
    transaction: any, 
    type: 'expense' | 'income' | 'installment'
  ): Promise<void> {
    if (this.isOnline) {
      try {
        // Try to add directly to Firebase
        switch (type) {
          case 'expense':
            await addExpenseWithBalanceCheck(userId, transaction)
            break
          case 'income':
            await addIncomeWithBalanceUpdate(userId, transaction)
            break
          case 'installment':
            await createInstallment(userId, transaction)
            break
        }
        console.log('Transaction added online:', type)
      } catch (error) {
        console.error('Failed to add transaction online, saving offline:', error)
        // Fallback to offline storage
        await offlineStorage.savePendingTransaction(transaction, type, userId)
      }
    } else {
      // Save to offline storage
      await offlineStorage.savePendingTransaction(transaction, type, userId)
      console.log('Transaction saved offline:', type)
    }
  }

  // Update transaction with offline support
  async updateTransaction(
    userId: string,
    id: string,
    update: any,
    type: 'expense' | 'income' | 'installment'
  ): Promise<void> {
    if (this.isOnline) {
      try {
        // Try to update directly in Firebase
        switch (type) {
          case 'expense':
            await updateExpenseWithBalanceCheck(userId, id, update)
            break
          case 'income':
            // Note: Income updates not implemented in firestore.ts yet
            console.warn('Income updates not implemented yet')
            break
          case 'installment':
            await updateInstallment(userId, id, update)
            break
        }
        console.log('Transaction updated online:', type, id)
      } catch (error) {
        console.error('Failed to update transaction online, saving offline:', error)
        // Fallback to offline storage
        await offlineStorage.savePendingUpdate({ id, ...update }, type, userId)
      }
    } else {
      // Save to offline storage
      await offlineStorage.savePendingUpdate({ id, ...update }, type, userId)
      console.log('Transaction update saved offline:', type, id)
    }
  }

  // Delete transaction with offline support
  async deleteTransaction(
    userId: string,
    id: string,
    type: 'expense' | 'income' | 'installment'
  ): Promise<void> {
    if (this.isOnline) {
      try {
        // Try to delete directly from Firebase
        switch (type) {
          case 'expense':
            await deleteExpenseWithBalanceRestore(userId, id)
            break
          case 'income':
            // Note: Income deletes not implemented in firestore.ts yet
            console.warn('Income deletes not implemented yet')
            break
          case 'installment':
            await deleteInstallment(userId, id)
            break
        }
        console.log('Transaction deleted online:', type, id)
      } catch (error) {
        console.error('Failed to delete transaction online, saving offline:', error)
        // Fallback to offline storage
        await offlineStorage.savePendingDelete(id, type, userId)
      }
    } else {
      // Save to offline storage
      await offlineStorage.savePendingDelete(id, type, userId)
      console.log('Transaction delete saved offline:', type, id)
    }
  }

  // Get pending count for UI
  async getPendingCount(userId: string): Promise<number> {
    return await offlineStorage.getPendingCount(userId)
  }

  // Clear all pending data
  async clearPendingData(userId: string): Promise<void> {
    await offlineStorage.clearPendingData(userId)
  }
}

export const offlineSync = new OfflineSync()

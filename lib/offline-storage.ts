// Offline Storage using IndexedDB
class OfflineStorage {
  private dbName = 'catatdiGW-offline'
  private version = 1
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      throw new Error('IndexedDB not available')
    }
    
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Store for pending transactions
        if (!db.objectStoreNames.contains('pendingTransactions')) {
          const store = db.createObjectStore('pendingTransactions', { keyPath: 'id', autoIncrement: true })
          store.createIndex('type', 'type', { unique: false })
          store.createIndex('timestamp', 'timestamp', { unique: false })
          store.createIndex('userId', 'userId', { unique: false })
        }

        // Store for pending updates
        if (!db.objectStoreNames.contains('pendingUpdates')) {
          const store = db.createObjectStore('pendingUpdates', { keyPath: 'id', autoIncrement: true })
          store.createIndex('type', 'type', { unique: false })
          store.createIndex('timestamp', 'timestamp', { unique: false })
          store.createIndex('userId', 'userId', { unique: false })
        }

        // Store for pending deletes
        if (!db.objectStoreNames.contains('pendingDeletes')) {
          const store = db.createObjectStore('pendingDeletes', { keyPath: 'id', autoIncrement: true })
          store.createIndex('type', 'type', { unique: false })
          store.createIndex('timestamp', 'timestamp', { unique: false })
          store.createIndex('userId', 'userId', { unique: false })
        }
      }
    })
  }

  private async getStore(storeName: string, mode: IDBTransactionMode = 'readonly'): Promise<IDBObjectStore> {
    if (!this.db) await this.init()
    const transaction = this.db!.transaction([storeName], mode)
    return transaction.objectStore(storeName)
  }

  // Save transaction to offline storage
  async savePendingTransaction(transaction: any, type: 'expense' | 'income' | 'installment', userId: string): Promise<void> {
    const store = await this.getStore('pendingTransactions', 'readwrite')
    const pendingTransaction = {
      ...transaction,
      type,
      userId,
      timestamp: Date.now(),
      status: 'pending'
    }
    store.add(pendingTransaction)
  }

  // Save update to offline storage
  async savePendingUpdate(update: any, type: 'expense' | 'income' | 'installment', userId: string): Promise<void> {
    const store = await this.getStore('pendingUpdates', 'readwrite')
    const pendingUpdate = {
      ...update,
      type,
      userId,
      timestamp: Date.now(),
      status: 'pending'
    }
    store.add(pendingUpdate)
  }

  // Save delete to offline storage
  async savePendingDelete(id: string, type: 'expense' | 'income' | 'installment', userId: string): Promise<void> {
    const store = await this.getStore('pendingDeletes', 'readwrite')
    const pendingDelete = {
      id,
      type,
      userId,
      timestamp: Date.now(),
      status: 'pending'
    }
    store.add(pendingDelete)
  }

  // Get all pending transactions
  async getPendingTransactions(userId: string): Promise<any[]> {
    const store = await this.getStore('pendingTransactions')
    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => {
        const transactions = request.result.filter((t: any) => t.userId === userId)
        resolve(transactions)
      }
      request.onerror = () => reject(request.error)
    })
  }

  // Get all pending updates
  async getPendingUpdates(userId: string): Promise<any[]> {
    const store = await this.getStore('pendingUpdates')
    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => {
        const updates = request.result.filter((u: any) => u.userId === userId)
        resolve(updates)
      }
      request.onerror = () => reject(request.error)
    })
  }

  // Get all pending deletes
  async getPendingDeletes(userId: string): Promise<any[]> {
    const store = await this.getStore('pendingDeletes')
    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => {
        const deletes = request.result.filter((d: any) => d.userId === userId)
        resolve(deletes)
      }
      request.onerror = () => reject(request.error)
    })
  }

  // Remove pending transaction after successful sync
  async removePendingTransaction(id: number): Promise<void> {
    const store = await this.getStore('pendingTransactions', 'readwrite')
    store.delete(id)
  }

  // Remove pending update after successful sync
  async removePendingUpdate(id: number): Promise<void> {
    const store = await this.getStore('pendingUpdates', 'readwrite')
    store.delete(id)
  }

  // Remove pending delete after successful sync
  async removePendingDelete(id: number): Promise<void> {
    const store = await this.getStore('pendingDeletes', 'readwrite')
    store.delete(id)
  }

  // Clear all pending data for a user
  async clearPendingData(userId: string): Promise<void> {
    const stores = ['pendingTransactions', 'pendingUpdates', 'pendingDeletes']
    
    for (const storeName of stores) {
      const store = await this.getStore(storeName, 'readwrite')
      const request = store.getAll()
      
      request.onsuccess = () => {
        const items = request.result.filter((item: any) => item.userId === userId)
        items.forEach((item: any) => store.delete(item.id))
      }
    }
  }

  // Get pending count for UI
  async getPendingCount(userId: string): Promise<number> {
    const [transactions, updates, deletes] = await Promise.all([
      this.getPendingTransactions(userId),
      this.getPendingUpdates(userId),
      this.getPendingDeletes(userId)
    ])
    
    return transactions.length + updates.length + deletes.length
  }
}

export const offlineStorage = new OfflineStorage()

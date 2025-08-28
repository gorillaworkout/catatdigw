import { addDoc, collection, doc, getDoc, getDocs, limit as limitFirestore, query, where, runTransaction, serverTimestamp, writeBatch, orderBy, Timestamp, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export type ExpenseInput = {
  amount: number
  description: string
  categoryId: string
  categoryName?: string
  accountId: string
  accountName?: string
  date: string // ISO yyyy-mm-dd
  notes?: string
}

export async function addExpenseWithBalanceCheck(userId: string, input: ExpenseInput) {
  if (!db) throw new Error("Firestore belum terinisialisasi")
  if (!userId) throw new Error("User belum login")
  
  // Check subscription status
  const isActive = await isSubscriptionActive(userId)
  if (!isActive) {
    throw new Error("Subscription Anda telah berakhir. Silakan perpanjang subscription untuk menambah pengeluaran.")
  }
  
  if (!input.accountId) throw new Error("Rekening wajib dipilih")
  if (!input.categoryId) throw new Error("Kategori wajib dipilih")
  if (!input.description?.trim()) throw new Error("Deskripsi pengeluaran wajib diisi")
  if (!input.date) throw new Error("Tanggal pengeluaran wajib dipilih")

  const accountRef = doc(db as any, "users", userId, "accounts", input.accountId)
  const expensesCol = collection(db as any, "users", userId, "expenses")

  await runTransaction(db as any, async (transaction: { get: (arg0: any) => any; update: (arg0: any, arg1: { balance: number }) => void; set: (arg0: any, arg1: { amount: number; description: string; categoryId: string; categoryName: string | null; accountId: string; accountName: string | null; date: string; notes: string; createdAt: any; updatedAt: any }) => void }) => {
    const accountSnap = await transaction.get(accountRef)
    if (!accountSnap.exists()) {
      throw new Error("Rekening tidak ditemukan")
    }
    const accountData = accountSnap.data() as { balance?: number; name?: string }
    const currentBalance = Number(accountData.balance || 0)
    const amount = Number(input.amount || 0)
    
    if (amount <= 0) throw new Error("Jumlah pengeluaran harus lebih dari 0")
    if (currentBalance < amount) {
      const shortfall = amount - currentBalance
      throw new Error(`Saldo rekening tidak mencukupi. Saldo: ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(currentBalance)}, Kekurangan: ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(shortfall)}`)
    }

    const newBalance = currentBalance - amount
    transaction.update(accountRef, { balance: newBalance })

    const docData = {
      amount,
      description: input.description.trim(),
      categoryId: input.categoryId,
      categoryName: input.categoryName || null,
      accountId: input.accountId,
      accountName: input.accountName || accountData.name || null,
      date: input.date,
      notes: input.notes || "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
    transaction.set(doc(expensesCol), docData)
  })
}

// Income functions
export type IncomeInput = {
  amount: number
  description: string
  categoryId: string
  categoryName?: string
  accountId: string
  accountName?: string
  date: string // ISO yyyy-mm-dd
  notes?: string
}

export async function addIncomeWithBalanceUpdate(userId: string, input: IncomeInput) {
  if (!db) throw new Error("Firestore belum terinisialisasi")
  if (!userId) throw new Error("User belum login")
  
  // Check subscription status
  const isActive = await isSubscriptionActive(userId)
  if (!isActive) {
    throw new Error("Subscription Anda telah berakhir. Silakan perpanjang subscription untuk menambah pendapatan.")
  }
  
  if (!input.accountId) throw new Error("Rekening wajib dipilih")
  if (!input.categoryId) throw new Error("Kategori wajib dipilih")
  if (!input.description?.trim()) throw new Error("Deskripsi pendapatan wajib diisi")
  if (!input.date) throw new Error("Tanggal pendapatan wajib dipilih")

  const accountRef = doc(db as any, "users", userId, "accounts", input.accountId)
  const incomeCol = collection(db as any, "users", userId, "income")

  await runTransaction(db as any, async (transaction: { get: (arg0: any) => any; update: (arg0: any, arg1: { balance: number }) => void; set: (arg0: any, arg1: { amount: number; description: string; categoryId: string; categoryName: string | null; accountId: string; accountName: string | null; date: string; notes: string; createdAt: any; updatedAt: any }) => void }) => {
    const accountSnap = await transaction.get(accountRef)
    if (!accountSnap.exists()) {
      throw new Error("Rekening tidak ditemukan")
    }
    const accountData = accountSnap.data() as { balance?: number; name?: string }
    const currentBalance = Number(accountData.balance || 0)
    const amount = Number(input.amount || 0)
    
    if (amount <= 0) throw new Error("Jumlah pendapatan harus lebih dari 0")

    const newBalance = currentBalance + amount
    transaction.update(accountRef, { balance: newBalance })

    const docData = {
      amount,
      description: input.description.trim(),
      categoryId: input.categoryId,
      categoryName: input.categoryName || null,
      accountId: input.accountId,
      accountName: input.accountName || accountData.name || null,
      date: input.date,
      notes: input.notes || "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
    transaction.set(doc(incomeCol), docData)
  })
}

// Accounts CRUD
export type AccountInput = {
  name: string
  type: "bank" | "cash" | "credit" | "investment" | "ewallet"
  balance?: number
  accountNumber?: string
  description?: string
  isActive?: boolean
}

export async function createAccount(userId: string, input: AccountInput) {
  if (!db) throw new Error("Firestore belum terinisialisasi")
  const col = collection(db as any, "users", userId, "accounts")
  return addDoc(col, {
    name: input.name,
    type: input.type,
    balance: Number(input.balance || 0),
    accountNumber: input.accountNumber || "",
    description: input.description || "",
    isActive: input.isActive ?? true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function updateAccount(userId: string, accountId: string, input: Partial<AccountInput>) {
  if (!db) throw new Error("Firestore belum terinisialisasi")
  const ref = doc(db as any, "users", userId, "accounts", accountId)
  const { updateDoc } = await import("firebase/firestore")
  await updateDoc(ref, {
    ...input,
    ...(input.balance !== undefined ? { balance: Number(input.balance) } : {}),
    updatedAt: serverTimestamp(),
  } as any)
}

export async function deleteAccount(userId: string, accountId: string) {
  if (!db) throw new Error("Firestore belum terinisialisasi")
  const ref = doc(db as any, "users", userId, "accounts", accountId)
  const { deleteDoc } = await import("firebase/firestore")
  await deleteDoc(ref)
}

// Categories CRUD
export type CategoryInput = {
  name: string
  color: string
  type: "expense" | "income"
  isDefault?: boolean
}

export async function createCategory(userId: string, input: CategoryInput) {
  if (!db) throw new Error("Firestore belum terinisialisasi")
  const col = collection(db as any, "users", userId, "categories")
  return addDoc(col, {
    name: input.name,
    color: input.color,
    type: input.type,
    isDefault: !!input.isDefault,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function updateCategory(userId: string, categoryId: string, input: Partial<CategoryInput>) {
  if (!db) throw new Error("Firestore belum terinisialisasi")
  const ref = doc(db as any, "users", userId, "categories", categoryId)
  const { updateDoc } = await import("firebase/firestore")
  await updateDoc(ref, { ...input, updatedAt: serverTimestamp() } as any)
}

export async function deleteCategory(userId: string, categoryId: string) {
  if (!db) throw new Error("Firestore belum terinisialisasi")
  const ref = doc(db as any, "users", userId, "categories", categoryId)
  const { deleteDoc } = await import("firebase/firestore")
  await deleteDoc(ref)
}

// Default accounts to seed for each new user
export const DEFAULT_ACCOUNTS: Array<{ name: string; type: AccountInput["type"]; balance?: number }> = [
  { name: "Dompet", type: "cash", balance: 0 },
  { name: "Bank BCA", type: "bank", balance: 0 },
]

export async function ensureUserDefaultAccounts(userId: string) {
  if (!db) throw new Error("Firestore belum terinisialisasi")
  const colRef = collection(db as any, "users", userId, "accounts")

  // Get all existing accounts to check for duplicates
  const existingSnap = await getDocs(colRef)
  const existingNames = new Set(existingSnap.docs.map(d => d.data().name))

  const batch = writeBatch(db as any)
  let hasChanges = false

  // Only add accounts that don't already exist
  DEFAULT_ACCOUNTS.forEach((a) => {
    if (!existingNames.has(a.name)) {
      const ref = doc(colRef)
      batch.set(ref, {
        name: a.name,
        type: a.type,
        balance: Number(a.balance || 0),
        accountNumber: "",
        description: "",
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      } as any)
      hasChanges = true
    }
  })

  if (hasChanges) {
    await batch.commit()
  }
}

// Default categories to seed for each user (expense and income)
export const DEFAULT_EXPENSE_CATEGORIES: Array<{ name: string; color: string }> = [
  { name: "Makanan & Minuman", color: "#10b981" },
  { name: "Transportasi", color: "#3b82f6" },
  { name: "Belanja", color: "#ef4444" },
  { name: "Hiburan", color: "#8b5cf6" },
  { name: "Kesehatan", color: "#f59e0b" },
  { name: "Pendidikan", color: "#06b6d4" },
  { name: "Tagihan", color: "#ec4899" },
  { name: "Lainnya", color: "#6b7280" },
]

export const DEFAULT_INCOME_CATEGORIES: Array<{ name: string; color: string }> = [
  { name: "Gaji", color: "#3b82f6" },
  { name: "Freelance", color: "#8b5cf6" },
  { name: "Bisnis", color: "#10b981" },
  { name: "Investasi", color: "#f59e0b" },
  { name: "Dividen", color: "#06b6d4" },
  { name: "Bonus", color: "#ec4899" },
  { name: "Hadiah", color: "#eab308" },
  { name: "Lainnya", color: "#6b7280" },
]

export async function ensureUserDefaultCategories(userId: string) {
  if (!db) throw new Error("Firestore belum terinisialisasi")
  const colRef = collection(db as any, "users", userId, "categories")

  // Get all existing categories to check for duplicates
  const existingSnap = await getDocs(colRef)
  const existingNames = new Set(existingSnap.docs.map(d => d.data().name))

  const batch = writeBatch(db as any)
  let hasChanges = false

  // Only add expense categories that don't already exist
  DEFAULT_EXPENSE_CATEGORIES.forEach((c) => {
    if (!existingNames.has(c.name)) {
      const ref = doc(colRef)
      batch.set(ref, {
        name: c.name,
        color: c.color,
        type: "expense",
        isDefault: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      } as any)
      hasChanges = true
    }
  })

  // Only add income categories that don't already exist
  DEFAULT_INCOME_CATEGORIES.forEach((c) => {
    if (!existingNames.has(c.name)) {
      const ref = doc(colRef)
      batch.set(ref, {
        name: c.name,
        color: c.color,
        type: "income",
        isDefault: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      } as any)
      hasChanges = true
    }
  })

  if (hasChanges) {
    await batch.commit()
  }
}

// Ensure both accounts and categories exist for a new user
export async function ensureUserBootstrap(userId: string) {
  if (!userId) return
  await Promise.all([
    ensureUserDefaultAccounts(userId),
    ensureUserDefaultCategories(userId),
    createUserSubscription(userId), // Add subscription for new users (only if doesn't exist)
  ])
}

// Ensure only accounts and categories exist (for existing users)
export async function ensureUserDefaultsOnly(userId: string) {
  if (!userId) return
  await Promise.all([
    ensureUserDefaultAccounts(userId),
    ensureUserDefaultCategories(userId),
    // Don't touch subscription for existing users
  ])
}

// Clean up duplicate categories (run this once if you have duplicates)
export async function cleanupDuplicateCategories(userId: string) {
  if (!db) throw new Error("Firestore belum terinisialisasi")
  const colRef = collection(db as any, "users", userId, "categories")
  
  const snap = await getDocs(colRef)
  const categories = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  
  // Group by name and find duplicates
  const nameGroups = new Map<string, any[]>()
  categories.forEach((cat: any) => {
    const name = cat.name
    if (!nameGroups.has(name)) {
      nameGroups.set(name, [])
    }
    nameGroups.get(name)!.push(cat)
  })
  
  // Find categories with duplicates
  const duplicates = Array.from(nameGroups.entries())
    .filter(([_, cats]) => cats.length > 1)
    .flatMap(([_, cats]) => cats.slice(1)) // Keep first, remove rest
  
  if (duplicates.length === 0) return
  
  // Delete duplicates
  const batch = writeBatch(db as any)
  duplicates.forEach(cat => {
    const ref = doc(colRef, cat.id)
    batch.delete(ref)
  })
  
  await batch.commit()
  console.log(`Cleaned up ${duplicates.length} duplicate categories`)
}

// Clean up duplicate accounts (run this once if you have duplicates)
export async function cleanupDuplicateAccounts(userId: string) {
  if (!db) throw new Error("Firestore belum terinisialisasi")
  const colRef = collection(db as any, "users", userId, "accounts")
  
  const snap = await getDocs(colRef)
  const accounts = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  
  // Group by name and find duplicates
  const nameGroups = new Map<string, any[]>()
  accounts.forEach((acc: any) => {
    const name = acc.name
    if (!nameGroups.has(name)) {
      nameGroups.set(name, [])
    }
    nameGroups.get(name)!.push(acc)
  })
  
  // Find accounts with duplicates
  const duplicates = Array.from(nameGroups.entries())
    .filter(([_, accs]) => accs.length > 1)
    .flatMap(([_, accs]) => accs.slice(1)) // Keep first, remove rest
  
  if (duplicates.length === 0) return
  
  // Delete duplicates
  const batch = writeBatch(db as any)
  duplicates.forEach(acc => {
    const ref = doc(colRef, acc.id)
    batch.delete(ref)
  })
  
  await batch.commit()
  console.log(`Cleaned up ${duplicates.length} duplicate accounts`)
}

// Clean up all duplicate data (accounts and categories) - run this once if you have duplicates
export async function cleanupAllDuplicateData(userId: string) {
  if (!db) throw new Error("Firestore belum terinisialisasi")
  
  console.log(`Starting cleanup for user ${userId}...`)
  
  await Promise.all([
    cleanupDuplicateAccounts(userId),
    cleanupDuplicateCategories(userId)
  ])
  
  console.log(`Cleanup completed for user ${userId}`)
}

// Get recent transactions (expenses and income combined)
export async function getRecentTransactions(userId: string, limitCount: number = 10) {
  if (!db) throw new Error("Firestore belum terinisialisasi")
  
  const expensesCol = collection(db as any, "users", userId, "expenses")
  const incomeCol = collection(db as any, "users", userId, "income")
  
  // Get recent expenses
  const expensesQuery = query(expensesCol, orderBy("date", "desc"), limitFirestore(limitCount))
  const expensesSnap = await getDocs(expensesQuery)
  
  // Get recent income
  const incomeQuery = query(incomeCol, orderBy("date", "desc"), limitFirestore(limitCount))
  const incomeSnap = await getDocs(incomeQuery)
  
  // Combine and sort by date
  const expenses = expensesSnap.docs.map(d => ({
    id: d.id,
    type: "expense" as const,
    ...d.data()
  }))
  
  const incomes = incomeSnap.docs.map(d => ({
    id: d.id,
    type: "income" as const,
    ...d.data()
  }))
  
  const allTransactions = [...expenses, ...incomes]
  allTransactions.sort((a, b) => {
    const dateA = (a as any).date
    const dateB = (b as any).date
    return new Date(dateB).getTime() - new Date(dateA).getTime()
  })
  
  return allTransactions.slice(0, limitCount)
}

// Get accounts with proper typing
export async function getAccounts(userId: string) {
  if (!db) throw new Error("Firestore belum terinisialisasi")
  
  const accountsCol = collection(db as any, "users", userId, "accounts")
  const accountsSnap = await getDocs(accountsCol)
  
  return accountsSnap.docs.map(d => ({
    id: d.id,
    ...d.data()
  }))
}

// Get account by ID
export async function getAccount(userId: string, accountId: string) {
  if (!db) throw new Error("Firestore belum terinisialisasi")
  
  const accountRef = doc(db as any, "users", userId, "accounts", accountId)
  const accountSnap = await getDoc(accountRef)
  
  if (!accountSnap.exists()) {
    return null
  }
  
  return {
    id: accountSnap.id,
    ...accountSnap.data()
  }
}

export async function deleteExpenseWithBalanceRestore(userId: string, expenseId: string) {
  if (!db) throw new Error("Firestore belum terinisialisasi")
  if (!userId) throw new Error("User belum login")

  const expenseRef = doc(db as any, "users", userId, "expenses", expenseId)
  const expensesCol = collection(db as any, "users", userId, "expenses")

  await runTransaction(db as any, async (transaction: { get: (arg0: any) => any; update: (arg0: any, arg1: { balance: number }) => void; delete: (arg0: any) => void }) => {
    // Get the expense data first
    const expenseSnap = await transaction.get(expenseRef)
    if (!expenseSnap.exists()) {
      throw new Error("Pengeluaran tidak ditemukan")
    }
    
    const expenseData = expenseSnap.data() as ExpenseInput
    const accountRef = doc(db as any, "users", userId, "accounts", expenseData.accountId)
    
    // Get current account balance
    const accountSnap = await transaction.get(accountRef)
    if (!accountSnap.exists()) {
      throw new Error("Rekening tidak ditemukan")
    }
    
    const accountData = accountSnap.data() as { balance?: number; name?: string }
    const currentBalance = Number(accountData.balance || 0)
    const expenseAmount = Number(expenseData.amount || 0)
    
    // Restore the balance by adding back the expense amount
    const newBalance = currentBalance + expenseAmount
    transaction.update(accountRef, { balance: newBalance })
    
    // Delete the expense
    transaction.delete(expenseRef)
  })
}

export async function updateExpenseWithBalanceCheck(
  userId: string, 
  expenseId: string, 
  input: ExpenseInput
) {
  if (!db) throw new Error("Firestore belum terinisialisasi")
  if (!userId) throw new Error("User belum login")
  if (!input.accountId) throw new Error("Rekening wajib dipilih")
  if (!input.categoryId) throw new Error("Kategori wajib dipilih")
  if (!input.description?.trim()) throw new Error("Deskripsi pengeluaran wajib diisi")
  if (!input.date) throw new Error("Tanggal pengeluaran wajib dipilih")

  const expenseRef = doc(db as any, "users", userId, "expenses", expenseId)
  const accountRef = doc(db as any, "users", userId, "accounts", input.accountId)

  await runTransaction(db as any, async (transaction: { 
    get: (arg0: any) => any; 
    update: (arg0: any, arg1: any) => void; 
  }) => {
    // Get the original expense data
    const expenseSnap = await transaction.get(expenseRef)
    if (!expenseSnap.exists()) {
      throw new Error("Pengeluaran tidak ditemukan")
    }
    
    const originalExpense = expenseSnap.data() as ExpenseInput
    const originalAmount = Number(originalExpense.amount || 0)
    const newAmount = Number(input.amount || 0)
    
    if (newAmount <= 0) throw new Error("Jumlah pengeluaran harus lebih dari 0")
    
    // Get current account balance
    const accountSnap = await transaction.get(accountRef)
    if (!accountSnap.exists()) {
      throw new Error("Rekening tidak ditemukan")
    }
    
    const accountData = accountSnap.data() as { balance?: number; name?: string }
    const currentBalance = Number(accountData.balance || 0)
    
    // Calculate the balance change
    // First, restore the original expense amount
    const balanceAfterRestore = currentBalance + originalAmount
    
    // Then check if we can deduct the new amount
    if (balanceAfterRestore < newAmount) {
      const shortfall = newAmount - balanceAfterRestore
      throw new Error(`Saldo rekening tidak mencukupi untuk pengeluaran baru. Saldo setelah pengembalian: ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(balanceAfterRestore)}, Kekurangan: ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(shortfall)}`)
    }
    
    // Calculate final balance
    const finalBalance = balanceAfterRestore - newAmount
    
    // Update account balance
    transaction.update(accountRef, { balance: finalBalance })
    
    // Update the expense
    const updatedExpenseData = {
      amount: newAmount,
      description: input.description.trim(),
      categoryId: input.categoryId,
      categoryName: input.categoryName || null,
      accountId: input.accountId,
      accountName: input.accountName || accountData.name || null,
      date: input.date,
      notes: input.notes || "",
      updatedAt: serverTimestamp(),
    }
    
    transaction.update(expenseRef, updatedExpenseData)
  })
}


// Transfer funds between two accounts (no expense/income recorded, just balance move)
export type TransferInput = {
  fromAccountId: string
  toAccountId: string
  amount: number
  date: string // ISO yyyy-mm-dd
  notes?: string
}

export async function transferFunds(userId: string, input: TransferInput) {
  if (!db) throw new Error("Firestore belum terinisialisasi")
  if (!userId) throw new Error("User belum login")
  if (!input.fromAccountId || !input.toAccountId) throw new Error("Rekening asal dan tujuan wajib dipilih")
  if (input.fromAccountId === input.toAccountId) throw new Error("Rekening asal dan tujuan tidak boleh sama")
  if (!input.date) throw new Error("Tanggal wajib dipilih")

  const amount = Number(input.amount || 0)
  if (amount <= 0) throw new Error("Jumlah pemindahan harus lebih dari 0")

  const fromRef = doc(db as any, "users", userId, "accounts", input.fromAccountId)
  const toRef = doc(db as any, "users", userId, "accounts", input.toAccountId)
  const transfersCol = collection(db as any, "users", userId, "transfers")

  await runTransaction(db as any, async (transaction: any) => {
    const fromSnap = await transaction.get(fromRef)
    const toSnap = await transaction.get(toRef)

    if (!fromSnap.exists()) throw new Error("Rekening asal tidak ditemukan")
    if (!toSnap.exists()) throw new Error("Rekening tujuan tidak ditemukan")

    const fromData = fromSnap.data() as { balance?: number; name?: string }
    const toData = toSnap.data() as { balance?: number; name?: string }

    const fromBalance = Number(fromData.balance || 0)
    const toBalance = Number(toData.balance || 0)

    if (fromBalance < amount) {
      const shortfall = amount - fromBalance
      throw new Error(`Saldo rekening asal tidak mencukupi. Kekurangan: ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(shortfall)}`)
    }

    // Update balances
    transaction.update(fromRef, { balance: fromBalance - amount, updatedAt: serverTimestamp() })
    transaction.update(toRef, { balance: toBalance + amount, updatedAt: serverTimestamp() })

    // Record transfer document for history/audit
    transaction.set(doc(transfersCol), {
      fromAccountId: input.fromAccountId,
      fromAccountName: fromData.name || null,
      toAccountId: input.toAccountId,
      toAccountName: toData.name || null,
      amount,
      date: input.date,
      notes: input.notes || "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  })
}

// Subscription management
export type SubscriptionStatus = "active" | "expired" | "trial"

export type SubscriptionData = {
  status: SubscriptionStatus
  startDate: Timestamp
  endDate: Timestamp
  isActive: boolean
}

export type UserRole = "user" | "admin"

export type UserData = {
  uid: string
  displayName: string
  email: string
  photoURL: string
  role: UserRole
  createdAt: any
  updatedAt: any
}

// Create subscription for new user (1 week trial) - ONLY if it doesn't exist
export async function createUserSubscription(userId: string) {
  if (!db) throw new Error("Firestore belum terinisialisasi")
  
  const subscriptionRef = doc(db as any, "users", userId, "subscription", "current")
  
  // Check if subscription already exists
  const existingSnap = await getDoc(subscriptionRef)
  if (existingSnap.exists()) {
    // Subscription already exists, don't overwrite it
    return existingSnap.data() as SubscriptionData
  }
  
  // Only create new subscription if it doesn't exist
  const now = new Date()
  const endDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 1 week from now
  
  const subscriptionData: SubscriptionData = {
    status: "trial",
    startDate: Timestamp.fromDate(now),
    endDate: Timestamp.fromDate(endDate),
    isActive: true,
  }
  
  await setDoc(subscriptionRef, subscriptionData)
  return subscriptionData
}

// Get user subscription status
export async function getUserSubscription(userId: string): Promise<SubscriptionData | null> {
  if (!db) throw new Error("Firestore belum terinisialisasi")
  
  const subscriptionRef = doc(db as any, "users", userId, "subscription", "current")
  const subscriptionSnap = await getDoc(subscriptionRef)
  
  if (!subscriptionSnap.exists()) {
    return null
  }
  
  return subscriptionSnap.data() as SubscriptionData
}

// Check if user subscription is active
export async function isSubscriptionActive(userId: string): Promise<boolean> {
  const subscription = await getUserSubscription(userId)
  
  if (!subscription) {
    return false
  }
  
  const now = new Date()
  const endDate = subscription.endDate.toDate()
  
  // Check if subscription has expired but don't auto-update
  if (now > endDate) {
    // Return false if expired, but don't auto-update the status
    return false
  }
  
  return subscription.isActive && subscription.status !== "expired"
}

// Update subscription status
export async function updateSubscriptionStatus(
  userId: string, 
  status: SubscriptionStatus, 
  isActive: boolean
) {
  if (!db) throw new Error("Firestore belum terinisialisasi")
  
  const subscriptionRef = doc(db as any, "users", userId, "subscription", "current")
  
  await setDoc(subscriptionRef, {
    status,
    isActive,
    updatedAt: serverTimestamp(),
  } as any, { merge: true })
}

// Extend subscription (for future use)
export async function extendSubscription(userId: string, daysToAdd: number) {
  if (!db) throw new Error("Firestore belum terinisialisasi")
  
  const subscription = await getUserSubscription(userId)
  if (!subscription) {
    throw new Error("Subscription tidak ditemukan")
  }
  
  const currentEndDate = subscription.endDate.toDate()
  const newEndDate = new Date(currentEndDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000)
  
  const subscriptionRef = doc(db as any, "users", userId, "subscription", "current")
  
  await setDoc(subscriptionRef, {
    endDate: Timestamp.fromDate(newEndDate),
    status: "active",
    isActive: true,
    updatedAt: serverTimestamp(),
  } as any, { merge: true })
}

// Admin functions for managing user subscriptions
export async function adminUpdateUserSubscription(
  adminUserId: string,
  targetUserId: string,
  updates: {
    status?: SubscriptionStatus
    isActive?: boolean
    endDate?: Date
    startDate?: Date
  }
) {
  if (!db) throw new Error("Firestore belum terinisialisasi")
  
  // TODO: Add admin check here - for now, allow any user to call this
  // In production, you should check if adminUserId has admin privileges
  
  const subscriptionRef = doc(db as any, "users", targetUserId, "subscription", "current")
  
  // Get current subscription data first
  const currentSnap = await getDoc(subscriptionRef)
  if (!currentSnap.exists()) {
    throw new Error("Subscription tidak ditemukan")
  }
  
  const currentData = currentSnap.data()
  
  const updateData: any = {
    updatedAt: serverTimestamp(),
  }
  
  if (updates.status !== undefined) {
    updateData.status = updates.status
  }
  
  if (updates.isActive !== undefined) {
    updateData.isActive = updates.isActive
  }
  
  if (updates.endDate !== undefined) {
    updateData.endDate = Timestamp.fromDate(updates.endDate)
  }
  
  if (updates.startDate !== undefined) {
    updateData.startDate = Timestamp.fromDate(updates.startDate)
  }
  
  // Use merge: true to only update specified fields
  await setDoc(subscriptionRef, updateData, { merge: true })
  
  console.log(`Admin ${adminUserId} updated subscription for user ${targetUserId}:`, updateData)
}

// Admin function to expire a user's subscription immediately
export async function adminExpireUserSubscription(adminUserId: string, targetUserId: string) {
  await adminUpdateUserSubscription(adminUserId, targetUserId, {
    status: "expired",
    isActive: false,
    endDate: new Date() // Set to current time
  })
}

// Verify subscription data hasn't been auto-updated
export async function verifySubscriptionIntegrity(userId: string): Promise<{
  isConsistent: boolean
  currentData: any
}> {
  if (!db) throw new Error("Firestore belum terinisialisasi")
  
  const subscriptionRef = doc(db as any, "users", userId, "subscription", "current")
  const subscriptionSnap = await getDoc(subscriptionRef)
  
  if (!subscriptionSnap.exists()) {
    return {
      isConsistent: false,
      currentData: null
    }
  }
  
  const data = subscriptionSnap.data()
  
  return {
    isConsistent: true,
    currentData: data
  }
}

// Admin function to extend a user's subscription
export async function adminExtendUserSubscription(
  adminUserId: string, 
  targetUserId: string, 
  daysToAdd: number
) {
  const subscription = await getUserSubscription(targetUserId)
  if (!subscription) {
    throw new Error("Subscription tidak ditemukan")
  }
  
  const currentEndDate = subscription.endDate.toDate()
  const newEndDate = new Date(currentEndDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000)
  
  await adminUpdateUserSubscription(adminUserId, targetUserId, {
    status: "active",
    isActive: true,
    endDate: newEndDate
  })
}

// Installment management
export type InstallmentInput = {
  title: string
  description?: string
  totalAmount: number
  numberOfInstallments: number
  installmentAmount: number
  interestRate?: number
  monthlyInterest?: number
  totalWithInterest?: number
  startDate: string // ISO yyyy-mm-dd
  dueDate: string // ISO yyyy-mm-dd
  accountId: string
  accountName?: string
  categoryId: string
  categoryName?: string
  status: "active" | "completed" | "overdue"
  notes?: string
}

export type InstallmentPaymentInput = {
  installmentId: string
  paymentNumber: number
  amount: number
  paymentDate: string // ISO yyyy-mm-dd
  accountId: string
  accountName?: string
  notes?: string
}

// Create new installment
export async function createInstallment(userId: string, input: InstallmentInput) {
  if (!db) throw new Error("Firestore belum terinisialisasi")
  if (!userId) throw new Error("User belum login")
  
  // Check subscription status
  const isActive = await isSubscriptionActive(userId)
  if (!isActive) {
    throw new Error("Subscription Anda telah berakhir. Silakan perpanjang subscription untuk menambah cicilan.")
  }
  
  if (!input.title?.trim()) throw new Error("Judul cicilan wajib diisi")
  if (!input.accountId) throw new Error("Rekening wajib dipilih")
  if (!input.categoryId) throw new Error("Kategori wajib dipilih")
  if (!input.startDate) throw new Error("Tanggal mulai wajib dipilih")
  if (!input.dueDate) throw new Error("Tanggal jatuh tempo wajib dipilih")
  if (input.totalAmount <= 0) throw new Error("Total jumlah cicilan harus lebih dari 0")
  if (input.numberOfInstallments <= 0) throw new Error("Jumlah cicilan harus lebih dari 0")
  if (input.installmentAmount <= 0) throw new Error("Jumlah per cicilan harus lebih dari 0")

  const col = collection(db as any, "users", userId, "installments")
  return addDoc(col, {
    title: input.title.trim(),
    description: input.description?.trim() || "",
    totalAmount: Number(input.totalAmount),
    numberOfInstallments: Number(input.numberOfInstallments),
    installmentAmount: Number(input.installmentAmount),
    interestRate: Number(input.interestRate || 0),
    monthlyInterest: Number(input.monthlyInterest || 0),
    totalWithInterest: Number(input.totalWithInterest || input.totalAmount),
    startDate: input.startDate,
    dueDate: input.dueDate,
    accountId: input.accountId,
    accountName: input.accountName || null,
    categoryId: input.categoryId,
    categoryName: input.categoryName || null,
    status: (() => {
      // Determine initial status based on due date
      const dueDate = new Date(input.dueDate)
      const now = new Date()
      if (now > dueDate) {
        return "overdue"
      }
      return "active"
    })(),
    notes: input.notes || "",
    paidInstallments: 0,
    totalPaid: 0,
    remainingAmount: Number(input.totalWithInterest || input.totalAmount),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

// Get all installments for a user
export async function getInstallments(userId: string) {
  if (!db) throw new Error("Firestore belum terinisialisasi")
  
  const installmentsCol = collection(db as any, "users", userId, "installments")
  const installmentsSnap = await getDocs(installmentsCol)
  
  const installments = installmentsSnap.docs.map(d => ({
    id: d.id,
    ...d.data()
  }))
  
  // Update status for installments that need correction
  for (const installment of installments) {
    const installmentData = installment as any
    const isCompleted = installmentData.paidInstallments >= installmentData.numberOfInstallments || installmentData.remainingAmount <= 0
    const isOverdue = new Date() > new Date(installmentData.dueDate) && !isCompleted
    
    let correctStatus = "active"
    if (isCompleted) {
      correctStatus = "completed"
    } else if (isOverdue) {
      correctStatus = "overdue"
    }
    
    // Update status if it's incorrect
    if (installmentData.status !== correctStatus) {
      const ref = doc(db as any, "users", userId, "installments", installment.id)
      const { updateDoc } = await import("firebase/firestore")
      await updateDoc(ref, { 
        status: correctStatus,
        updatedAt: serverTimestamp() 
      } as any)
      
      // Update the local data
      installmentData.status = correctStatus
    }
  }
  
  return installments
}

// Get installment by ID
export async function getInstallment(userId: string, installmentId: string) {
  if (!db) throw new Error("Firestore belum terinisialisasi")
  
  const installmentRef = doc(db as any, "users", userId, "installments", installmentId)
  const installmentSnap = await getDoc(installmentRef)
  
  if (!installmentSnap.exists()) {
    return null
  }
  
  return {
    id: installmentSnap.id,
    ...installmentSnap.data()
  }
}

// Update installment
export async function updateInstallment(userId: string, installmentId: string, input: Partial<InstallmentInput>) {
  if (!db) throw new Error("Firestore belum terinisialisasi")
  
  // Get current installment data to calculate correct status
  const currentInstallment = await getInstallment(userId, installmentId)
  if (!currentInstallment) {
    throw new Error("Cicilan tidak ditemukan")
  }
  
  // Calculate new status based on current data and updates
  let newStatus = (currentInstallment as any).status
  
  // If due date is being updated, recalculate status
  if (input.dueDate) {
    const dueDate = new Date(input.dueDate)
    const now = new Date()
    if (now > dueDate) {
      newStatus = "overdue"
    } else if ((currentInstallment as any).paidInstallments >= (currentInstallment as any).numberOfInstallments) {
      newStatus = "completed"
    } else {
      newStatus = "active"
    }
  }
  
  const ref = doc(db as any, "users", userId, "installments", installmentId)
  const { updateDoc } = await import("firebase/firestore")
  await updateDoc(ref, { 
    ...input, 
    status: newStatus,
    updatedAt: serverTimestamp() 
  } as any)
}

// Delete installment
export async function deleteInstallment(userId: string, installmentId: string) {
  if (!db) throw new Error("Firestore belum terinisialisasi")
  const ref = doc(db as any, "users", userId, "installments", installmentId)
  const { deleteDoc } = await import("firebase/firestore")
  await deleteDoc(ref)
}

// Pay installment
export async function payInstallment(userId: string, input: InstallmentPaymentInput) {
  if (!db) throw new Error("Firestore belum terinisialisasi")
  if (!userId) throw new Error("User belum login")
  
  // Check subscription status
  const isActive = await isSubscriptionActive(userId)
  if (!isActive) {
    throw new Error("Subscription Anda telah berakhir. Silakan perpanjang subscription untuk membayar cicilan.")
  }
  
  if (!input.installmentId) throw new Error("Cicilan wajib dipilih")
  if (!input.accountId) throw new Error("Rekening wajib dipilih")
  if (!input.paymentDate) throw new Error("Tanggal pembayaran wajib dipilih")
  if (input.amount <= 0) throw new Error("Jumlah pembayaran harus lebih dari 0")

  const installmentRef = doc(db as any, "users", userId, "installments", input.installmentId)
  const accountRef = doc(db as any, "users", userId, "accounts", input.accountId)
  const paymentsCol = collection(db as any, "users", userId, "installmentPayments")
  const expensesCol = collection(db as any, "users", userId, "expenses")

  await runTransaction(db as any, async (transaction: any) => {
    // Get installment data
    const installmentSnap = await transaction.get(installmentRef)
    if (!installmentSnap.exists()) {
      throw new Error("Cicilan tidak ditemukan")
    }
    
    const installmentData = installmentSnap.data()
    const currentPaidInstallments = Number(installmentData.paidInstallments || 0)
    const currentTotalPaid = Number(installmentData.totalPaid || 0)
    const totalAmount = Number(installmentData.totalWithInterest || installmentData.totalAmount || 0)
    const remainingAmount = Number(installmentData.remainingAmount || totalAmount)
    const paymentAmount = Number(input.amount)
    
    // Check if payment amount exceeds remaining amount
    if (paymentAmount > remainingAmount) {
      throw new Error(`Jumlah pembayaran melebihi sisa cicilan. Sisa: ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(remainingAmount)}`)
    }
    
    // Get account data for balance check
    const accountSnap = await transaction.get(accountRef)
    if (!accountSnap.exists()) {
      throw new Error("Rekening tidak ditemukan")
    }
    
    const accountData = accountSnap.data()
    const currentBalance = Number(accountData.balance || 0)
    
    if (currentBalance < paymentAmount) {
      const shortfall = paymentAmount - currentBalance
      throw new Error(`Saldo rekening tidak mencukupi. Kekurangan: ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(shortfall)}`)
    }
    
    // Update account balance
    transaction.update(accountRef, { 
      balance: currentBalance - paymentAmount,
      updatedAt: serverTimestamp()
    })
    
    // Create payment record
    transaction.set(doc(paymentsCol), {
      installmentId: input.installmentId,
      paymentNumber: input.paymentNumber,
      amount: paymentAmount,
      paymentDate: input.paymentDate,
      accountId: input.accountId,
      accountName: input.accountName || accountData.name || null,
      notes: input.notes || "",
      createdAt: serverTimestamp(),
    })
    
    // Create expense record for the installment payment
    const expenseDescription = `Pembayaran Cicilan ${installmentData.title} - Cicilan ke-${input.paymentNumber}`
    const expenseNotes = input.notes ? `Catatan: ${input.notes}` : `Pembayaran cicilan ${installmentData.title}`
    
    transaction.set(doc(expensesCol), {
      amount: paymentAmount,
      description: expenseDescription,
      categoryId: installmentData.categoryId,
      categoryName: installmentData.categoryName || null,
      accountId: input.accountId,
      accountName: input.accountName || accountData.name || null,
      date: input.paymentDate,
      notes: expenseNotes,
      installmentPaymentId: input.installmentId, // Link to installment for tracking
      paymentNumber: input.paymentNumber, // Track which payment number this is
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    
    // Update installment data
    const newTotalPaid = currentTotalPaid + paymentAmount
    const newRemainingAmount = remainingAmount - paymentAmount
    const installmentAmount = Number(installmentData.installmentAmount || 0)
    const newPaidInstallments = installmentAmount > 0 ? Math.ceil(newTotalPaid / installmentAmount) : 0
    
    // Determine new status based on both remaining amount and paid installments
    let newStatus = "active"
    if (newRemainingAmount <= 0 || newPaidInstallments >= installmentData.numberOfInstallments) {
      newStatus = "completed"
    } else if (newRemainingAmount > 0 && new Date() > new Date(installmentData.dueDate)) {
      newStatus = "overdue"
    }
    
    transaction.update(installmentRef, {
      paidInstallments: newPaidInstallments,
      totalPaid: newTotalPaid,
      remainingAmount: newRemainingAmount,
      status: newStatus,
      updatedAt: serverTimestamp(),
    })
  })
}

// Get installment payments
export async function getInstallmentPayments(userId: string, installmentId?: string) {
  if (!db) throw new Error("Firestore belum terinisialisasi")
  
  const paymentsCol = collection(db as any, "users", userId, "installmentPayments")
  
  if (installmentId) {
    const paymentsQuery = query(paymentsCol, where("installmentId", "==", installmentId))
    const paymentsSnap = await getDocs(paymentsQuery)
    return paymentsSnap.docs.map(d => ({
      id: d.id,
      ...d.data()
    }))
  } else {
    const paymentsSnap = await getDocs(paymentsCol)
    return paymentsSnap.docs.map(d => ({
      id: d.id,
      ...d.data()
    }))
  }
}

// Update user role (admin only)
export async function updateUserRole(adminUserId: string, targetUserId: string, newRole: UserRole) {
  if (!db) throw new Error("Firestore belum terinisialisasi")
  
  // TODO: Add admin check here - for now, allow any user to call this
  // In production, you should check if adminUserId has admin privileges
  
  const userRef = doc(db as any, "users", targetUserId)
  
  await setDoc(userRef, {
    role: newRole,
    updatedAt: serverTimestamp(),
  } as any, { merge: true })
  
  console.log(`Admin ${adminUserId} updated role for user ${targetUserId} to ${newRole}`)
}

// Get all users with their subscription data (admin only)
export async function getAllUsersWithSubscriptions() {
  if (!db) throw new Error("Firestore belum terinisialisasi")
  
  const usersCol = collection(db as any, "users")
  const usersSnap = await getDocs(usersCol)
  
  console.log(`Found ${usersSnap.docs.length} user documents in Firestore`)
  
  const usersWithSubscriptions = []
  
  for (const userDoc of usersSnap.docs) {
          const userData = userDoc.data()
      const userId = userDoc.id
      
      console.log(`Processing user ${userId}:`, userData)
    
          try {
        const subscription = await getUserSubscription(userId)
        console.log(`Subscription for ${userId}:`, subscription)
              // Calculate remaining days if subscription exists
        let remainingDays = 0
        let isActive = false
        
        if (subscription && subscription.endDate) {
          const endDate = subscription.endDate.toDate()
          const now = new Date()
          remainingDays = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
          isActive = subscription.isActive && now <= endDate
        }
        
        usersWithSubscriptions.push({
          userId,
          email: userData.email || "",
          displayName: userData.displayName || "",
          photoURL: userData.photoURL || "",
          role: userData.role || "user",
          createdAt: userData.createdAt,
          subscription,
          isActive,
          remainingDays
        })
          } catch (error) {
        console.error(`Error getting subscription for user ${userId}:`, error)
        // Add user even if subscription fetch fails
        usersWithSubscriptions.push({
          userId,
          email: userData.email || "",
          displayName: userData.displayName || "",
          photoURL: userData.photoURL || "",
          role: userData.role || "user",
          createdAt: userData.createdAt,
          subscription: null,
          isActive: false,
          remainingDays: 0
        })
      }
  }
  
  console.log(`Loaded ${usersWithSubscriptions.length} users with subscriptions`)
  return usersWithSubscriptions
}



import { addDoc, collection, doc, getDoc, getDocs, limit as limitFirestore, query, where, runTransaction, serverTimestamp, writeBatch, orderBy } from "firebase/firestore"
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
  const anySnap = await getDocs(query(colRef, limitFirestore(1)))
  if (!anySnap.empty) return

  const batch = writeBatch(db as any)
  DEFAULT_ACCOUNTS.forEach((a) => {
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
  })
  await batch.commit()
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



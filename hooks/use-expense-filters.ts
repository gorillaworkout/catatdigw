"use client"

import { useState } from "react"

export type ExpenseFilters = {
  search: string
  category: string
  account: string
  dateFrom: string
  dateTo: string
  sort: string
  installmentOnly: boolean
}

const DEFAULT_FILTERS: ExpenseFilters = {
  search: "",
  category: "__all__",
  account: "__all__",
  dateFrom: "",
  dateTo: "",
  sort: "date-desc",
  installmentOnly: false,
}

export function useExpenseFilters() {
  const [filters, setFilters] = useState<ExpenseFilters>(DEFAULT_FILTERS)

  const updateFilter = (key: keyof ExpenseFilters, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS)
  }

  const hasActiveFilters = 
    filters.search !== "" ||
    filters.category !== "__all__" ||
    filters.account !== "__all__" ||
    filters.dateFrom !== "" ||
    filters.dateTo !== "" ||
    filters.installmentOnly

  return {
    filters,
    updateFilter,
    clearFilters,
    hasActiveFilters,
  }
}

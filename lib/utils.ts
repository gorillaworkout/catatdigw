import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatIDR(input: string | number): string {
  if (input === null || input === undefined) return ""
  const digits = typeof input === "number" ? String(Math.floor(input)) : String(input).replace(/\D/g, "")
  if (!digits) return ""
  const number = Number(digits)
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(number)
}

export function parseIDR(input: string): number {
  if (!input) return 0
  const digits = input.replace(/\D/g, "")
  return digits ? Number(digits) : 0
}

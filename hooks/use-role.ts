"use client"

import { useState, useEffect } from "react"
import { useAuth } from "./use-auth"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { UserRole, UserData } from "@/lib/firestore"

export function useRole() {
  const { user } = useAuth()
  const [role, setRole] = useState<UserRole>("user")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setRole("user")
      setLoading(false)
      return
    }

    const fetchUserRole = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const userRef = doc(db as any, "users", user.uid)
        const userSnap = await getDoc(userRef)
        
        if (userSnap.exists()) {
          const userData = userSnap.data() as UserData
          setRole(userData.role || "user")
        } else {
          setRole("user")
        }
      } catch (err) {
        console.error("Error fetching user role:", err)
        setError("Gagal memuat role user")
        setRole("user")
      } finally {
        setLoading(false)
      }
    }

    fetchUserRole()
  }, [user])

  const isAdmin = role === "admin"
  const isUser = role === "user"

  return {
    role,
    isAdmin,
    isUser,
    loading,
    error,
  }
}


"use client"

import { useState, useEffect } from "react"
import { type User, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebase"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!auth) {
      setError("Firebase authentication is not properly configured. Please check your environment variables.")
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
      setError(null)
    })

    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    if (!auth || !googleProvider) {
      setError("Firebase authentication is not available")
      return
    }

    try {
      setError(null)
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      console.error("Error signing in with Google:", error)
      setError("Failed to sign in with Google")
    }
  }

  const logout = async () => {
    if (!auth) {
      setError("Firebase authentication is not available")
      return
    }

    try {
      setError(null)
      await signOut(auth)
    } catch (error) {
      console.error("Error signing out:", error)
      setError("Failed to sign out")
    }
  }

  return {
    user,
    loading,
    error, // Added error state to return object
    signInWithGoogle,
    logout,
  }
}

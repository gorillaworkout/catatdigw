"use client"

import { useState, useEffect } from "react"
import { type User, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth"
import { auth, googleProvider, db } from "@/lib/firebase"
import { ensureUserBootstrap, ensureUserDefaultsOnly } from "@/lib/firestore"
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"

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

    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      try {
        setUser(user)
        setError(null)

        // On first login, create the user profile document if it doesn't exist yet
        if (user && db) {
          const userRef = doc(db as any, "users", user.uid)
          const snap = await getDoc(userRef)
          if (!snap.exists()) {
            await setDoc(userRef, {
              uid: user.uid,
              displayName: user.displayName || "",
              email: user.email || "",
              photoURL: user.photoURL || "",
              role: "user", // Default role for new users
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            } as any)
            // Seed default collections for first-time users
            await ensureUserBootstrap(user.uid)
          } else {
            // keep updatedAt fresh on subsequent logins
            await setDoc(
              userRef,
              { updatedAt: serverTimestamp() } as any,
              { merge: true } as any
            )
            // Ensure accounts and categories exist without touching subscription
            ensureUserDefaultsOnly(user.uid).catch(() => {})
          }
        }
      } catch (e) {
        console.error(e)
        setError("Gagal menyiapkan data pengguna")
      } finally {
        setLoading(false)
      }
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

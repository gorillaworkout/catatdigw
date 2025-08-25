"use client"

import { useEffect, useMemo, useState } from "react"
import { collection, doc, onSnapshot, query, where, orderBy, type QueryConstraint } from "firebase/firestore"

// Re-export orderBy for use in components
export { orderBy }
import { ensureUserDefaultCategories } from "@/lib/firestore"
import { db } from "@/lib/firebase"
import type { Firestore } from "firebase/firestore"
import { useAuth } from "@/hooks/use-auth"

type DocWithId<T> = T & { id: string }

export function useUserCollection<T = any>(
  subpath: string,
  constraints: QueryConstraint[] = []
) {
  const { user } = useAuth()
  const [data, setData] = useState<DocWithId<T>[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user || !db) {
      setData([])
      setLoading(false)
      return
    }
          try {
        const baseRef = collection(db as any, "users", user.uid, subpath)
      const q = query(baseRef, ...constraints)
      const unsub = onSnapshot(
        q,
        (snap) => {
          const docs = snap.docs.map((d) => ({ id: d.id, ...(d.data() as T) }))
          setData(docs)
          setLoading(false)
        },
        (e) => {
          console.error(e)
          setError("Gagal memuat data")
          setLoading(false)
        }
      )
      return () => unsub()
    } catch (e) {
      console.error(e)
      setError("Gagal menyiapkan query")
      setLoading(false)
    }
  }, [user, subpath, JSON.stringify(constraints)])

  return { data, loading, error }
}

export function useThisMonthRange() {
  return useMemo(() => {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    return { start, end }
  }, [])
}

export function useUserDoc<T = any>(subpath: string, docId: string) {
  const { user } = useAuth()
  const [data, setData] = useState<(T & { id: string }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user || !db) {
      setData(null)
      setLoading(false)
      return
    }
    try {
      const ref = doc(db as any, "users", user.uid, subpath, docId)
      const unsub = onSnapshot(
        ref,
        (snap) => {
          setData(snap.exists() ? ({ id: snap.id, ...(snap.data() as T) }) : null)
          setLoading(false)
        },
        (e) => {
          console.error(e)
          setError("Gagal memuat data")
          setLoading(false)
        }
      )
      return () => unsub()
    } catch (e) {
      console.error(e)
      setError("Gagal menyiapkan doc listener")
      setLoading(false)
    }
  }, [user, subpath, docId])

  return { data, loading, error }
}



"use client"

import { useState, useEffect } from "react"
import { useAuth } from "./use-auth"
import { 
  getUserSubscription, 
  isSubscriptionActive, 
  extendSubscription,
  type SubscriptionData 
} from "@/lib/firestore"

export function useSubscription() {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [isActive, setIsActive] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setSubscription(null)
      setIsActive(false)
      setLoading(false)
      return
    }

    const checkSubscription = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const [subscriptionData, activeStatus] = await Promise.all([
          getUserSubscription(user.uid),
          isSubscriptionActive(user.uid)
        ])
        
        setSubscription(subscriptionData)
        setIsActive(activeStatus)
      } catch (err) {
        console.error("Error checking subscription:", err)
        setError("Gagal memeriksa status subscription")
        setIsActive(false)
      } finally {
        setLoading(false)
      }
    }

    checkSubscription()
  }, [user])

  const extendUserSubscription = async (daysToAdd: number) => {
    if (!user) {
      throw new Error("User belum login")
    }

    try {
      setError(null)
      await extendSubscription(user.uid, daysToAdd)
      
      // Refresh subscription data
      const [subscriptionData, activeStatus] = await Promise.all([
        getUserSubscription(user.uid),
        isSubscriptionActive(user.uid)
      ])
      
      setSubscription(subscriptionData)
      setIsActive(activeStatus)
    } catch (err) {
      console.error("Error extending subscription:", err)
      setError("Gagal memperpanjang subscription")
      throw err
    }
  }

  const getRemainingDays = (): number => {
    if (!subscription) return 0
    
    const now = new Date()
    const endDate = subscription.endDate.toDate()
    const diffTime = endDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    return Math.max(0, diffDays)
  }

  const getSubscriptionStatusText = (): string => {
    if (!subscription) return "Tidak ada subscription"
    
    if (!isActive) {
      return "Subscription telah berakhir"
    }
    
    const remainingDays = getRemainingDays()
    if (remainingDays === 0) {
      return "Subscription berakhir hari ini"
    }
    
    return `Subscription aktif - ${remainingDays} hari tersisa`
  }

  return {
    subscription,
    isActive,
    loading,
    error,
    extendSubscription: extendUserSubscription,
    getRemainingDays,
    getSubscriptionStatusText,
  }
}

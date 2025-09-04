"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, Clock, Trash2, Edit, Plus } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useOffline } from "@/hooks/use-offline"

export function OfflineTransactions() {
  const { user } = useAuth()
  const { isOnline, pendingCount, syncPendingData, getPendingTransactions, getPendingUpdates, getPendingDeletes } = useOffline()
  const [pendingData, setPendingData] = useState({
    transactions: [],
    updates: [],
    deletes: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadPendingData()
    }
  }, [user, pendingCount])

  const loadPendingData = async () => {
    if (!user) return

    setLoading(true)
    try {
      const [transactions, updates, deletes] = await Promise.all([
        getPendingTransactions(user.uid),
        getPendingUpdates(user.uid),
        getPendingDeletes(user.uid)
      ])

      setPendingData({
        transactions,
        updates,
        deletes
      })
    } catch (error) {
      console.error('Failed to load pending data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'expense':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'income':
        return <Plus className="w-4 h-4 text-green-500" />
      case 'installment':
        return <Clock className="w-4 h-4 text-blue-500" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'expense':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'income':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'installment':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  if (!user || pendingCount === 0) return null

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Offline Transactions ({pendingCount})
        </CardTitle>
        <CardDescription>
          {isOnline 
            ? "These transactions are waiting to be synced to the server."
            : "These transactions will be synced when you're back online."
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground mt-2">Loading pending data...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Pending Transactions */}
            {pendingData.transactions.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  New Transactions ({pendingData.transactions.length})
                </h4>
                <div className="space-y-2">
                  {pendingData.transactions.map((transaction: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(transaction.type)}
                        <div>
                          <p className="font-medium">{transaction.description || transaction.title || 'Untitled'}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(transaction.timestamp)}
                          </p>
                        </div>
                      </div>
                      <Badge className={getTypeColor(transaction.type)}>
                        {transaction.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pending Updates */}
            {pendingData.updates.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Updates ({pendingData.updates.length})
                </h4>
                <div className="space-y-2">
                  {pendingData.updates.map((update: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(update.type)}
                        <div>
                          <p className="font-medium">Update: {update.description || update.title || 'Untitled'}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(update.timestamp)}
                          </p>
                        </div>
                      </div>
                      <Badge className={getTypeColor(update.type)}>
                        {update.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pending Deletes */}
            {pendingData.deletes.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Deletions ({pendingData.deletes.length})
                </h4>
                <div className="space-y-2">
                  {pendingData.deletes.map((deleteItem: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(deleteItem.type)}
                        <div>
                          <p className="font-medium">Delete: {deleteItem.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(deleteItem.timestamp)}
                          </p>
                        </div>
                      </div>
                      <Badge className={getTypeColor(deleteItem.type)}>
                        {deleteItem.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sync Button */}
            {isOnline && pendingCount > 0 && (
              <div className="pt-4 border-t">
                <Button 
                  onClick={() => syncPendingData(user.uid)} 
                  className="w-full"
                  variant="outline"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Sync All Pending Data
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

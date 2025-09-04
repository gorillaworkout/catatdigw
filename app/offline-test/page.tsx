"use client"

import { NetworkStatus } from "@/components/network-status"
import { OfflineTransactions } from "@/components/offline-transactions"
import { OfflineExpenseForm } from "@/components/offline-expense-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff, Database, Clock, CheckCircle } from "lucide-react"

export default function OfflineTestPage() {
  return (
    <div className="min-h-screen bg-background">
      <NetworkStatus />
      
      <div className="pt-20 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Offline Functionality Test</h1>
            <p className="text-muted-foreground">
              Test offline data storage, sync, and network detection
            </p>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Wifi className="w-5 h-5" />
                  Network Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm">Online</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Turn off internet to test offline mode
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Database className="w-5 h-5" />
                  Offline Storage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">IndexedDB Ready</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Data will be stored locally when offline
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="w-5 h-5" />
                  Background Sync
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Service Worker Active</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Auto-sync when connection restored
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Offline Transactions */}
          <OfflineTransactions />

          {/* Test Form */}
          <OfflineExpenseForm />

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>How to Test Offline Functionality</CardTitle>
              <CardDescription>
                Follow these steps to test the offline features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5">1</Badge>
                  <div>
                    <p className="font-medium">Turn off your internet connection</p>
                    <p className="text-sm text-muted-foreground">
                      Disconnect WiFi or turn off mobile data
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5">2</Badge>
                  <div>
                    <p className="font-medium">Add a new expense</p>
                    <p className="text-sm text-muted-foreground">
                      Use the form above to add an expense while offline
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5">3</Badge>
                  <div>
                    <p className="font-medium">Check pending transactions</p>
                    <p className="text-sm text-muted-foreground">
                      The expense should appear in the "Offline Transactions" section
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5">4</Badge>
                  <div>
                    <p className="font-medium">Turn internet back on</p>
                    <p className="text-sm text-muted-foreground">
                      Reconnect to WiFi or turn on mobile data
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5">5</Badge>
                  <div>
                    <p className="font-medium">Watch auto-sync</p>
                    <p className="text-sm text-muted-foreground">
                      The pending transaction should automatically sync to the server
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Offline Features</CardTitle>
              <CardDescription>
                What you can do while offline
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-green-600 dark:text-green-400">✅ Available Offline</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Add new expenses</li>
                    <li>• Add new income</li>
                    <li>• Create installments</li>
                    <li>• Edit existing data</li>
                    <li>• Delete transactions</li>
                    <li>• View cached data</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-600 dark:text-blue-400">🔄 Auto-Sync Features</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Background sync when online</li>
                    <li>• Retry failed operations</li>
                    <li>• Conflict resolution</li>
                    <li>• Progress indicators</li>
                    <li>• Error handling</li>
                    <li>• Data integrity checks</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <a 
              href="/" 
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

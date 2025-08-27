"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Trash2, CheckCircle, AlertTriangle, Users, Database } from "lucide-react"
import { cleanupAllDuplicateData, getAllUsersWithSubscriptions } from "@/lib/firestore"
import { useAuth } from "@/hooks/use-auth"
import { useRole } from "@/hooks/use-role"

export function AdminDataCleanup() {
  const { user } = useAuth()
  const { isAdmin } = useRole()
  const [isLoading, setIsLoading] = useState(false)
  const [users, setUsers] = useState<any[]>([])
  const [result, setResult] = useState<{
    type: "success" | "error" | "info"
    message: string
  } | null>(null)

  const handleLoadUsers = async () => {
    if (!user?.uid) {
      setResult({
        type: "error",
        message: "Anda harus login terlebih dahulu"
      })
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      const allUsers = await getAllUsersWithSubscriptions()
      setUsers(allUsers)
      setResult({
        type: "success",
        message: `Berhasil memuat ${allUsers.length} user`
      })
    } catch (error) {
      console.error("Error loading users:", error)
      setResult({
        type: "error",
        message: `Gagal memuat data user: ${error instanceof Error ? error.message : "Unknown error"}`
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCleanupAllUsers = async () => {
    if (!user?.uid) {
      setResult({
        type: "error",
        message: "Anda harus login terlebih dahulu"
      })
      return
    }

    if (users.length === 0) {
      setResult({
        type: "error",
        message: "Harap muat data user terlebih dahulu"
      })
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      let successCount = 0
      let errorCount = 0

      for (const userData of users) {
        try {
          await cleanupAllDuplicateData(userData.userId)
          successCount++
        } catch (error) {
          console.error(`Error cleaning up user ${userData.userId}:`, error)
          errorCount++
        }
      }

      setResult({
        type: successCount > 0 ? "success" : "error",
        message: `Cleanup selesai. Berhasil: ${successCount}, Gagal: ${errorCount}`
      })
    } catch (error) {
      console.error("Error during bulk cleanup:", error)
      setResult({
        type: "error",
        message: `Gagal melakukan cleanup: ${error instanceof Error ? error.message : "Unknown error"}`
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCleanupSpecificUser = async (userId: string, userEmail: string) => {
    if (!user?.uid) {
      setResult({
        type: "error",
        message: "Anda harus login terlebih dahulu"
      })
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      await cleanupAllDuplicateData(userId)
      setResult({
        type: "success",
        message: `Berhasil membersihkan data untuk user: ${userEmail}`
      })
    } catch (error) {
      console.error(`Error cleaning up user ${userId}:`, error)
      setResult({
        type: "error",
        message: `Gagal membersihkan data untuk ${userEmail}: ${error instanceof Error ? error.message : "Unknown error"}`
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Admin Data Cleanup</CardTitle>
          <CardDescription>
            Membersihkan data duplikat untuk semua user
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Anda tidak memiliki akses admin untuk menggunakan fitur ini
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Admin Data Cleanup
        </CardTitle>
        <CardDescription>
          Membersihkan data duplikat (accounts dan categories) untuk semua user dalam sistem
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Peringatan Admin:</strong> Fitur ini akan menghapus data duplikat secara permanen untuk semua user. 
            Pastikan Anda telah membackup data penting sebelum menjalankan cleanup.
          </AlertDescription>
        </Alert>

        <div className="grid gap-3">
          <Button 
            onClick={handleLoadUsers}
            disabled={isLoading}
            className="w-full"
            variant="outline"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memuat Data User...
              </>
            ) : (
              <>
                <Users className="mr-2 h-4 w-4" />
                Muat Data Semua User
              </>
            )}
          </Button>

          <Button 
            onClick={handleCleanupAllUsers}
            disabled={isLoading || users.length === 0}
            className="w-full"
            variant="destructive"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Membersihkan Semua User...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Bersihkan Data Semua User ({users.length})
              </>
            )}
          </Button>
        </div>

        {result && (
          <Alert className={result.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            {result.type === "success" ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={result.type === "success" ? "text-green-800" : "text-red-800"}>
              {result.message}
            </AlertDescription>
          </Alert>
        )}

        {users.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Daftar User ({users.length})</h4>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {users.map((userData) => (
                <div key={userData.userId} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{userData.email}</div>
                    <div className="text-xs text-muted-foreground">
                      {userData.displayName || "No name"} • {userData.role}
                    </div>
                  </div>
                  <Button
                    onClick={() => handleCleanupSpecificUser(userData.userId, userData.email)}
                    disabled={isLoading}
                    size="sm"
                    variant="outline"
                  >
                    {isLoading ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      "Cleanup"
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

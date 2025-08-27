"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Trash2, CheckCircle, AlertTriangle } from "lucide-react"
import { cleanupAllDuplicateData, cleanupDuplicateAccounts, cleanupDuplicateCategories } from "@/lib/firestore"
import { useAuth } from "@/hooks/use-auth"

export function DataCleanup() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    type: "success" | "error" | "info"
    message: string
  } | null>(null)

  const handleCleanupAll = async () => {
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
      await cleanupAllDuplicateData(user.uid)
      setResult({
        type: "success",
        message: "Berhasil membersihkan semua data duplikat (accounts dan categories)"
      })
    } catch (error) {
      console.error("Error during cleanup:", error)
      setResult({
        type: "error",
        message: `Gagal membersihkan data: ${error instanceof Error ? error.message : "Unknown error"}`
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCleanupAccounts = async () => {
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
      await cleanupDuplicateAccounts(user.uid)
      setResult({
        type: "success",
        message: "Berhasil membersihkan data duplikat accounts"
      })
    } catch (error) {
      console.error("Error during accounts cleanup:", error)
      setResult({
        type: "error",
        message: `Gagal membersihkan accounts: ${error instanceof Error ? error.message : "Unknown error"}`
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCleanupCategories = async () => {
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
      await cleanupDuplicateCategories(user.uid)
      setResult({
        type: "success",
        message: "Berhasil membersihkan data duplikat categories"
      })
    } catch (error) {
      console.error("Error during categories cleanup:", error)
      setResult({
        type: "error",
        message: `Gagal membersihkan categories: ${error instanceof Error ? error.message : "Unknown error"}`
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Data Cleanup</CardTitle>
          <CardDescription>
            Membersihkan data duplikat dalam aplikasi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Anda harus login terlebih dahulu untuk menggunakan fitur ini
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
          <Trash2 className="h-5 w-5" />
          Data Cleanup
        </CardTitle>
        <CardDescription>
          Membersihkan data duplikat (accounts dan categories) yang mungkin terjadi saat registrasi
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Peringatan:</strong> Fitur ini akan menghapus data duplikat secara permanen. 
            Pastikan Anda telah membackup data penting sebelum menjalankan cleanup.
          </AlertDescription>
        </Alert>

        <div className="grid gap-3">
          <Button 
            onClick={handleCleanupAll}
            disabled={isLoading}
            className="w-full"
            variant="destructive"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Membersihkan Semua Data...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Bersihkan Semua Data Duplikat
              </>
            )}
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button 
              onClick={handleCleanupAccounts}
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Bersihkan Accounts"
              )}
            </Button>

            <Button 
              onClick={handleCleanupCategories}
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Bersihkan Categories"
              )}
            </Button>
          </div>
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
      </CardContent>
    </Card>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { 
  getUserSubscription, 
  adminUpdateUserSubscription,
  adminExpireUserSubscription,
  adminExtendUserSubscription,
  getAllUsersWithSubscriptions,
  updateUserRole,
  type SubscriptionStatus,
  type UserRole
} from "@/lib/firestore"
import { Calendar, AlertTriangle, CheckCircle, Clock, User, Search } from "lucide-react"

interface UserSubscription {
  userId: string
  email: string
  displayName: string
  photoURL: string
  role: UserRole
  createdAt: any
  subscription: any
  isActive: boolean
  remainingDays: number
}

export function AdminSubscriptionManager() {
  const [users, setUsers] = useState<UserSubscription[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<UserSubscription | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [action, setAction] = useState<"extend" | "expire" | "update" | "role">("extend")
  const [daysToAdd, setDaysToAdd] = useState("30")
  const [updateData, setUpdateData] = useState({
    status: "active" as SubscriptionStatus,
    isActive: true,
    endDate: new Date().toISOString().split("T")[0]
  })
  const [newRole, setNewRole] = useState<UserRole>("user")
  
  const { toast } = useToast()
  const { user } = useAuth()

  const loadUserSubscriptions = async () => {
    setLoading(true)
    try {
      const userSubscriptions = await getAllUsersWithSubscriptions()
      setUsers(userSubscriptions)
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat data subscription user",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUserSubscriptions()
  }, [])

  const handleAction = async () => {
    if (!selectedUser || !user) return

    try {
      setLoading(true)
      
              switch (action) {
          case "extend":
            await adminExtendUserSubscription(user.uid, selectedUser.userId, parseInt(daysToAdd))
            toast({
              title: "Berhasil",
              description: `Subscription user diperpanjang ${daysToAdd} hari`
            })
            break
            
          case "expire":
            await adminExpireUserSubscription(user.uid, selectedUser.userId)
            toast({
              title: "Berhasil",
              description: "Subscription user diakhiri"
            })
            break
            
          case "update":
            await adminUpdateUserSubscription(user.uid, selectedUser.userId, {
              status: updateData.status,
              isActive: updateData.isActive,
              endDate: new Date(updateData.endDate)
            })
            toast({
              title: "Berhasil",
              description: "Data subscription user diperbarui"
            })
            break
            
          case "role":
            await updateUserRole(user.uid, selectedUser.userId, newRole)
            toast({
              title: "Berhasil",
              description: `Role user diubah menjadi ${newRole}`
            })
            break
        }
      
      setIsDialogOpen(false)
      loadUserSubscriptions() // Reload data
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Gagal melakukan aksi",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user => 
    user.userId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (user: UserSubscription) => {
    if (!user.isActive) {
      return <Badge variant="destructive">Berakhir</Badge>
    }
    if (user.remainingDays <= 3) {
      return <Badge variant="secondary">Hampir Habis</Badge>
    }
    return <Badge variant="default">Aktif</Badge>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Admin Subscription Manager</h2>
        <p className="text-muted-foreground">Kelola subscription semua user</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Cari User
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Cari berdasarkan user ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Memuat data...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">Tidak ada user ditemukan</p>
            </CardContent>
          </Card>
        ) : (
          filteredUsers.map((user) => (
            <Card key={user.userId}>
              <CardHeader>
                <div className="flex items-center justify-between">
                                     <div className="flex items-center gap-3">
                     <div className="bg-primary/10 p-2 rounded-lg">
                       <User className="h-4 w-4 text-primary" />
                     </div>
                     <div>
                       <CardTitle className="text-lg">{user.displayName || user.userId}</CardTitle>
                       <CardDescription>
                         {user.email}
                       </CardDescription>
                     </div>
                   </div>
                  {getStatusBadge(user)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Status</Label>
                    <p className="font-medium">{user.subscription?.status || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Sisa Waktu</Label>
                    <p className="font-medium">{user.remainingDays} hari</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Berakhir</Label>
                    <p className="font-medium">
                      {user.subscription?.endDate?.toDate().toLocaleDateString("id-ID") || "N/A"}
                    </p>
                  </div>
                </div>
                
                                 <div className="flex gap-2">
                   <Dialog open={isDialogOpen && selectedUser?.userId === user.userId} onOpenChange={setIsDialogOpen}>
                     <DialogTrigger asChild>
                       <Button 
                         size="sm" 
                         onClick={() => {
                           setSelectedUser(user)
                           setAction("extend")
                         }}
                       >
                         <Calendar className="h-4 w-4 mr-2" />
                         Perpanjang
                       </Button>
                     </DialogTrigger>
                     <DialogContent>
                       <DialogHeader>
                         <DialogTitle>Perpanjang Subscription</DialogTitle>
                         <DialogDescription>
                           Perpanjang subscription untuk user {user.userId}
                         </DialogDescription>
                       </DialogHeader>
                       <div className="space-y-4">
                         <div>
                           <Label htmlFor="days">Jumlah Hari</Label>
                           <Input
                             id="days"
                             type="number"
                             min="1"
                             value={daysToAdd}
                             onChange={(e) => setDaysToAdd(e.target.value)}
                             placeholder="30"
                           />
                         </div>
                         <Button 
                           onClick={handleAction} 
                           disabled={isExtending}
                           className="w-full"
                         >
                           {isExtending ? "Memproses..." : "Perpanjang"}
                         </Button>
                       </div>
                     </DialogContent>
                   </Dialog>

                                      <Button 
                     size="sm"
                     variant="outline"
                     onClick={async () => {
                       if (confirm(`Yakin ingin mengubah role user ${user.userId} dari ${user.role} menjadi ${user.role === "admin" ? "user" : "admin"}?`)) {
                         setSelectedUser(user)
                         try {
                           await updateUserRole(user.uid, user.userId, user.role === "admin" ? "user" : "admin")
                           toast({
                             title: "Berhasil",
                             description: `Role user diubah menjadi ${user.role === "admin" ? "user" : "admin"}`
                           })
                           loadUserSubscriptions()
                         } catch (error) {
                           toast({
                             title: "Error",
                             description: "Gagal mengubah role user",
                             variant: "destructive"
                           })
                         }
                       }
                     }}
                   >
                     <User className="h-4 w-4 mr-2" />
                     {user.role === "admin" ? "Jadikan User" : "Jadikan Admin"}
                   </Button>

                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={async () => {
                      if (confirm(`Yakin ingin mengakhiri subscription user ${user.userId}?`)) {
                        setSelectedUser(user)
                        try {
                          await adminExpireUserSubscription(user.userId, user.userId)
                          toast({
                            title: "Berhasil",
                            description: "Subscription user diakhiri"
                          })
                          loadUserSubscriptions()
                        } catch (error) {
                          toast({
                            title: "Error",
                            description: "Gagal mengakhiri subscription",
                            variant: "destructive"
                          })
                        }
                      }
                    }}
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Akhiri
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

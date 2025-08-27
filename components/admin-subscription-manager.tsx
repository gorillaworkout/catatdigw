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
  getAllUsersDebug,
  updateUserRole,
  type SubscriptionStatus,
  type UserRole
} from "@/lib/firestore"
import { Calendar, AlertTriangle, CheckCircle, Clock, User, Search, Edit, Crown, Shield, Users, TrendingUp, AlertCircle } from "lucide-react"

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
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "expired" | "admin">("all")
  
  const { toast } = useToast()
  const { user: currentUser } = useAuth()

  const loadUserSubscriptions = async () => {
    setLoading(true)
    try {
      console.log("Loading user subscriptions...")
      const userSubscriptions = await getAllUsersWithSubscriptions()
      console.log("Loaded user subscriptions:", userSubscriptions)
      setUsers(userSubscriptions)
    } catch (error) {
      console.error("Error loading user subscriptions:", error)
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
    if (!selectedUser || !currentUser) return

    try {
      setLoading(true)
      
      switch (action) {
        case "extend":
          await adminExtendUserSubscription(currentUser.uid, selectedUser.userId, parseInt(daysToAdd))
          toast({
            title: "Berhasil",
            description: `Subscription user diperpanjang ${daysToAdd} hari`
          })
          break
          
        case "expire":
          await adminExpireUserSubscription(currentUser.uid, selectedUser.userId)
          toast({
            title: "Berhasil",
            description: "Subscription user diakhiri"
          })
          break
          
        case "update":
          await adminUpdateUserSubscription(currentUser.uid, selectedUser.userId, {
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
          await updateUserRole(currentUser.uid, selectedUser.userId, newRole)
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

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.userId.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (!matchesSearch) return false
    
    switch (filterStatus) {
      case "active":
        return user.isActive && user.remainingDays > 0
      case "expired":
        return !user.isActive || user.remainingDays <= 0
      case "admin":
        return user.role === "admin"
      default:
        return true
    }
  })

  // Debug logging
  useEffect(() => {
    console.log("Users state:", users)
    console.log("Filtered users:", filteredUsers)
    console.log("Search term:", searchTerm)
    console.log("Filter status:", filterStatus)
  }, [users, filteredUsers, searchTerm, filterStatus])

  // Calculate statistics
  const stats = {
    total: users.length,
    active: users.filter(u => u.isActive && u.remainingDays > 0).length,
    expired: users.filter(u => !u.isActive || u.remainingDays <= 0).length,
    admin: users.filter(u => u.role === "admin").length,
    expiringSoon: users.filter(u => u.remainingDays <= 3 && u.remainingDays > 0).length
  }

  const getStatusBadge = (user: UserSubscription) => {
    if (user.role === "admin") {
      return <Badge variant="default" className="bg-purple-500"><Crown className="h-3 w-3 mr-1" />Admin</Badge>
    }
    if (!user.isActive || user.remainingDays <= 0) {
      return <Badge variant="destructive">Berakhir</Badge>
    }
    if (user.remainingDays <= 3) {
      return <Badge variant="secondary">Hampir Habis</Badge>
    }
    return <Badge variant="default" className="bg-green-500">Aktif</Badge>
  }

  const getRemainingDaysText = (days: number) => {
    if (days <= 0) return "Berakhir"
    if (days === 1) return "1 hari"
    return `${days} hari`
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Admin Panel - Kelola User</h2>
        <p className="text-muted-foreground">Kelola subscription dan status semua user</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total User</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscription Aktif</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscription Berakhir</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin</CardTitle>
            <Crown className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.admin}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hampir Habis</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.expiringSoon}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Cari User
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Cari berdasarkan nama, email, atau user ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Filter Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua User</SelectItem>
                <SelectItem value="active">Subscription Aktif</SelectItem>
                <SelectItem value="expired">Subscription Berakhir</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>


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
                      <CardTitle className="text-lg">{user.displayName || "User Tanpa Nama"}</CardTitle>
                      <CardDescription>
                        {user.email} • ID: {user.userId}
                      </CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(user)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Role</Label>
                    <p className="font-medium capitalize">{user.role}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Status Subscription</Label>
                    <p className="font-medium">{user.subscription?.status || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Sisa Waktu</Label>
                    <p className="font-medium">{getRemainingDaysText(user.remainingDays)}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Berakhir</Label>
                    <p className="font-medium">
                      {user.subscription?.endDate?.toDate().toLocaleDateString("id-ID") || "N/A"}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {/* Perpanjang Subscription */}
                  <Dialog open={isDialogOpen && selectedUser?.userId === user.userId && action === "extend"} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm" 
                        onClick={() => {
                          setSelectedUser(user)
                          setAction("extend")
                          setDaysToAdd("30")
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
                          Perpanjang subscription untuk {user.displayName || user.email}
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
                          disabled={loading}
                          className="w-full"
                        >
                          {loading ? "Memproses..." : "Perpanjang"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Update Subscription */}
                  <Dialog open={isDialogOpen && selectedUser?.userId === user.userId && action === "update"} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedUser(user)
                          setAction("update")
                          setUpdateData({
                            status: user.subscription?.status || "active",
                            isActive: user.isActive,
                            endDate: user.subscription?.endDate?.toDate().toISOString().split("T")[0] || new Date().toISOString().split("T")[0]
                          })
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Update
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Update Subscription</DialogTitle>
                        <DialogDescription>
                          Update data subscription untuk {user.displayName || user.email}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="status">Status</Label>
                          <Select value={updateData.status} onValueChange={(value: SubscriptionStatus) => setUpdateData({...updateData, status: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Aktif</SelectItem>
                              <SelectItem value="expired">Berakhir</SelectItem>
                              <SelectItem value="cancelled">Dibatalkan</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="endDate">Tanggal Berakhir</Label>
                          <Input
                            id="endDate"
                            type="date"
                            value={updateData.endDate}
                            onChange={(e) => setUpdateData({...updateData, endDate: e.target.value})}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="isActive"
                            checked={updateData.isActive}
                            onChange={(e) => setUpdateData({...updateData, isActive: e.target.checked})}
                          />
                          <Label htmlFor="isActive">Subscription Aktif</Label>
                        </div>
                        <Button 
                          onClick={handleAction} 
                          disabled={loading}
                          className="w-full"
                        >
                          {loading ? "Memproses..." : "Update"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Update Role */}
                  <Dialog open={isDialogOpen && selectedUser?.userId === user.userId && action === "role"} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedUser(user)
                          setAction("role")
                          setNewRole(user.role === "admin" ? "user" : "admin")
                        }}
                      >
                        <Crown className="h-4 w-4 mr-2" />
                        {user.role === "admin" ? "Jadikan User" : "Jadikan Admin"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Update Role User</DialogTitle>
                        <DialogDescription>
                          Ubah role untuk {user.displayName || user.email}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="role">Role Baru</Label>
                          <Select value={newRole} onValueChange={(value: UserRole) => setNewRole(value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button 
                          onClick={handleAction} 
                          disabled={loading}
                          className="w-full"
                        >
                          {loading ? "Memproses..." : "Update Role"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Akhiri Subscription */}
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={async () => {
                      if (confirm(`Yakin ingin mengakhiri subscription untuk ${user.displayName || user.email}?`)) {
                        setSelectedUser(user)
                        setAction("expire")
                        try {
                          await adminExpireUserSubscription(currentUser?.uid || "admin", user.userId)
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

      <div className="text-center text-sm text-muted-foreground">
        Total: {filteredUsers.length} user ditemukan dari {stats.total} user
      </div>
    </div>
  )
}

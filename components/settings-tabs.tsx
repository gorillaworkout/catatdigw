"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AccountManagement } from "@/components/account-management"
import { ProfileSettings } from "@/components/profile-settings"
import { AppPreferences } from "@/components/app-preferences"
import { SecuritySettings } from "@/components/security-settings"
import { CategoryManagement } from "@/components/category-management"
import { DataManagement } from "@/components/data-management"

export function SettingsTabs() {
  return (
    <Tabs defaultValue="accounts" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 bg-muted">
        <TabsTrigger value="accounts" className="text-sm">
          Rekening
        </TabsTrigger>
        {/* <TabsTrigger value="profile" className="text-sm">
          Profil
        </TabsTrigger> */}
        {/* <TabsTrigger value="preferences" className="text-sm">
          Preferensi
        </TabsTrigger> */}
        {/* <TabsTrigger value="security" className="text-sm">
          Keamanan
        </TabsTrigger> */}
        <TabsTrigger value="categories" className="text-sm">
          Kategori
        </TabsTrigger>
        <TabsTrigger value="data" className="text-sm">
          Data
        </TabsTrigger>
      </TabsList>

      <TabsContent value="accounts" className="space-y-6">
        <AccountManagement />
      </TabsContent>

      <TabsContent value="profile" className="space-y-6">
        <ProfileSettings />
      </TabsContent>

      <TabsContent value="preferences" className="space-y-6">
        <AppPreferences />
      </TabsContent>

      <TabsContent value="security" className="space-y-6">
        <SecuritySettings />
      </TabsContent>

      <TabsContent value="categories" className="space-y-6">
        <CategoryManagement />
      </TabsContent>

      <TabsContent value="data" className="space-y-6">
        <DataManagement />
      </TabsContent>
    </Tabs>
  )
}

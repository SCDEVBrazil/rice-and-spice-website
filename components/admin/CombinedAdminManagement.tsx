'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Shield, Key, Users } from 'lucide-react'
import { InviteCodeManager } from '@/components/admin/InviteCodeManager'
import { AdminUserManagement } from '@/components/admin/AdminUserManagement'

interface CombinedAdminManagementProps {
  onMessage: (message: string, type: 'success' | 'error') => void
}

export function CombinedAdminManagement({ onMessage }: CombinedAdminManagementProps) {
  const [activeTab, setActiveTab] = useState('users')

  // Handle tab switching from URL hash
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#invites') {
        setActiveTab('invites')
        window.location.hash = '' // Clear hash
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    handleHashChange() // Check on mount

    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-yellow-400 mb-2" 
            style={{ fontFamily: 'var(--font-cinzel-decorative), serif', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
          Admin Management
        </h2>
        <p className="text-amber-100">Manage administrator accounts and invite codes</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 bg-yellow-900/40 backdrop-blur-sm border-2 border-yellow-600/30">
          <TabsTrigger 
            value="users" 
            className="data-[state=active]:bg-yellow-600 data-[state=active]:text-amber-900 text-amber-100"
          >
            <Users className="w-4 h-4 mr-2" />
            Admin Users
          </TabsTrigger>
          <TabsTrigger 
            value="invites" 
            className="data-[state=active]:bg-yellow-600 data-[state=active]:text-amber-900 text-amber-100"
          >
            <Key className="w-4 h-4 mr-2" />
            Invite Codes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <AdminUserManagement 
            onMessage={onMessage} 
            onSwitchToInvites={() => setActiveTab('invites')}
          />
        </TabsContent>

        <TabsContent value="invites">
          <InviteCodeManager onMessage={onMessage} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
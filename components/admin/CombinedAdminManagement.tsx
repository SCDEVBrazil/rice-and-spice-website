'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Shield, Key, Users, ChevronDown } from 'lucide-react'
import { InviteCodeManager } from '@/components/admin/InviteCodeManager'
import { AdminUserManagement } from '@/components/admin/AdminUserManagement'

interface CombinedAdminManagementProps {
  onMessage: (message: string, type: 'success' | 'error') => void
}

export function CombinedAdminManagement({ onMessage }: CombinedAdminManagementProps) {
  const [activeTab, setActiveTab] = useState('users')
  const [mobileTabOpen, setMobileTabOpen] = useState(false)

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

  // Tab configuration
  const tabs = [
    { key: 'users', label: 'Admin Users', icon: Users },
    { key: 'invites', label: 'Invite Codes', icon: Key }
  ]

  // Get current tab details for mobile header
  const currentTab = tabs.find(tab => tab.key === activeTab)

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey)
    setMobileTabOpen(false) // Close mobile dropdown when tab changes
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Mobile Responsive */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-2" 
            style={{ fontFamily: 'var(--font-cinzel-decorative), serif', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
          Admin Management
        </h2>
        <p className="text-amber-100 text-sm sm:text-base">Manage administrator accounts and invite codes</p>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="block sm:hidden">
        <div className="bg-yellow-900/40 backdrop-blur-sm rounded-lg border-2 border-yellow-600/30 mb-4">
          <button
            onClick={() => setMobileTabOpen(!mobileTabOpen)}
            className="w-full flex items-center justify-between p-4 text-amber-100"
          >
            <div className="flex items-center space-x-3">
              {currentTab && <currentTab.icon className="w-5 h-5 text-yellow-400" />}
              <span className="font-medium text-yellow-400">
                {currentTab?.label || 'Select Tab'}
              </span>
            </div>
            <ChevronDown className={`w-5 h-5 text-yellow-400 transition-transform ${mobileTabOpen ? 'rotate-180' : ''}`} />
          </button>

          {mobileTabOpen && (
            <div className="border-t border-yellow-600/30">
              {tabs.map((tab) => {
                const Icon = tab.icon
                
                return (
                  <button
                    key={tab.key}
                    onClick={() => handleTabChange(tab.key)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-all duration-200 ${
                      activeTab === tab.key
                        ? 'bg-yellow-600 text-amber-900'
                        : 'text-amber-100 hover:bg-yellow-700/50'
                    } ${tab.key !== tabs[tabs.length - 1].key ? 'border-b border-yellow-600/20' : ''}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Desktop/Tablet Tab Navigation */}
      <div className="hidden sm:block">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 bg-yellow-900/40 backdrop-blur-sm border-2 border-yellow-600/30 p-1">
            <TabsTrigger 
              value="users" 
              className="data-[state=active]:bg-yellow-600 data-[state=active]:text-amber-900 text-amber-100 font-medium py-3"
            >
              <Users className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Admin Users</span>
              <span className="md:hidden">Users</span>
            </TabsTrigger>
            <TabsTrigger 
              value="invites" 
              className="data-[state=active]:bg-yellow-600 data-[state=active]:text-amber-900 text-amber-100 font-medium py-3"
            >
              <Key className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Invite Codes</span>
              <span className="md:hidden">Invites</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-6">
            <AdminUserManagement 
              onMessage={onMessage} 
              onSwitchToInvites={() => setActiveTab('invites')}
            />
          </TabsContent>

          <TabsContent value="invites" className="mt-6">
            <InviteCodeManager onMessage={onMessage} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Mobile Content (outside Tabs component) */}
      <div className="block sm:hidden">
        {activeTab === 'users' && (
          <AdminUserManagement 
            onMessage={onMessage} 
            onSwitchToInvites={() => handleTabChange('invites')}
          />
        )}
        {activeTab === 'invites' && (
          <InviteCodeManager onMessage={onMessage} />
        )}
      </div>
    </div>
  )
}
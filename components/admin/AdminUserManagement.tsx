'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  User, 
  Crown, 
  Shield, 
  Calendar, 
  Mail, 
  Clock,
  Trash2,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Key,
  Loader2
} from 'lucide-react'
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { FirebaseAuthManager, AdminUser } from '@/lib/admin/firebase-auth-manager'

interface AdminUserManagementProps {
  onMessage: (message: string, type: 'success' | 'error') => void
  onSwitchToInvites?: () => void
}

export function AdminUserManagement({ onMessage, onSwitchToInvites }: AdminUserManagementProps) {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null)
  const [deletingUsers, setDeletingUsers] = useState<Set<string>>(new Set())

  useEffect(() => {
    loadAdminUsers()
    getCurrentUser()
  }, [])

  const getCurrentUser = async () => {
    try {
      const user = await FirebaseAuthManager.getCurrentAdmin()
      setCurrentUser(user)
    } catch (error) {
      console.error('Error getting current user:', error)
    }
  }

  const loadAdminUsers = async () => {
    setIsLoading(true)
    try {
      const querySnapshot = await getDocs(collection(db, 'admin-users'))
      const users: AdminUser[] = []
      
      querySnapshot.forEach((doc) => {
        users.push({ ...doc.data(), uid: doc.id } as AdminUser)
      })
      
      // Sort by creation date (newest first)
      users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      setAdminUsers(users)
    } catch (error) {
      console.error('Error loading admin users:', error)
      onMessage('Failed to load admin users', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const updateUserRole = async (uid: string, newRole: 'owner' | 'manager') => {
    try {
      await updateDoc(doc(db, 'admin-users', uid), { role: newRole })
      onMessage(`User role updated to ${newRole}`, 'success')
      await loadAdminUsers() // Refresh list
    } catch (error) {
      console.error('Error updating user role:', error)
      onMessage('Failed to update user role', 'error')
    }
  }

  // ENHANCED: Complete user deletion with double confirmation and loading state
  const deleteUser = async (uid: string, email: string) => {
    // Prevent deleting yourself
    if (currentUser && uid === currentUser.uid) {
      onMessage('You cannot delete your own account', 'error')
      return
    }

    // First confirmation
    if (!confirm(`⚠️ DELETE ADMIN ACCOUNT ⚠️\n\nYou are about to permanently delete the admin account for:\n${email}\n\nThis will:\n• Remove all admin access\n• Delete the Firebase Authentication account\n• Cannot be undone\n\nAre you absolutely sure?`)) {
      return
    }

    // Second confirmation for extra safety
    if (!confirm(`🚨 FINAL CONFIRMATION 🚨\n\nType the email address to confirm deletion:\n\nDeleting: ${email}\n\nThis action is PERMANENT and cannot be undone.\n\nClick OK to proceed with deletion.`)) {
      return
    }

    // Set loading state for this specific user
    setDeletingUsers(prev => new Set(prev).add(uid))

    try {
      console.log(`🗑️ Starting complete deletion process for: ${email}`)
      
      // Use the enhanced deleteAdminUser method that handles both admin collection and Firebase Auth
      const result = await FirebaseAuthManager.deleteAdminUser(uid, email)
      
      if (result.success) {
        onMessage(result.message, 'success')
        console.log(`✅ Complete deletion successful for: ${email}`)
      } else {
        onMessage(result.message, 'error')
        console.log(`❌ Deletion failed for: ${email}`)
      }
      
      // Refresh the user list to reflect changes
      await loadAdminUsers()
      
    } catch (error) {
      console.error('Error during complete user deletion:', error)
      onMessage('Failed to delete user account completely. Please try again.', 'error')
    } finally {
      // Remove loading state for this user
      setDeletingUsers(prev => {
        const newSet = new Set(prev)
        newSet.delete(uid)
        return newSet
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRoleBadge = (role: 'owner' | 'manager') => {
    if (role === 'owner') {
      return <Badge className="bg-yellow-600 text-yellow-100"><Crown className="w-3 h-3 mr-1" />Owner</Badge>
    } else {
      return <Badge className="bg-blue-600 text-blue-100"><Shield className="w-3 h-3 mr-1" />Manager</Badge>
    }
  }

  const ownerCount = adminUsers.filter(user => user.role === 'owner').length
  const managerCount = adminUsers.filter(user => user.role === 'manager').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-yellow-400 mb-2" 
              style={{ fontFamily: 'var(--font-cinzel-decorative), serif', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            Admin User Management
          </h2>
          <p className="text-amber-100">Manage admin accounts and permissions</p>
        </div>
        
        <Button
          onClick={loadAdminUsers}
          variant="outline"
          className="border-2 border-yellow-600/70 text-yellow-400 hover:bg-yellow-600/30 bg-yellow-900/40 backdrop-blur-sm"
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Enhanced Security Warning */}
      <Alert className="border-red-500 bg-red-900/50">
        <AlertTriangle className="h-4 w-4 text-red-400" />
        <AlertDescription className="text-red-200">
          <strong>Complete Deletion:</strong> When you delete an admin user, they will be permanently removed from both the admin system AND Firebase Authentication. This action cannot be undone.
        </AlertDescription>
      </Alert>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-yellow-900/50 backdrop-blur-sm border-2 border-yellow-600/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-100">Total Admins</p>
                <p className="text-2xl font-bold text-yellow-400">{adminUsers.length}</p>
              </div>
              <Users className="w-8 h-8 text-yellow-400 opacity-70" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-900/50 backdrop-blur-sm border-2 border-yellow-600/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-100">Owners</p>
                <p className="text-2xl font-bold text-yellow-400">{ownerCount}</p>
              </div>
              <Crown className="w-8 h-8 text-yellow-400 opacity-70" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-900/50 backdrop-blur-sm border-2 border-blue-600/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-100">Managers</p>
                <p className="text-2xl font-bold text-blue-400">{managerCount}</p>
              </div>
              <Shield className="w-8 h-8 text-blue-400 opacity-70" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Users List */}
      <Card className="bg-yellow-900/50 backdrop-blur-sm border-2 border-yellow-600/50">
        <CardHeader>
          <CardTitle className="text-yellow-400">Admin Accounts</CardTitle>
          <CardDescription className="text-amber-100">
            All administrator accounts and their details
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-yellow-600/20 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : adminUsers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-yellow-400 mx-auto mb-4 opacity-50" />
              <p className="text-amber-100">No admin users found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {adminUsers.map((user) => (
                <div key={user.uid} className="flex items-center justify-between p-6 bg-yellow-600/20 rounded-lg border border-yellow-600/30">
                  <div className="flex items-center space-x-4">
                    <User className="w-12 h-12 text-yellow-400 bg-yellow-600/30 p-3 rounded-full" />
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <p className="text-lg font-semibold text-amber-100">{user.email}</p>
                        {getRoleBadge(user.role)}
                        {user.uid === currentUser?.uid && (
                          <Badge variant="outline" className="border-green-500 text-green-400">You</Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-amber-300">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Created: {formatDate(user.createdAt)}
                        </span>
                        {user.lastLogin && (
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            Last login: {formatDate(user.lastLogin)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {/* Role Change Button (owners only, not for themselves) */}
                    {currentUser?.role === 'owner' && user.uid !== currentUser.uid && (
                      <Button
                        onClick={() => updateUserRole(user.uid, user.role === 'owner' ? 'manager' : 'owner')}
                        size="sm"
                        className={user.role === 'owner' 
                          ? "bg-blue-600 hover:bg-blue-700 text-white" 
                          : "bg-yellow-600 hover:bg-yellow-700 text-amber-900"
                        }
                      >
                        {user.role === 'owner' ? (
                          <>
                            <Shield className="w-3 h-3 mr-1" />
                            Make Manager
                          </>
                        ) : (
                          <>
                            <Crown className="w-3 h-3 mr-1" />
                            Make Owner
                          </>
                        )}
                      </Button>
                    )}
                    
                    {/* Delete Button (only if not self and current user is owner) */}
                    {currentUser && 
                     user.uid !== currentUser.uid && 
                     currentUser.role === 'owner' && (
                      <Button
                        onClick={() => deleteUser(user.uid, user.email)}
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white"
                        disabled={deletingUsers.has(user.uid)}
                      >
                        {deletingUsers.has(user.uid) ? (
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        ) : (
                          <Trash2 className="w-3 h-3 mr-1" />
                        )}
                        {deletingUsers.has(user.uid) ? 'Deleting...' : 'Delete'}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add New Admin User CTA */}
      <Card className="bg-yellow-900/50 backdrop-blur-sm border-2 border-yellow-600/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-yellow-400 mb-1">Add New Admin User</h3>
              <p className="text-amber-100 text-sm">Create invite codes for new administrators</p>
            </div>
            <Button
              onClick={onSwitchToInvites}
              className="bg-yellow-600 hover:bg-yellow-700 text-amber-900 font-medium"
            >
              <Key className="w-4 h-4 mr-2" />
              Manage Invites
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Alert className="border-blue-500 bg-blue-900/50">
        <CheckCircle className="h-4 w-4 text-blue-400" />
        <AlertDescription className="text-blue-200">
          <strong>Permission Levels:</strong> Owners can manage all admin accounts and have full system access. Managers can manage restaurant content but cannot modify admin accounts.
        </AlertDescription>
      </Alert>
    </div>
  )
}
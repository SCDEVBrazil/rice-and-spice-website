'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { 
  Key, 
  Plus, 
  Copy, 
  Trash2, 
  RefreshCw, 
  CheckCircle, 
  Clock, 
  User,
  Shield,
  Calendar,
  Users,
  X,
  Loader2
} from 'lucide-react'
import { FirebaseAuthManager, InviteCode } from '@/lib/admin/firebase-auth-manager'

interface InviteCodeManagerProps {
  onMessage: (message: string, type: 'success' | 'error') => void
}

export function InviteCodeManager({ onMessage }: InviteCodeManagerProps) {
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentUserEmail, setCurrentUserEmail] = useState('')
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null)
  const [deletingCodes, setDeletingCodes] = useState<Set<string>>(new Set()) // NEW: Track deleting codes

  // Load invite codes on mount
  useEffect(() => {
    loadInviteCodes()
    getCurrentUser()
  }, [])

  const getCurrentUser = async () => {
    try {
      const user = await FirebaseAuthManager.getCurrentAdmin()
      if (user) {
        setCurrentUserEmail(user.email)
      }
    } catch (error) {
      console.error('Error getting current user:', error)
    }
  }

  const loadInviteCodes = async () => {
    setIsLoading(true)
    try {
      const codes = await FirebaseAuthManager.getInviteCodes()
      setInviteCodes(codes)
    } catch (error) {
      console.error('Error loading invite codes:', error)
      onMessage('Failed to load invite codes', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const generateInviteCode = async () => {
    setIsGenerating(true)
    try {
      const result = await FirebaseAuthManager.generateInviteCode(currentUserEmail)
      
      if (result.success) {
        onMessage(`Invite code generated: ${result.code}`, 'success')
        await loadInviteCodes() // Refresh list
      } else {
        onMessage(result.message, 'error')
      }
    } catch (error) {
      console.error('Error generating invite code:', error)
      onMessage('Failed to generate invite code', 'error')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async (code: string, codeId: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCodeId(codeId)
      onMessage('Invite code copied to clipboard!', 'success')
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedCodeId(null)
      }, 2000)
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      onMessage('Failed to copy invite code', 'error')
    }
  }

  // NEW: Delete specific invite code
  const deleteInviteCode = async (codeId: string, code: string) => {
    // Confirmation dialog
    if (!confirm(`Are you sure you want to delete invite code: ${code}?\n\nThis action cannot be undone.`)) {
      return
    }

    // Set loading state for this specific code
    setDeletingCodes(prev => new Set(prev).add(codeId))

    try {
      const result = await FirebaseAuthManager.deleteInviteCode(codeId)
      
      if (result.success) {
        onMessage('Invite code deleted successfully', 'success')
        await loadInviteCodes() // Refresh list
      } else {
        onMessage(result.message, 'error')
      }
    } catch (error) {
      console.error('Error deleting invite code:', error)
      onMessage('Failed to delete invite code', 'error')
    } finally {
      // Remove loading state for this code
      setDeletingCodes(prev => {
        const newSet = new Set(prev)
        newSet.delete(codeId)
        return newSet
      })
    }
  }

  const cleanupExpiredCodes = async () => {
    setIsLoading(true)
    try {
      const deletedCount = await FirebaseAuthManager.cleanupExpiredCodes()
      onMessage(`Cleaned up ${deletedCount} expired invite codes`, 'success')
      await loadInviteCodes() // Refresh list
    } catch (error) {
      console.error('Error cleaning up expired codes:', error)
      onMessage('Failed to cleanup expired codes', 'error')
    } finally {
      setIsLoading(false)
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

  const getCodeStatus = (code: InviteCode) => {
    if (code.isUsed) {
      return { label: 'Used', color: 'bg-gray-600 text-gray-200' }
    } else if (new Date(code.expiresAt) < new Date()) {
      return { label: 'Expired', color: 'bg-red-600 text-red-200' }
    } else {
      return { label: 'Active', color: 'bg-green-600 text-green-200' }
    }
  }

  const activeCodesCount = inviteCodes.filter(code => !code.isUsed && new Date(code.expiresAt) > new Date()).length
  const usedCodesCount = inviteCodes.filter(code => code.isUsed).length
  const expiredCodesCount = inviteCodes.filter(code => !code.isUsed && new Date(code.expiresAt) < new Date()).length

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-2" 
              style={{ fontFamily: 'var(--font-cinzel-decorative), serif', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            Invite Code Management
          </h2>
          <p className="text-amber-100 text-sm sm:text-base">Generate and manage invite codes for new admin accounts</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2">
          <Button
            onClick={loadInviteCodes}
            variant="outline"
            size="sm"
            className="border-2 border-yellow-600/70 text-yellow-400 hover:bg-yellow-600/30 bg-yellow-900/40 backdrop-blur-sm"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={generateInviteCode}
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white border-2 border-green-500"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Generate Code
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Info Alert - Mobile Responsive */}
      <Alert className="border-blue-500 bg-blue-900/50">
        <Shield className="h-4 w-4 text-blue-400 flex-shrink-0" />
        <AlertDescription className="text-blue-200 text-sm">
          Invite codes are valid for 24 hours and can only be used once. Share them securely with new admins.
        </AlertDescription>
      </Alert>

      {/* Stats Grid - Mobile Responsive */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card className="bg-yellow-900/50 backdrop-blur-sm border-2 border-yellow-600/50">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-amber-100">Total Codes</p>
                <p className="text-xl sm:text-2xl font-bold text-yellow-400">{inviteCodes.length}</p>
              </div>
              <Key className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 opacity-70" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-900/50 backdrop-blur-sm border-2 border-green-600/50">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-green-100">Active</p>
                <p className="text-xl sm:text-2xl font-bold text-green-400">{activeCodesCount}</p>
              </div>
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 opacity-70" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 backdrop-blur-sm border-2 border-gray-600/50">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-100">Used</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-400">{usedCodesCount}</p>
              </div>
              <User className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 opacity-70" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-900/50 backdrop-blur-sm border-2 border-red-600/50">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-red-100">Expired</p>
                <p className="text-xl sm:text-2xl font-bold text-red-400">{expiredCodesCount}</p>
              </div>
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-red-400 opacity-70" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cleanup Button - Mobile Responsive */}
      {expiredCodesCount > 0 && (
        <Card className="bg-orange-900/50 backdrop-blur-sm border-2 border-orange-600/50">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-orange-400">Cleanup Expired Codes</h3>
                <p className="text-orange-200 text-sm">Remove {expiredCodesCount} expired invite codes to keep your list clean</p>
              </div>
              <Button
                onClick={cleanupExpiredCodes}
                size="sm"
                className="bg-orange-600 hover:bg-orange-700 text-white self-start sm:self-auto"
                disabled={isLoading}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clean Up
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invite Codes List - Mobile Responsive */}
      <Card className="bg-yellow-900/50 backdrop-blur-sm border-2 border-yellow-600/50">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl text-yellow-400">Invite Codes</CardTitle>
          <CardDescription className="text-amber-100 text-sm">
            All generated invite codes and their status
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          {isLoading ? (
            <div className="space-y-3 sm:space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 sm:h-16 bg-yellow-600/20 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : inviteCodes.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <Key className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-400/50 mx-auto mb-4" />
              <p className="text-amber-100 text-sm sm:text-base">No invite codes generated yet</p>
              <p className="text-amber-200 text-xs sm:text-sm">Click "Generate Code" to create your first invite code</p>
            </div>
          ) : (
            <div className="space-y-3">
              {inviteCodes.map((code) => {
                const status = getCodeStatus(code)
                return (
                  <div
                    key={code.id}
                    className="p-3 sm:p-4 bg-yellow-900/30 rounded-lg border border-yellow-600/30"
                  >
                    {/* Mobile Layout */}
                    <div className="block sm:hidden space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <code className="text-xs font-mono text-yellow-300 bg-yellow-900/50 px-2 py-1 rounded break-all">
                          {code.code}
                        </code>
                        <Badge className={`${status.color} text-xs`}>
                          {status.label}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-xs text-amber-200">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">Created: {formatDate(code.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">Expires: {formatDate(code.expiresAt)}</span>
                        </div>
                        {code.isUsed && code.usedBy && (
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">Used by: {code.usedBy}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Mobile Action Buttons */}
                      <div className="flex gap-2">
                        {/* Copy Button (only for active codes) */}
                        {!code.isUsed && new Date(code.expiresAt) > new Date() && (
                          <Button
                            onClick={() => copyToClipboard(code.code, code.id)}
                            size="sm"
                            className={`flex-1 transition-all duration-200 text-xs ${
                              copiedCodeId === code.id
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                          >
                            {copiedCodeId === code.id ? (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 mr-1" />
                                Copy
                              </>
                            )}
                          </Button>
                        )}
                        
                        {/* Delete Button (for all codes) */}
                        <Button
                          onClick={() => deleteInviteCode(code.id, code.code)}
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white text-xs min-w-[80px]"
                          disabled={deletingCodes.has(code.id)}
                        >
                          {deletingCodes.has(code.id) ? (
                            <>
                              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <code className="text-sm font-mono text-yellow-300 bg-yellow-900/50 px-2 py-1 rounded">
                            {code.code}
                          </code>
                          <Badge className={status.color}>
                            {status.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-amber-200">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Created: {formatDate(code.createdAt)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Expires: {formatDate(code.expiresAt)}
                          </div>
                          {code.isUsed && code.usedBy && (
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              Used by: {code.usedBy}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Desktop Action Buttons */}
                      <div className="flex items-center gap-2">
                        {/* Copy Button (only for active codes) */}
                        {!code.isUsed && new Date(code.expiresAt) > new Date() && (
                          <Button
                            onClick={() => copyToClipboard(code.code, code.id)}
                            size="sm"
                            className={`transition-all duration-200 ${
                              copiedCodeId === code.id
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                          >
                            {copiedCodeId === code.id ? (
                              <>
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4 mr-1" />
                                Copy
                              </>
                            )}
                          </Button>
                        )}
                        
                        {/* Delete Button (for all codes) */}
                        <Button
                          onClick={() => deleteInviteCode(code.id, code.code)}
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white"
                          disabled={deletingCodes.has(code.id)}
                        >
                          {deletingCodes.has(code.id) ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  User, 
  Mail, 
  Lock, 
  Camera, 
  Save, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Eye,
  EyeOff,
  Shield,
  Calendar,
  Trash2,
  Upload
} from 'lucide-react'
import { FirebaseAuthManager } from '@/lib/admin/firebase-auth-manager'

interface UserProfile {
  id: string
  email: string
  displayName: string
  role: 'owner' | 'manager'
  profilePicture?: string
  createdAt: string
  lastLogin: string
}

interface ProfileFormData {
  displayName: string
  email: string
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface ProfileManagementProps {
  onMessage?: (message: string, type?: 'success' | 'error') => void
}

export function ProfileManagement({ onMessage }: ProfileManagementProps) {
  // State management
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [formData, setFormData] = useState<ProfileFormData>({
    displayName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  // Load user profile data
  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setLoading(true)
      
      // Get current admin user from Firebase
      const currentAdmin = await FirebaseAuthManager.getCurrentAdmin()
      if (!currentAdmin) {
        throw new Error('No authenticated user found')
      }
      
      // Create profile object
      const userProfile: UserProfile = {
        id: currentAdmin.uid,
        email: currentAdmin.email,
        displayName: currentAdmin.displayName || currentAdmin.email.split('@')[0],
        role: currentAdmin.role,
        profilePicture: currentAdmin.profilePicture,
        createdAt: currentAdmin.createdAt || new Date().toISOString(),
        lastLogin: currentAdmin.lastLogin || new Date().toISOString()
      }
      
      setProfile(userProfile)
      setFormData({
        displayName: userProfile.displayName,
        email: userProfile.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      console.error('Failed to load profile:', error)
      onMessage?.('Failed to load profile information', 'error')
    } finally {
      setLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const errors: string[] = []

    // Validate display name
    if (!formData.displayName.trim()) {
      errors.push('Display name is required')
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      errors.push('Please enter a valid email address')
    }

    // Validate password changes (only if user is trying to change password)
    if (formData.newPassword || formData.confirmPassword || formData.currentPassword) {
      if (!formData.currentPassword) {
        errors.push('Current password is required to change password')
      }
      
      if (formData.newPassword.length < 6) {
        errors.push('New password must be at least 6 characters long')
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        errors.push('New passwords do not match')
      }
    }

    setValidationErrors(errors)
    return errors.length === 0
  }

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([])
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !profile) return

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      onMessage?.('Please select a valid image file', 'error')
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      onMessage?.('Image size must be less than 5MB', 'error')
      return
    }

    try {
      setUploadingImage(true)
      
      // Upload to Firebase Storage
      const imageUrl = await FirebaseAuthManager.uploadProfilePicture(file, profile.id)
      
      // Update local state
      setProfile(prev => prev ? {
        ...prev,
        profilePicture: imageUrl
      } : null)
      
      onMessage?.('Profile picture updated successfully!', 'success')
    } catch (error) {
      console.error('Image upload failed:', error)
      onMessage?.('Failed to upload image. Please try again.', 'error')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleRemoveProfilePicture = async () => {
    if (!profile?.profilePicture) return

    if (!confirm('Are you sure you want to remove your profile picture?')) {
      return
    }

    try {
      setUploadingImage(true)
      
      const result = await FirebaseAuthManager.deleteProfilePicture(profile.id, profile.profilePicture)
      
      if (result.success) {
        setProfile(prev => prev ? {
          ...prev,
          profilePicture: undefined
        } : null)
        
        onMessage?.(result.message, 'success')
      } else {
        onMessage?.(result.message, 'error')
      }
    } catch (error) {
      console.error('Failed to remove profile picture:', error)
      onMessage?.('Failed to remove profile picture. Please try again.', 'error')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!validateForm() || !profile) return

    try {
      setSaving(true)

      // Check if password is being changed
      const isChangingPassword = formData.newPassword.trim() !== ''

      // Update profile information
      const result = await FirebaseAuthManager.updateAdminProfile({
        displayName: formData.displayName,
        email: formData.email,
        ...(isChangingPassword && {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      })

      if (result.success) {
        // Update local state
        setProfile(prev => prev ? {
          ...prev,
          displayName: formData.displayName,
          email: formData.email
        } : null)

        // Clear password fields
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }))

        onMessage?.(result.message, 'success')
      } else {
        onMessage?.(result.message, 'error')
      }
    } catch (error: any) {
      console.error('Failed to update profile:', error)
      onMessage?.(error.message || 'Failed to update profile. Please try again.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-16">
          <RefreshCw className="w-8 h-8 animate-spin text-yellow-400 mx-auto mb-4" />
          <p className="text-amber-100">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="space-y-6">
        <Alert className="border-red-500 bg-red-900/50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-200">
            Failed to load profile information. Please refresh the page and try again.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-yellow-400 mb-2" style={{ fontFamily: 'var(--font-cinzel-decorative), serif', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
          Profile Management
        </h2>
        <p className="text-amber-100">Manage your personal information and account settings</p>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Alert className="border-red-500 bg-red-900/50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-200">
            <ul className="list-disc list-inside space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture & Account Info */}
        <Card className="bg-yellow-900/50 backdrop-blur-sm border-2 border-yellow-600/50 shadow-xl">
          <CardHeader>
            <CardTitle className="text-yellow-400 flex items-center gap-2">
              <User className="w-5 h-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Picture */}
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-full bg-yellow-600/20 border-4 border-yellow-600/50 flex items-center justify-center overflow-hidden">
                  {profile.profilePicture ? (
                    <img 
                      src={profile.profilePicture} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-yellow-400" />
                  )}
                </div>
                
                {/* Upload Button */}
                <label className="absolute bottom-0 right-0 bg-yellow-600 hover:bg-yellow-700 rounded-full p-2 cursor-pointer shadow-lg transition-colors">
                  <Camera className="w-4 h-4 text-amber-900" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </label>
              </div>
              
              {uploadingImage && (
                <p className="text-amber-200 text-sm mt-2">
                  <RefreshCw className="w-3 h-3 inline mr-1 animate-spin" />
                  Uploading...
                </p>
              )}
              
              {/* Remove Picture Button */}
              {profile.profilePicture && !uploadingImage && (
                <Button
                  onClick={handleRemoveProfilePicture}
                  size="sm"
                  variant="outline"
                  className="mt-2 border-red-600/50 text-red-400 hover:bg-red-600/20"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Remove
                </Button>
              )}
            </div>

            <Separator className="bg-yellow-600/30" />

            {/* Account Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-amber-100">Role</span>
                <Badge className={`${profile.role === 'owner' ? 'bg-yellow-600' : 'bg-blue-600'} text-white`}>
                  <Shield className="w-3 h-3 mr-1" />
                  {profile.role === 'owner' ? 'Owner' : 'Manager'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-amber-100">Member Since</span>
                <span className="text-yellow-400">
                  {new Date(profile.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-amber-100">Last Login</span>
                <span className="text-yellow-400">
                  {new Date(profile.lastLogin).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="bg-yellow-900/50 backdrop-blur-sm border-2 border-yellow-600/50 shadow-xl lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-yellow-400 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Display Name */}
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-amber-100">Display Name</Label>
                <Input
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                  className="bg-yellow-900/30 border-yellow-600/50 text-amber-100 placeholder-amber-300"
                  placeholder="Enter your display name"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-amber-100">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="bg-yellow-900/30 border-yellow-600/50 text-amber-100 placeholder-amber-300"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <Separator className="bg-yellow-600/30" />

            {/* Password Change Section */}
            <div className="space-y-4">
              <h4 className="text-yellow-400 font-semibold flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Change Password
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Current Password */}
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-amber-100">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPasswords.current ? "text" : "password"}
                      value={formData.currentPassword}
                      onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                      className="bg-yellow-900/30 border-yellow-600/50 text-amber-100 placeholder-amber-300 pr-10"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-amber-300 hover:text-amber-100"
                    >
                      {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-amber-100">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPasswords.new ? "text" : "password"}
                      value={formData.newPassword}
                      onChange={(e) => handleInputChange('newPassword', e.target.value)}
                      className="bg-yellow-900/30 border-yellow-600/50 text-amber-100 placeholder-amber-300 pr-10"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-amber-300 hover:text-amber-100"
                    >
                      {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-amber-100">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPasswords.confirm ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="bg-yellow-900/30 border-yellow-600/50 text-amber-100 placeholder-amber-300 pr-10"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-amber-300 hover:text-amber-100"
                    >
                      {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end space-x-4">
              <Button
                onClick={loadProfile}
                variant="outline"
                className="border-yellow-600/50 text-yellow-400 hover:bg-yellow-600/20"
                disabled={saving}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              
              <Button
                onClick={handleSaveProfile}
                className="bg-yellow-600 hover:bg-yellow-700 text-amber-900 border-2 border-yellow-500"
                disabled={saving}
              >
                {saving ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
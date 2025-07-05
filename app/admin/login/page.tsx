'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  UserPlus, 
  LogIn,
  Key,
  AlertCircle,
  CheckCircle,
  Shield
} from 'lucide-react'
import { LogoWithIcon } from '@/components/logos'
import { FirebaseAuthManager } from '@/lib/admin/firebase-auth-manager'
import { auth } from '@/lib/firebase'

export default function AdminLogin() {
  const [activeTab, setActiveTab] = useState('login')
  const [isLoading, setIsLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  // Login form state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Registration form state
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirmPassword, setRegConfirmPassword] = useState('')
  const [inviteCode, setInviteCode] = useState('')

  // First admin setup state
  const [isFirstAdmin, setIsFirstAdmin] = useState(false)
  const [firstAdminCode, setFirstAdminCode] = useState('')

  // FIXED: Check authentication status only once on mount, no ongoing listener
  useEffect(() => {
    let isMounted = true
    
    const checkAuthAndInitialize = async () => {
      try {
        // Check if user is already authenticated
        const currentUser = auth.currentUser
        if (currentUser) {
          // User is already logged in, verify they have admin access
          const adminUser = await FirebaseAuthManager.getCurrentAdmin()
          if (adminUser && isMounted) {
            // User is authenticated and has admin access, redirect immediately
            router.replace('/admin/dashboard')
            return
          }
        }

        // Check if we need to initialize first admin (only if no current user)
        if (!currentUser) {
          const result = await FirebaseAuthManager.initializeFirstAdmin()
          if (isMounted && result.success && result.inviteCode) {
            setIsFirstAdmin(true)
            setFirstAdminCode(result.inviteCode)
            setSuccess(`Welcome! This is your first time setup. Use the invite code below to create your admin account.`)
            setActiveTab('register')
            setInviteCode(result.inviteCode)
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error)
      } finally {
        if (isMounted) {
          setIsInitializing(false)
        }
      }
    }

    checkAuthAndInitialize()

    return () => {
      isMounted = false
    }
  }, [router])

  // Password reset state
  const [resetEmail, setResetEmail] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await FirebaseAuthManager.signInAdmin(loginEmail, loginPassword)
      
      if (result.success) {
        setSuccess('Login successful! Redirecting...')
        // Use replace instead of push to prevent back navigation to login
        setTimeout(() => {
          router.replace('/admin/dashboard')
        }, 500)
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Validate passwords match
    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    // Validate password strength
    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters long')
      setIsLoading(false)
      return
    }

    try {
      const result = await FirebaseAuthManager.registerAdmin(regEmail, regPassword, inviteCode)
      
      if (result.success) {
        setSuccess('Account created successfully! Redirecting to dashboard...')
        // Clear registration form
        setRegEmail('')
        setRegPassword('')
        setRegConfirmPassword('')
        setInviteCode('')
        // Use replace instead of push to prevent back navigation to login
        setTimeout(() => {
          router.replace('/admin/dashboard')
        }, 500)
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await FirebaseAuthManager.sendPasswordReset(resetEmail)
      
      if (result.success) {
        setSuccess('Password reset email sent! Check your inbox.')
        setResetEmail('')
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const clearMessages = () => {
    setError('')
    setSuccess('')
  }

  // Show loading state while initializing
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-900 to-black flex items-center justify-center">
        <div className="text-amber-100 text-lg">Initializing admin system...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 to-black flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900/80 via-yellow-900/60 to-black/90"></div>
      
      <Card className="w-full max-w-md relative z-10 bg-yellow-900/50 backdrop-blur-sm border-2 border-yellow-600/50 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto">
            <LogoWithIcon width={80} height={80} className="mx-auto" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-yellow-400" style={{ fontFamily: 'var(--font-cinzel-decorative), serif', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
              Rice & Spice Admin
            </CardTitle>
            <CardDescription className="text-amber-100">
              Restaurant Management Portal
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {/* First Admin Setup Alert */}
          {isFirstAdmin && (
            <Alert className="mb-4 border-green-200 bg-green-900/50 backdrop-blur-sm">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-green-200">
                <strong>First Time Setup:</strong> No admin accounts exist yet. Use the invite code below to create your first admin account.
                <div className="mt-2 p-2 bg-green-800/50 rounded font-mono text-sm">
                  {firstAdminCode}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Global Messages */}
          {error && (
            <Alert className="mb-4 border-red-200 bg-red-900/50 backdrop-blur-sm">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-200">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 border-green-200 bg-green-900/50 backdrop-blur-sm">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-green-200">{success}</AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={(value) => { setActiveTab(value); clearMessages() }}>
            <TabsList className="grid w-full grid-cols-3 bg-yellow-900/30 border border-yellow-600/50">
              <TabsTrigger value="login" className="data-[state=active]:bg-yellow-600 data-[state=active]:text-amber-900">
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-yellow-600 data-[state=active]:text-amber-900">
                <UserPlus className="w-4 h-4 mr-2" />
                Register
              </TabsTrigger>
              <TabsTrigger value="reset" className="data-[state=active]:bg-yellow-600 data-[state=active]:text-amber-900">
                <Key className="w-4 h-4 mr-2" />
                Reset
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-amber-100 font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-yellow-400" />
                    <Input
                      id="login-email"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="pl-10 border-yellow-600/50 bg-yellow-900/30 text-amber-100 placeholder:text-amber-300 focus:border-yellow-500 focus:ring-yellow-500/20"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-amber-100 font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-yellow-400" />
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="pl-10 pr-10 border-yellow-600/50 bg-yellow-900/30 text-amber-100 placeholder:text-amber-300 focus:border-yellow-500 focus:ring-yellow-500/20"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-yellow-400 hover:text-yellow-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-amber-900 font-bold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl border-2 border-yellow-500"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing In...' : 'Sign In to Admin Panel'}
                </Button>
              </form>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register" className="space-y-4">
              <Alert className="border-blue-200 bg-blue-900/50 backdrop-blur-sm">
                <Shield className="h-4 w-4 text-blue-400" />
                <AlertDescription className="text-blue-200">
                  <strong>Invite-Only Registration:</strong> You need a valid invite code to create an admin account.
                </AlertDescription>
              </Alert>

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-email" className="text-amber-100 font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-yellow-400" />
                    <Input
                      id="reg-email"
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="pl-10 border-yellow-600/50 bg-yellow-900/30 text-amber-100 placeholder:text-amber-300 focus:border-yellow-500 focus:ring-yellow-500/20"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-password" className="text-amber-100 font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-yellow-400" />
                    <Input
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="pl-10 pr-10 border-yellow-600/50 bg-yellow-900/30 text-amber-100 placeholder:text-amber-300 focus:border-yellow-500 focus:ring-yellow-500/20"
                      placeholder="Create a password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-yellow-400 hover:text-yellow-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-confirm-password" className="text-amber-100 font-medium">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-yellow-400" />
                    <Input
                      id="reg-confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      className="pl-10 border-yellow-600/50 bg-yellow-900/30 text-amber-100 placeholder:text-amber-300 focus:border-yellow-500 focus:ring-yellow-500/20"
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invite-code" className="text-amber-100 font-medium">
                    Invite Code
                  </Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 h-4 w-4 text-yellow-400" />
                    <Input
                      id="invite-code"
                      type="text"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                      className="pl-10 border-yellow-600/50 bg-yellow-900/30 text-amber-100 placeholder:text-amber-300 focus:border-yellow-500 focus:ring-yellow-500/20"
                      placeholder="RICE-SPICE-XXXXX-XXXXX"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl border-2 border-green-500"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Admin Account'}
                </Button>
              </form>
            </TabsContent>

            {/* Password Reset Tab */}
            <TabsContent value="reset" className="space-y-4">
              <Alert className="border-orange-200 bg-orange-900/50 backdrop-blur-sm">
                <AlertCircle className="h-4 w-4 text-orange-400" />
                <AlertDescription className="text-orange-200">
                  Enter your email address and we'll send you a link to reset your password.
                </AlertDescription>
              </Alert>

              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email" className="text-amber-100 font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-yellow-400" />
                    <Input
                      id="reset-email"
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="pl-10 border-yellow-600/50 bg-yellow-900/30 text-amber-100 placeholder:text-amber-300 focus:border-yellow-500 focus:ring-yellow-500/20"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl border-2 border-orange-500"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Email'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
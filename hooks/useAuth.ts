// hooks/useAuth.ts
// Simple, error-free version of the authentication hook

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  email: string
}

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  user: User | null
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null
  })
  const router = useRouter()

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = () => {
    // Only run in browser
    if (typeof window === 'undefined') {
      setAuthState(prev => ({ ...prev, isLoading: false }))
      return
    }

    try {
      const authenticated = localStorage.getItem('admin_authenticated')
      const email = localStorage.getItem('admin_email')
      
      if (authenticated === 'true' && email) {
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          user: { email }
        })
      } else {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null
        })
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null
      })
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    if (typeof window === 'undefined') return false

    try {
      // Demo authentication
      if (email === 'admin@riceandspice.com' && password === 'RiceSpice2025!') {
        localStorage.setItem('admin_authenticated', 'true')
        localStorage.setItem('admin_email', email)
        
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          user: { email }
        })
        
        return true
      }
      
      return false
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  const logout = () => {
    if (typeof window === 'undefined') return

    try {
      localStorage.removeItem('admin_authenticated')
      localStorage.removeItem('admin_email')
      
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null
      })
      
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const requireAuth = (redirectTo = '/admin/login') => {
    if (!authState.isLoading && !authState.isAuthenticated) {
      router.push(redirectTo)
    }
  }

  return {
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    user: authState.user,
    login,
    logout,
    requireAuth,
    checkAuthStatus
  }
}
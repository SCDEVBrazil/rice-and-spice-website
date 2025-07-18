'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { ProfileManagement } from '@/components/admin/ProfileManagement'
import { 
  TrendingUp, 
  Settings, 
  MenuSquare, 
  PlusCircle, 
  Info, 
  Shield,
  DollarSign,
  Calendar,
  Users,
  LogOut,
  Check,
  X,
  Clock,
  MapPin,
  Phone,
  RefreshCw,
  User,
  ChevronDown,
  Menu
} from 'lucide-react'
import { LogoWithIcon } from '@/components/logos'
import { FirebaseAuthManager } from '@/lib/admin/firebase-auth-manager'
import { AccessDeniedModal } from '@/components/admin/AccessDeniedModal'
import { ImportWarningModal } from '@/components/admin/ImportWarningModal'
import { BuffetSettings } from '@/components/admin/BuffetSettings'
import { MenuManagement } from '@/components/admin/MenuManagement'
import { MenuDataImport } from '@/components/admin/MenuDataImport'
import { RestaurantInfoManagement } from '@/components/admin/RestaurantInfoManagement'
import { CombinedAdminManagement } from '@/components/admin/CombinedAdminManagement'
import { adminData } from '@/lib/admin'

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUserRole, setCurrentUserRole] = useState<'owner' | 'manager'>('manager')
  const [adminEmail, setAdminEmail] = useState('')
  const [activeSection, setActiveSection] = useState('overview')
  const [showAccessDeniedModal, setShowAccessDeniedModal] = useState(false)
  const [showImportWarning, setShowImportWarning] = useState(false)
  const [pendingImportAccess, setPendingImportAccess] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')
  const [overviewLoading, setOverviewLoading] = useState(true)
  const [buffetPrice, setBuffetPrice] = useState(17.99)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // FIXED: Add restaurant info state for dynamic updates
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: 'Rice & Spice',
    address: '1200 W Main St Ste 10, Peoria, IL 61606',
    phone: '(309) 670-1029',
    hours: {
      tuesday: '11AM-2:30PM, 4:30-9PM',
      saturday: '11AM-3PM, 5-9PM',
      sunday: 'Closed'
    }
  })
  
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = FirebaseAuthManager.onAuthStateChange(async (user) => {
      if (user) {
        try {
          const adminUser = await FirebaseAuthManager.getCurrentAdmin()
          if (adminUser) {
            setIsAuthenticated(true)
            setCurrentUserRole(adminUser.role)
            setAdminEmail(adminUser.email)
            // Load overview data
            refreshOverviewData()
          } else {
            router.push('/admin/login')
          }
        } catch (error) {
          console.error('Error getting admin user:', error)
          router.push('/admin/login')
        }
      } else {
        router.push('/admin/login')
      }
    })

    return () => unsubscribe()
  }, [router])

  // FIXED: Enhanced overview data refresh function to load both buffet and restaurant info
  const refreshOverviewData = async () => {
    try {
      setOverviewLoading(true)
      
      // Load both buffet settings and restaurant info in parallel
      const [settings, info] = await Promise.all([
        adminData.getBuffetSettings(),
        adminData.getRestaurantInfo()
      ])
      
      setBuffetPrice(settings.price)
      setRestaurantInfo({
        name: info.name,
        address: info.address,
        phone: info.phone,
        hours: {
          tuesday: info.hours.tuesday,
          saturday: info.hours.saturday,
          sunday: info.hours.sunday
        }
      })
      
      console.log('✅ Overview data refreshed, new buffet price:', settings.price)
      console.log('✅ Restaurant info refreshed:', info)
    } catch (error) {
      console.error('❌ Failed to refresh overview data:', error)
    } finally {
      setOverviewLoading(false)
    }
  }

  // FIXED: Auto-refresh when returning to overview or page gains focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && activeSection === 'overview' && isAuthenticated) {
        console.log('Page became visible, refreshing overview data...')
        refreshOverviewData()
      }
    }

    const handleFocus = () => {
      if (activeSection === 'overview' && isAuthenticated) {
        console.log('Page gained focus, refreshing overview data...')
        refreshOverviewData()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [activeSection, isAuthenticated])

  const handleLogout = async () => {
  try {
    await FirebaseAuthManager.signOutAdmin()  // Changed from signOut to signOutAdmin
    router.push('/admin/login')
  } catch (error) {
    console.error('Error signing out:', error)
  }
}

  // FIXED: Enhanced message handler that refreshes overview for both buffet and restaurant updates
  const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(''), 5000)
    
    // Always refresh overview data when buffet settings or restaurant info are successfully updated
    if (type === 'success' && (msg.toLowerCase().includes('buffet') || msg.toLowerCase().includes('restaurant'))) {
      console.log('🔄 Update detected, refreshing overview data...')
      setTimeout(() => {
        refreshOverviewData()
      }, 500) // Small delay to ensure Firebase has updated
    }
  }

  // FIXED: Updated handleSectionChange to refresh overview when switching back
  const handleSectionChange = (sectionName: string) => {
    // Check if admin management requires owner role
    if (sectionName === 'admin' && currentUserRole !== 'owner') {
      setShowAccessDeniedModal(true)
      return
    }

    if (sectionName === 'import') {
      setShowImportWarning(true)
      setPendingImportAccess(true)
    } else {
      setActiveSection(sectionName)
      setMobileMenuOpen(false) // Close mobile menu when section changes
      
      // Refresh overview data when returning to overview
      if (sectionName === 'overview') {
        console.log('🔄 Switched to overview, refreshing data...')
        refreshOverviewData()
      }
    }
  }

  // FIXED: New function to handle Quick Actions with permission checks and refresh
  const handleQuickAction = (sectionName: string) => {
    // Same permission logic as handleSectionChange
    if (sectionName === 'admin' && currentUserRole !== 'owner') {
      setShowAccessDeniedModal(true)
      return
    }
    
    // If permission check passes, change section
    setActiveSection(sectionName)
  }

  // FIXED: Access denied modal close handler that redirects to overview
  const handleAccessDeniedClose = () => {
    setShowAccessDeniedModal(false)
    setActiveSection('overview')
    refreshOverviewData() // Refresh when returning to overview
  }

  // Handle import warning confirmation
  const handleImportWarningConfirm = () => {
    setShowImportWarning(false)
    setPendingImportAccess(false)
    setActiveSection('import')
  }

  // Handle import warning cancel
  const handleImportWarningCancel = () => {
    setShowImportWarning(false)
    setPendingImportAccess(false)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-900 to-black flex items-center justify-center">
        <div className="text-amber-100">Loading...</div>
      </div>
    )
  }

  const menuSections = [
    { name: 'overview', label: 'Overview', icon: TrendingUp },
    { name: 'buffet', label: 'Buffet Settings', icon: Settings },
    { name: 'menu', label: 'Menu Management', icon: MenuSquare },
    { name: 'import', label: 'Import Data', icon: PlusCircle },
    { name: 'restaurant', label: 'Restaurant Info', icon: Info },
    { name: 'admin', label: 'Admin Management', icon: Shield },
    { name: 'profile', label: 'Profile', icon: User }
  ]

  const stats = [
    { title: 'Current Buffet Price', value: `$${buffetPrice.toFixed(2)}`, change: 'Saturday 11AM-3PM', icon: DollarSign },
    { title: 'Menu Items', value: '141', change: '11 categories', icon: MenuSquare },
    { title: 'Restaurant Status', value: 'Open', change: 'Tue-Fri: 11AM-2:30PM, 4:30-9PM', icon: Calendar },
    { title: 'Website Status', value: 'Live', change: 'All systems operational', icon: Users }
  ]

  // Get current section details for mobile header
  const currentSection = menuSections.find(section => section.name === activeSection)

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 to-black">
      {/* Import Warning Modal */}
      <ImportWarningModal
        isOpen={showImportWarning}
        onClose={handleImportWarningCancel}
        onConfirm={handleImportWarningConfirm}
      />

      {/* Access Denied Modal */}
      <AccessDeniedModal
        isOpen={showAccessDeniedModal}
        onClose={handleAccessDeniedClose}
      />

      {/* Header */}
      <header className="bg-yellow-900/50 backdrop-blur-sm border-b border-yellow-600/30 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <LogoWithIcon width={40} height={40} className="sm:w-[50px] sm:h-[50px]" />
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-yellow-400" style={{ fontFamily: 'var(--font-cinzel-decorative), serif', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                  Rice & Spice Admin
                </h1>
                <p className="text-xs sm:text-sm text-amber-100 hidden sm:block">Restaurant Management Portal</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Badge className="bg-green-600 hover:bg-green-700 text-white border-green-500 text-xs">
                Online
              </Badge>
              <span className="text-amber-100 text-xs sm:text-sm hidden md:block">{adminEmail}</span>
              <Button
                onClick={handleLogout}
                size="sm"
                className="bg-yellow-600 hover:bg-yellow-700 text-amber-900 border-2 border-yellow-500"
              >
                <LogOut className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Global Message */}
      {message && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <Alert className={`${messageType === 'success' ? 'border-green-500 bg-green-900/50' : 'border-red-500 bg-red-900/50'}`}>
            {messageType === 'success' ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
            <AlertDescription className={messageType === 'success' ? 'text-green-200' : 'text-red-200'}>
              {message}
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Navigation */}
        <div className="mb-6 sm:mb-8">
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-1 bg-yellow-900/40 backdrop-blur-sm rounded-lg p-2 border-2 border-yellow-600/30">
            {menuSections.map((section) => {
              const Icon = section.icon
              
              return (
                <button
                  key={section.name}
                  onClick={() => handleSectionChange(section.name)}
                  className={`flex items-center space-x-2 px-4 xl:px-6 py-3 rounded-md font-medium transition-all duration-300 ${
                    activeSection === section.name
                      ? 'bg-yellow-600 text-amber-900 shadow-lg border-2 border-yellow-500'
                      : 'text-amber-100 hover:bg-yellow-700/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm xl:text-base">{section.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Mobile Navigation */}
          <div className="lg:hidden">
            {/* Mobile Header with Current Section */}
            <div className="bg-yellow-900/40 backdrop-blur-sm rounded-lg border-2 border-yellow-600/30 mb-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-full flex items-center justify-between p-4 text-amber-100"
              >
                <div className="flex items-center space-x-3">
                  {currentSection && <currentSection.icon className="w-5 h-5 text-yellow-400" />}
                  <span className="font-medium text-yellow-400">
                    {currentSection?.label || 'Select Section'}
                  </span>
                </div>
                <ChevronDown className={`w-5 h-5 text-yellow-400 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Mobile Dropdown Menu */}
              {mobileMenuOpen && (
                <div className="border-t border-yellow-600/30">
                  {menuSections.map((section) => {
                    const Icon = section.icon
                    
                    return (
                      <button
                        key={section.name}
                        onClick={() => handleSectionChange(section.name)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-all duration-200 ${
                          activeSection === section.name
                            ? 'bg-yellow-600 text-amber-900'
                            : 'text-amber-100 hover:bg-yellow-700/50'
                        } ${section.name !== menuSections[menuSections.length - 1].name ? 'border-b border-yellow-600/20' : ''}`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{section.label}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Tablet Navigation (768px - 1024px) */}
          <div className="hidden md:block lg:hidden">
            <div className="bg-yellow-900/40 backdrop-blur-sm rounded-lg p-2 border-2 border-yellow-600/30">
              <div className="grid grid-cols-2 gap-2">
                {menuSections.map((section) => {
                  const Icon = section.icon
                  
                  return (
                    <button
                      key={section.name}
                      onClick={() => handleSectionChange(section.name)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md font-medium transition-all duration-300 ${
                        activeSection === section.name
                          ? 'bg-yellow-600 text-amber-900 shadow-lg border-2 border-yellow-500'
                          : 'text-amber-100 hover:bg-yellow-700/50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{section.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* FIXED: Overview Section with dynamic restaurant info - Mobile Responsive */}
        {activeSection === 'overview' && (
          <div className="space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-2" style={{ fontFamily: 'var(--font-cinzel-decorative), serif', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                  Dashboard Overview
                </h2>
                <p className="text-amber-100 text-sm sm:text-base">Manage your restaurant's online presence</p>
              </div>
              
              {/* FIXED: Add refresh button to manually update data */}
              <Button
                onClick={refreshOverviewData}
                variant="outline"
                size="sm"
                className="border-yellow-600/50 text-yellow-400 hover:bg-yellow-600/20 self-start sm:self-auto"
                disabled={overviewLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${overviewLoading ? 'animate-spin' : ''}`} />
                Refresh Data
              </Button>
            </div>

            {/* Stats Grid - Mobile Responsive */}
            {overviewLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-24 sm:h-32 bg-yellow-600/20 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <Card key={index} className="bg-yellow-900/50 backdrop-blur-sm border-2 border-yellow-600/50 shadow-xl">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm text-amber-100 truncate">{stat.title}</p>
                            <p className="text-xl sm:text-2xl font-bold text-yellow-400">{stat.value}</p>
                            <p className="text-xs text-amber-200 mt-1 line-clamp-2">{stat.change}</p>
                          </div>
                          <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 opacity-70 flex-shrink-0 ml-2" />
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}

            {/* FIXED: Restaurant Information with dynamic data - Mobile Responsive */}
            <Card className="bg-yellow-900/50 backdrop-blur-sm border-2 border-yellow-600/50 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl text-yellow-400" style={{ fontFamily: 'var(--font-cinzel-decorative), serif' }}>
                  Restaurant Information
                </CardTitle>
                <CardDescription className="text-amber-100 text-sm">
                  Current restaurant details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-yellow-400 text-sm sm:text-base">Address</h4>
                      <p className="text-amber-100 text-sm break-words">{restaurantInfo.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-yellow-400 text-sm sm:text-base">Phone</h4>
                      <p className="text-amber-100 text-sm">{restaurantInfo.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 md:col-span-1">
                    <Clock className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-yellow-400 text-sm sm:text-base">Hours</h4>
                      <div className="text-amber-100 text-xs sm:text-sm space-y-1">
                        <p><strong>Tue-Fri:</strong> {restaurantInfo.hours.tuesday}</p>
                        <p><strong>Saturday:</strong> {restaurantInfo.hours.saturday}</p>
                        <p><strong>Sunday:</strong> {restaurantInfo.hours.sunday}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions - Mobile Responsive */}
            <Card className="bg-yellow-900/50 backdrop-blur-sm border-2 border-yellow-600/50 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl text-yellow-400" style={{ fontFamily: 'var(--font-cinzel-decorative), serif' }}>
                  Quick Actions
                </CardTitle>
                <CardDescription className="text-amber-100 text-sm">
                  Common management tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <Button
                    onClick={() => handleQuickAction('buffet')}
                    size="sm"
                    className="bg-yellow-600 hover:bg-yellow-700 text-amber-900 border-2 border-yellow-500 shadow-lg hover:shadow-xl transition-all duration-300 h-auto py-3"
                  >
                    <DollarSign className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">Update Buffet Price</span>
                  </Button>
                  <Button
                    onClick={() => handleQuickAction('menu')}
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-700 text-amber-100 border-2 border-orange-500 shadow-lg hover:shadow-xl transition-all duration-300 h-auto py-3"
                  >
                    <PlusCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">Manage Menu Items</span>
                  </Button>
                  <Button
                    onClick={() => handleQuickAction('restaurant')}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-500 shadow-lg hover:shadow-xl transition-all duration-300 h-auto py-3"
                  >
                    <Info className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">Restaurant Info</span>
                  </Button>
                  <Button
                    onClick={() => handleQuickAction('admin')}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white border-2 border-purple-500 shadow-lg hover:shadow-xl transition-all duration-300 h-auto py-3"
                  >
                    <Shield className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">Admin Management</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* FIXED: Buffet Settings Section with enhanced callback */}
        {activeSection === 'buffet' && (
          <BuffetSettings 
            onMessage={showMessage} 
            onBuffetUpdated={refreshOverviewData} // This callback ensures overview updates
          />
        )}

        {/* Menu Management Section */}
        {activeSection === 'menu' && (
          <MenuManagement onMessage={showMessage} />
        )}

        {/* Menu Data Import Section */}
        {activeSection === 'import' && (
          <MenuDataImport onMessage={showMessage} />
        )}

        {/* FIXED: Restaurant Information Section with callback */}
        {activeSection === 'restaurant' && (
          <RestaurantInfoManagement 
            onMessage={showMessage} 
            onRestaurantInfoUpdated={refreshOverviewData} // Add this callback
          />
        )}

        {/* Admin Management Section */}
        {activeSection === 'admin' && (
          <CombinedAdminManagement onMessage={showMessage} />
        )}

        {/* Profile Management Section */}
        {activeSection === 'profile' && (
          <ProfileManagement onMessage={showMessage} />
        )}
      </div>
    </div>
  )
}
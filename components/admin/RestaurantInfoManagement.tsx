'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { 
  MapPin, 
  Phone, 
  Clock, 
  Mail, 
  Globe,
  Save,
  RefreshCw,
  Check,
  X,
  Info,
  Loader2
} from 'lucide-react'
import { adminData } from '@/lib/admin'
import type { RestaurantInfo } from '@/lib/admin/types'

interface RestaurantInfoManagementProps {
  onMessage: (message: string, type: 'success' | 'error') => void
  onRestaurantInfoUpdated?: () => void // New callback to notify parent component
}

export function RestaurantInfoManagement({ onMessage, onRestaurantInfoUpdated }: RestaurantInfoManagementProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo>({
    name: 'Rice & Spice',
    address: '1200 W Main St Ste 10, Peoria, IL 61606',
    phone: '(309) 670-1029',
    email: 'info@riceandspice.com',
    website: 'https://riceandspice.com',
    hours: {
      monday: '11:00 AM - 2:30 PM, 4:30 PM - 9:00 PM',
      tuesday: '11:00 AM - 2:30 PM, 4:30 PM - 9:00 PM',
      wednesday: '11:00 AM - 2:30 PM, 4:30 PM - 9:00 PM',
      thursday: '11:00 AM - 2:30 PM, 4:30 PM - 9:00 PM',
      friday: '11:00 AM - 2:30 PM, 4:30 PM - 9:00 PM',
      saturday: '11:00 AM - 3:00 PM, 5:00 PM - 9:00 PM',
      sunday: 'Closed'
    },
    description: 'Authentic Indian cuisine in the heart of Peoria, Illinois. Experience traditional flavors with a modern twist.'
  })

  const [hasChanges, setHasChanges] = useState(false)

  // FIXED: Load restaurant information from Firebase
  const loadRestaurantInfo = async () => {
    setIsLoading(true)
    try {
      const info = await adminData.getRestaurantInfo(true) // Force refresh
      setRestaurantInfo(info)
      setHasChanges(false)
      console.log('✅ Restaurant info loaded from Firebase:', info)
    } catch (error) {
      console.error('Failed to load restaurant info:', error)
      onMessage('Failed to load restaurant information', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // FIXED: Save restaurant information to Firebase
  const saveRestaurantInfo = async () => {
    setIsSaving(true)
    try {
      // Validate the data first
      const errors = adminData.validateRestaurantInfo(restaurantInfo)
      if (errors.length > 0) {
        onMessage(`Validation errors: ${errors.join(', ')}`, 'error')
        setIsSaving(false)
        return
      }

      const startTime = Date.now()
      
      await adminData.updateRestaurantInfo(restaurantInfo)
      
      const endTime = Date.now()
      console.log(`✅ Restaurant info saved in ${endTime - startTime}ms`)
      
      onMessage('Restaurant information updated successfully!', 'success')
      setHasChanges(false)
      
      // Notify parent component that restaurant info was updated
      if (onRestaurantInfoUpdated) {
        onRestaurantInfoUpdated()
      }
      
    } catch (error) {
      console.error('Failed to save restaurant info:', error)
      onMessage('Failed to save restaurant information', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  // Handle input changes
  const handleInputChange = (field: keyof RestaurantInfo, value: string) => {
    setRestaurantInfo(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  // Handle hours changes
  const handleHoursChange = (day: keyof RestaurantInfo['hours'], value: string) => {
    setRestaurantInfo(prev => ({
      ...prev,
      hours: { ...prev.hours, [day]: value }
    }))
    setHasChanges(true)
  }

  // Load data on component mount
  useEffect(() => {
    loadRestaurantInfo()
  }, [])

  const daysOfWeek = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold text-yellow-400 mb-2" 
                style={{ fontFamily: 'var(--font-cinzel-decorative), serif', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            Restaurant Information
            </h2>
            <p className="text-amber-100">Manage your restaurant's contact details and operating hours</p>
        </div>
        
        <div className="flex items-center gap-2">
            {hasChanges && (
            <Badge variant="secondary" className="bg-yellow-600 text-amber-900">
                Unsaved Changes
            </Badge>
            )}
            {/* IMPROVED: Better contrast refresh button */}
            <Button
            onClick={loadRestaurantInfo}
            variant="outline"
            className="bg-yellow-600/20 border-yellow-400 text-yellow-300 hover:bg-yellow-600/40 hover:text-yellow-100 hover:border-yellow-300 transition-all duration-200"
            disabled={isLoading}
            >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
            </Button>
        </div>
    </div>

      {/* Info Alert */}
      <Alert className="border-blue-500 bg-blue-900/50">
        <Info className="h-4 w-4 text-blue-400" />
        <AlertDescription className="text-blue-200">
          Changes to restaurant information will be reflected on your website immediately after saving.
        </AlertDescription>
      </Alert>

      {isLoading ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 bg-yellow-600/20 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Basic Information */}
          <Card className="bg-yellow-900/50 backdrop-blur-sm border-2 border-yellow-600/50 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-400">
                <Globe className="w-5 h-5" />
                Basic Information
              </CardTitle>
              <CardDescription className="text-amber-100">
                Restaurant name and description
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-amber-100">Restaurant Name</Label>
                <Input
                  id="name"
                  value={restaurantInfo.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="border-yellow-600/50 bg-yellow-900/30 text-amber-100 focus:border-yellow-400"
                  disabled={isLoading || isSaving}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-amber-100">Description</Label>
                <Textarea
                  id="description"
                  value={restaurantInfo.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="border-yellow-600/50 bg-yellow-900/30 text-amber-100 min-h-[100px] focus:border-yellow-400"
                  disabled={isLoading || isSaving}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-yellow-900/50 backdrop-blur-sm border-2 border-yellow-600/50 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-400">
                <Phone className="w-5 h-5" />
                Contact Information
              </CardTitle>
              <CardDescription className="text-amber-100">
                Phone, email, and website details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-amber-100">Phone Number</Label>
                <Input
                  id="phone"
                  value={restaurantInfo.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="border-yellow-600/50 bg-yellow-900/30 text-amber-100 focus:border-yellow-400"
                  placeholder="(309) 670-1029"
                  disabled={isLoading || isSaving}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-amber-100">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={restaurantInfo.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="border-yellow-600/50 bg-yellow-900/30 text-amber-100 focus:border-yellow-400"
                  placeholder="info@riceandspice.com"
                  disabled={isLoading || isSaving}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website" className="text-amber-100">Website URL</Label>
                <Input
                  id="website"
                  value={restaurantInfo.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="border-yellow-600/50 bg-yellow-900/30 text-amber-100 focus:border-yellow-400"
                  placeholder="https://riceandspice.com"
                  disabled={isLoading || isSaving}
                />
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          <Card className="bg-yellow-900/50 backdrop-blur-sm border-2 border-yellow-600/50 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-400">
                <MapPin className="w-5 h-5" />
                Address
              </CardTitle>
              <CardDescription className="text-amber-100">
                Physical location information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="address" className="text-amber-100">Full Address</Label>
                <Textarea
                  id="address"
                  value={restaurantInfo.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="border-yellow-600/50 bg-yellow-900/30 text-amber-100 min-h-[100px] focus:border-yellow-400"
                  placeholder="1200 W Main St Ste 10, Peoria, IL 61606"
                  disabled={isLoading || isSaving}
                />
              </div>
            </CardContent>
          </Card>

          {/* Operating Hours */}
          <Card className="bg-yellow-900/50 backdrop-blur-sm border-2 border-yellow-600/50 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-400">
                <Clock className="w-5 h-5" />
                Operating Hours
              </CardTitle>
              <CardDescription className="text-amber-100">
                Daily operating schedule
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {daysOfWeek.map((day) => (
                <div key={day.key} className="space-y-2">
                  <Label htmlFor={day.key} className="text-amber-100">{day.label}</Label>
                  <Input
                    id={day.key}
                    value={restaurantInfo.hours[day.key as keyof RestaurantInfo['hours']]}
                    onChange={(e) => handleHoursChange(day.key as keyof RestaurantInfo['hours'], e.target.value)}
                    className="border-yellow-600/50 bg-yellow-900/30 text-amber-100 focus:border-yellow-400"
                    placeholder="11:00 AM - 2:30 PM, 4:30 PM - 9:00 PM"
                    disabled={isLoading || isSaving}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t border-yellow-600/30">
        <Button
          onClick={saveRestaurantInfo}
          disabled={!hasChanges || isLoading || isSaving}
          className="bg-yellow-600 hover:bg-yellow-700 text-amber-900 border-2 border-yellow-500 text-lg px-8 py-3"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Saving Restaurant Information...
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              Save Restaurant Information
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
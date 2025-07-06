'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Save, Loader2, RefreshCw } from 'lucide-react'
import { adminData } from '@/lib/admin'

interface BuffetSettingsProps {
  onMessage: (message: string, type: 'success' | 'error') => void
  onBuffetUpdated?: () => void // New callback to notify parent component
}

export function BuffetSettings({ onMessage, onBuffetUpdated }: BuffetSettingsProps) {
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [buffetForm, setBuffetForm] = useState({
    price: 17.99,
    hours: "11:00AM - 3:00PM",
    description: "All-you-can-eat Saturday buffet featuring rotating dishes and much more!",
    isActive: true
  })

  useEffect(() => {
    loadBuffetSettings()
  }, [])

  const loadBuffetSettings = async () => {
    try {
      setInitialLoading(true)
      const settings = await adminData.getBuffetSettings()
      setBuffetForm({
        price: settings.price,
        hours: settings.hours,
        description: settings.description,
        isActive: settings.isActive
      })
    } catch (error) {
      console.error('Failed to load buffet settings:', error)
      onMessage('Failed to load buffet settings', 'error')
    } finally {
      setInitialLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Start timing the save operation
      const startTime = Date.now()
      
      await adminData.updateBuffetSettings({
        price: buffetForm.price,
        hours: buffetForm.hours,
        description: buffetForm.description,
        isActive: buffetForm.isActive
      })
      
      const endTime = Date.now()
      const duration = endTime - startTime
      
      console.log(`Buffet settings save completed in ${duration}ms`)
      
      onMessage('Buffet settings updated successfully!', 'success')
      
      // Notify parent component that buffet was updated
      if (onBuffetUpdated) {
        onBuffetUpdated()
      }
      
    } catch (error) {
      console.error('Failed to update buffet settings:', error)
      onMessage('Failed to update buffet settings. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Add refresh function to reload settings
  const handleRefresh = async () => {
    await loadBuffetSettings()
    onMessage('Buffet settings refreshed', 'success')
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-2" style={{ fontFamily: 'var(--font-cinzel-decorative), serif', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            Buffet Settings
          </h2>
          <p className="text-amber-100 text-sm sm:text-base">Manage your Saturday buffet pricing and details</p>
        </div>
        
        {/* FIXED: Enhanced refresh button with better contrast and mobile sizing */}
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          className="border-2 border-yellow-600/70 text-yellow-400 hover:bg-yellow-600/30 bg-yellow-900/40 backdrop-blur-sm self-start sm:self-auto"
          disabled={initialLoading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${initialLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {initialLoading ? (
        <div className="space-y-4">
          <div className="h-64 sm:h-96 bg-yellow-600/20 rounded-lg animate-pulse" />
        </div>
      ) : (
        <Card className="bg-yellow-900/50 backdrop-blur-sm border-2 border-yellow-600/50 shadow-xl">
          <CardHeader className="pb-4 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl text-yellow-400" style={{ fontFamily: 'var(--font-cinzel-decorative), serif' }}>
              Saturday Buffet Configuration
            </CardTitle>
            <CardDescription className="text-amber-100 text-sm">
              Update buffet price, hours, and description
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Price and Hours - Mobile Responsive Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Buffet Price */}
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-amber-100 font-medium text-sm sm:text-base">
                    Buffet Price ($)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    max="999.99"
                    value={buffetForm.price}
                    onChange={(e) => setBuffetForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    className="bg-yellow-900/30 border-yellow-600/50 text-amber-100 focus:border-yellow-400 h-10 sm:h-11"
                    required
                  />
                </div>

                {/* Buffet Hours */}
                <div className="space-y-2">
                  <Label htmlFor="hours" className="text-amber-100 font-medium text-sm sm:text-base">
                    Buffet Hours
                  </Label>
                  <Input
                    id="hours"
                    type="text"
                    value={buffetForm.hours}
                    onChange={(e) => setBuffetForm(prev => ({ ...prev, hours: e.target.value }))}
                    className="bg-yellow-900/30 border-yellow-600/50 text-amber-100 focus:border-yellow-400 h-10 sm:h-11"
                    placeholder="e.g., 11:00AM - 3:00PM"
                    required
                  />
                </div>
              </div>

              {/* Buffet Description - Mobile Responsive */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-amber-100 font-medium text-sm sm:text-base">
                  Buffet Description
                </Label>
                <Textarea
                  id="description"
                  value={buffetForm.description}
                  onChange={(e) => setBuffetForm(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-yellow-900/30 border-yellow-600/50 text-amber-100 focus:border-yellow-400 min-h-[80px] sm:min-h-[100px] text-sm sm:text-base"
                  placeholder="Describe your Saturday buffet offering..."
                  required
                />
              </div>

              {/* Buffet Active Toggle - Mobile Responsive */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-yellow-900/30 rounded-lg border border-yellow-600/30 space-y-3 sm:space-y-0">
                <div className="space-y-1">
                  <Label className="text-amber-100 font-medium text-sm sm:text-base">Buffet Active</Label>
                  <p className="text-xs sm:text-sm text-amber-200">
                    {buffetForm.isActive ? 'Buffet is currently active and visible to customers' : 'Buffet is disabled and hidden from customers'}
                  </p>
                </div>
                <Switch
                  checked={buffetForm.isActive}
                  onCheckedChange={(checked) => setBuffetForm(prev => ({ ...prev, isActive: checked }))}
                  className="data-[state=checked]:bg-yellow-600 self-start sm:self-auto"
                />
              </div>

              {/* Save Button - Mobile Responsive */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-amber-900 border-2 border-yellow-500 text-base sm:text-lg py-2.5 sm:py-3 h-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                    <span className="text-sm sm:text-base">Saving Buffet Settings...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    <span className="text-sm sm:text-base">Save Buffet Settings</span>
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
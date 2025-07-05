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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-yellow-400 mb-2" style={{ fontFamily: 'var(--font-cinzel-decorative), serif', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            Buffet Settings
          </h2>
          <p className="text-amber-100">Manage your Saturday buffet pricing and details</p>
        </div>
        
        {/* FIXED: Enhanced refresh button with better contrast */}
        <Button
          onClick={handleRefresh}
          variant="outline"
          className="border-2 border-yellow-600/70 text-yellow-400 hover:bg-yellow-600/30 bg-yellow-900/40 backdrop-blur-sm"
          disabled={initialLoading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${initialLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {initialLoading ? (
        <div className="space-y-4">
          <div className="h-96 bg-yellow-600/20 rounded-lg animate-pulse" />
        </div>
      ) : (
        <Card className="bg-yellow-900/50 backdrop-blur-sm border-2 border-yellow-600/50 shadow-xl">
          <CardHeader>
            <CardTitle className="text-yellow-400" style={{ fontFamily: 'var(--font-cinzel-decorative), serif' }}>
              Saturday Buffet Configuration
            </CardTitle>
            <CardDescription className="text-amber-100">
              Update buffet price, hours, and description
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Buffet Price */}
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-amber-100 font-medium">
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
                    className="bg-yellow-900/30 border-yellow-600/50 text-amber-100 focus:border-yellow-400"
                    required
                  />
                </div>

                {/* Buffet Hours */}
                <div className="space-y-2">
                  <Label htmlFor="hours" className="text-amber-100 font-medium">
                    Buffet Hours
                  </Label>
                  <Input
                    id="hours"
                    type="text"
                    value={buffetForm.hours}
                    onChange={(e) => setBuffetForm(prev => ({ ...prev, hours: e.target.value }))}
                    className="bg-yellow-900/30 border-yellow-600/50 text-amber-100 focus:border-yellow-400"
                    placeholder="e.g., 11:00AM - 3:00PM"
                    required
                  />
                </div>
              </div>

              {/* Buffet Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-amber-100 font-medium">
                  Buffet Description
                </Label>
                <Textarea
                  id="description"
                  value={buffetForm.description}
                  onChange={(e) => setBuffetForm(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-yellow-900/30 border-yellow-600/50 text-amber-100 focus:border-yellow-400 min-h-[100px]"
                  placeholder="Describe your Saturday buffet offering..."
                  required
                />
              </div>

              {/* Buffet Active Toggle */}
              <div className="flex items-center justify-between p-4 bg-yellow-900/30 rounded-lg border border-yellow-600/30">
                <div className="space-y-1">
                  <Label className="text-amber-100 font-medium">Buffet Active</Label>
                  <p className="text-sm text-amber-200">
                    {buffetForm.isActive ? 'Buffet is currently active and visible to customers' : 'Buffet is disabled and hidden from customers'}
                  </p>
                </div>
                <Switch
                  checked={buffetForm.isActive}
                  onCheckedChange={(checked) => setBuffetForm(prev => ({ ...prev, isActive: checked }))}
                  className="data-[state=checked]:bg-yellow-600"
                />
              </div>

              {/* Save Button with improved loading state */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-amber-900 border-2 border-yellow-500 text-lg py-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Saving Buffet Settings...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Save Buffet Settings
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
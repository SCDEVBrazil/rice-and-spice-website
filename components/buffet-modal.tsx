"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { LogoWithIcon } from "@/components/logos"
import { Phone, Copy, Check, X, Loader2 } from "lucide-react"
import { adminData } from '@/lib/admin'
import type { BuffetSettings, RestaurantInfo } from '@/lib/admin/types'

export function BuffetModal() {
  // State for dynamic data
  const [buffetSettings, setBuffetSettings] = useState<BuffetSettings | null>(null)
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  
  // State for phone modal functionality
  const [showPhoneModal, setShowPhoneModal] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Load both buffet settings and restaurant info in parallel
      const [buffetData, restaurantData] = await Promise.all([
        adminData.getBuffetSettings(),
        adminData.getRestaurantInfo()
      ])
      
      setBuffetSettings(buffetData)
      setRestaurantInfo(restaurantData)
    } catch (error) {
      console.error('Failed to load buffet modal data:', error)
      setError('Failed to load buffet information')
      
      // Fallback to default values if Firebase fails
      setBuffetSettings({
        price: 17.99,
        hours: "11:00AM - 3:00PM",
        description: "All-you-can-eat Saturday buffet featuring rotating dishes and much more!",
        isActive: true,
        updatedAt: new Date().toISOString()
      })
      setRestaurantInfo({
        name: 'Rice & Spice',
        address: '1200 W Main St Ste 10, Peoria, IL 61606',
        phone: '(309) 670-1029',
        email: 'info@riceandspice.com',
        website: 'https://riceandspice.com',
        hours: {
          monday: '11AM-2:30PM, 4:30-9PM',
          tuesday: '11AM-2:30PM, 4:30-9PM',
          wednesday: '11AM-2:30PM, 4:30-9PM',
          thursday: '11AM-2:30PM, 4:30-9PM',
          friday: '11AM-2:30PM, 4:30-9PM',
          saturday: '11AM-3PM, 5-9PM',
          sunday: 'Closed'
        },
        description: 'Authentic Indian cuisine in the heart of Peoria, Illinois. Experience the rich flavors and aromatic spices of India.',
        updatedAt: new Date().toISOString()
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCallClick = (e: { preventDefault: () => void }) => {
    // Check if it's likely a mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    
    if (!isMobile) {
      e.preventDefault()
      setShowPhoneModal(true)
    }
    // On mobile, let the tel: link work normally
  }

  const copyToClipboard = () => {
    const phoneNumber = restaurantInfo?.phone || '(309) 670-1029'
    navigator.clipboard.writeText(phoneNumber).then(() => {
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
        setShowPhoneModal(false)
      }, 1500)
    }).catch(() => {
      // Fallback if clipboard API fails
      alert(`Please call us at: ${phoneNumber}`)
    })
  }

  // Show loading state
  if (loading) {
    return (
      <div className="p-6 bg-gradient-to-br from-amber-50 to-yellow-100 rounded-xl">
        <div className="text-center">
          <div className="mb-4">
            <LogoWithIcon width={80} height={80} className="mx-auto" />
          </div>
          <div className="flex items-center justify-center gap-2 text-amber-900">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-lg">Loading buffet information...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gradient-to-br from-amber-50 to-yellow-100 rounded-xl">
      <div className="text-center mb-6">
        <div className="mb-4">
          <LogoWithIcon width={80} height={80} className="mx-auto" />
        </div>
        <h2 className="text-3xl font-bold text-amber-900 mb-2" style={{ fontFamily: 'var(--font-cinzel-decorative), serif', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
          Saturday Buffet
        </h2>
        <p className="text-xl font-semibold text-yellow-600">
          ${buffetSettings?.price?.toFixed(2) || '17.99'}
        </p>
        <p className="text-amber-700 mb-4">
          {buffetSettings?.hours || '11:00AM - 3:00PM'}
        </p>
        <p className="text-amber-800 text-sm leading-relaxed">
          {buffetSettings?.description || 'All-you-can-eat Saturday buffet featuring rotating dishes and much more!'}
        </p>
      </div>

      {/* Featured Items */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-amber-900 mb-3 text-center">
          Featured Items
        </h3>
        <div className="grid grid-cols-2 gap-3 text-sm text-amber-800">
          <div className="flex items-center">
            <span className="text-yellow-600 mr-2">•</span>
            Biryani Selection
          </div>
          <div className="flex items-center">
            <span className="text-yellow-600 mr-2">•</span>
            Curry Varieties
          </div>
          <div className="flex items-center">
            <span className="text-yellow-600 mr-2">•</span>
            Tandoor Specialties
          </div>
          <div className="flex items-center">
            <span className="text-yellow-600 mr-2">•</span>
            Fresh Naan & Rice
          </div>
          <div className="flex items-center">
            <span className="text-yellow-600 mr-2">•</span>
            Vegetarian Options
          </div>
          <div className="flex items-center">
            <span className="text-yellow-600 mr-2">•</span>
            Desserts
          </div>
        </div>
      </div>

      {/* Call Button */}
      <div className="text-center">
        <a href={`tel:${restaurantInfo?.phone || '(309) 670-1029'}`} onClick={handleCallClick}>
          <Button className="bg-yellow-600 hover:bg-yellow-700 text-amber-900 px-8 py-3 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 border-2 border-yellow-500 rounded-full">
            <Phone className="w-5 h-5 mr-2" />
            Call for Reservations
          </Button>
        </a>
      </div>

      {/* Phone Modal (Desktop) */}
      {showPhoneModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowPhoneModal(false)}>
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            {/* Header with centered title and close button */}
            <div className="relative mb-6">
              <h3 className="text-lg font-bold text-amber-900 text-center">Call Rice & Spice</h3>
              <button 
                onClick={() => setShowPhoneModal(false)}
                className="absolute right-0 top-0 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Phone number and buttons - all centered */}
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-900 mb-6">
                {restaurantInfo?.phone || '(309) 670-1029'}
              </p>
              
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={copyToClipboard}
                  className="bg-yellow-600 hover:bg-yellow-700 text-amber-900 flex items-center gap-2"
                  disabled={copied}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Number
                    </>
                  )}
                </Button>
                
                <a href={`tel:${restaurantInfo?.phone || '(309) 670-1029'}`}>
                  <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Call Now
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
          <div className="flex items-center gap-2 text-red-800 text-sm">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>{error}</span>
            <button 
              onClick={loadData}
              className="ml-auto text-red-600 hover:text-red-800 text-xs underline"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
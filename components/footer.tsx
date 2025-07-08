"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MapPin, Phone, Facebook, Instagram } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { LogoWithIcon } from "@/components/logos"
import { BuffetModal } from "@/components/buffet-modal"
import { adminData } from '@/lib/admin'
import type { RestaurantInfo } from '@/lib/admin/types'

export function Footer() {
  // State for dynamic data
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRestaurantInfo()
  }, [])

  const loadRestaurantInfo = async () => {
    try {
      const data = await adminData.getRestaurantInfo()
      setRestaurantInfo(data)
    } catch (error) {
      console.error('Failed to load restaurant info for footer:', error)
      // Fallback to default values if Firebase fails
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

  // Format hours for clean display
  const formatHours = (hours: string | undefined) => {
    if (!hours || hours.toLowerCase() === 'closed') return 'Closed'
    
    // Convert "11:00 AM - 2:30 PM, 4:30 PM - 9:00 PM" to "11AM-2:30PM, 4:30-9PM"
    return hours
      .replace(/:\d{2}/g, '') // Remove :00 seconds
      .replace(/\s+AM/g, 'AM')
      .replace(/\s+PM/g, 'PM')
      .replace(/\s+-\s+/g, '-')
      .replace(/,\s+/g, ', ')
  }

  return (
    <footer className="bg-gray-900 text-white py-8 sm:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <LogoWithIcon width={40} height={40} />
              <span className="font-decorative text-xl sm:text-2xl text-gold">
                {restaurantInfo?.name || 'Rice and Spice'}
              </span>
            </div>
            <p className="text-gray-300 mb-4 sm:mb-6 max-w-md text-sm sm:text-base">
              {restaurantInfo?.description || 
               'Authentic Indian cuisine in the heart of Peoria, Illinois. Experience the rich flavors and aromatic spices of India.'}
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-gray-300 text-sm sm:text-base">
                <MapPin className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
                <span>{restaurantInfo?.address || '1200 W Main St Ste 10, Peoria, IL 61606'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm sm:text-base">
                <Phone className="h-4 w-4 text-gold flex-shrink-0" />
                <span>{restaurantInfo?.phone || '(309) 670-1029'}</span>
              </div>
            </div>
            <div className="flex gap-4 mt-4 sm:mt-6">
              <Link
                href="https://www.facebook.com/share/16NJkM4ooY/?mibextid=wwXIfr"
                target="_blank"
                className="text-gold hover:text-white transition-colors"
              >
                <Facebook className="h-7 w-7 sm:h-8 sm:w-8" />
              </Link>
              <Link
                href="https://www.instagram.com/ricea.ndspice?igsh=MWIxZWVvMXl2c3J2OQ=="
                target="_blank"
                className="text-gold hover:text-white transition-colors"
              >
                <Instagram className="h-7 w-7 sm:h-8 sm:w-8" />
              </Link>
            </div>
          </div>

          {/* FIXED: Quick Links - Centered on Mobile */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-gold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                  Contact
                </Link>
              </li>
              <li>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="text-gray-300 hover:text-white transition-colors cursor-pointer text-sm sm:text-base">
                      Saturday Buffet
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] mx-4">
                    <BuffetModal />
                  </DialogContent>
                </Dialog>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                  Catering
                </Link>
              </li>
            </ul>
          </div>

          {/* FIXED: Hours - Centered Title, Improved Mobile Layout */}
          <div>
            <h3 className="text-lg font-semibold text-gold mb-4 text-center md:text-left">Hours</h3>
            <div className="space-y-2 text-gray-300">
              {/* Mobile: Stacked Layout | Desktop: Side-by-side */}
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <span className="text-sm sm:text-base font-medium">Monday - Friday</span>
                <span className="text-sm sm:text-base text-gray-400 sm:text-gray-300">
                  {formatHours(restaurantInfo?.hours?.monday) || '11AM-2:30PM, 4:30-9PM'}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <span className="text-sm sm:text-base font-medium">Saturday</span>
                <span className="text-sm sm:text-base text-gray-400 sm:text-gray-300">
                  {formatHours(restaurantInfo?.hours?.saturday) || '11AM-3PM, 5-9PM'}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <span className="text-sm sm:text-base font-medium">Sunday</span>
                <span className="text-sm sm:text-base text-gray-400 sm:text-gray-300">
                  {formatHours(restaurantInfo?.hours?.sunday) || 'Closed'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400">
          <p className="text-sm sm:text-base">&copy; 2025 {restaurantInfo?.name || 'Rice and Spice'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
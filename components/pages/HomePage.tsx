// components/pages/HomePage.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { MapPin, Phone, Clock, ChevronRight, Utensils, Users, CalendarDays, Loader2, Settings } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BuffetModal } from "@/components/buffet-modal"
import { LogoWithIcon } from "@/components/logos"
import { adminData } from '@/lib/admin'
import type { RestaurantInfo, BuffetSettings } from '@/lib/admin/types'

export default function HomePage() {
  // State for dynamic data
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo | null>(null)
  const [buffetSettings, setBuffetSettings] = useState<BuffetSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  
  // State for auto-popup modal
  const [showBuffetPopup, setShowBuffetPopup] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  // Auto-popup effect
  useEffect(() => {
  // Check if user has already seen the popup in this session
  const hasSeenPopup = sessionStorage.getItem('buffet-popup-shown')
  
  if (!hasSeenPopup && buffetSettings?.isActive) {
    // Show popup immediately
    setShowBuffetPopup(true)
    // Mark as shown in session storage
    sessionStorage.setItem('buffet-popup-shown', 'true')
  }
}, [buffetSettings])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Load both restaurant info and buffet settings in parallel
      const [restaurantData, buffetData] = await Promise.all([
        adminData.getRestaurantInfo(),
        adminData.getBuffetSettings()
      ])
      
      setRestaurantInfo(restaurantData)
      setBuffetSettings(buffetData)
    } catch (error) {
      console.error('Failed to load homepage data:', error)
      setError('Failed to load restaurant information')
      
      // Fallback to default values if Firebase fails
      setRestaurantInfo({
        name: 'Rice & Spice',
        address: '1200 W Main St Ste 10, Peoria, IL 61606',
        phone: '(309) 670-1029',
        email: 'contact@riceandspicepeoria.com',
        website: 'https://riceandspicepeoria.com',
        hours: {
          monday: '11:00 AM - 2:30 PM, 4:30 PM - 9:00 PM',
          tuesday: '11:00 AM - 2:30 PM, 4:30 PM - 9:00 PM',
          wednesday: '11:00 AM - 2:30 PM, 4:30 PM - 9:00 PM',
          thursday: '11:00 AM - 2:30 PM, 4:30 PM - 9:00 PM',
          friday: '11:00 AM - 2:30 PM, 4:30 PM - 9:00 PM',
          saturday: '11:00 AM - 3:00 PM, 5:00 PM - 9:00 PM',
          sunday: 'Closed'
        },
        description: 'Authentic Indian cuisine in the heart of Peoria, Illinois.',
        updatedAt: new Date().toISOString()
      })
      
      setBuffetSettings({
        price: 17.99,
        hours: "11:00AM - 3:00PM",
        description: "All-you-can-eat Saturday buffet featuring rotating dishes and much more!",
        isActive: true,
        updatedAt: new Date().toISOString()
      })
    } finally {
      setLoading(false)
    }
  }

  // Compact hour formatting for hero section
  const formatHoursCompact = (hours: string | undefined) => {
    if (!hours || hours.toLowerCase() === 'closed') {
      return 'Closed'
    }
    
    if (hours.toLowerCase() === 'not closed') {
      return 'Open'
    }
    
    // Convert "11:00 AM - 2:30 PM, 4:30 PM - 9:00 PM" to "11AM-2:30PM, 4:30-9PM"
    return hours
      .replace(/\s+AM/g, 'AM')
      .replace(/\s+PM/g, 'PM')
      .replace(/\s+-\s+/g, '-')
      .replace(/:00(?=AM|PM)/g, '') // Remove :00 from times like 11:00AM -> 11AM
      .replace(/,\s+/g, ', ')
  }

  // Format hours for display
  const formatHoursForDisplay = () => {
    if (!restaurantInfo?.hours) return "Loading hours..."
    
    const { tuesday, friday, saturday, sunday } = restaurantInfo.hours
    return `Tue-Fri: ${tuesday} | Sat: ${saturday} | Sun: ${sunday}`
  }

  // Loading skeleton component
  const LoadingSkeleton = ({ width, height = "h-6" }: { width: string; height?: string }) => (
    <div className={`bg-gray-300/20 animate-pulse rounded ${height} ${width}`}></div>
  )

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      {/* Admin Access Button - Floating in bottom right corner */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link href="/admin/login">
          <Button
            className="bg-amber-900/90 hover:bg-amber-800 text-amber-100 border border-amber-600/70 backdrop-blur-sm shadow-xl transition-all duration-200 hover:shadow-2xl hover:scale-105 rounded-full"
            size="sm"
          >
            <Settings className="w-4 h-4 mr-2" />
            Admin
          </Button>
        </Link>
      </div>

      {/* SEO-Enhanced Hero Section */}
      <section className="relative min-h-[500px] md:min-h-[600px] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-background.jpg"
            alt="Rice and Spice authentic Indian restaurant interior featuring traditional decor and dining atmosphere in Peoria, Illinois"
            fill
            className="object-cover brightness-[0.85]"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30" />
        
        <div className="relative w-full max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="text-center space-y-6 md:space-y-8">
            
            {/* Logo */}
            <div className="mb-4 md:mb-6">
              <LogoWithIcon width={120} height={120} className="mx-auto md:w-[150px] md:h-[150px]" />
            </div>
            
            {/* SEO-Optimized Main Heading */}
            <header>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-decorative text-cream leading-tight px-4">
                Authentic Indian Cuisine in Peoria, Illinois
              </h1>
              <p className="text-lg md:text-xl text-amber-200 mt-4 px-4">
                Traditional dishes, Saturday buffet & fresh ingredients at Rice & Spice Restaurant
              </p>
            </header>
            
            {/* Dynamic Contact Information - Responsive Grid Layout */}
            <div className="mt-8 md:mt-12 max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8 text-cream">
                
                {/* Address */}
                <address className="flex flex-col items-center space-y-2 p-4 bg-black/20 rounded-lg backdrop-blur-sm not-italic">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 md:h-6 md:w-6 text-gold flex-shrink-0" aria-hidden="true" />
                    <span className="text-gold font-semibold text-sm md:text-base">Address</span>
                  </div>
                  {loading ? (
                    <LoadingSkeleton width="w-48 md:w-56" />
                  ) : (
                    <p className="text-sm md:text-base lg:text-lg text-center leading-relaxed px-2">
                      {restaurantInfo?.address}
                    </p>
                  )}
                </address>
                
                {/* Phone */}
                <div className="flex flex-col items-center space-y-2 p-4 bg-black/20 rounded-lg backdrop-blur-sm">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-5 w-5 md:h-6 md:w-6 text-gold flex-shrink-0" aria-hidden="true" />
                    <span className="text-gold font-semibold text-sm md:text-base">Phone</span>
                  </div>
                  {loading ? (
                    <LoadingSkeleton width="w-32 md:w-40" />
                  ) : (
                    <p className="text-sm md:text-base lg:text-lg font-mono">
                      <a href={`tel:${restaurantInfo?.phone?.replace(/\D/g, '')}`} className="hover:text-yellow-300 transition-colors">
                        {restaurantInfo?.phone}
                      </a>
                    </p>
                  )}
                </div>
                
                {/* Hours */}
                <div className="flex flex-col items-center space-y-2 p-4 bg-black/20 rounded-lg backdrop-blur-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 md:h-6 md:w-6 text-gold flex-shrink-0" aria-hidden="true" />
                    <span className="text-gold font-semibold text-sm md:text-base">Hours</span>
                  </div>
                  {loading ? (
                    <LoadingSkeleton width="w-40 md:w-48" />
                  ) : (
                    <div className="text-xs md:text-sm lg:text-base text-center leading-relaxed">
                      <p><span className="text-gold">Tue-Fri:</span> {formatHoursCompact(restaurantInfo?.hours?.tuesday)}</p>
                      <p><span className="text-gold">Sat:</span> {formatHoursCompact(restaurantInfo?.hours?.saturday)}</p>
                      <p><span className="text-gold">Sun:</span> {formatHoursCompact(restaurantInfo?.hours?.sunday)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <nav className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center px-4" aria-label="Main navigation">
              <Link href="/menu">
                <Button className="bg-saffron hover:bg-saffron/90 text-white text-lg md:text-xl px-8 py-4 h-auto font-medium w-full sm:w-auto">
                  View Menu
                </Button>
              </Link>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-yellow-600 hover:bg-yellow-700 text-amber-900 text-lg md:text-xl px-8 py-4 h-auto font-medium border-2 border-yellow-500 shadow-lg w-full sm:w-auto">
                    Saturday Buffet - ${buffetSettings?.price?.toFixed(2) || "17.99"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <BuffetModal />
                </DialogContent>
              </Dialog>
            </nav>
          </div>
        </div>
      </section>

      {/* Unified Content Block - About, Buffet, Indian Tadka, Events */}
      <main className="bg-gradient-to-br from-amber-900 to-black">
        
        {/* About Section */}
        <section className="py-16 px-4" aria-labelledby="about-heading">
          <div className="max-w-4xl mx-auto text-center">
            {/* Header */}
            <header className="mb-8">
              <h2 id="about-heading" className="text-3xl md:text-4xl font-serif text-yellow-400 mb-4 tracking-wider" style={{ fontFamily: 'var(--font-cinzel-decorative), serif', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                Welcome to {loading ? (
                  <span className="inline-block">
                    <LoadingSkeleton width="w-32" height="h-8" />
                  </span>
                ) : (
                  restaurantInfo?.name || 'Rice and Spice'
                )}
              </h2>
              <div className="h-1 w-24 bg-yellow-500 mx-auto mb-6" aria-hidden="true"></div>
              {loading ? (
                <div className="space-y-2">
                  <LoadingSkeleton width="w-full" />
                  <LoadingSkeleton width="w-3/4 mx-auto" />
                  <LoadingSkeleton width="w-5/6 mx-auto" />
                </div>
              ) : (
                <p className="text-lg md:text-xl text-amber-100 leading-relaxed">
                  {restaurantInfo?.description || 
                   "Experience the rich flavors and aromatic spices of authentic Indian cuisine at Rice and Spice. Our chefs bring generations of culinary expertise from various regions of India, creating dishes that capture the essence of traditional Indian cooking with a modern twist."
                  }
                </p>
              )}
            </header>

            
            {/* Updated Feature Cards with Better Icons and SEO */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {/* Authentic Recipes Card */}
              <article className="bg-yellow-900/50 backdrop-blur-sm rounded-lg p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 border-2 border-yellow-600/50 transform hover:-translate-y-1">
                <div className="bg-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  {/* Recipe Book Icon */}
                  <svg className="w-8 h-8 text-amber-900" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-yellow-400 mb-3">Authentic Recipes</h3>
                <p className="text-amber-100">Traditional family recipes passed down through generations, bringing you the true taste of India with authentic spices and cooking techniques.</p>
              </article>

              {/* Fresh Ingredients Card */}
              <article className="bg-yellow-900/50 backdrop-blur-sm rounded-lg p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 border-2 border-yellow-600/50 transform hover:-translate-y-1">
                <div className="bg-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  {/* Leaf/Nature Icon */}
                  <svg className="w-8 h-8 text-amber-900" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-yellow-400 mb-3">Fresh Ingredients</h3>
                <p className="text-amber-100">We source the finest spices imported directly from India and the freshest local ingredients to ensure every dish bursts with authentic flavor.</p>
              </article>

              {/* Expert Chefs Card */}
              <article className="bg-yellow-900/50 backdrop-blur-sm rounded-lg p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 border-2 border-yellow-600/50 transform hover:-translate-y-1">
                <div className="bg-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  {/* Chef Hat Icon */}
                  <svg className="w-8 h-8 text-amber-900" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.5,1.5C10.73,1.5 9.17,2.67 8.54,4.27C8.5,4.27 8.5,4.27 8.46,4.27C6.68,4.27 5.22,5.73 5.22,7.5C5.22,7.78 5.26,8.05 5.33,8.31C3.75,8.94 2.61,10.53 2.61,12.41C2.61,14.95 4.66,17 7.2,17H18.42C20.36,17 21.94,15.42 21.94,13.5C21.94,11.58 20.36,10 18.42,10C18.25,10 18.08,10 17.91,10.03C17.67,7.18 15.3,4.95 12.38,4.95C12.42,4.95 12.46,4.95 12.5,4.95V1.5Z"/>
                    <path d="M7,18V22H17V18H7Z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-yellow-400 mb-3">Expert Chefs</h3>
                <p className="text-amber-100">Our skilled chefs bring years of experience from various regions of India, specializing in North and South Indian cuisine preparation.</p>
              </article>
            </div>

            {/* Call to Action */}
            <div className="mt-12">
              <p className="text-lg text-amber-100 mb-8">
                Come taste the difference that authentic Indian cooking makes in Peoria, Illinois.
              </p>
              <nav className="flex flex-wrap justify-center gap-6" aria-label="Restaurant actions">
                <Link href="/menu">
                  <Button className="bg-yellow-600 hover:bg-yellow-700 text-amber-900 px-10 py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 border-2 border-yellow-500 rounded-full">
                    View Our Full Menu
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button className="bg-orange-600 hover:bg-orange-700 text-amber-100 px-10 py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 border-2 border-orange-500 rounded-full">
                    Make a Reservation
                  </Button>
                </Link>
              </nav>
            </div>
          </div>
        </section>

        {/* Elegant Divider */}
        <div className="flex justify-center py-8" aria-hidden="true">
          <div className="h-0.5 w-3/4 bg-gradient-to-r from-transparent via-yellow-500/80 to-transparent shadow-lg"></div>
        </div>

        {/* FIXED: Dynamic Saturday Buffet Section - Mobile Responsive */}
        <section className="py-16 px-4" aria-labelledby="buffet-heading">
          <div className="max-w-4xl mx-auto text-center">
            {/* Header Section */}
            <header className="mb-8">
              <div className="bg-yellow-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl border-4 border-amber-800">
                <svg className="w-12 h-12 text-amber-900" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/>
                </svg>
              </div>
              <h2 id="buffet-heading" className="text-4xl md:text-5xl text-yellow-400 mb-4 tracking-wider" style={{ fontFamily: 'var(--font-cinzel-decorative), cursive', textShadow: '3px 3px 6px rgba(0,0,0,0.7)', letterSpacing: '0.08em', fontWeight: '700' }}>
                All You Can Eat Indian Buffet
              </h2>
              <p className="text-2xl font-bold text-orange-400 mb-3">Every Saturday in Peoria</p>
              
              {/* Dynamic Buffet Hours */}
              {loading ? (
                <LoadingSkeleton width="w-48 mx-auto" />
              ) : (
                <p className="text-xl text-amber-100 mb-4">{buffetSettings?.hours || "11:00AM - 3:00PM"}</p>
              )}
              
              {/* Dynamic Buffet Price */}
              {loading ? (
                <LoadingSkeleton width="w-32 mx-auto" height="h-16" />
              ) : (
                <p className="text-5xl font-bold text-yellow-400 drop-shadow-lg">
                  ${buffetSettings?.price?.toFixed(2) || "17.99"} per person
                </p>
              )}
            </header>
            
            {/* Featured Dishes */}
            <article className="bg-yellow-900/40 backdrop-blur-sm rounded-lg p-6 sm:p-8 border-2 border-yellow-600/50 shadow-2xl">
              <h3 className="text-lg text-orange-300 mb-4 font-medium">Featured Saturday Buffet Items:</h3>
              <div className="text-xl text-amber-100 leading-relaxed">
                <p className="mb-2">
                  <strong>Main Dishes:</strong> Chicken Tikka Masala • Butter Chicken • Lamb Curry • Paneer Makhani
                </p>
                <p className="mb-2">
                  <strong>Rice & Biryani:</strong> Basmati Rice • Vegetable Biryani • Chicken Biryani
                </p>
                <p className="mb-2">
                  <strong>Appetizers:</strong> Samosas • Pakoras • Tandoori Chicken • Naan Bread
                </p>
                <p className="font-bold text-yellow-400 text-2xl mt-4">
                  ...and much more rotating weekly!
                </p>
              </div>
              
              {/* Show buffet status */}
              {buffetSettings && !buffetSettings.isActive && (
                <div className="mt-4 p-3 bg-orange-900/50 rounded-lg border border-orange-600/30" role="alert">
                  <p className="text-orange-300 font-medium">
                    Saturday buffet is temporarily unavailable. Please check back soon!
                  </p>
                </div>
              )}
              
              {/* FIXED: Mobile-Responsive Buffet CTA Button */}
              <div className="mt-6 px-2 sm:px-0">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-yellow-600 hover:bg-yellow-700 text-amber-900 px-4 sm:px-8 py-3 text-base sm:text-lg font-bold rounded-full shadow-lg w-full sm:w-auto max-w-sm sm:max-w-none">
                      <span className="block sm:hidden">Learn More About Buffet</span>
                      <span className="hidden sm:block">Learn More About Our Saturday Buffet</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <BuffetModal />
                  </DialogContent>
                </Dialog>
              </div>
            </article>
          </div>
        </section>

        {/* Elegant Divider */}
        <div className="flex justify-center py-4" aria-hidden="true">
          <div className="h-px w-3/4 bg-gradient-to-r from-transparent via-yellow-600/50 to-transparent"></div>
        </div>

        {/* FIXED: Indian Tadka Sister Restaurant Section - Mobile Responsive */}
        <section className="py-16 px-4" aria-labelledby="sister-restaurant-heading">
          <div className="max-w-4xl mx-auto">
            <header className="text-center mb-10">
              <h2 id="sister-restaurant-heading" className="text-3xl md:text-4xl font-serif text-yellow-400 mb-2 tracking-wider" style={{ fontFamily: 'var(--font-cinzel-decorative), serif', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                Visit Our Sister Restaurant
              </h2>
              <div className="h-1 w-40 bg-yellow-500 mx-auto" aria-hidden="true"></div>
            </header>

            <article className="bg-yellow-900/40 backdrop-blur-sm rounded-lg shadow-2xl overflow-hidden border-2 border-yellow-600/50">
              <div className="flex flex-col md:flex-row min-h-[500px]">
                <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-serif text-yellow-400 mb-4 tracking-wider" style={{ fontFamily: 'var(--font-cinzel-decorative), serif', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                      Indian Tadka
                    </h3>
                    
                    {/* FIXED: Mobile-Responsive Button Layout */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-6">
                      <span className="bg-orange-700 px-4 py-2 rounded text-yellow-400 font-bold text-center border border-yellow-600 text-sm sm:text-base">
                        Open Sundays!
                      </span>
                      <span className="bg-yellow-600 px-4 py-2 rounded text-amber-900 font-bold text-center border border-orange-600 text-sm sm:text-base">
                        Sunday Lunch Buffet
                      </span>
                    </div>
                  </div>
                  
                  <address className="space-y-4 flex-grow not-italic">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" aria-hidden="true" />
                      <p className="text-amber-100 text-sm sm:text-base">7815 Knoxville Ave Unit #12, Peoria, IL 61614</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" aria-hidden="true" />
                      <p className="text-amber-100 text-sm sm:text-base">
                        <a href="tel:3095982024" className="hover:text-yellow-300 transition-colors">
                          (309) 598-2024
                        </a>
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" aria-hidden="true" />
                      <div className="text-amber-100 text-sm sm:text-base">
                        <p><strong>Tuesday - Saturday:</strong> 11:00AM - 2:30PM, 5:00PM - 9:30PM</p>
                        <p><strong>Sunday:</strong> 11:00AM - 2:30PM (Lunch Buffet), 5:00PM - 8:30PM</p>
                        <p><strong>Monday:</strong> Closed</p>
                      </div>
                    </div>
                  </address>
                  
                  <nav className="space-y-3 mt-6">
                    <div className="flex items-start gap-3">
                      <svg className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                      </svg>
                      <Link
                        href="https://indiantadka309.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-yellow-400 hover:text-yellow-300 underline transition-colors text-sm sm:text-base"
                      >
                        Visit Indian Tadka Website - Menu & Online Ordering
                      </Link>
                    </div>
                  </nav>
                </div>
                <div className="md:w-1/2 relative">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3020.1234567890123!2d-89.6123456789!3d40.7123456789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880a123456789abc%3A0x123456789abcdef0!2s7815%20Knoxville%20Ave%20Unit%20%2312%2C%20Peoria%2C%20IL%2061614!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Indian Tadka sister restaurant location map in Peoria, Illinois"
                    className="rounded-r-lg"
                  ></iframe>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* Elegant Divider */}
        <div className="flex justify-center py-4" aria-hidden="true">
          <div className="h-px w-3/4 bg-gradient-to-r from-transparent via-yellow-600/50 to-transparent"></div>
        </div>

        {/* Events & Catering Section */}
        <section className="py-16 px-4" aria-labelledby="events-heading">
          <div className="max-w-4xl mx-auto">
            <header className="text-center mb-10">
              <h2 id="events-heading" className="text-3xl md:text-4xl font-serif text-yellow-400 mb-4 tracking-wider" style={{ fontFamily: 'var(--font-cinzel-decorative), serif', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                Catering & Special Events in Peoria
              </h2>
              <div className="h-1 w-32 bg-yellow-500 mx-auto mb-6" aria-hidden="true"></div>
              <p className="text-lg text-amber-100">
                From intimate gatherings to large celebrations, we offer professional Indian catering and private event spaces in Peoria, Illinois.
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <article className="bg-yellow-900/50 backdrop-blur-sm rounded-lg p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 border-2 border-yellow-600/50 transform hover:-translate-y-1">
                <div className="bg-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Utensils className="h-8 w-8 text-amber-900" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-yellow-400 mb-3 text-center">Indian Catering Services</h3>
                <p className="text-amber-100 text-center">
                  Bring authentic Indian flavors to your location with our professional catering services. Perfect for corporate events, weddings, and parties in Peoria.
                </p>
              </article>

              <article className="bg-yellow-900/50 backdrop-blur-sm rounded-lg p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 border-2 border-yellow-600/50 transform hover:-translate-y-1">
                <div className="bg-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Users className="h-8 w-8 text-amber-900" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-yellow-400 mb-3 text-center">Private Dining Room</h3>
                <p className="text-amber-100 text-center">Reserve our elegant private dining room for your special occasions, business meetings, or family celebrations.</p>
              </article>

              <article className="bg-yellow-900/50 backdrop-blur-sm rounded-lg p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 border-2 border-yellow-600/50 transform hover:-translate-y-1">
                <div className="bg-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <CalendarDays className="h-8 w-8 text-amber-900" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-yellow-400 mb-3 text-center">Special Celebrations</h3>
                <p className="text-amber-100 text-center">
                  Make your celebrations memorable with our festive atmosphere, traditional Indian music, and delicious authentic cuisine.
                </p>
              </article>
            </div>

            <div className="text-center mt-12">
              <Link href="/contact">
                <Button className="bg-yellow-600 hover:bg-yellow-700 text-amber-900 px-10 py-4 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 border-2 border-yellow-500">
                  Contact Us for Event Planning
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Auto-popup Saturday Buffet Modal */}
      <Dialog open={showBuffetPopup} onOpenChange={setShowBuffetPopup}>
        <DialogContent className="sm:max-w-[500px]">
          <BuffetModal />
        </DialogContent>
      </Dialog>

      {/* Error Display */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-900/90 text-red-100 px-4 py-2 rounded-lg shadow-lg border border-red-600/50 z-50" role="alert">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-400 rounded-full" aria-hidden="true"></div>
            <span className="text-sm">{error}</span>
            <button 
              onClick={() => setError('')}
              className="ml-2 text-red-300 hover:text-red-100"
              aria-label="Dismiss error message"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Retry button if data failed to load */}
      {error && (
        <div className="fixed bottom-16 right-4 z-50">
          <Button
            onClick={loadData}
            disabled={loading}
            className="bg-yellow-600 hover:bg-yellow-700 text-amber-900 px-4 py-2 text-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                Retrying...
              </>
            ) : (
              'Retry Loading Data'
            )}
          </Button>
        </div>
      )}

      <Footer />
    </div>
  )
}
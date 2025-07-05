// components/pages/ContactPage.tsx (Client Component - HAS 'use client')
'use client'

import { useState, useEffect } from 'react'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Phone, Clock, Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import Image from "next/image"
import { adminData } from '@/lib/admin'
import type { RestaurantInfo } from '@/lib/admin/types'

export default function ContactPage() {
  // State for dynamic data
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  useEffect(() => {
    loadRestaurantInfo()
  }, [])

  const loadRestaurantInfo = async () => {
    try {
      const data = await adminData.getRestaurantInfo()
      setRestaurantInfo(data)
    } catch (error) {
      console.error('Failed to load restaurant info for contact page:', error)
      // Fallback to default values if Firebase fails
      setRestaurantInfo({
        name: 'Rice & Spice',
        address: '1200 W Main St Ste 10, Peoria, IL 61606',
        phone: '(309) 670-1029',
        email: 'contact@riceandspicepeoria.com',
        website: 'https://riceandspicepeoria.com',
        hours: {
          monday: '11:00AM - 2:30PM, 4:30PM - 9:00PM',
          tuesday: '11:00AM - 2:30PM, 4:30PM - 9:00PM',
          wednesday: '11:00AM - 2:30PM, 4:30PM - 9:00PM',
          thursday: '11:00AM - 2:30PM, 4:30PM - 9:00PM',
          friday: '11:00AM - 2:30PM, 4:30PM - 9:00PM',
          saturday: '11:00AM - 3:00PM, 5:00PM - 9:00PM',
          sunday: 'Closed'
        },
        description: 'Authentic Indian cuisine in the heart of Peoria, Illinois.',
        updatedAt: new Date().toISOString()
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear any previous error messages when user starts typing
    if (submitStatus.type === 'error') {
      setSubmitStatus({ type: null, message: '' })
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.message) {
        setSubmitStatus({
          type: 'error',
          message: 'Please fill in all required fields (Name, Email, and Message).'
        })
        setIsSubmitting(false)
        return
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        setSubmitStatus({
          type: 'error',
          message: 'Please enter a valid email address.'
        })
        setIsSubmitting(false)
        return
      }

      // Prepare form data for Formspree
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('phone', formData.phone)
      formDataToSend.append('subject', formData.subject)
      formDataToSend.append('message', formData.message)
      
      // Add hidden fields for Formspree
      formDataToSend.append('_cc', 'abir@riceandspicepeoria.com') // CC to Abir
      formDataToSend.append('_subject', `Contact Form: ${formData.subject || 'New Message'}`)
      formDataToSend.append('_replyto', formData.email)
      formDataToSend.append('_next', window.location.href) // Stay on same page

      // Submit to Formspree
      const response = await fetch('https://formspree.io/f/meokwkyq', {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Accept': 'application/json'
        }
      })

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Thank you for your message! We\'ll get back to you soon.'
        })
        
        // Clear form after successful submission
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        })
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send message')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus({
        type: 'error',
        message: 'Sorry, there was an error sending your message. Please try again or call us directly.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Format hours for display
  const formatHours = (hours: string | undefined) => {
    if (!hours || hours.toLowerCase() === 'closed') return 'Closed'
    
    // Convert "11:00 AM - 2:30 PM, 4:30 PM - 9:00 PM" to "11:00AM - 2:30PM, 4:30PM - 9:00PM"
    return hours
      .replace(/\s+AM/g, 'AM')
      .replace(/\s+PM/g, 'PM')
      .replace(/\s+-\s+/g, ' - ')
      .replace(/,\s+/g, ', ')
  }

  // Loading skeleton component
  const LoadingSkeleton = ({ width, height = "h-5" }: { width: string; height?: string }) => (
    <div className={`bg-yellow-600/30 animate-pulse rounded ${height} ${width}`}></div>
  )

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <section className="relative h-[300px]">
        <div className="absolute inset-0">
          <Image src="/images/contact-header.png" alt="Contact Us" fill className="object-cover brightness-[0.7]" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30" />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-5xl text-yellow-400 mb-4" style={{ fontFamily: 'var(--font-cinzel-decorative), serif', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            Contact Us
          </h1>
          <div className="h-1 w-20 bg-yellow-500"></div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-amber-900 to-black">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="flex flex-col">
                <h2 className="text-3xl md:text-4xl text-yellow-400 mb-8" style={{ fontFamily: 'var(--font-cinzel-decorative), serif', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                  Get In Touch
                </h2>

                {/* Success/Error Messages */}
                {submitStatus.type && (
                  <Alert className={`mb-6 ${
                    submitStatus.type === 'success' 
                      ? 'border-green-500 bg-green-900/50' 
                      : 'border-red-500 bg-red-900/50'
                  }`}>
                    {submitStatus.type === 'success' ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-400" />
                    )}
                    <AlertDescription className={
                      submitStatus.type === 'success' ? 'text-green-200' : 'text-red-200'
                    }>
                      {submitStatus.message}
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 flex-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label htmlFor="name" className="text-base font-semibold text-amber-100">
                        Name *
                      </label>
                      <Input 
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your name" 
                        className="h-12 border-yellow-600/50 bg-yellow-900/30 text-amber-100 placeholder:text-amber-300 focus:border-yellow-500 focus:ring-yellow-500/20 text-base" 
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <label htmlFor="email" className="text-base font-semibold text-amber-100">
                        Email *
                      </label>
                      <Input 
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Your email" 
                        className="h-12 border-yellow-600/50 bg-yellow-900/30 text-amber-100 placeholder:text-amber-300 focus:border-yellow-500 focus:ring-yellow-500/20 text-base" 
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label htmlFor="phone" className="text-base font-semibold text-amber-100">
                      Phone
                    </label>
                    <Input 
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Your phone number" 
                      className="h-12 border-yellow-600/50 bg-yellow-900/30 text-amber-100 placeholder:text-amber-300 focus:border-yellow-500 focus:ring-yellow-500/20 text-base" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label htmlFor="subject" className="text-base font-semibold text-amber-100">
                      Subject
                    </label>
                    <Input 
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Subject" 
                      className="h-12 border-yellow-600/50 bg-yellow-900/30 text-amber-100 placeholder:text-amber-300 focus:border-yellow-500 focus:ring-yellow-500/20 text-base" 
                    />
                  </div>
                  <div className="space-y-3 flex-1">
                    <label htmlFor="message" className="text-base font-semibold text-amber-100">
                      Message *
                    </label>
                    <Textarea 
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Your message" 
                      className="min-h-[200px] border-yellow-600/50 bg-yellow-900/30 text-amber-100 placeholder:text-amber-300 focus:border-yellow-500 focus:ring-yellow-500/20 text-base resize-none" 
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-14 bg-yellow-600 hover:bg-yellow-700 text-amber-900 font-bold rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 border-2 border-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Sending Message...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </Button>
                </form>
              </div>

              <div className="flex flex-col">
                <h2 className="text-3xl md:text-4xl text-yellow-400 mb-8" style={{ fontFamily: 'var(--font-cinzel-decorative), serif', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                  Information
                </h2>

                <Card className="bg-yellow-900/50 backdrop-blur-sm border-2 border-yellow-600/50 shadow-xl mb-8">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <MapPin className="h-6 w-6 text-yellow-400 mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-bold text-yellow-400 text-lg">Address</h3>
                          {loading ? (
                            <LoadingSkeleton width="w-64" />
                          ) : (
                            <p className="text-amber-100 text-base">
                              {restaurantInfo?.address}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <Phone className="h-6 w-6 text-yellow-400 mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-bold text-yellow-400 text-lg">Phone</h3>
                          {loading ? (
                            <LoadingSkeleton width="w-40" />
                          ) : (
                            <p className="text-amber-100 text-base">
                              {restaurantInfo?.phone}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <Mail className="h-6 w-6 text-yellow-400 mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-bold text-yellow-400 text-lg">Email</h3>
                          {loading ? (
                            <LoadingSkeleton width="w-48" />
                          ) : (
                            <p className="text-amber-100 text-base">
                              {restaurantInfo?.email}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <Clock className="h-6 w-6 text-yellow-400 mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-bold text-yellow-400 text-lg">Hours</h3>
                          {loading ? (
                            <div className="space-y-1">
                              <LoadingSkeleton width="w-72" />
                              <LoadingSkeleton width="w-64" />
                              <LoadingSkeleton width="w-32" />
                            </div>
                          ) : (
                            <div className="text-amber-100 text-base">
                              <p>
                                <strong className="text-yellow-300">Monday - Friday:</strong> {formatHours(restaurantInfo?.hours?.monday)}
                              </p>
                              <p>
                                <strong className="text-yellow-300">Saturday:</strong> {formatHours(restaurantInfo?.hours?.saturday)}
                              </p>
                              <p>
                                <strong className="text-yellow-300">Sunday:</strong> {formatHours(restaurantInfo?.hours?.sunday)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="h-[350px] relative rounded-lg overflow-hidden border-2 border-yellow-600/50 shadow-xl flex-1">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3019.123456789!2d-89.123456!3d40.123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s1200%20W%20Main%20St%20Ste%2010%2C%20Peoria%2C%20IL%2061606!5e0!3m2!1sen!2sus!4v1234567890!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Rice and Spice Location"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
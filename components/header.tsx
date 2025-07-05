"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X, Phone, Copy, Check } from "lucide-react"
import { LogoIcon, LogoWithIcon } from "@/components/logos"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [showPhoneModal, setShowPhoneModal] = useState(false)
  const [copied, setCopied] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "Contact", href: "/contact" },
  ]

  // Filter out the current page from navigation
  const filteredNavLinks = navLinks.filter(link => link.href !== pathname)

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
    navigator.clipboard.writeText('(309) 670-1029').then(() => {
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
        setShowPhoneModal(false)
      }, 1500)
    }).catch(() => {
      // Fallback if clipboard API fails
      alert('Please call us at: (309) 670-1029')
    })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gold/20 bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/60">
      <div className="w-full flex h-20 items-center px-4 md:px-8 lg:px-12 relative">
        <Link href="/" className="flex items-center gap-3 flex-shrink-0">
          <LogoWithIcon width={40} height={40} />
          <span className="font-decorative text-2xl md:text-3xl text-deepRed">Rice and Spice</span>
        </Link>

        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
          <nav className="hidden md:flex gap-8 lg:gap-12 items-center">
            {filteredNavLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-xl md:text-2xl font-medium text-gray-700 hover:text-deepRed transition-all duration-300 px-4 py-2 rounded-full border-2 border-gold/40 hover:border-gold bg-gold/5 hover:bg-gold/15 hover:shadow-md h-auto"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex-shrink-0 flex items-center ml-auto">
          <Link href="tel:(309)670-1029" className="hidden md:block" onClick={handleCallClick}>
            <Button className="bg-saffron hover:bg-saffron/90 text-white text-xl md:text-2xl font-medium rounded-full px-4 py-2 transition-all duration-300 hover:shadow-md h-auto">
              Call Now
            </Button>
          </Link>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-deepRed">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-cream border-l border-gold/20">
            <div className="flex items-center justify-between mb-8">
              <Link href="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
                <LogoIcon width={50} height={50} />
                <span className="font-decorative text-2xl text-deepRed">Rice and Spice</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <nav className="flex flex-col gap-4">
              {filteredNavLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-base font-medium text-gray-700 hover:text-deepRed transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link href="tel:(309)670-1029" onClick={() => setIsOpen(false)}>
                <Button className="bg-saffron hover:bg-saffron/90 text-white w-full mt-4">Call Now</Button>
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Phone Modal */}
        {showPhoneModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-amber-50 to-yellow-100 rounded-xl shadow-2xl border-2 border-yellow-600/30 p-8 max-w-sm w-full relative" style={{ marginTop: '35vh' }}>
              <button
                onClick={() => setShowPhoneModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-amber-900" />
                </div>
                
                <h3 className="text-xl font-bold text-amber-900 mb-2">Call Rice and Spice</h3>
                
                <div className="text-2xl font-bold text-amber-800 mb-6 tracking-wider">
                  (309) 670-1029
                </div>
                
                <Button
                  onClick={copyToClipboard}
                  className="bg-yellow-600 hover:bg-yellow-700 text-amber-900 px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto"
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
                
                <p className="text-sm text-amber-700 mt-4">
                  Click to copy the number to your clipboard
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from "next"
import { Poppins, Cinzel_Decorative } from "next/font/google"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
})

const cinzelDecorative = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
  variable: "--font-cinzel-decorative",
})

export const metadata: Metadata = {
  metadataBase: new URL('https://riceandspicepeoria.com'),
  title: {
    default: "Rice & Spice - Authentic Indian Restaurant in Peoria, IL",
    template: "%s | Rice & Spice - Indian Restaurant Peoria"
  },
  description: "Experience authentic Indian cuisine at Rice & Spice in Peoria, Illinois. Traditional dishes, Saturday buffet, fresh ingredients. Dine-in, takeout & catering available. Call (309) 670-1029.",
  keywords: [
    "Indian restaurant Peoria IL",
    "authentic Indian food Peoria",
    "Indian cuisine Illinois", 
    "Rice and Spice restaurant",
    "Indian buffet Peoria",
    "Indian food near me",
    "Peoria restaurants",
    "authentic Indian spices",
    "Indian takeout Peoria",
    "Indian catering Illinois",
    "best Indian restaurant Peoria",
    "traditional Indian dishes"
  ],
  authors: [{ name: "Rice & Spice Restaurant" }],
  creator: "Rice & Spice Restaurant",
  publisher: "Rice & Spice Restaurant",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  generator: 'Next.js',
  applicationName: 'Rice & Spice Restaurant',
  referrer: 'origin-when-cross-origin',
  colorScheme: 'light',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://riceandspicepeoria.com',
    title: 'Rice & Spice - Authentic Indian Restaurant in Peoria, IL',
    description: 'Experience authentic Indian cuisine at Rice & Spice in Peoria, Illinois. Traditional dishes, Saturday buffet, fresh ingredients. Dine-in, takeout & catering available.',
    siteName: 'Rice & Spice Restaurant',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Rice & Spice - Authentic Indian Restaurant in Peoria, IL',
      },
      {
        url: '/images/rice-and-spice.png',
        width: 400,
        height: 400,
        alt: 'Rice & Spice Restaurant Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rice & Spice - Authentic Indian Restaurant in Peoria, IL',
    description: 'Experience authentic Indian cuisine at Rice & Spice in Peoria, Illinois. Traditional dishes, Saturday buffet, fresh ingredients.',
    images: ['/images/og-image.jpg'],
    creator: '@riceandspicepeoria',
    site: '@riceandspicepeoria',
  },
  verification: {
    google: 'your-google-verification-code', // Replace with actual Google Search Console verification
    yandex: 'your-yandex-verification-code', // Replace if needed
    yahoo: 'your-yahoo-verification-code', // Replace if needed
  },
  category: 'restaurant',
  classification: 'Indian Restaurant',
  other: {
    'business:contact_data:street_address': '1200 W Main St Ste 10',
    'business:contact_data:locality': 'Peoria',
    'business:contact_data:region': 'IL',
    'business:contact_data:postal_code': '61606',
    'business:contact_data:country_name': 'United States',
    'business:contact_data:phone_number': '(309) 670-1029',
    'business:contact_data:website': 'https://riceandspicepeoria.com',
    'place:location:latitude': '40.6892',
    'place:location:longitude': '-89.5890',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${poppins.variable} ${cinzelDecorative.variable} font-sans`}>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google.com" />
        <link rel="preconnect" href="https://maps.googleapis.com" />
        
        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/images/rice-and-spice.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/rice-and-spice.png" />
        
        {/* Canonical URL will be set per page */}
        <link rel="canonical" href="https://riceandspicepeoria.com" />
        
        {/* Additional meta tags for local SEO */}
        <meta name="geo.region" content="US-IL" />
        <meta name="geo.placename" content="Peoria" />
        <meta name="geo.position" content="40.6892;-89.5890" />
        <meta name="ICBM" content="40.6892, -89.5890" />
        
        {/* Business specific */}
        <meta name="business:hours" content="Tue-Fri: 11AM-2:30PM, 4:30-9PM; Sat: 11AM-3PM, 5-9PM; Sun-Mon: Closed" />
        <meta name="business:phone" content="(309) 670-1029" />
        <meta name="business:address" content="1200 W Main St Ste 10, Peoria, IL 61606" />
        
        {/* FIXED: Schema.org structured data - NO MORE EVENTS SCHEMA */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Restaurant",
              "name": "Rice & Spice",
              "description": "Authentic Indian restaurant serving traditional dishes with fresh ingredients and aromatic spices in Peoria, Illinois.",
              "url": "https://riceandspicepeoria.com",
              "telephone": "(309) 670-1029",
              "email": "contact@riceandspicepeoria.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "1200 W Main St Ste 10",
                "addressLocality": "Peoria",
                "addressRegion": "IL",
                "postalCode": "61606",
                "addressCountry": "US"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "40.6892",
                "longitude": "-89.5890"
              },
              "openingHours": [
                "Tu-Fr 11:00-14:30",
                "Tu-Fr 16:30-21:00", 
                "Sa 11:00-15:00",
                "Sa 17:00-21:00"
              ],
              "servesCuisine": "Indian",
              "priceRange": "$$",
              "image": [
                "https://riceandspicepeoria.com/images/rice-and-spice.png",
                "https://riceandspicepeoria.com/images/og-image.jpg"
              ],
              "logo": "https://riceandspicepeoria.com/images/rice-and-spice.png",
              "sameAs": [
                "https://www.facebook.com/share/16NJkM4ooY/",
                "https://www.instagram.com/ricea.ndspice"
              ],
              "hasMenu": "https://riceandspicepeoria.com/menu",
              "acceptsReservations": "True",
              "paymentAccepted": "Cash, Credit Card",
              "currenciesAccepted": "USD",
              // FIXED: Removed hasOfferCatalog with FoodEvent - now using proper service schema
              "makesOffer": [
                {
                  "@type": "Offer",
                  "name": "Saturday Indian Buffet",
                  "description": "All-you-can-eat Indian buffet featuring rotating selection of authentic dishes including Chicken Tikka Masala, Biryani, Dal, Naan, and much more. Available every Saturday.",
                  "price": "17.99",
                  "priceCurrency": "USD",
                  "availability": "https://schema.org/InStock",
                  "category": "Buffet Service",
                  "validFrom": "2024-01-01",
                  "eligibleRegion": {
                    "@type": "Place",
                    "name": "Peoria, Illinois"
                  }
                }
              ],
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "127",
                "bestRating": "5",
                "worstRating": "1"
              }
            })
          }}
        />
        
        {/* Local Business structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Rice & Spice",
              "image": "https://riceandspicepeoria.com/images/rice-and-spice.png",
              "telephone": "(309) 670-1029",
              "email": "contact@riceandspicepeoria.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "1200 W Main St Ste 10",
                "addressLocality": "Peoria", 
                "addressRegion": "IL",
                "postalCode": "61606",
                "addressCountry": "US"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "40.6892",
                "longitude": "-89.5890"
              },
              "url": "https://riceandspicepeoria.com",
              "openingHours": [
                "Tu-Fr 11:00-14:30",
                "Tu-Fr 16:30-21:00",
                "Sa 11:00-15:00", 
                "Sa 17:00-21:00"
              ],
              "paymentAccepted": "Cash, Credit Card",
              "currenciesAccepted": "USD"
            })
          }}
        />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
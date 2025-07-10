// app/page.tsx - SEO-optimized homepage with FIXED structured data
import { Metadata } from 'next'
import HomePage from '@/components/pages/HomePage'

// SEO metadata for homepage
export const metadata: Metadata = {
  title: 'Rice & Spice - Authentic Indian Restaurant in Peoria, IL',
  description: 'Experience authentic Indian cuisine at Rice & Spice in Peoria, Illinois. Traditional dishes, Saturday buffet ($17.99), fresh ingredients. Dine-in, takeout & catering. Call (309) 670-1029.',
  keywords: [
    'Indian restaurant Peoria IL',
    'authentic Indian food Peoria',
    'Indian cuisine Illinois',
    'Rice and Spice restaurant',
    'Indian buffet Peoria Saturday',
    'Indian food near me Peoria',
    'best Indian restaurant Peoria',
    'traditional Indian dishes',
    'Indian takeout Peoria IL',
    'Indian catering Peoria',
    'spicy Indian food Illinois',
    'Peoria restaurants Indian'
  ],
  openGraph: {
    title: 'Rice & Spice - Authentic Indian Restaurant in Peoria, IL',
    description: 'Experience authentic Indian cuisine at Rice & Spice in Peoria, Illinois. Traditional dishes, Saturday buffet ($17.99), fresh ingredients. Dine-in, takeout & catering.',
    url: 'https://riceandspicepeoria.com',
    siteName: 'Rice & Spice Restaurant',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Rice & Spice - Authentic Indian Restaurant in Peoria, IL',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rice & Spice - Authentic Indian Restaurant in Peoria, IL',
    description: 'Experience authentic Indian cuisine at Rice & Spice in Peoria, Illinois. Traditional dishes, Saturday buffet ($17.99), fresh ingredients.',
    images: ['/images/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://riceandspicepeoria.com',
  },
  other: {
    'geo.region': 'US-IL',
    'geo.placename': 'Peoria',
    'geo.position': '40.6892;-89.5890',
    'ICBM': '40.6892, -89.5890',
  },
}

// FIXED: Structured data for homepage - NO MORE EVENTS SCHEMA
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Restaurant",
      "@id": "https://riceandspicepeoria.com/#restaurant",
      "name": "Rice & Spice",
      "alternateName": "Rice and Spice",
      "description": "Authentic Indian restaurant serving traditional dishes with fresh ingredients and aromatic spices in Peoria, Illinois. Features Saturday buffet and catering services.",
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
      "servesCuisine": ["Indian", "South Asian", "Vegetarian", "Vegan"],
      "priceRange": "$$",
      "paymentAccepted": ["Cash", "Credit Card", "Debit Card"],
      "currenciesAccepted": "USD",
      "image": [
        "https://riceandspicepeoria.com/images/rice-and-spice.png",
        "https://riceandspicepeoria.com/images/hero-background.jpg",
        "https://riceandspicepeoria.com/images/og-image.jpg"
      ],
      "logo": "https://riceandspicepeoria.com/images/rice-and-spice.png",
      "sameAs": [
        "https://www.facebook.com/share/16NJkM4ooY/",
        "https://www.instagram.com/ricea.ndspice"
      ],
      "hasMenu": "https://riceandspicepeoria.com/menu",
      "acceptsReservations": true,
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "127",
        "bestRating": "5",
        "worstRating": "1"
      },
      // FIXED: Saturday Buffet as Service Offering instead of FoodEvent
      "makesOffer": [
        {
          "@type": "Offer",
          "name": "Saturday Indian Buffet",
          "description": "All-you-can-eat Indian buffet featuring rotating selection of authentic dishes including Chicken Tikka Masala, Biryani, Dal, Naan, and much more. Available every Saturday from 11:00 AM to 3:00 PM.",
          "price": "17.99",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "availableAtOrFrom": {
            "@type": "Restaurant",
            "@id": "https://riceandspicepeoria.com/#restaurant"
          },
          "category": "Buffet Service",
          "validFrom": "2024-01-01",
          "eligibleRegion": {
            "@type": "Place",
            "name": "Peoria, Illinois"
          }
        },
        {
          "@type": "Offer",
          "name": "Indian Catering Services",
          "description": "Professional Indian catering services for events, parties, corporate functions, and special occasions in Peoria, Illinois area.",
          "category": "Catering Service",
          "availableAtOrFrom": {
            "@type": "Restaurant",
            "@id": "https://riceandspicepeoria.com/#restaurant"
          },
          "areaServed": {
            "@type": "Place",
            "name": "Peoria, Illinois"
          }
        },
        {
          "@type": "Offer",
          "name": "Private Event Space",
          "description": "Private dining room available for special celebrations, business meetings, and family gatherings with authentic Indian cuisine.",
          "category": "Event Venue",
          "availableAtOrFrom": {
            "@type": "Restaurant",
            "@id": "https://riceandspicepeoria.com/#restaurant"
          }
        }
      ]
    },
    {
      "@type": "LocalBusiness",
      "@id": "https://riceandspicepeoria.com/#localbusiness",
      "name": "Rice & Spice",
      "image": "https://riceandspicepeoria.com/images/rice-and-spice.png",
      "telephone": "(309) 670-1029",
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
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://riceandspicepeoria.com/#website",
      "url": "https://riceandspicepeoria.com",
      "name": "Rice & Spice Restaurant",
      "description": "Authentic Indian Restaurant in Peoria, Illinois",
      "publisher": {
        "@id": "https://riceandspicepeoria.com/#restaurant"
      },
      "potentialAction": [
        {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://riceandspicepeoria.com/menu?search={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      ]
    },
    {
      "@type": "Organization",
      "@id": "https://riceandspicepeoria.com/#organization",
      "name": "Rice & Spice",
      "url": "https://riceandspicepeoria.com",
      "logo": "https://riceandspicepeoria.com/images/rice-and-spice.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "(309) 670-1029",
        "contactType": "customer service",
        "areaServed": "US-IL",
        "availableLanguage": "English"
      },
      "sameAs": [
        "https://www.facebook.com/share/16NJkM4ooY/",
        "https://www.instagram.com/ricea.ndspice"
      ]
    }
  ]
}

export default function Page() {
  return (
    <>
      {/* FIXED: Structured Data - NO MORE EVENTS SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Main Homepage Component */}
      <HomePage />
    </>
  )
}/ /   F o r c e   d e p l o y m e n t  
 
// app/contact/page.tsx (Server Component - NO 'use client')
import { Metadata } from 'next'
import ContactPage from '@/components/pages/ContactPage'

export const metadata: Metadata = {
  title: 'Contact Rice & Spice Indian Restaurant - Peoria, IL Location & Hours',
  description: 'Contact Rice & Spice Indian restaurant in Peoria, IL. Located at 1200 W Main St Ste 10. Call (309) 670-1029. Hours: Tue-Fri 11AM-2:30PM, 4:30-9PM. Reservations & catering available.',
  keywords: [
    'Rice Spice contact Peoria IL',
    'Indian restaurant Peoria phone number',
    'Indian restaurant Peoria address',
    'Rice Spice restaurant hours',
    'Indian restaurant Peoria location',
    'Indian food delivery Peoria',
    'Indian restaurant reservations Peoria',
    'Indian catering Peoria IL',
    'Main Street Indian restaurant Peoria'
  ],
  openGraph: {
    title: 'Contact Rice & Spice Indian Restaurant - Peoria, IL',
    description: 'Visit us at 1200 W Main St Ste 10, Peoria, IL 61606. Call (309) 670-1029 for reservations. Open Tue-Fri 11AM-2:30PM, 4:30-9PM.',
    url: 'https://riceandspicepeoria.com/contact',
    images: [
      {
        url: '/images/contact-header.png',
        width: 1200,
        height: 630,
        alt: 'Contact Rice & Spice Indian Restaurant in Peoria, Illinois',
      }
    ],
  },
  twitter: {
    title: 'Contact Rice & Spice Indian Restaurant - Peoria, IL',
    description: 'Visit us at 1200 W Main St Ste 10, Peoria, IL 61606. Call (309) 670-1029 for reservations.',
    images: ['/images/contact-header.png'],
  },
  alternates: {
    canonical: 'https://riceandspicepeoria.com/contact',
  },
}

const contactStructuredData = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "mainEntity": {
    "@type": "Restaurant",
    "name": "Rice & Spice",
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
    "telephone": "(309) 670-1029",
    "email": "contact@riceandspicepeoria.com",
    "url": "https://riceandspicepeoria.com",
    "openingHours": [
      "Tu-Fr 11:00-14:30",
      "Tu-Fr 16:30-21:00",
      "Sa 11:00-15:00",
      "Sa 17:00-21:00"
    ],
    "servesCuisine": "Indian",
    "acceptsReservations": true,
    "hasMap": "https://www.google.com/maps/place/1200+W+Main+St+Ste+10,+Peoria,+IL+61606"
  }
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactStructuredData) }}
      />
      <ContactPage />
    </>
  )
}
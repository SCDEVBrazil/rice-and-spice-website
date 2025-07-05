// app/menu/page.tsx (Server Component - NO 'use client')
import { Metadata } from 'next'
import MenuPage from '@/components/pages/MenuPage'

export const metadata: Metadata = {
  title: 'Indian Food Menu - Rice & Spice Restaurant Peoria, IL',
  description: 'Explore our authentic Indian menu featuring 141+ dishes: biryani, curry, tandoori, naan, dosa, and more. Traditional Indian cuisine with fresh spices in Peoria, Illinois.',
  keywords: [
    'Indian menu Peoria IL',
    'Indian food menu',
    'biryani menu Peoria',
    'Indian curry menu',
    'tandoori menu',
    'Indian restaurant menu Illinois',
    'authentic Indian dishes Peoria',
    'vegetarian Indian food menu',
    'Indian takeout menu',
    'dosa menu Peoria',
    'naan bread menu',
    'Indian buffet menu Saturday'
  ],
  openGraph: {
    title: 'Authentic Indian Food Menu - Rice & Spice Peoria',
    description: 'Browse our extensive Indian menu with 141+ authentic dishes including biryani, curry, tandoori, dosa, and traditional Indian breads.',
    url: 'https://riceandspicepeoria.com/menu',
    images: [
      {
        url: '/images/menu-header.jpg',
        width: 1200,
        height: 630,
        alt: 'Rice & Spice Indian Restaurant Menu - Authentic Indian Food in Peoria, IL',
      }
    ],
  },
  twitter: {
    title: 'Authentic Indian Food Menu - Rice & Spice Peoria',
    description: 'Browse our extensive Indian menu with 141+ authentic dishes including biryani, curry, tandoori, dosa, and traditional Indian breads.',
    images: ['/images/menu-header.jpg'],
  },
  alternates: {
    canonical: 'https://riceandspicepeoria.com/menu',
  },
}

const menuStructuredData = {
  "@context": "https://schema.org",
  "@type": "Menu",
  "name": "Rice & Spice Indian Restaurant Menu",
  "description": "Authentic Indian cuisine menu featuring traditional dishes from various regions of India",
  "inLanguage": "en-US",
  "menuAddOn": [
    {
      "@type": "MenuSection",
      "name": "Vegetarian Appetizers",
      "description": "Traditional Indian vegetarian starters and appetizers",
      "hasMenuSection": [
        {
          "@type": "MenuItem",
          "name": "Samosas",
          "description": "Crispy pastries filled with spiced vegetables"
        },
        {
          "@type": "MenuItem", 
          "name": "Pakoras",
          "description": "Vegetable fritters with traditional spices"
        }
      ]
    },
    {
      "@type": "MenuSection",
      "name": "Tandoori Specialties",
      "description": "Authentic tandoori dishes cooked in traditional clay oven",
      "hasMenuSection": [
        {
          "@type": "MenuItem",
          "name": "Chicken Tikka",
          "description": "Marinated chicken cooked in tandoori oven"
        },
        {
          "@type": "MenuItem",
          "name": "Tandoori Chicken",
          "description": "Traditional Indian barbecued chicken"
        }
      ]
    },
    {
      "@type": "MenuSection",
      "name": "Biryani & Rice",
      "description": "Aromatic rice dishes with authentic Indian spices",
      "hasMenuSection": [
        {
          "@type": "MenuItem",
          "name": "Chicken Biryani",
          "description": "Fragrant basmati rice with spiced chicken"
        },
        {
          "@type": "MenuItem",
          "name": "Vegetable Biryani", 
          "description": "Aromatic rice with mixed vegetables and spices"
        }
      ]
    }
  ]
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(menuStructuredData) }}
      />
      <MenuPage />
    </>
  )
}
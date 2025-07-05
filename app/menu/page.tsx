'use client'

import { useState, useEffect } from 'react'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, RefreshCw, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MenuSectionImage } from "@/components/menu-section-image"
import { adminData } from '@/lib/admin'
import type { MenuItem } from '@/lib/admin/types'
import { Metadata } from 'next'

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

// Add this structured data script to your menu page component
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

// Helper function to filter items by ID pattern (for subcategories)
function filterItemsByIdPattern(items: MenuItem[], pattern: string) {
  return items.filter(item => item.id.includes(pattern))
}

// Helper function to get items by category
function getItemsByCategory(items: MenuItem[], category: string): MenuItem[] {
  return items.filter(item => item.category === category && item.isAvailable !== false)
}

// Reusable Menu Section Component
interface MenuSectionProps {
  title: string
  items: MenuItem[]
  showImage?: boolean
  imageSection?: string
  subcategoryGroups?: { [key: string]: MenuItem[] }
  loading?: boolean
}

function MenuSection({ title, items, showImage = true, imageSection, subcategoryGroups, loading }: MenuSectionProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-amber-100">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading {title}...</span>
          </div>
        </div>
      </div>
    )
  }

  const hasItems = subcategoryGroups 
    ? Object.values(subcategoryGroups).some(group => group.length > 0)
    : items.length > 0

  if (!hasItems) {
    return (
      <div className="text-center py-8">
        <div className="text-amber-200">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <p>No items available in {title} category</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Section Image */}
      {showImage && imageSection && (
        <div className="text-center">
          <MenuSectionImage section={imageSection} size="large" />
        </div>
      )}

      {/* Subcategory Groups */}
      {subcategoryGroups ? (
        <div className="space-y-8">
          {Object.entries(subcategoryGroups).map(([subcategoryName, subcategoryItems]) => (
            subcategoryItems.length > 0 && (
              <div key={subcategoryName}>
                <h3 className="text-xl font-bold text-yellow-400 mb-4 text-center">
                  {subcategoryName}
                </h3>
                <div className="grid gap-4">
                  {subcategoryItems.map((item) => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      ) : (
        /* Regular Items */
        <div className="grid gap-4">
          {items.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}

// Menu Item Card Component
function MenuItemCard({ item }: { item: MenuItem }) {
  return (
    <Card className="bg-yellow-900/30 backdrop-blur-sm border-2 border-yellow-600/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-amber-100">
                {item.name}
              </h3>
              {item.isPopular && (
                <Badge className="bg-yellow-600 text-amber-900 text-xs">
                  Popular
                </Badge>
              )}
            </div>
            <p className="text-amber-200 text-sm leading-relaxed">
              {item.description}
            </p>
          </div>
          <div className="ml-4 text-right">
            <span className="text-xl font-bold text-yellow-400">
              ${item.price.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Category-specific components that use Firebase data
function TiffinMenuSection({ items, loading }: { items: MenuItem[], loading: boolean }) {
  const allTiffinItems = getItemsByCategory(items, 'Tiffin')
  
  // Check if we have enough items to warrant subcategories
  const dosaDishes = filterItemsByIdPattern(allTiffinItems, 'dosa')
  const uttappamDishes = filterItemsByIdPattern(allTiffinItems, 'uttappam')
  const idlyDishes = filterItemsByIdPattern(allTiffinItems, 'idly')
  const otherItems = allTiffinItems.filter(item => 
    !item.id.includes('dosa') && 
    !item.id.includes('uttappam') && 
    !item.id.includes('idly')
  )

  // Only use subcategories if we have multiple types with sufficient items
  const hasMultipleSubcategories = [dosaDishes, uttappamDishes, idlyDishes, otherItems].filter(group => group.length > 0).length > 1
  
  if (hasMultipleSubcategories && (dosaDishes.length > 1 || uttappamDishes.length > 1 || idlyDishes.length > 1)) {
    const subcategoryGroups: { [key: string]: MenuItem[] } = {}
    
    if (dosaDishes.length > 0) subcategoryGroups["Dosa Varieties"] = dosaDishes
    if (uttappamDishes.length > 0) subcategoryGroups["Uttappam Varieties"] = uttappamDishes
    if (idlyDishes.length > 0) subcategoryGroups["Idly Varieties"] = idlyDishes
    if (otherItems.length > 0) subcategoryGroups["Other Tiffin Items"] = otherItems

    return (
      <MenuSection
        title="Tiffin"
        items={[]}
        imageSection="tiffin"
        subcategoryGroups={subcategoryGroups}
        loading={loading}
      />
    )
  }

  // Show all items without subcategories
  return (
    <MenuSection
      title="Tiffin"
      items={allTiffinItems}
      imageSection="tiffin"
      loading={loading}
    />
  )
}

function VegStarterMenuSection({ items, loading }: { items: MenuItem[], loading: boolean }) {
  const allVegStarterItems = getItemsByCategory(items, 'Veg Starter')
  
  // Check if we have enough items to warrant subcategories
  const chatItems = filterItemsByIdPattern(allVegStarterItems, 'chat')
  const pakodaItems = filterItemsByIdPattern(allVegStarterItems, 'pakoda')
  const gobiItems = filterItemsByIdPattern(allVegStarterItems, 'gobi')
  const cornItems = filterItemsByIdPattern(allVegStarterItems, 'corn')
  const paneerItems = filterItemsByIdPattern(allVegStarterItems, 'paneer')
  const otherItems = allVegStarterItems.filter(item => 
    !item.id.includes('chat') && 
    !item.id.includes('pakoda') && 
    !item.id.includes('gobi') && 
    !item.id.includes('corn') && 
    !item.id.includes('paneer')
  )

  // Only use subcategories if we have multiple types with sufficient items
  const hasMultipleSubcategories = [chatItems, pakodaItems, gobiItems, cornItems, paneerItems, otherItems].filter(group => group.length > 0).length > 1
  
  if (hasMultipleSubcategories && (chatItems.length > 1 || pakodaItems.length > 1 || gobiItems.length > 1 || cornItems.length > 1 || paneerItems.length > 1)) {
    const subcategoryGroups: { [key: string]: MenuItem[] } = {}
    
    if (chatItems.length > 0) subcategoryGroups["Chat Items"] = chatItems
    if (pakodaItems.length > 0) subcategoryGroups["Pakoda/Fritters"] = pakodaItems
    if (gobiItems.length > 0) subcategoryGroups["Gobi (Cauliflower) Dishes"] = gobiItems
    if (cornItems.length > 0) subcategoryGroups["Corn Dishes"] = cornItems
    if (paneerItems.length > 0) subcategoryGroups["Paneer Dishes"] = paneerItems
    if (otherItems.length > 0) subcategoryGroups["Other Items"] = otherItems

    return (
      <MenuSection
        title="Veg Starter"
        items={[]}
        imageSection="veg-starter"
        subcategoryGroups={subcategoryGroups}
        loading={loading}
      />
    )
  }

  // Show all items without subcategories
  return (
    <MenuSection
      title="Veg Starter"
      items={allVegStarterItems}
      imageSection="veg-starter"
      loading={loading}
    />
  )
}

function NonVegStarterMenuSection({ items, loading }: { items: MenuItem[], loading: boolean }) {
  const allNonVegStarterItems = getItemsByCategory(items, 'Non Veg Starter')

  return (
    <MenuSection
      title="Non Veg Starter"
      items={allNonVegStarterItems}
      imageSection="non-veg-starter"
      loading={loading}
    />
  )
}

function VegCurryMenuSection({ items, loading }: { items: MenuItem[], loading: boolean }) {
  const allVegCurryItems = getItemsByCategory(items, 'Veg Curry')

  return (
    <MenuSection
      title="Veg Curry"
      items={allVegCurryItems}
      imageSection="curry"
      loading={loading}
    />
  )
}

function EggCurryMenuSection({ items, loading }: { items: MenuItem[], loading: boolean }) {
  const allEggCurryItems = getItemsByCategory(items, 'Egg Curry')

  return (
    <MenuSection
      title="Egg Curry"
      items={allEggCurryItems}
      imageSection="curry"
      loading={loading}
    />
  )
}

function NonVegCurryMenuSection({ items, loading }: { items: MenuItem[], loading: boolean }) {
  const allNonVegCurryItems = getItemsByCategory(items, 'Non Veg Curry')
  
  // Check if we have enough items to warrant subcategories
  const chickenItems = filterItemsByIdPattern(allNonVegCurryItems, 'chicken')
  const lambItems = filterItemsByIdPattern(allNonVegCurryItems, 'lamb')
  const goatItems = filterItemsByIdPattern(allNonVegCurryItems, 'goat')
  const seafoodItems = filterItemsByIdPattern(allNonVegCurryItems, 'seafood')
  const otherItems = allNonVegCurryItems.filter(item => 
    !item.id.includes('chicken') && 
    !item.id.includes('lamb') && 
    !item.id.includes('goat') && 
    !item.id.includes('seafood')
  )

  // Only use subcategories if we have multiple types with sufficient items
  const hasMultipleSubcategories = [chickenItems, lambItems, goatItems, seafoodItems, otherItems].filter(group => group.length > 0).length > 1
  
  if (hasMultipleSubcategories && (chickenItems.length > 1 || lambItems.length > 1 || goatItems.length > 1 || seafoodItems.length > 1)) {
    const subcategoryGroups: { [key: string]: MenuItem[] } = {}
    
    if (chickenItems.length > 0) subcategoryGroups["Chicken Curries"] = chickenItems
    if (lambItems.length > 0) subcategoryGroups["Lamb Curries"] = lambItems
    if (goatItems.length > 0) subcategoryGroups["Goat Curries"] = goatItems
    if (seafoodItems.length > 0) subcategoryGroups["Seafood Curries"] = seafoodItems
    if (otherItems.length > 0) subcategoryGroups["Other Curries"] = otherItems

    return (
      <MenuSection
        title="Non Veg Curry"
        items={[]}
        imageSection="curry"
        subcategoryGroups={subcategoryGroups}
        loading={loading}
      />
    )
  }

  // Show all items without subcategories
  return (
    <MenuSection
      title="Non Veg Curry"
      items={allNonVegCurryItems}
      imageSection="curry"
      loading={loading}
    />
  )
}

function BreadMenuSection({ items, loading }: { items: MenuItem[], loading: boolean }) {
  const allBreadItems = getItemsByCategory(items, 'Bread')

  return (
    <MenuSection
      title="Bread"
      items={allBreadItems}
      imageSection="bread"
      loading={loading}
    />
  )
}

function RiceMenuSection({ items, loading }: { items: MenuItem[], loading: boolean }) {
  const allRiceItems = getItemsByCategory(items, 'Rice')
  
  const subcategoryGroups = {
    "Biryani - Hyderabadi Style": filterItemsByIdPattern(allRiceItems, 'hyderabadi'),
    "Biryani - Gongura Style": filterItemsByIdPattern(allRiceItems, 'gongura'),
    "Fried Rice": filterItemsByIdPattern(allRiceItems, 'fried'),
    "Other Rice Dishes": allRiceItems.filter(item => 
      !item.id.includes('hyderabadi') && 
      !item.id.includes('gongura') && 
      !item.id.includes('fried')
    )
  }

  return (
    <MenuSection
      title="Rice"
      items={[]}
      imageSection="rice"
      subcategoryGroups={subcategoryGroups}
      loading={loading}
    />
  )
}

function OthersMenuSection({ items, loading }: { items: MenuItem[], loading: boolean }) {
  const allOthersItems = getItemsByCategory(items, 'Others')

  return (
    <MenuSection
      title="Others"
      items={allOthersItems}
      imageSection="dessert"
      loading={loading}
    />
  )
}

function NoodlesMenuSection({ items, loading }: { items: MenuItem[], loading: boolean }) {
  const allNoodlesItems = getItemsByCategory(items, 'Noodles')

  return (
    <MenuSection
      title="Noodles"
      items={allNoodlesItems}
      imageSection="noodles"
      loading={loading}
    />
  )
}

function TandoorMenuSection({ items, loading }: { items: MenuItem[], loading: boolean }) {
  const allTandoorItems = getItemsByCategory(items, 'Tandoor')

  return (
    <MenuSection
      title="Tandoor"
      items={allTandoorItems}
      imageSection="tandoori"
      loading={loading}
    />
  )
}

// Main Menu Page Component
export default function MenuPage() {
  // State for dynamic data
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [currentTab, setCurrentTab] = useState('tiffin')

  useEffect(() => {
    loadMenuData()
  }, [])

  const loadMenuData = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Load menu items and categories from Firebase
      const [itemsData, categoriesData] = await Promise.all([
        adminData.getMenuItems(),
        adminData.getCategories()
      ])
      
      setMenuItems(itemsData)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Failed to load menu data:', error)
      setError('Failed to load menu information')
      
      // Fallback to empty arrays to prevent crashes
      setMenuItems([])
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  // Get statistics for display
  const totalItems = menuItems.length
  const availableItems = menuItems.filter(item => item.isAvailable !== false).length
  const popularItems = menuItems.filter(item => item.isPopular).length

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[500px]">
        <div className="absolute inset-0">
          <Image
            src="/images/menu-header.jpg"
            alt="Indian Food Spread"
            fill
            className="object-cover object-center brightness-[0.7]"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30" />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-5xl text-yellow-400 mb-4" style={{ fontFamily: 'var(--font-cinzel-decorative), serif', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            Our Menu
          </h1>
          <div className="h-1 w-20 bg-yellow-500 mb-4"></div>
          
          {/* Menu Statistics */}
          {!loading && !error && (
            <div className="flex gap-8 text-amber-100 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{totalItems}</div>
                <div>Total Items</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{categories.length}</div>
                <div>Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{popularItems}</div>
                <div>Popular Items</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Menu Content */}
      <section className="py-16 bg-gradient-to-br from-amber-900 to-black">
        <div className="container mx-auto px-4">
          <div className="w-full mx-auto px-4">
            
            {/* Loading State */}
            {loading && (
              <div className="text-center py-16">
                <div className="flex items-center justify-center gap-3 text-amber-100">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <span className="text-xl">Loading our delicious menu...</span>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-red-300 mb-2">Unable to Load Menu</h3>
                  <p className="text-red-200 mb-6">{error}</p>
                  <Button
                    onClick={loadMenuData}
                    className="bg-yellow-600 hover:bg-yellow-700 text-amber-900"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              </div>
            )}

            {/* Menu Tabs */}
            {!loading && !error && (
              <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                <TabsList className="mb-8 w-full bg-transparent border-0 p-0">
                  
                  {/* Mobile: Dropdown Menu */}
                  <div className="md:hidden mb-6">
                    <Select value={currentTab} onValueChange={setCurrentTab}>
                      <SelectTrigger className="w-full h-12 bg-yellow-900/50 border-2 border-yellow-600/50 text-amber-100 text-base font-medium shadow-lg">
                        <SelectValue placeholder="Select Menu Category" className="text-amber-100" />
                      </SelectTrigger>
                      <SelectContent className="bg-yellow-900/95 backdrop-blur-sm border-2 border-yellow-600/50 text-amber-100">
                        <SelectItem value="tiffin" className="text-amber-100 hover:bg-yellow-600/30 focus:bg-yellow-600/30 cursor-pointer">
                          🥞 Tiffin (South Indian)
                        </SelectItem>
                        <SelectItem value="veg-starter" className="text-amber-100 hover:bg-yellow-600/30 focus:bg-yellow-600/30 cursor-pointer">
                          🥗 Veg Starter
                        </SelectItem>
                        <SelectItem value="non-veg-starter" className="text-amber-100 hover:bg-yellow-600/30 focus:bg-yellow-600/30 cursor-pointer">
                          🍗 Non-Veg Starter
                        </SelectItem>
                        <SelectItem value="veg-curry" className="text-amber-100 hover:bg-yellow-600/30 focus:bg-yellow-600/30 cursor-pointer">
                          🍛 Veg Curry
                        </SelectItem>
                        <SelectItem value="egg-curry" className="text-amber-100 hover:bg-yellow-600/30 focus:bg-yellow-600/30 cursor-pointer">
                          🥚 Egg Curry
                        </SelectItem>
                        <SelectItem value="non-veg-curry" className="text-amber-100 hover:bg-yellow-600/30 focus:bg-yellow-600/30 cursor-pointer">
                          🍖 Non-Veg Curry
                        </SelectItem>
                        <SelectItem value="bread" className="text-amber-100 hover:bg-yellow-600/30 focus:bg-yellow-600/30 cursor-pointer">
                          🍞 Bread (Naan & Roti)
                        </SelectItem>
                        <SelectItem value="rice" className="text-amber-100 hover:bg-yellow-600/30 focus:bg-yellow-600/30 cursor-pointer">
                          🍚 Rice & Biryani
                        </SelectItem>
                        <SelectItem value="others" className="text-amber-100 hover:bg-yellow-600/30 focus:bg-yellow-600/30 cursor-pointer">
                          🍰 Others (Desserts)
                        </SelectItem>
                        <SelectItem value="noodles" className="text-amber-100 hover:bg-yellow-600/30 focus:bg-yellow-600/30 cursor-pointer">
                          🍜 Noodles
                        </SelectItem>
                        <SelectItem value="tandoor" className="text-amber-100 hover:bg-yellow-600/30 focus:bg-yellow-600/30 cursor-pointer">
                          🔥 Tandoor
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tablet: Horizontal scrolling */}
                  <div className="hidden md:block lg:hidden">
                    <div className="overflow-x-auto pb-2">
                      <div className="flex gap-2 min-w-max">
                        <div className="bg-yellow-900/50 rounded-lg border-2 border-yellow-600/50 h-12 flex items-center justify-center min-w-[100px] shadow-lg">
                          <TabsTrigger value="tiffin" className="text-amber-100 hover:text-yellow-400 data-[state=active]:bg-yellow-600 data-[state=active]:text-amber-900 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 h-10 w-full flex items-center justify-center border-0 bg-transparent whitespace-nowrap">Tiffin</TabsTrigger>
                        </div>
                        <div className="bg-yellow-900/50 rounded-lg border-2 border-yellow-600/50 h-12 flex items-center justify-center min-w-[120px] shadow-lg">
                          <TabsTrigger value="veg-starter" className="text-amber-100 hover:text-yellow-400 data-[state=active]:bg-yellow-600 data-[state=active]:text-amber-900 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 h-10 w-full flex items-center justify-center border-0 bg-transparent whitespace-nowrap">Veg Starter</TabsTrigger>
                        </div>
                        <div className="bg-yellow-900/50 rounded-lg border-2 border-yellow-600/50 h-12 flex items-center justify-center min-w-[140px] shadow-lg">
                          <TabsTrigger value="non-veg-starter" className="text-amber-100 hover:text-yellow-400 data-[state=active]:bg-yellow-600 data-[state=active]:text-amber-900 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 h-10 w-full flex items-center justify-center border-0 bg-transparent whitespace-nowrap">Non-Veg Starter</TabsTrigger>
                        </div>
                        <div className="bg-yellow-900/50 rounded-lg border-2 border-yellow-600/50 h-12 flex items-center justify-center min-w-[110px] shadow-lg">
                          <TabsTrigger value="veg-curry" className="text-amber-100 hover:text-yellow-400 data-[state=active]:bg-yellow-600 data-[state=active]:text-amber-900 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 h-10 w-full flex items-center justify-center border-0 bg-transparent whitespace-nowrap">Veg Curry</TabsTrigger>
                        </div>
                        <div className="bg-yellow-900/50 rounded-lg border-2 border-yellow-600/50 h-12 flex items-center justify-center min-w-[110px] shadow-lg">
                          <TabsTrigger value="egg-curry" className="text-amber-100 hover:text-yellow-400 data-[state=active]:bg-yellow-600 data-[state=active]:text-amber-900 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 h-10 w-full flex items-center justify-center border-0 bg-transparent whitespace-nowrap">Egg Curry</TabsTrigger>
                        </div>
                        <div className="bg-yellow-900/50 rounded-lg border-2 border-yellow-600/50 h-12 flex items-center justify-center min-w-[140px] shadow-lg">
                          <TabsTrigger value="non-veg-curry" className="text-amber-100 hover:text-yellow-400 data-[state=active]:bg-yellow-600 data-[state=active]:text-amber-900 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 h-10 w-full flex items-center justify-center border-0 bg-transparent whitespace-nowrap">Non-Veg Curry</TabsTrigger>
                        </div>
                        <div className="bg-yellow-900/50 rounded-lg border-2 border-yellow-600/50 h-12 flex items-center justify-center min-w-[80px] shadow-lg">
                          <TabsTrigger value="bread" className="text-amber-100 hover:text-yellow-400 data-[state=active]:bg-yellow-600 data-[state=active]:text-amber-900 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 h-10 w-full flex items-center justify-center border-0 bg-transparent whitespace-nowrap">Bread</TabsTrigger>
                        </div>
                        <div className="bg-yellow-900/50 rounded-lg border-2 border-yellow-600/50 h-12 flex items-center justify-center min-w-[80px] shadow-lg">
                          <TabsTrigger value="rice" className="text-amber-100 hover:text-yellow-400 data-[state=active]:bg-yellow-600 data-[state=active]:text-amber-900 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 h-10 w-full flex items-center justify-center border-0 bg-transparent whitespace-nowrap">Rice</TabsTrigger>
                        </div>
                        <div className="bg-yellow-900/50 rounded-lg border-2 border-yellow-600/50 h-12 flex items-center justify-center min-w-[90px] shadow-lg">
                          <TabsTrigger value="others" className="text-amber-100 hover:text-yellow-400 data-[state=active]:bg-yellow-600 data-[state=active]:text-amber-900 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 h-10 w-full flex items-center justify-center border-0 bg-transparent whitespace-nowrap">Others</TabsTrigger>
                        </div>
                        <div className="bg-yellow-900/50 rounded-lg border-2 border-yellow-600/50 h-12 flex items-center justify-center min-w-[100px] shadow-lg">
                          <TabsTrigger value="noodles" className="text-amber-100 hover:text-yellow-400 data-[state=active]:bg-yellow-600 data-[state=active]:text-amber-900 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 h-10 w-full flex items-center justify-center border-0 bg-transparent whitespace-nowrap">Noodles</TabsTrigger>
                        </div>
                        <div className="bg-yellow-900/50 rounded-lg border-2 border-yellow-600/50 h-12 flex items-center justify-center min-w-[100px] shadow-lg">
                          <TabsTrigger value="tandoor" className="text-amber-100 hover:text-yellow-400 data-[state=active]:bg-yellow-600 data-[state=active]:text-amber-900 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 h-10 w-full flex items-center justify-center border-0 bg-transparent whitespace-nowrap">Tandoor</TabsTrigger>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Large Desktop: Original flex layout */}
                  <div className="hidden lg:flex gap-3 h-14 items-center">
                    <div className="bg-yellow-900/50 rounded-lg border-2 border-yellow-600/50 h-12 flex items-center justify-center flex-1 shadow-lg">
                      <TabsTrigger value="tiffin" className="text-amber-100 hover:text-yellow-400 data-[state=active]:bg-yellow-600 data-[state=active]:text-amber-900 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 h-10 w-full flex items-center justify-center border-0 bg-transparent">Tiffin</TabsTrigger>
                    </div>
                    <div className="bg-yellow-900/50 rounded-lg border-2 border-yellow-600/50 h-12 flex items-center justify-center flex-1 shadow-lg">
                      <TabsTrigger value="veg-starter" className="text-amber-100 hover:text-yellow-400 data-[state=active]:bg-yellow-600 data-[state=active]:text-amber-900 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 h-10 w-full flex items-center justify-center border-0 bg-transparent">Veg Starter</TabsTrigger>
                    </div>
                    <div className="bg-yellow-900/50 rounded-lg border-2 border-yellow-600/50 h-12 flex items-center justify-center flex-[1.3] shadow-lg">
                      <TabsTrigger value="non-veg-starter" className="text-amber-100 hover:text-yellow-400 data-[state=active]:bg-yellow-600 data-[state=active]:text-amber-900 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 h-10 w-full flex items-center justify-center border-0 bg-transparent">Non-Veg Starter</TabsTrigger>
                    </div>
                    <div className="bg-yellow-900/50 rounded-lg border-2 border-yellow-600/50 h-12 flex items-center justify-center flex-1 shadow-lg">
                      <TabsTrigger value="veg-curry" className="text-amber-100 hover:text-yellow-400 data-[state=active]:bg-yellow-600 data-[state=active]:text-amber-900 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 h-10 w-full flex items-center justify-center border-0 bg-transparent">Veg Curry</TabsTrigger>
                    </div>
                    <div className="bg-yellow-900/50 rounded-lg border-2 border-yellow-600/50 h-12 flex items-center justify-center flex-1 shadow-lg">
                      <TabsTrigger value="egg-curry" className="text-amber-100 hover:text-yellow-400 data-[state=active]:bg-yellow-600 data-[state=active]:text-amber-900 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 h-10 w-full flex items-center justify-center border-0 bg-transparent">Egg Curry</TabsTrigger>
                    </div>
                    <div className="bg-yellow-900/50 rounded-lg border-2 border-yellow-600/50 h-12 flex items-center justify-center flex-[1.3] shadow-lg">
                      <TabsTrigger value="non-veg-curry" className="text-amber-100 hover:text-yellow-400 data-[state=active]:bg-yellow-600 data-[state=active]:text-amber-900 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 h-10 w-full flex items-center justify-center border-0 bg-transparent">Non-Veg Curry</TabsTrigger>
                    </div>
                    <div className="bg-yellow-900/50 rounded-lg border-2 border-yellow-600/50 h-12 flex items-center justify-center flex-[0.8] shadow-lg">
                      <TabsTrigger value="bread" className="text-amber-100 hover:text-yellow-400 data-[state=active]:bg-yellow-600 data-[state=active]:text-amber-900 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 h-10 w-full flex items-center justify-center border-0 bg-transparent">Bread</TabsTrigger>
                    </div>
                    <div className="bg-yellow-900/50 rounded-lg border-2 border-yellow-600/50 h-12 flex items-center justify-center flex-[0.8] shadow-lg">
                      <TabsTrigger value="rice" className="text-amber-100 hover:text-yellow-400 data-[state=active]:bg-yellow-600 data-[state=active]:text-amber-900 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 h-10 w-full flex items-center justify-center border-0 bg-transparent">Rice</TabsTrigger>
                    </div>
                    <div className="bg-yellow-900/50 rounded-lg border-2 border-yellow-600/50 h-12 flex items-center justify-center flex-1 shadow-lg">
                      <TabsTrigger value="others" className="text-amber-100 hover:text-yellow-400 data-[state=active]:bg-yellow-600 data-[state=active]:text-amber-900 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 h-10 w-full flex items-center justify-center border-0 bg-transparent">Others</TabsTrigger>
                    </div>
                    <div className="bg-yellow-900/50 rounded-lg border-2 border-yellow-600/50 h-12 flex items-center justify-center flex-1 shadow-lg">
                      <TabsTrigger value="noodles" className="text-amber-100 hover:text-yellow-400 data-[state=active]:bg-yellow-600 data-[state=active]:text-amber-900 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 h-10 w-full flex items-center justify-center border-0 bg-transparent">Noodles</TabsTrigger>
                    </div>
                    <div className="bg-yellow-900/50 rounded-lg border-2 border-yellow-600/50 h-12 flex items-center justify-center flex-1 shadow-lg">
                      <TabsTrigger value="tandoor" className="text-amber-100 hover:text-yellow-400 data-[state=active]:bg-yellow-600 data-[state=active]:text-amber-900 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 h-10 w-full flex items-center justify-center border-0 bg-transparent">Tandoor</TabsTrigger>
                    </div>
                  </div>
                </TabsList>

                {/* Tab Contents */}
                <TabsContent value="tiffin">
                  <TiffinMenuSection items={menuItems} loading={false} />
                </TabsContent>

                <TabsContent value="veg-starter">
                  <VegStarterMenuSection items={menuItems} loading={false} />
                </TabsContent>

                <TabsContent value="non-veg-starter">
                  <NonVegStarterMenuSection items={menuItems} loading={false} />
                </TabsContent>

                <TabsContent value="veg-curry">
                  <VegCurryMenuSection items={menuItems} loading={false} />
                </TabsContent>

                <TabsContent value="egg-curry">
                  <EggCurryMenuSection items={menuItems} loading={false} />
                </TabsContent>

                <TabsContent value="non-veg-curry">
                  <NonVegCurryMenuSection items={menuItems} loading={false} />
                </TabsContent>

                <TabsContent value="bread">
                  <BreadMenuSection items={menuItems} loading={false} />
                </TabsContent>

                <TabsContent value="rice">
                  <RiceMenuSection items={menuItems} loading={false} />
                </TabsContent>

                <TabsContent value="others">
                  <OthersMenuSection items={menuItems} loading={false} />
                </TabsContent>

                <TabsContent value="noodles">
                  <NoodlesMenuSection items={menuItems} loading={false} />
                </TabsContent>

                <TabsContent value="tandoor">
                  <TandoorMenuSection items={menuItems} loading={false} />
                </TabsContent>
              </Tabs>
            )}

            {/* Menu Legend */}
            {!loading && !error && popularItems > 0 && (
              <div className="mt-12 text-center">
                <div className="inline-flex items-center gap-2 bg-yellow-900/30 px-4 py-2 rounded-lg border border-yellow-600/30">
                  <Badge className="bg-yellow-600 text-amber-900 text-xs">Popular</Badge>
                  <span className="text-amber-200 text-sm">Customer favorites</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Error Display for Failed Retries */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-900/90 text-red-100 px-4 py-2 rounded-lg shadow-lg border border-red-600/50 z-50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <span className="text-sm">{error}</span>
            <button 
              onClick={() => setError('')}
              className="ml-2 text-red-300 hover:text-red-100"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
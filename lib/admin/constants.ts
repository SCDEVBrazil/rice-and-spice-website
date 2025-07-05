// lib/admin/constants.ts
// Constants and initial data for the admin system

import type { MenuItem, BuffetSettings, RestaurantData, RestaurantInfo } from './types'

// Menu categories from the existing website
export const MENU_CATEGORIES = [
  'Tiffin',
  'Veg Starter',
  'Non Veg Starter', 
  'Veg Curry',
  'Egg Curry',
  'Non Veg Curry',
  'Bread',
  'Rice',
  'Others',
  'Noodles',
  'Tandoor'
] as const

// Storage keys for localStorage
export const STORAGE_KEYS = {
  RESTAURANT_DATA: 'rice_spice_restaurant_data',
  PENDING_CHANGES: 'rice_spice_pending_changes',
  LAST_BACKUP: 'rice_spice_last_backup'
} as const

// Initial buffet settings
export const INITIAL_BUFFET_SETTINGS: BuffetSettings = {
  price: 17.99,
  hours: "11:00AM - 3:00PM",
  description: "All-you-can-eat Saturday buffet featuring rotating dishes and much more!",
  isActive: true,
  updatedAt: new Date().toISOString()
}

// FIXED: Declare INITIAL_RESTAURANT_INFO before using it
export const INITIAL_RESTAURANT_INFO: RestaurantInfo = {
  name: 'Rice & Spice',
  address: '1200 W Main St Ste 10, Peoria, IL 61606',
  phone: '(309) 670-1029',
  email: 'info@riceandspice.com',
  website: 'https://riceandspice.com',
  hours: {
    monday: '11:00 AM - 2:30 PM, 4:30 PM - 9:00 PM',
    tuesday: '11:00 AM - 2:30 PM, 4:30 PM - 9:00 PM',
    wednesday: '11:00 AM - 2:30 PM, 4:30 PM - 9:00 PM',
    thursday: '11:00 AM - 2:30 PM, 4:30 PM - 9:00 PM',
    friday: '11:00 AM - 2:30 PM, 4:30 PM - 9:00 PM',
    saturday: '11:00 AM - 3:00 PM, 5:00 PM - 9:00 PM',
    sunday: 'Closed'
  },
  description: 'Authentic Indian cuisine in the heart of Peoria, Illinois. Experience traditional flavors with a modern twist.',
  updatedAt: new Date().toISOString()
}

// Real menu data extracted from the existing menu page
export const INITIAL_MENU_DATA: MenuItem[] = [
  // Tiffin Section
  {
    id: 'tiffin-1',
    name: 'Plain Dosa',
    description: 'Crispy rice crepe served with sambar and chutneys',
    price: 13.99,
    category: 'Tiffin',
    isAvailable: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'tiffin-2',
    name: 'Masala Dosa',
    description: 'Crispy rice crepe filled with spiced potatoes and onions',
    price: 15.99,
    category: 'Tiffin',
    isAvailable: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'tiffin-3',
    name: 'Mysore Masala Dosa',
    description: 'Crispy rice crepe filled with spiced potatoes and onions',
    price: 15.99,
    category: 'Tiffin',
    isPopular: true,
    isAvailable: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  // Veg Starter Section
  {
    id: 'veg-starter-1',
    name: 'Samosa',
    description: 'Crispy pastry pockets filled with flavorful spices',
    price: 8.50,
    category: 'Veg Starter',
    isAvailable: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'veg-starter-2',
    name: 'Samosa Chat',
    description: 'Crispy fried or baked pastry filled with spiced potatoes and peas',
    price: 11.99,
    category: 'Veg Starter',
    isPopular: true,
    isAvailable: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  // Non Veg Starter Section
  {
    id: 'non-veg-starter-1',
    name: 'Chili Chicken',
    description: 'Spicy chicken dish with a kick of chili',
    price: 18.99,
    category: 'Non Veg Starter',
    isPopular: true,
    isAvailable: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  // Rice Section
  {
    id: 'rice-1',
    name: 'Hyderabadi Goat Biryani',
    description: 'Aromatic goat biryani with a blend of spices',
    price: 20.99,
    category: 'Rice',
    isAvailable: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'rice-2',
    name: 'Vijayawada Chicken Biryani',
    description: 'Flavorful basmati rice cooked with chicken and spices',
    price: 18.99,
    category: 'Rice',
    isAvailable: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  // Tandoor Section
  {
    id: 'tandoor-1',
    name: 'Tandoori Chicken',
    description: 'Marinated chicken cooked to perfection in a traditional Indian clay oven',
    price: 17.99,
    category: 'Tandoor',
    isPopular: true,
    isAvailable: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'tandoor-2',
    name: 'Tandoori Platter',
    description: 'Tilapia, Tandoori chicken, Afghani tikka, Malai Kabba',
    price: 22.99,
    category: 'Tandoor',
    isPopular: true,
    isAvailable: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  }
  // Note: This is a subset for demo purposes
  // In a real implementation, you'd include all menu items
]

// FIXED: Now INITIAL_DATA can use INITIAL_RESTAURANT_INFO since it's declared above
export const INITIAL_DATA: RestaurantData = {
  buffetSettings: INITIAL_BUFFET_SETTINGS,
  categories: [...MENU_CATEGORIES],
  menuItems: INITIAL_MENU_DATA,
  restaurantInfo: INITIAL_RESTAURANT_INFO
}
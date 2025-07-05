// lib/admin/menu-imports/veg-curry-data.ts
// Veg Curry section menu items

import type { MenuItem } from '../types'

export const VEG_CURRY_ITEMS: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>[] = [
  // Paneer Dishes (all $18.99)
  {
    name: 'Kashmiri Paneer',
    description: 'Tender paneer in a rich, creamy Kashmiri-inspired curry',
    price: 18.99,
    category: 'Veg Curry',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Paneer Labaddar',
    description: 'Rich and creamy curry made with paneer',
    price: 18.99,
    category: 'Veg Curry',
    isPopular: true,
    isAvailable: true
  },
  {
    name: 'Afghani Paneer',
    description: 'Tender paneer in a rich and creamy Afghani-inspired curry sauce',
    price: 18.99,
    category: 'Veg Curry',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Saag Paneer',
    description: 'Creamy spinach curry with paneer',
    price: 18.99,
    category: 'Veg Curry',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Paneer Tikka Masala',
    description: 'Marinated paneer in a rich, creamy tomato sauce',
    price: 18.99,
    category: 'Veg Curry',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Paneer Butter Masala',
    description: 'Rich and creamy tomato-based curry with paneer',
    price: 18.99,
    category: 'Veg Curry',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Palak Paneer',
    description: 'Creamy spinach curry with paneer',
    price: 18.99,
    category: 'Veg Curry',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Mutter Paneer',
    description: 'Peas and paneer in a rich, creamy curry sauce',
    price: 18.99,
    category: 'Veg Curry',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Kadai Paneer',
    description: 'Indian-style cheese in a rich, creamy tomato sauce',
    price: 18.99,
    category: 'Veg Curry',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Paneer Mughlai',
    description: 'Rich and creamy curry made with paneer',
    price: 18.99,
    category: 'Veg Curry',
    isPopular: false,
    isAvailable: true
  },
  // Other Vegetable Curries (all $16.99)
  {
    name: 'Vegetable Labaddar',
    description: 'Mixed vegetables in a flavorful curry sauce',
    price: 16.99,
    category: 'Veg Curry',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Okra Masala',
    description: 'Tender okra in a rich, aromatic spice blend',
    price: 16.99,
    category: 'Veg Curry',
    isPopular: true,
    isAvailable: true
  },
  {
    name: 'Navratan Korma',
    description: 'Mixed vegetables in a rich, creamy sauce',
    price: 16.99,
    category: 'Veg Curry',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Aloo Palak',
    description: 'Spinach curry with potatoes',
    price: 16.99,
    category: 'Veg Curry',
    isPopular: true,
    isAvailable: true
  },
  {
    name: 'Dhaba Dal Fry',
    description: 'Traditional lentil curry made with aromatic spices',
    price: 16.99,
    category: 'Veg Curry',
    isPopular: true,
    isAvailable: true
  },
  {
    name: 'Chana Masala',
    description: 'North Indian-style chickpea curry in a rich, aromatic sauce',
    price: 16.99,
    category: 'Veg Curry',
    isPopular: false,
    isAvailable: true
  }
]
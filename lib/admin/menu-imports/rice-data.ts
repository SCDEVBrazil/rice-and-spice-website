// lib/admin/menu-imports/rice-data.ts
// Rice section menu items

import type { MenuItem } from '../types'

export const RICE_ITEMS: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>[] = [
  // Biryani - Hyderabadi Style
  {
    name: 'Hyderabadi Goat Biryani',
    description: 'Aromatic goat biryani with a blend of spices',
    price: 20.99,
    category: 'Rice',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Vijayawada Chicken Biryani',
    description: 'Flavorful basmati rice cooked with chicken and spices',
    price: 18.99,
    category: 'Rice',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Hyderabadi Veg Biryani',
    description: 'Aromatic basmati rice cooked with a blend of spices and vegetables',
    price: 16.49,
    category: 'Rice',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Hyderabadi Paneer Biryani',
    description: 'Flavorful basmati rice cooked with paneer and spices',
    price: 18.99,
    category: 'Rice',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Hyderabadi Egg Biryani',
    description: 'Aromatic basmati rice cooked with eggs and spices',
    price: 17.99,
    category: 'Rice',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Hyderabadi Shrimp Biryani',
    description: 'Savoury shrimp infused in aromatic spices and basmati rice',
    price: 20.99,
    category: 'Rice',
    isPopular: false,
    isAvailable: true
  },
  // Biryani - Gongura Style
  {
    name: 'Gongura Goat Biryani',
    description: 'Savoury goat biryani infused with the tangy flavour of gongura',
    price: 20.99,
    category: 'Rice',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'House Special Tawa Chicken Biryani',
    description: 'Flavorful basmati rice cooked with tender chicken and aromatic spices',
    price: 18.99,
    category: 'Rice',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Gongura Veg Biryani',
    description: 'Savoury rice dish featuring gongura and vegetables',
    price: 16.49,
    category: 'Rice',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Gongura Paneer Biryani',
    description: 'Savoury Indian-style rice dish featuring paneer and gongura',
    price: 18.99,
    category: 'Rice',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Gongura Egg Biryani',
    description: 'Flavorful rice dish featuring eggs and Gongura',
    price: 17.99,
    category: 'Rice',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Gongura Shrimp Biryani',
    description: 'Savoury shrimp infused with Gongura, served over a bed of flavorful rice',
    price: 20.99,
    category: 'Rice',
    isPopular: false,
    isAvailable: true
  },
  // Fried Rice
  {
    name: 'Veg Fried Rice',
    description: 'Mixed vegetables and rice, a flavorful combination',
    price: 16.99,
    category: 'Rice',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Paneer Fried Rice',
    description: 'Indian-style rice dish with paneer',
    price: 18.99,
    category: 'Rice',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Shrimp Fried Rice',
    description: 'Rice with shrimp',
    price: 20.99,
    category: 'Rice',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Egg Fried Rice',
    description: 'Flavorful rice dish with eggs',
    price: 17.99,
    category: 'Rice',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Chicken Fried Rice',
    description: 'Savory rice dish with chicken',
    price: 18.99,
    category: 'Rice',
    isPopular: false,
    isAvailable: true
  }
]
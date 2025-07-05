// lib/admin/menu-imports/egg-curry-data.ts
// Egg Curry section menu items

import type { MenuItem } from '../types'

export const EGG_CURRY_ITEMS: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>[] = [
  // All Egg Curries (all $18.99)
  {
    name: 'Home Style Egg Curry',
    description: 'Eggs in a rich and flavorful curry sauce',
    price: 18.99,
    category: 'Egg Curry',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Gongura Egg Curry',
    description: 'Tangy curry made with eggs and gongura leaves',
    price: 18.99,
    category: 'Egg Curry',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Egg Korma',
    description: 'Rich and creamy egg curry with a delicate blend of spices',
    price: 18.99,
    category: 'Egg Curry',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Egg Masala',
    description: 'Boiled eggs in a rich, aromatic spice blend',
    price: 18.99,
    category: 'Egg Curry',
    isPopular: false,
    isAvailable: true
  }
]
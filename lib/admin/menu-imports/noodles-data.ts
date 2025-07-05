// lib/admin/menu-imports/noodles-data.ts
// Noodles section menu items

import type { MenuItem } from '../types'

export const NOODLES_ITEMS: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Chicken Noodles',
    description: 'Tender noodles served with chicken',
    price: 18.99,
    category: 'Noodles',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Paneer Noodles',
    description: 'Indian-style noodles with paneer',
    price: 18.99,
    category: 'Noodles',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Egg Noodles',
    description: 'Noodles made with eggs',
    price: 17.49,
    category: 'Noodles',
    isPopular: true,
    isAvailable: true
  },
  {
    name: 'Veg Noodles',
    description: 'Stir-fried noodles with vegetables',
    price: 15.49,
    category: 'Noodles',
    isPopular: true,
    isAvailable: true
  },
  {
    name: 'Shrimp Noodles',
    description: 'Noodles with shrimp, a classic combination',
    price: 19.99,
    category: 'Noodles',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Mixed Noodles',
    description: 'Veg, Chicken, Egg and Shrimp',
    price: 21.99,
    category: 'Noodles',
    isPopular: false,
    isAvailable: true
  }
]
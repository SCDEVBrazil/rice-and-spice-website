// lib/admin/menu-imports/others-data.ts
// Others section menu items

import type { MenuItem } from '../types'

export const OTHERS_ITEMS: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Mango Lassi',
    description: 'Creamy yogurt drink blended with sweet mango puree',
    price: 6.49,
    category: 'Others',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Gulab Jamun',
    description: 'Sweet dumplings soaked in a sweet syrup',
    price: 7.99,
    category: 'Others',
    isPopular: false,
    isAvailable: true
  }
]
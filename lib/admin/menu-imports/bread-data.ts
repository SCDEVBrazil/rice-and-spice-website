// lib/admin/menu-imports/bread-data.ts
// Bread section menu items

import type { MenuItem } from '../types'

export const BREAD_ITEMS: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Bullet Naan',
    description: 'Soft, leavened flatbread',
    price: 5.99,
    category: 'Bread',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Cheese Naan',
    description: 'Soft, buttery naan infused with melted cheese',
    price: 5.99,
    category: 'Bread',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Onon Kulcha',
    description: 'Traditional Indian flatbread',
    price: 5.99,
    category: 'Bread',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Garlic Naan',
    description: 'Soft, leavened flatbread infused with garlic',
    price: 4.99,
    category: 'Bread',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Plain Naan',
    description: 'Soft, lightly leavened Indian flatbread',
    price: 3.99,
    category: 'Bread',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Butter Naan',
    description: 'Soft, lightly buttered flatbread',
    price: 3.99,
    category: 'Bread',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Aloo Paratha',
    description: 'Flaky flatbread stuffed with spiced potatoes',
    price: 5.99,
    category: 'Bread',
    isPopular: false,
    isAvailable: true
  }
]
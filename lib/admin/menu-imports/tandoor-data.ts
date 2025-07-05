// lib/admin/menu-imports/tandoor-data.ts
// Tandoor section menu items

import type { MenuItem } from '../types'

export const TANDOOR_ITEMS: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Chicken Tikka',
    description: 'Marinated chicken in a rich, aromatic blend of spices',
    price: 18.99,
    category: 'Tandoor',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Paneer Tikka',
    description: 'Marinated paneer with aromatic spices',
    price: 18.99,
    category: 'Tandoor',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Tandoori Chicken',
    description: 'Marinated chicken cooked to perfection in a traditional Indian clay oven',
    price: 17.99,
    category: 'Tandoor',
    isPopular: true,
    isAvailable: true
  },
  {
    name: 'Murg Malai Tikka',
    description: 'Creamy chicken tikka',
    price: 18.99,
    category: 'Tandoor',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Afghani Chicken Tikka',
    description: 'Tender chicken marinated in aromatic spices',
    price: 18.99,
    category: 'Tandoor',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Shrimp Tikka',
    description: 'Succulent shrimp in a rich, aromatic blend of spices',
    price: 20.99,
    category: 'Tandoor',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Tandoori Platter',
    description: 'Tilapia, Tandoori chicken, Afghani tikka, Malai Kabba',
    price: 22.99,
    category: 'Tandoor',
    isPopular: true,
    isAvailable: true
  }
]
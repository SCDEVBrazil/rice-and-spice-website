// lib/admin/menu-imports/tiffin-data.ts
// Tiffin section menu items

import type { MenuItem } from '../types'

export const TIFFIN_ITEMS: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>[] = [
  // Dosa Varieties
  {
    name: 'Plain Dosa',
    description: 'Crispy rice crepe served with sambar and chutneys',
    price: 13.99,
    category: 'Tiffin',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Masala Dosa',
    description: 'Crispy rice crepe filled with spiced potatoes and onions',
    price: 15.99,
    category: 'Tiffin',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Onion Dosa',
    description: 'Crispy rice crepe with onions',
    price: 15.99,
    category: 'Tiffin',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Masala Onion Dosa',
    description: 'Thin, crispy rice crepe filled with spiced onions',
    price: 15.99,
    category: 'Tiffin',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Mysore Masala Dosa',
    description: 'Crispy rice crepe filled with spiced potatoes and onions',
    price: 15.99,
    category: 'Tiffin',
    isPopular: true,
    isAvailable: true
  },
  {
    name: 'Ghee Dosa',
    description: 'Crispy rice crepe served with a side of flavorful accompaniments',
    price: 15.99,
    category: 'Tiffin',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Ghee Karam Dosa',
    description: 'Crispy rice crepe with a hint of ghee and spices',
    price: 15.99,
    category: 'Tiffin',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Rava Masala Dosa',
    description: 'Crispy rice crepe filled with spiced potatoes and onions',
    price: 15.99,
    category: 'Tiffin',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Rava Onion Dosa',
    description: 'Rava dosa with onions',
    price: 15.99,
    category: 'Tiffin',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Spring Dosa',
    description: 'Thin, crispy rice crepe served with flavorful fillings',
    price: 15.99,
    category: 'Tiffin',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Egg Dosa',
    description: 'Dosa with egg',
    price: 15.99,
    category: 'Tiffin',
    isPopular: false,
    isAvailable: true
  },
  // Uttappam Varieties
  {
    name: 'Plain Uthappam',
    description: 'Thin, crispy rice pancake',
    price: 13.99,
    category: 'Tiffin',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Onion Uthappam',
    description: 'Thin, crispy rice pancake with caramelized onions',
    price: 15.99,
    category: 'Tiffin',
    isPopular: false,
    isAvailable: true
  },
  // Idly Varieties
  {
    name: 'Idly Vada',
    description: 'Steamed rice cakes served with crispy fried lentil doughnuts',
    price: 9.99,
    category: 'Tiffin',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Idly',
    description: 'Steamed rice cakes, soft and light',
    price: 9.99,
    category: 'Tiffin',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Sambar Idly',
    description: 'Steamed rice cakes served with a flavorful lentil-based vegetable stew',
    price: 9.99,
    category: 'Tiffin',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Sambar Vada',
    description: 'Crispy fried lentil doughnut served with a side of sambar',
    price: 9.99,
    category: 'Tiffin',
    isPopular: true,
    isAvailable: true
  },
  // Other Tiffin Items
  {
    name: 'Chole Bature',
    description: 'Spicy chickpea curry served with a puffed bread',
    price: 16.99,
    category: 'Tiffin',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Poori Bhaji',
    description: 'Traditional Indian puffed bread served with a flavorful potato curry',
    price: 13.99,
    category: 'Tiffin',
    isPopular: true,
    isAvailable: true
  },
  {
    name: 'Paneer Kati Roll',
    description: 'Indian-style flatbread wrapped around marinated paneer',
    price: 17.99,
    category: 'Tiffin',
    isPopular: true,
    isAvailable: true
  },
  {
    name: 'Chicken Kati Roll',
    description: 'Tender chicken wrapped in a flavorful roll',
    price: 18.99,
    category: 'Tiffin',
    isPopular: false,
    isAvailable: true
  }
]
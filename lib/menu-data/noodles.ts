// lib/menu-data/noodles.ts
import { MenuItem } from './types'

export const NOODLES_ITEMS: MenuItem[] = [
  {
    id: 'noodles-chicken-1',
    name: 'Chicken Noodles',
    description: 'Tender noodles served with chicken',
    price: 18.99,
    category: 'Noodles',
    isAvailable: true
  },
  {
    id: 'noodles-paneer-1',
    name: 'Paneer Noodles',
    description: 'Indian-style noodles with paneer',
    price: 18.99,
    category: 'Noodles',
    isAvailable: true
  },
  {
    id: 'noodles-egg-1',
    name: 'Egg Noodles',
    description: 'Noodles made with eggs',
    price: 17.49,
    category: 'Noodles',
    isPopular: true,
    isAvailable: true
  },
  {
    id: 'noodles-veg-1',
    name: 'Veg Noodles',
    description: 'Stir-fried noodles with vegetables',
    price: 15.49,
    category: 'Noodles',
    isPopular: true,
    isAvailable: true
  },
  {
    id: 'noodles-shrimp-1',
    name: 'Shrimp Noodles',
    description: 'Noodles with shrimp, a classic combination',
    price: 19.99,
    category: 'Noodles',
    isAvailable: true
  },
  {
    id: 'noodles-mixed-1',
    name: 'Mixed Noodles',
    description: 'Veg, Chicken, Egg and Shrimp',
    price: 21.99,
    category: 'Noodles',
    isAvailable: true
  }
]
// lib/admin/menu-imports/non-veg-starter-data.ts
// Non Veg Starter section menu items

import type { MenuItem } from '../types'

export const NON_VEG_STARTER_ITEMS: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>[] = [
  // Chicken Dishes
  {
    name: 'Chili Chicken',
    description: 'Spicy chicken dish with a kick of chili',
    price: 18.99,
    category: 'Non Veg Starter',
    isPopular: true,
    isAvailable: true
  },
  {
    name: 'Chicken Manchuriyan',
    description: 'Chicken in Manchurian sauce',
    price: 18.99,
    category: 'Non Veg Starter',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Chicken 65',
    description: 'Spicy chicken dish with a flavorful twist',
    price: 18.99,
    category: 'Non Veg Starter',
    isPopular: true,
    isAvailable: true
  },
  {
    name: 'Pepper Chicken Fry',
    description: 'Spicy chicken strips tossed with peppers',
    price: 18.99,
    category: 'Non Veg Starter',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Kodi Vepudu',
    description: 'Spicy Andhra-style chicken dish',
    price: 18.99,
    category: 'Non Veg Starter',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Chicken Lollipop',
    description: 'Tender chicken wings in a flavorful marinade',
    price: 18.99,
    category: 'Non Veg Starter',
    isPopular: true,
    isAvailable: true
  },
  // Goat
  {
    name: 'Goat Sukkah',
    description: 'Tender goat meat in a flavorful dish',
    price: 21.99,
    category: 'Non Veg Starter',
    isPopular: false,
    isAvailable: true
  },
  // Shrimp Dishes
  {
    name: 'Chili Shrimp',
    description: 'Succulent shrimp in a spicy chili sauce',
    price: 19.99,
    category: 'Non Veg Starter',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Shrimp Manchuriyan',
    description: 'Succulent shrimp in a savory Manchurian-inspired sauce',
    price: 19.99,
    category: 'Non Veg Starter',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Tava Shrimp',
    description: 'Succulent shrimp in a flavorful blend of spices',
    price: 19.99,
    category: 'Non Veg Starter',
    isPopular: false,
    isAvailable: true
  },
  // Fish Dishes
  {
    name: 'Apollo Fish',
    description: 'Spicy fish preparation with aromatic spices',
    price: 19.99,
    category: 'Non Veg Starter',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Chili Fish',
    description: 'Spicy fish dish with a kick of chili',
    price: 19.99,
    category: 'Non Veg Starter',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Tava Fish',
    description: 'Fish in a flavorful blend of spices',
    price: 19.99,
    category: 'Non Veg Starter',
    isPopular: false,
    isAvailable: true
  }
]
// lib/admin/menu-imports/non-veg-curry-data.ts
// Non Veg Curry section menu items

import type { MenuItem } from '../types'

export const NON_VEG_CURRY_ITEMS: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>[] = [
  // Chicken Curries (all $18.99)
  {
    name: 'House Special Chicken Curry',
    description: 'Tender chicken in a rich and flavorful curry sauce',
    price: 18.99,
    category: 'Non Veg Curry',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Chicken Tikka Masala',
    description: 'Tender chicken in a rich, creamy tomato sauce',
    price: 18.99,
    category: 'Non Veg Curry',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Butter Chicken',
    description: 'Tender chicken in a rich, creamy tomato sauce',
    price: 18.99,
    category: 'Non Veg Curry',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Chicken Chettinad',
    description: 'Spicy chicken curry from the Chettinad region, rich in flavor',
    price: 18.99,
    category: 'Non Veg Curry',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Saag Chicken',
    description: 'Tender chicken in a rich spinach curry sauce',
    price: 18.99,
    category: 'Non Veg Curry',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Chicken Labaddar',
    description: 'Tender chicken in a rich, flavorful curry sauce',
    price: 18.99,
    category: 'Non Veg Curry',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Kadai Chicken',
    description: 'Tender chicken in a rich, aromatic curry sauce',
    price: 18.99,
    category: 'Non Veg Curry',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Afghani Chicken Curry',
    description: 'Tender chicken in a rich and flavorful curry sauce',
    price: 18.99,
    category: 'Non Veg Curry',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Gongura Chicken Curry',
    description: 'Tangy and flavorful curry made with gongura leaves and chicken',
    price: 18.99,
    category: 'Non Veg Curry',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Mughlai Chicken',
    description: 'Rich and creamy chicken curry with a blend of spices',
    price: 18.99,
    category: 'Non Veg Curry',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Lucknow Chicken Masala',
    description: 'Tender chicken in a rich, aromatic masala sauce',
    price: 18.99,
    category: 'Non Veg Curry',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Chicken Korma',
    description: 'Tender chicken in a rich, creamy curry sauce',
    price: 18.99,
    category: 'Non Veg Curry',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Chicken Vindaloo',
    description: 'Spicy curry made with marinated chicken in a rich tomato-based sauce',
    price: 18.99,
    category: 'Non Veg Curry',
    isPopular: false,
    isAvailable: true
  },
  // Lamb Curries (all $21.99)
  {
    name: 'Lamb Chili Masala',
    description: 'Tender lamb in a rich, aromatic masala sauce',
    price: 21.99,
    category: 'Non Veg Curry',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Lamb Curry',
    description: 'Tender lamb in a rich, flavorful curry sauce',
    price: 21.99,
    category: 'Non Veg Curry',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Lamb Vindaloo',
    description: 'Tender lamb in a rich, spicy curry sauce',
    price: 21.99,
    category: 'Non Veg Curry',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Lamb Korma',
    description: 'Tender lamb in a rich, creamy curry sauce',
    price: 21.99,
    category: 'Non Veg Curry',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Lamb Rogan Josh',
    description: 'Tender lamb in a rich, aromatic curry sauce',
    price: 21.99,
    category: 'Non Veg Curry',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Lamb Chettinad',
    description: 'Tender lamb in a rich and aromatic Chettinad spice blend',
    price: 21.99,
    category: 'Non Veg Curry',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Lamb Tikka Masala',
    description: 'Tender lamb in a rich, creamy tomato sauce',
    price: 21.99,
    category: 'Non Veg Curry',
    isPopular: false,
    isAvailable: true
  },
  // Goat Curries (all $21.99)
  {
    name: 'Gouse Special Goat Curry',
    description: 'Tender goat meat in a rich and flavorful curry sauce',
    price: 21.99,
    category: 'Non Veg Curry',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Goat Vindaloo',
    description: 'Tender goat in a rich, spicy curry sauce',
    price: 21.99,
    category: 'Non Veg Curry',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Goat Korma',
    description: 'Tender goat in a rich, creamy curry sauce',
    price: 21.99,
    category: 'Non Veg Curry',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Goat Chettinad',
    description: 'Tender goat meat in a rich and flavorful Chettinad curry',
    price: 21.99,
    category: 'Non Veg Curry',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Goat Chili Masala',
    description: 'Tender goat in a rich, aromatic masala sauce',
    price: 21.99,
    category: 'Non Veg Curry',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Kadai Goat',
    description: 'Tender goat meat in a rich and flavorful curry',
    price: 21.99,
    category: 'Non Veg Curry',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Gongura Goat Curry',
    description: 'Tender goat meat cooked in a flavorful Gongura curry sauce',
    price: 21.99,
    category: 'Non Veg Curry',
    isPopular: false,
    isAvailable: true
  },
  // Seafood Curries (all $20.99)
  {
    name: 'Malabar Fish Curry',
    description: 'Tender fish in a rich and flavorful curry sauce',
    price: 20.99,
    category: 'Non Veg Curry',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Fish Pulusu',
    description: 'Tangy fish curry made with a flavorful broth',
    price: 20.99,
    category: 'Non Veg Curry',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Shrimp Masala',
    description: 'Succulent shrimp in a rich, aromatic masala sauce',
    price: 20.99,
    category: 'Non Veg Curry',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Shrimp Tikka Masala',
    description: 'Succulent shrimp in a rich, creamy tomato sauce',
    price: 20.99,
    category: 'Non Veg Curry',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Shrimp Chettinad',
    description: 'Savoury shrimp curry with a blend of spices',
    price: 20.99,
    category: 'Non Veg Curry',
    isPopular: false,
    isAvailable: true
  }
]
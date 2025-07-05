// lib/admin/menu-imports/veg-starter-data.ts
// Veg Starter section menu items

import type { MenuItem } from '../types'

export const VEG_STARTER_ITEMS: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>[] = [
  // Chat Items
  {
    name: 'Samosa',
    description: 'Crispy pastry pockets filled with flavorful spices',
    price: 8.50,
    category: 'Veg Starter',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Samosa Chat',
    description: 'Crispy fried or baked pastry filled with spiced potatoes and peas',
    price: 11.99,
    category: 'Veg Starter',
    isPopular: true,
    isAvailable: true
  },
  {
    name: 'Papdi Chat',
    description: 'Crisp fried flour bread served with yogurt and chutney',
    price: 11.99,
    category: 'Veg Starter',
    isPopular: false,
    isAvailable: true
  },
  // Pakoda/Fritters
  {
    name: 'Onion Pakoda',
    description: 'Crispy fried onion fritters',
    price: 11.99,
    category: 'Veg Starter',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Mix Veg Pakoda',
    description: 'Assorted vegetables in a crispy fritter',
    price: 11.99,
    category: 'Veg Starter',
    isPopular: false,
    isAvailable: true
  },
  // Gobi (Cauliflower) Dishes
  {
    name: 'Gobi Manchuriyan',
    description: 'Cauliflower in a spicy Manchurian sauce',
    price: 17.99,
    category: 'Veg Starter',
    isPopular: true,
    isAvailable: true
  },
  {
    name: 'Gobi Chili',
    description: 'Cauliflower in a spicy chili sauce',
    price: 17.99,
    category: 'Veg Starter',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Gobi 65',
    description: 'Cauliflower florets in a spicy, tangy sauce',
    price: 17.99,
    category: 'Veg Starter',
    isPopular: false,
    isAvailable: true
  },
  // Corn Dishes
  {
    name: 'Baby Corn Manchuriyan',
    description: 'Crisp baby corn in a savory Manchurian-style sauce',
    price: 17.99,
    category: 'Veg Starter',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Chili Babycorn',
    description: 'Crisp baby corn in a spicy chili seasoning',
    price: 17.99,
    category: 'Veg Starter',
    isPopular: false,
    isAvailable: true
  },
  // Paneer Dishes
  {
    name: 'Paneer Manchuriyan',
    description: 'Crisp fried paneer in a sweet and sour Manchurian sauce',
    price: 18.49,
    category: 'Veg Starter',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Chili Paneer',
    description: 'Spicy Indian cheese dish with a tangy kick',
    price: 18.49,
    category: 'Veg Starter',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Paneer 65',
    description: 'Indian-style cheese cubes marinated in spices',
    price: 18.49,
    category: 'Veg Starter',
    isPopular: false,
    isAvailable: true
  },
  // Other Items
  {
    name: 'Veg Appetizer Platter',
    description: 'Assortment of vegetarian delights to start your meal',
    price: 20.99,
    category: 'Veg Starter',
    isPopular: false,
    isAvailable: true
  },
  {
    name: 'Cut Mirchi',
    description: 'Spicy green chilies in a flavorful blend',
    price: 12.99,
    category: 'Veg Starter',
    isPopular: true,
    isAvailable: true
  },
  {
    name: 'Stuffed Mirchi',
    description: 'Spicy peppers filled with flavorful ingredients',
    price: 13.99,
    category: 'Veg Starter',
    isPopular: false,
    isAvailable: true
  }
]
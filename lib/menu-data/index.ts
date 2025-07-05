// lib/menu-data/index.ts - Main aggregator file
import { MenuItem } from './types'
import { TIFFIN_ITEMS } from './tiffin'
import { VEG_STARTER_ITEMS } from './veg-starter'
import { NON_VEG_STARTER_ITEMS } from './non-veg-starter'
import { VEG_CURRY_ITEMS } from './veg-curry'
import { EGG_CURRY_ITEMS } from './egg-curry'
import { NON_VEG_CURRY_ITEMS } from './non-veg-curry'
import { BREAD_ITEMS } from './bread'
import { RICE_ITEMS } from './rice'
import { NOODLES_ITEMS } from './noodles'
import { TANDOOR_ITEMS } from './tandoor'
import { OTHERS_ITEMS } from './others'

// Combine all menu items
export const COMPLETE_MENU_DATA: MenuItem[] = [
  ...TIFFIN_ITEMS,
  ...VEG_STARTER_ITEMS,
  ...NON_VEG_STARTER_ITEMS,
  ...VEG_CURRY_ITEMS,
  ...EGG_CURRY_ITEMS,
  ...NON_VEG_CURRY_ITEMS,
  ...BREAD_ITEMS,
  ...RICE_ITEMS,
  ...NOODLES_ITEMS,
  ...TANDOOR_ITEMS,
  ...OTHERS_ITEMS
]

// Helper functions
export function getItemsByCategory(category: string): MenuItem[] {
  return COMPLETE_MENU_DATA.filter(item => item.category === category)
}

export function getPopularItems(): MenuItem[] {
  return COMPLETE_MENU_DATA.filter(item => item.isPopular === true)
}

export function searchMenuItems(query: string): MenuItem[] {
  const searchTerm = query.toLowerCase()
  return COMPLETE_MENU_DATA.filter(item =>
    item.name.toLowerCase().includes(searchTerm) ||
    item.description.toLowerCase().includes(searchTerm) ||
    item.category.toLowerCase().includes(searchTerm)
  )
}

// Export types
export type { MenuItem }
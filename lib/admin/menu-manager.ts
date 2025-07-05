// lib/admin/menu-manager.ts
// Menu CRUD operations and management

import type { MenuItem, BulkUpdateItem, ValidationError } from './types'
import { MENU_CATEGORIES } from './constants'

export class MenuManager {
  // Get all menu items
  static getMenuItems(items: MenuItem[]): MenuItem[] {
    return [...items]
  }

  // Get menu items by category
  static getMenuItemsByCategory(items: MenuItem[], category: string): MenuItem[] {
    return items.filter(item => item.category === category)
  }

  // Get single menu item
  static getMenuItem(items: MenuItem[], id: string): MenuItem | undefined {
    return items.find(item => item.id === id)
  }

  // Add new menu item
  static addMenuItem(
    items: MenuItem[], 
    itemData: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>
  ): { items: MenuItem[]; newItem: MenuItem } {
    const now = new Date().toISOString()
    const newItem: MenuItem = {
      ...itemData,
      id: `${itemData.category.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      createdAt: now,
      updatedAt: now
    }
    
    const updatedItems = [...items, newItem]
    return { items: updatedItems, newItem }
  }

  // Update existing menu item
  static updateMenuItem(
    items: MenuItem[], 
    id: string, 
    updates: Partial<Omit<MenuItem, 'id' | 'createdAt'>>
  ): { items: MenuItem[]; updatedItem: MenuItem | null } {
    const itemIndex = items.findIndex(item => item.id === id)
    
    if (itemIndex === -1) {
      return { items, updatedItem: null }
    }
    
    const updatedItem: MenuItem = {
      ...items[itemIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    const updatedItems = [...items]
    updatedItems[itemIndex] = updatedItem
    
    return { items: updatedItems, updatedItem }
  }

  // Delete menu item
  static deleteMenuItem(items: MenuItem[], id: string): { items: MenuItem[]; deleted: boolean } {
    const itemIndex = items.findIndex(item => item.id === id)
    
    if (itemIndex === -1) {
      return { items, deleted: false }
    }
    
    const updatedItems = items.filter(item => item.id !== id)
    return { items: updatedItems, deleted: true }
  }

  // Toggle item availability
  static toggleItemAvailability(items: MenuItem[], id: string): { items: MenuItem[]; success: boolean } {
    const item = this.getMenuItem(items, id)
    if (!item) return { items, success: false }
    
    const result = this.updateMenuItem(items, id, { 
      isAvailable: !item.isAvailable 
    })
    
    return { items: result.items, success: result.updatedItem !== null }
  }

  // Toggle item popularity
  static toggleItemPopularity(items: MenuItem[], id: string): { items: MenuItem[]; success: boolean } {
    const item = this.getMenuItem(items, id)
    if (!item) return { items, success: false }
    
    const result = this.updateMenuItem(items, id, { 
      isPopular: !item.isPopular 
    })
    
    return { items: result.items, success: result.updatedItem !== null }
  }

  // Bulk update multiple items
  static updateMultipleItems(items: MenuItem[], updates: BulkUpdateItem[]): { items: MenuItem[]; updatedCount: number } {
    let updatedItems = [...items]
    let updatedCount = 0
    
    updates.forEach(({ id, data }) => {
      const result = this.updateMenuItem(updatedItems, id, data)
      if (result.updatedItem) {
        updatedItems = result.items
        updatedCount++
      }
    })
    
    return { items: updatedItems, updatedCount }
  }

  // Update prices for a category
  static updateCategoryPrices(
    items: MenuItem[], 
    category: string, 
    priceChange: number, 
    isPercentage: boolean = false
  ): { items: MenuItem[]; updatedCount: number } {
    let updatedCount = 0
    
    const updatedItems = items.map(item => {
      if (item.category === category) {
        const newPrice = isPercentage 
          ? item.price * (1 + priceChange / 100)
          : item.price + priceChange
        
        updatedCount++
        return {
          ...item,
          price: Math.round(newPrice * 100) / 100, // Round to 2 decimal places
          updatedAt: new Date().toISOString()
        }
      }
      return item
    })
    
    return { items: updatedItems, updatedCount }
  }

  // Search menu items
  static searchMenuItems(items: MenuItem[], query: string): MenuItem[] {
    const searchTerm = query.toLowerCase().trim()
    if (!searchTerm) return this.getMenuItems(items)
    
    return items.filter(item =>
      item.name.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm) ||
      item.category.toLowerCase().includes(searchTerm)
    )
  }

  // Validate menu item data
  static validateMenuItem(item: Partial<MenuItem>): ValidationError[] {
    const errors: ValidationError[] = []
    
    if (!item.name || item.name.trim().length === 0) {
      errors.push({ field: 'name', message: 'Item name is required' })
    } else if (item.name.trim().length > 100) {
      errors.push({ field: 'name', message: 'Item name must be less than 100 characters' })
    }
    
    if (!item.description || item.description.trim().length === 0) {
      errors.push({ field: 'description', message: 'Item description is required' })
    } else if (item.description.trim().length > 500) {
      errors.push({ field: 'description', message: 'Item description must be less than 500 characters' })
    }
    
    if (!item.price || item.price <= 0) {
      errors.push({ field: 'price', message: 'Item price must be greater than 0' })
    } else if (item.price > 999.99) {
      errors.push({ field: 'price', message: 'Item price must be less than $1000' })
    }
    
    if (!item.category || !MENU_CATEGORIES.includes(item.category as any)) {
      errors.push({ field: 'category', message: 'Valid category is required' })
    }
    
    return errors
  }

  // Sort menu items
  static sortMenuItems(items: MenuItem[], sortBy: 'name' | 'price' | 'category' | 'updated', ascending: boolean = true): MenuItem[] {
    const sorted = [...items].sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'price':
          comparison = a.price - b.price
          break
        case 'category':
          comparison = a.category.localeCompare(b.category)
          break
        case 'updated':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          break
      }
      
      return ascending ? comparison : -comparison
    })
    
    return sorted
  }

  // Filter menu items
  static filterMenuItems(
    items: MenuItem[], 
    filters: {
      category?: string
      isAvailable?: boolean
      isPopular?: boolean
      priceRange?: { min: number; max: number }
    }
  ): MenuItem[] {
    return items.filter(item => {
      if (filters.category && item.category !== filters.category) {
        return false
      }
      
      if (filters.isAvailable !== undefined && item.isAvailable !== filters.isAvailable) {
        return false
      }
      
      if (filters.isPopular !== undefined && item.isPopular !== filters.isPopular) {
        return false
      }
      
      if (filters.priceRange) {
        if (item.price < filters.priceRange.min || item.price > filters.priceRange.max) {
          return false
        }
      }
      
      return true
    })
  }

  // Get duplicate items (same name and category)
  static findDuplicateItems(items: MenuItem[]): MenuItem[][] {
    const duplicates: MenuItem[][] = []
    const seen = new Map<string, MenuItem[]>()
    
    items.forEach(item => {
      const key = `${item.name.toLowerCase()}-${item.category}`
      if (!seen.has(key)) {
        seen.set(key, [])
      }
      seen.get(key)!.push(item)
    })
    
    seen.forEach(group => {
      if (group.length > 1) {
        duplicates.push(group)
      }
    })
    
    return duplicates
  }
}
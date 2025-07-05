// lib/admin/types.ts
// TypeScript interfaces and types for the admin system

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  isPopular?: boolean
  isAvailable?: boolean
  createdAt: string
  updatedAt: string
}

export interface BuffetSettings {
  price: number
  hours: string
  description: string
  isActive: boolean
  updatedAt: string
}

export interface RestaurantData {
  buffetSettings: BuffetSettings
  categories: string[]
  menuItems: MenuItem[]
  restaurantInfo: RestaurantInfo  // Add this line
  lastDeployed?: string
}

export interface CategoryStats {
  category: string
  count: number
}

export interface RestaurantStats {
  totalItems: number
  activeItems: number
  popularItems: number
  averagePrice: number
  buffetPrice: number
  categoryStats: CategoryStats[]
  lastUpdated: string
}

export interface DeploymentResult {
  success: boolean
  message: string
}

export interface BulkUpdateItem {
  id: string
  data: Partial<Omit<MenuItem, 'id' | 'createdAt'>>
}

export interface ValidationError {
  field: string
  message: string
}

export interface BackupData {
  data: RestaurantData
  timestamp: string
}

export interface RestaurantInfo {
  name: string
  address: string
  phone: string
  email: string
  website: string
  hours: {
    monday: string
    tuesday: string
    wednesday: string
    thursday: string
    friday: string
    saturday: string
    sunday: string
  }
  description: string
  updatedAt?: string
}
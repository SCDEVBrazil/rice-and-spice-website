// lib/admin/index.ts
// Main AdminDataManager class that orchestrates all the modules - FIXED VERSION

import type { 
  RestaurantData, 
  MenuItem, 
  BuffetSettings, 
  RestaurantInfo,
  RestaurantStats,
  BulkUpdateItem,
  ValidationError,
  DeploymentResult
} from './types'
import { MENU_CATEGORIES } from './constants'
import { FirebaseStorageManager } from './firebase-storage'
import { MenuManager } from './menu-manager'
import { BuffetManager } from './buffet-manager'
import { AnalyticsManager } from './analytics'
import { DeploymentManager } from './deployment'

export class AdminDataManager {
  private static instance: AdminDataManager
  private data: RestaurantData | null = null
  private pendingChanges: boolean = false
  private loadingPromise: Promise<void> | null = null

  private constructor() {
    // Initialize with async loading
    this.loadingPromise = this.loadData()
  }

  public static getInstance(): AdminDataManager {
    if (!AdminDataManager.instance) {
      AdminDataManager.instance = new AdminDataManager()
    }
    return AdminDataManager.instance
  }

  // Private method to load data from Firebase
  private async loadData(): Promise<void> {
    try {
      console.log('AdminDataManager: Loading data from Firebase...')
      this.data = await FirebaseStorageManager.loadData()
      this.pendingChanges = await FirebaseStorageManager.loadPendingChanges()
      console.log('AdminDataManager: Data loaded successfully')
    } catch (error) {
      console.error('AdminDataManager: Failed to load data:', error)
      throw error
    }
  }

  // OPTIMIZED: Different save strategies for different types of updates
  private async saveDataWithStrategy(strategy: 'fast' | 'full' | 'buffet-only' | 'restaurant-only' = 'full'): Promise<void> {
    if (!this.data) {
      throw new Error('No data to save')
    }
    
    try {
      console.log(`AdminDataManager: Saving data with ${strategy} strategy...`)
      
      switch (strategy) {
        case 'buffet-only':
          await FirebaseStorageManager.saveBuffetSettingsOnly(this.data.buffetSettings)
          break
        case 'restaurant-only':
          await FirebaseStorageManager.saveRestaurantInfoOnly(this.data.restaurantInfo)
          break
        case 'fast':
          await FirebaseStorageManager.saveDataFast(this.data, this.pendingChanges)
          break
        case 'full':
        default:
          await FirebaseStorageManager.saveData(this.data, this.pendingChanges, true)
          break
      }
      
      console.log('AdminDataManager: Data saved successfully')
    } catch (error) {
      console.error('AdminDataManager: Failed to save data:', error)
      throw error
    }
  }

  // Legacy save method for backward compatibility
  private async saveData(): Promise<void> {
    await this.saveDataWithStrategy('full')
  }

  // Private method to ensure data is loaded
  private async ensureDataLoaded(): Promise<void> {
    if (this.loadingPromise) {
      await this.loadingPromise
      this.loadingPromise = null
    }
    
    if (!this.data) {
      await this.loadData()
    }
  }

  // Private method to mark changes as pending
  private markPendingChanges(): void {
    this.pendingChanges = true
  }

  // OPTIMIZED: Force refresh data from Firebase
  public async refreshData(): Promise<void> {
    try {
      console.log('AdminDataManager: Refreshing data from Firebase...')
      this.data = await FirebaseStorageManager.loadData()
      this.pendingChanges = await FirebaseStorageManager.loadPendingChanges()
      console.log('AdminDataManager: Data refreshed successfully')
    } catch (error) {
      console.error('AdminDataManager: Failed to refresh data:', error)
      throw error
    }
  }

  // =====================================
  // BUFFET SETTINGS MANAGEMENT (OPTIMIZED)
  // =====================================

  // OPTIMIZED: Get buffet settings with optional force refresh
  public async getBuffetSettings(forceRefresh: boolean = false): Promise<BuffetSettings> {
    if (forceRefresh) {
      await this.refreshData()
    } else {
      await this.ensureDataLoaded()
    }
    return BuffetManager.getBuffetSettings(this.data!.buffetSettings)
  }

  // OPTIMIZED: Ultra-fast buffet settings update
  public async updateBuffetSettings(settings: Partial<BuffetSettings>): Promise<void> {
    await this.ensureDataLoaded()
    
    console.log('AdminDataManager: Updating buffet settings:', settings)
    const startTime = Date.now()
    
    this.data!.buffetSettings = BuffetManager.updateBuffetSettings(
      this.data!.buffetSettings, 
      settings
    )
    
    this.markPendingChanges()
    
    // Use the fastest save strategy for buffet-only updates
    await this.saveDataWithStrategy('buffet-only')
    
    const endTime = Date.now()
    console.log(`AdminDataManager: Buffet settings updated and saved in ${endTime - startTime}ms`)
  }

  // OPTIMIZED: Get buffet settings directly from Firebase (bypasses cache)
  public async getBuffetSettingsDirect(): Promise<BuffetSettings> {
    try {
      return await FirebaseStorageManager.getBuffetSettingsOnly()
    } catch (error) {
      console.error('Failed to get buffet settings directly:', error)
      // Fallback to cached version
      return await this.getBuffetSettings()
    }
  }

  // =====================================
  // RESTAURANT INFO MANAGEMENT (NEW)
  // =====================================

  // Get restaurant information with optional force refresh
  public async getRestaurantInfo(forceRefresh: boolean = false): Promise<RestaurantInfo> {
    if (forceRefresh) {
      await this.refreshData()
    } else {
      await this.ensureDataLoaded()
    }
    return { ...this.data!.restaurantInfo }
  }

  // OPTIMIZED: Ultra-fast restaurant info update
  public async updateRestaurantInfo(info: Partial<RestaurantInfo>): Promise<void> {
    await this.ensureDataLoaded()
    
    console.log('AdminDataManager: Updating restaurant info:', info)
    const startTime = Date.now()
    
    this.data!.restaurantInfo = {
      ...this.data!.restaurantInfo,
      ...info,
      updatedAt: new Date().toISOString()
    }
    
    this.markPendingChanges()
    
    // Use the fastest save strategy for restaurant info updates
    await this.saveDataWithStrategy('restaurant-only')
    
    const endTime = Date.now()
    console.log(`AdminDataManager: Restaurant info updated and saved in ${endTime - startTime}ms`)
  }

  // OPTIMIZED: Get restaurant info directly from Firebase (bypasses cache)
  public async getRestaurantInfoDirect(): Promise<RestaurantInfo> {
    try {
      return await FirebaseStorageManager.getRestaurantInfoOnly()
    } catch (error) {
      console.error('Failed to get restaurant info directly:', error)
      // Fallback to cached version
      return await this.getRestaurantInfo()
    }
  }

  // Validate restaurant information
  public validateRestaurantInfo(info: Partial<RestaurantInfo>): string[] {
    const errors: string[] = []

    if (info.name !== undefined) {
      if (!info.name.trim()) {
        errors.push('Restaurant name is required')
      } else if (info.name.length > 100) {
        errors.push('Restaurant name must be less than 100 characters')
      }
    }

    if (info.phone !== undefined) {
      if (!info.phone.trim()) {
        errors.push('Phone number is required')
      } else if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(info.phone.trim())) {
        errors.push('Phone number must be in format (xxx) xxx-xxxx')
      }
    }

    if (info.email !== undefined) {
      if (info.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email.trim())) {
        errors.push('Email address must be valid')
      }
    }

    if (info.address !== undefined) {
      if (!info.address.trim()) {
        errors.push('Address is required')
      } else if (info.address.length > 200) {
        errors.push('Address must be less than 200 characters')
      }
    }

    if (info.website !== undefined) {
      if (info.website.trim() && !/^https?:\/\/.+$/.test(info.website.trim())) {
        errors.push('Website must be a valid URL (starting with http:// or https://)')
      }
    }

    if (info.description !== undefined) {
      if (!info.description.trim()) {
        errors.push('Description is required')
      } else if (info.description.length > 500) {
        errors.push('Description must be less than 500 characters')
      }
    }

    return errors
  }

  // OPTIMIZED: Emergency save method (fastest possible)
  public async emergencySave(): Promise<void> {
    if (!this.data) {
      throw new Error('No data to save')
    }
    
    try {
      console.log('AdminDataManager: Emergency save in progress...')
      // Just save the restaurant settings, skip everything else
      await FirebaseStorageManager.saveBuffetSettingsOnly(this.data.buffetSettings)
      console.log('AdminDataManager: Emergency save completed')
    } catch (error) {
      console.error('AdminDataManager: Emergency save failed:', error)
      throw error
    }
  }

  // =====================================
  // MENU ITEMS MANAGEMENT - FIXED METHODS
  // =====================================

  public async getMenuItems(): Promise<MenuItem[]> {
    await this.ensureDataLoaded()
    return MenuManager.getMenuItems(this.data!.menuItems)
  }

  public async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    await this.ensureDataLoaded()
    return MenuManager.getMenuItemsByCategory(this.data!.menuItems, category)
  }

  public async getMenuItem(id: string): Promise<MenuItem | undefined> {
    await this.ensureDataLoaded()
    return MenuManager.getMenuItem(this.data!.menuItems, id)
  }

  // FIXED: Add menu item with direct Firebase save
  public async addMenuItem(itemData: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<MenuItem> {
    await this.ensureDataLoaded()
    
    // Create the menu item locally first
    const result = MenuManager.addMenuItem(this.data!.menuItems, itemData)
    this.data!.menuItems = result.items
    
    // FIXED: Save the new item directly to Firebase
    try {
      await FirebaseStorageManager.addMenuItem(result.newItem)
      console.log('✅ Menu item saved to Firebase successfully')
    } catch (error) {
      // Rollback local changes if Firebase save fails
      this.data!.menuItems = this.data!.menuItems.filter(item => item.id !== result.newItem.id)
      throw error
    }
    
    return result.newItem
  }

  // FIXED: Update menu item with direct Firebase save
  public async updateMenuItem(id: string, updates: Partial<Omit<MenuItem, 'id' | 'createdAt'>>): Promise<MenuItem | null> {
    await this.ensureDataLoaded()
    
    // Store original item for rollback
    const originalItem = this.data!.menuItems.find(item => item.id === id)
    if (!originalItem) {
      return null
    }
    
    // Update locally first
    const result = MenuManager.updateMenuItem(this.data!.menuItems, id, updates)
    this.data!.menuItems = result.items
    
    if (result.updatedItem) {
      try {
        // FIXED: Save the updated item directly to Firebase
        await FirebaseStorageManager.updateMenuItem(id, updates)
        console.log('✅ Menu item updated in Firebase successfully')
      } catch (error) {
        // Rollback local changes if Firebase save fails
        const rollbackResult = MenuManager.updateMenuItem(this.data!.menuItems, id, originalItem)
        this.data!.menuItems = rollbackResult.items
        throw error
      }
    }
    
    return result.updatedItem
  }

  // FIXED: Delete menu item with direct Firebase deletion
  public async deleteMenuItem(id: string): Promise<boolean> {
    await this.ensureDataLoaded()
    
    // Store original data for rollback
    const originalItems = [...this.data!.menuItems]
    
    const result = MenuManager.deleteMenuItem(this.data!.menuItems, id)
    this.data!.menuItems = result.items
    
    if (result.deleted) {
      try {
        // FIXED: Delete the item directly from Firebase
        await FirebaseStorageManager.deleteMenuItem(id)
        console.log('✅ Menu item deleted from Firebase successfully')
      } catch (error) {
        // Rollback local changes if Firebase deletion fails
        this.data!.menuItems = originalItems
        throw error
      }
    }
    
    return result.deleted
  }

  // FIXED: Toggle availability with direct Firebase save
  public async toggleItemAvailability(id: string): Promise<boolean> {
    await this.ensureDataLoaded()
    
    const item = this.data!.menuItems.find(item => item.id === id)
    if (!item) return false
    
    const newAvailability = !item.isAvailable
    
    // Update locally first
    const result = MenuManager.toggleItemAvailability(this.data!.menuItems, id)
    this.data!.menuItems = result.items
    
    if (result.success) {
      try {
        // FIXED: Save the availability change directly to Firebase
        await FirebaseStorageManager.updateMenuItem(id, { isAvailable: newAvailability })
        console.log('✅ Item availability updated in Firebase successfully')
      } catch (error) {
        // Rollback local changes if Firebase save fails
        const rollbackResult = MenuManager.toggleItemAvailability(this.data!.menuItems, id)
        this.data!.menuItems = rollbackResult.items
        throw error
      }
    }
    
    return result.success
  }

  // FIXED: Toggle popularity with direct Firebase save
  public async toggleItemPopularity(id: string): Promise<boolean> {
    await this.ensureDataLoaded()
    
    const item = this.data!.menuItems.find(item => item.id === id)
    if (!item) return false
    
    const newPopularity = !item.isPopular
    
    // Update locally first
    const result = MenuManager.toggleItemPopularity(this.data!.menuItems, id)
    this.data!.menuItems = result.items
    
    if (result.success) {
      try {
        // FIXED: Save the popularity change directly to Firebase
        await FirebaseStorageManager.updateMenuItem(id, { isPopular: newPopularity })
        console.log('✅ Item popularity updated in Firebase successfully')
      } catch (error) {
        // Rollback local changes if Firebase save fails
        const rollbackResult = MenuManager.toggleItemPopularity(this.data!.menuItems, id)
        this.data!.menuItems = rollbackResult.items
        throw error
      }
    }
    
    return result.success
  }

  // OPTIMIZED: Bulk menu updates with batch Firebase operations
  public async updateMultipleItems(updates: BulkUpdateItem[]): Promise<number> {
    await this.ensureDataLoaded()
    
    console.log('AdminDataManager: Performing bulk menu updates:', updates.length, 'items')
    
    // Store original data for rollback
    const originalItems = [...this.data!.menuItems]
    
    const result = MenuManager.updateMultipleItems(this.data!.menuItems, updates)
    this.data!.menuItems = result.items
    
    if (result.updatedCount > 0) {
      try {
        // FIXED: Use batch Firebase operations for bulk updates
        const firebaseUpdates = updates.map(({ id, data }) => ({ id, updates: data }))
        await FirebaseStorageManager.batchUpdateMenuItems(firebaseUpdates)
        console.log('✅ Bulk menu updates saved to Firebase successfully')
      } catch (error) {
        // Rollback local changes if Firebase save fails
        this.data!.menuItems = originalItems
        throw error
      }
    }
    
    console.log('AdminDataManager: Bulk menu updates completed')
    return result.updatedCount
  }

  public async updateCategoryPrices(category: string, priceChange: number, isPercentage: boolean = false): Promise<number> {
    await this.ensureDataLoaded()
    
    const result = MenuManager.updateCategoryPrices(
      this.data!.menuItems, 
      category, 
      priceChange, 
      isPercentage
    )
    this.data!.menuItems = result.items
    
    if (result.updatedCount > 0) {
      this.markPendingChanges()
      await this.saveDataWithStrategy('fast')
    }
    
    return result.updatedCount
  }

  public async searchMenuItems(query: string): Promise<MenuItem[]> {
    await this.ensureDataLoaded()
    return MenuManager.searchMenuItems(this.data!.menuItems, query)
  }

  public validateMenuItem(item: Partial<MenuItem>): ValidationError[] {
    return MenuManager.validateMenuItem(item)
  }

  public async sortMenuItems(sortBy: 'name' | 'price' | 'category' | 'updated', ascending: boolean = true): Promise<MenuItem[]> {
    await this.ensureDataLoaded()
    return MenuManager.sortMenuItems(this.data!.menuItems, sortBy, ascending)
  }

  public async filterMenuItems(filters: {
    category?: string
    isAvailable?: boolean
    isPopular?: boolean
    priceRange?: { min: number; max: number }
  }): Promise<MenuItem[]> {
    await this.ensureDataLoaded()
    return MenuManager.filterMenuItems(this.data!.menuItems, filters)
  }

  public async findDuplicateItems(): Promise<MenuItem[][]> {
    await this.ensureDataLoaded()
    return MenuManager.findDuplicateItems(this.data!.menuItems)
  }

  // =====================================
  // CATEGORIES MANAGEMENT
  // =====================================

  public async getCategories(): Promise<string[]> {
    await this.ensureDataLoaded()
    return [...this.data!.categories]
  }

  public async addCategory(category: string): Promise<void> {
    await this.ensureDataLoaded()
    
    if (!this.data!.categories.includes(category)) {
      this.data!.categories.push(category)
      this.markPendingChanges()
      await this.saveDataWithStrategy('fast')
    }
  }

  // =====================================
  // ANALYTICS & STATISTICS
  // =====================================

  public async getStats(): Promise<RestaurantStats> {
    await this.ensureDataLoaded()
    return AnalyticsManager.calculateStats(this.data!)
  }

  // =====================================
  // CHANGE MANAGEMENT
  // =====================================

  public hasPendingChanges(): boolean {
    return this.pendingChanges
  }

  public getPendingChangesCount(): number {
    return this.pendingChanges ? 1 : 0
  }

  public async markAsDeployed(): Promise<void> {
    await this.ensureDataLoaded()
    
    this.data!.lastDeployed = new Date().toISOString()
    this.pendingChanges = false
    await this.saveDataWithStrategy('full')
  }

  // =====================================
  // IMPORT/EXPORT FUNCTIONALITY
  // =====================================

  public async exportData(): Promise<string> {
    await this.ensureDataLoaded()
    return FirebaseStorageManager.exportData(this.data!)
  }

  public async importData(jsonData: string): Promise<void> {
    const importedData = FirebaseStorageManager.importData(jsonData)
    this.data = importedData
    this.markPendingChanges()
    await this.saveDataWithStrategy('full')
  }

  public async resetToDefaults(): Promise<void> {
    await FirebaseStorageManager.clearAllData()
    await FirebaseStorageManager.initializeDefaultData()
    this.data = null
    this.pendingChanges = false
    await this.loadData()
  }

  // =====================================
  // DEPLOYMENT OPERATIONS
  // =====================================

  public async generateMenuPageContent(): Promise<string> {
    await this.ensureDataLoaded()
    return DeploymentManager.generateMenuPageContent(this.data!)
  }

  public async generateBuffetModalContent(): Promise<string> {
    await this.ensureDataLoaded()
    return DeploymentManager.generateBuffetModalContent(this.data!.buffetSettings)
  }

  public async simulateDeployment(): Promise<DeploymentResult> {
    const result = await DeploymentManager.simulateDeployment()
    if (result.success) {
      await this.markAsDeployed()
    }
    return result
  }

  // =====================================
  // UTILITY METHODS (ENHANCED)
  // =====================================

  public async getLastBackup() {
    return await FirebaseStorageManager.loadLastBackup()
  }

  public generateBackupFileName(): string {
    return FirebaseStorageManager.generateBackupFileName()
  }

  // Get raw data (for debugging or advanced operations)
  public async getRawData(): Promise<RestaurantData> {
    await this.ensureDataLoaded()
    return { ...this.data! }
  }

  // OPTIMIZED: Force reload data from Firebase
  public async reloadData(): Promise<void> {
    this.data = null
    await this.loadData()
  }

  // Test Firebase connection
  public async testConnection(): Promise<boolean> {
    try {
      await this.ensureDataLoaded()
      return true
    } catch (error) {
      console.error('Firebase connection test failed:', error)
      return false
    }
  }

  // OPTIMIZED: Update specific restaurant field
  public async updateRestaurantField(field: string, value: any): Promise<void> {
    try {
      await FirebaseStorageManager.updateRestaurantField(field, value)
      // Update local cache if data is loaded
      if (this.data && field in this.data) {
        (this.data as any)[field] = value
      }
    } catch (error) {
      console.error(`Failed to update ${field}:`, error)
      throw error
    }
  }

  // OPTIMIZED: Get data freshness info
  public getDataFreshness(): {
    isLoaded: boolean
    hasCache: boolean
    pendingChanges: boolean
    lastLoaded: string | null
  } {
    return {
      isLoaded: this.data !== null,
      hasCache: this.data !== null,
      pendingChanges: this.pendingChanges,
      lastLoaded: this.data ? new Date().toISOString() : null
    }
  }

  // OPTIMIZED: Clear local cache (force fresh load on next operation)
  public clearCache(): void {
    this.data = null
    this.loadingPromise = null
    console.log('AdminDataManager: Cache cleared')
  }

  // OPTIMIZED: Preload data (useful for performance)
  public async preloadData(): Promise<void> {
    if (!this.data) {
      await this.ensureDataLoaded()
      console.log('AdminDataManager: Data preloaded successfully')
    }
  }

  // OPTIMIZED: Health check for the data manager
  public async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy'
    checks: {
      dataLoaded: boolean
      firebaseConnection: boolean
      dataIntegrity: boolean
    }
    timestamp: string
  }> {
    const checks = {
      dataLoaded: this.data !== null,
      firebaseConnection: false,
      dataIntegrity: false
    }

    try {
      // Test Firebase connection
      checks.firebaseConnection = await this.testConnection()
      
      // Check data integrity
      if (this.data) {
        checks.dataIntegrity = !!(
          this.data.buffetSettings &&
          this.data.categories &&
          this.data.restaurantInfo &&
          Array.isArray(this.data.menuItems)
        )
      }
    } catch (error) {
      console.error('Health check failed:', error)
    }

    const healthyChecks = Object.values(checks).filter(Boolean).length
    let status: 'healthy' | 'degraded' | 'unhealthy'
    
    if (healthyChecks === 3) {
      status = 'healthy'
    } else if (healthyChecks >= 2) {
      status = 'degraded'
    } else {
      status = 'unhealthy'
    }

    return {
      status,
      checks,
      timestamp: new Date().toISOString()
    }
  }

  // OPTIMIZED: Performance metrics
  public getPerformanceMetrics(): {
    dataSize: number
    menuItemsCount: number
    categoriesCount: number
    cacheHit: boolean
    pendingOperations: number
    hasRestaurantInfo: boolean
  } {
    return {
      dataSize: this.data ? JSON.stringify(this.data).length : 0,
      menuItemsCount: this.data?.menuItems?.length || 0,
      categoriesCount: this.data?.categories?.length || 0,
      cacheHit: this.data !== null,
      pendingOperations: this.pendingChanges ? 1 : 0,
      hasRestaurantInfo: !!(this.data?.restaurantInfo)
    }
  }

  // OPTIMIZED: Force full data refresh and validation
  public async fullRefresh(): Promise<{
    success: boolean
    dataLoaded: boolean
    validationResults: any
    performance: any
  }> {
    try {
      const startTime = Date.now()
      
      // Clear cache and reload
      this.clearCache()
      await this.refreshData()
      
      // Validate data
      const validation = this.validateDataIntegrity()
      const performance = this.getPerformanceMetrics()
      
      const endTime = Date.now()
      
      return {
        success: true,
        dataLoaded: this.data !== null,
        validationResults: validation,
        performance: {
          ...performance,
          refreshTime: endTime - startTime
        }
      }
    } catch (error) {
      console.error('Full refresh failed:', error)
      return {
        success: false,
        dataLoaded: false,
        validationResults: { isValid: false, errors: ['Refresh failed'], warnings: [] },
        performance: this.getPerformanceMetrics()
      }
    }
  }

  // Validate data integrity
  private validateDataIntegrity(): {
    isValid: boolean
    errors: string[]
    warnings: string[]
  } {
    const errors: string[] = []
    const warnings: string[] = []
    
    if (!this.data) {
      errors.push('No data loaded')
      return { isValid: false, errors, warnings }
    }
    
    if (!this.data.buffetSettings) {
      errors.push('Missing buffet settings')
    }
    
    if (!this.data.restaurantInfo) {
      errors.push('Missing restaurant info')
    }
    
    if (!Array.isArray(this.data.menuItems)) {
      errors.push('Menu items not an array')
    } else if (this.data.menuItems.length === 0) {
      warnings.push('No menu items found')
    }
    
    if (!Array.isArray(this.data.categories)) {
      errors.push('Categories not an array')
    } else if (this.data.categories.length === 0) {
      warnings.push('No categories found')
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }
}

// Export singleton instance
export const adminData = AdminDataManager.getInstance()

// Export all types and constants for use in components
export * from './types'
export * from './constants'
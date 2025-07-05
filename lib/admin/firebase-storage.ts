// lib/admin/firebase-storage.ts
// Firebase storage operations for the admin system - FIXED VERSION

import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  updateDoc,
  deleteDoc,
  addDoc,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { RestaurantData, BackupData, BuffetSettings, RestaurantInfo, MenuItem } from './types'
import { INITIAL_DATA, INITIAL_RESTAURANT_INFO } from './constants'

export class FirebaseStorageManager {
  private static readonly RESTAURANT_DOC_ID = 'rice-and-spice'
  private static readonly COLLECTIONS = {
    restaurants: 'restaurants',
    menuItems: 'menu-items',
    backups: 'backups'
  }

  // Helper function to remove undefined values from objects
  private static removeUndefinedValues(obj: any): any {
    if (obj === null || obj === undefined) return null
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.removeUndefinedValues(item))
    }
    
    if (typeof obj === 'object') {
      const cleaned: any = {}
      for (const [key, value] of Object.entries(obj)) {
        if (value !== undefined) {
          cleaned[key] = this.removeUndefinedValues(value)
        }
      }
      return cleaned
    }
    
    return obj
  }

  // Load restaurant data from Firestore
  static async loadData(): Promise<RestaurantData> {
    try {
      console.log('Loading data from Firestore...')
      
      // Get restaurant info (buffet settings, categories, etc.)
      const restaurantRef = doc(db, this.COLLECTIONS.restaurants, this.RESTAURANT_DOC_ID)
      const restaurantSnap = await getDoc(restaurantRef)
      
      // Get menu items
      const menuItemsRef = collection(db, this.COLLECTIONS.menuItems)
      const menuItemsSnap = await getDocs(menuItemsRef)
      
      let buffetSettings = INITIAL_DATA.buffetSettings
      let categories = INITIAL_DATA.categories
      let restaurantInfo = INITIAL_DATA.restaurantInfo
      let lastDeployed = undefined
      
      if (restaurantSnap.exists()) {
        const data = restaurantSnap.data()
        buffetSettings = data.buffetSettings || INITIAL_DATA.buffetSettings
        categories = data.categories || INITIAL_DATA.categories
        restaurantInfo = data.restaurantInfo || INITIAL_DATA.restaurantInfo
        lastDeployed = data.lastDeployed
      }
      
      const menuItems = menuItemsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MenuItem[]
      
      // If no data exists, initialize with default data
      if (menuItems.length === 0) {
        console.log('No data found, initializing with default data...')
        await this.initializeDefaultData()
        return INITIAL_DATA
      }
      
      const loadedData: RestaurantData = {
        buffetSettings,
        categories,
        menuItems,
        restaurantInfo,
        ...(lastDeployed && { lastDeployed })
      }
      
      console.log('✅ Data loaded from Firestore successfully')
      return loadedData
      
    } catch (error) {
      console.error('❌ Failed to load data from Firestore:', error)
      // Fallback to initial data if Firestore fails
      return INITIAL_DATA
    }
  }

  // OPTIMIZED: Save restaurant data to Firestore with optional backup
  static async saveData(data: RestaurantData, pendingChanges: boolean = false, createBackup: boolean = true): Promise<void> {
    try {
      console.log(`Saving data to Firestore${createBackup ? ' with backup' : ' (no backup)'}...`)
      
      // Clean the data to remove undefined values
      const cleanData = this.removeUndefinedValues(data)
      
      // Prepare restaurant document data
      const restaurantDocData: any = {
        buffetSettings: cleanData.buffetSettings,
        categories: cleanData.categories,
        restaurantInfo: cleanData.restaurantInfo,
        pendingChanges,
        updatedAt: serverTimestamp()
      }
      
      // Only add lastDeployed if it exists
      if (cleanData.lastDeployed) {
        restaurantDocData.lastDeployed = cleanData.lastDeployed
      }
      
      // Save restaurant info (buffet settings, categories, etc.)
      const restaurantRef = doc(db, this.COLLECTIONS.restaurants, this.RESTAURANT_DOC_ID)
      await setDoc(restaurantRef, restaurantDocData, { merge: true })
      
      // Save menu items - we'll update existing and add new ones
      const menuPromises = cleanData.menuItems.map((item: MenuItem) => {
        const itemRef = doc(db, this.COLLECTIONS.menuItems, item.id)
        const cleanItem = this.removeUndefinedValues(item)
        return setDoc(itemRef, {
          ...cleanItem,
          updatedAt: serverTimestamp()
        })
      })
      
      await Promise.all(menuPromises)
      
      // Create backup only if requested (this is the slow part)
      if (createBackup) {
        const backup: BackupData = {
          data: cleanData,
          timestamp: new Date().toISOString()
        }
        
        const backupRef = collection(db, this.COLLECTIONS.backups)
        await addDoc(backupRef, backup)
        console.log('Backup created')
      }
      
      console.log('✅ Data saved to Firestore successfully')
      
    } catch (error) {
      console.error('❌ Failed to save data to Firestore:', error)
      throw new Error('Failed to save changes to database')
    }
  }

  // OPTIMIZED: Fast save without backup creation - FIXED TO INCLUDE MENU ITEMS
  static async saveDataFast(data: RestaurantData, pendingChanges: boolean = false): Promise<void> {
    try {
      console.log('Fast saving data to Firestore (no backup)...')
      
      // Clean the data to remove undefined values
      const cleanData = this.removeUndefinedValues(data)
      
      // Prepare restaurant document data
      const restaurantDocData: any = {
        buffetSettings: cleanData.buffetSettings,
        categories: cleanData.categories,
        restaurantInfo: cleanData.restaurantInfo,
        pendingChanges,
        updatedAt: serverTimestamp()
      }
      
      // Only add lastDeployed if it exists
      if (cleanData.lastDeployed) {
        restaurantDocData.lastDeployed = cleanData.lastDeployed
      }
      
      // Save restaurant info (buffet settings, categories, etc.)
      const restaurantRef = doc(db, this.COLLECTIONS.restaurants, this.RESTAURANT_DOC_ID)
      await setDoc(restaurantRef, restaurantDocData, { merge: true })
      
      // FIXED: Also save menu items in fast save (this was the missing piece!)
      const menuPromises = cleanData.menuItems.map((item: MenuItem) => {
        const itemRef = doc(db, this.COLLECTIONS.menuItems, item.id)
        const cleanItem = this.removeUndefinedValues(item)
        return setDoc(itemRef, {
          ...cleanItem,
          updatedAt: serverTimestamp()
        })
      })
      
      await Promise.all(menuPromises)
      
      console.log('✅ Data fast-saved to Firestore successfully (no backup created)')
      
    } catch (error) {
      console.error('❌ Failed to fast-save data to Firestore:', error)
      throw new Error('Failed to save changes to database')
    }
  }

  // OPTIMIZED: Ultra-fast save for buffet settings only
  static async saveBuffetSettingsOnly(buffetSettings: BuffetSettings): Promise<void> {
    try {
      console.log('Saving only buffet settings to Firestore...')
      
      const restaurantRef = doc(db, this.COLLECTIONS.restaurants, this.RESTAURANT_DOC_ID)
      await setDoc(restaurantRef, {
        buffetSettings: this.removeUndefinedValues(buffetSettings),
        updatedAt: serverTimestamp()
      }, { merge: true })
      
      console.log('✅ Buffet settings saved successfully')
      
    } catch (error) {
      console.error('❌ Failed to save buffet settings:', error)
      throw new Error('Failed to save buffet settings')
    }
  }

  // OPTIMIZED: Ultra-fast save for restaurant info only
  static async saveRestaurantInfoOnly(restaurantInfo: RestaurantInfo): Promise<void> {
    try {
      console.log('Saving only restaurant info to Firestore...')
      
      const restaurantRef = doc(db, this.COLLECTIONS.restaurants, this.RESTAURANT_DOC_ID)
      await setDoc(restaurantRef, {
        restaurantInfo: this.removeUndefinedValues(restaurantInfo),
        updatedAt: serverTimestamp()
      }, { merge: true })
      
      console.log('✅ Restaurant info saved successfully')
      
    } catch (error) {
      console.error('❌ Failed to save restaurant info:', error)
      throw new Error('Failed to save restaurant info')
    }
  }

  // FIXED: Individual menu item update method
  static async updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<void> {
    try {
      console.log(`Updating menu item ${id} in Firebase...`)
      
      const itemRef = doc(db, this.COLLECTIONS.menuItems, id)
      
      // Remove undefined values and add timestamp
      const cleanUpdates = this.removeUndefinedValues({
        ...updates,
        updatedAt: serverTimestamp()
      })
      
      await updateDoc(itemRef, cleanUpdates)
      
      console.log(`✅ Menu item ${id} updated successfully`)
      
    } catch (error) {
      console.error(`❌ Failed to update menu item ${id}:`, error)
      throw new Error(`Failed to update menu item: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // FIXED: Add new menu item method
  static async addMenuItem(item: MenuItem): Promise<void> {
    try {
      console.log(`Adding menu item ${item.id} to Firebase...`)
      
      const itemRef = doc(db, this.COLLECTIONS.menuItems, item.id)
      
      const cleanItem = this.removeUndefinedValues({
        ...item,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      
      await setDoc(itemRef, cleanItem)
      
      console.log(`✅ Menu item ${item.id} added successfully`)
      
    } catch (error) {
      console.error(`❌ Failed to add menu item ${item.id}:`, error)
      throw new Error(`Failed to add menu item: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // FIXED: Delete menu item method
  static async deleteMenuItem(id: string): Promise<void> {
    try {
      console.log(`Deleting menu item ${id} from Firebase...`)
      
      const itemRef = doc(db, this.COLLECTIONS.menuItems, id)
      await deleteDoc(itemRef)
      
      console.log(`✅ Menu item ${id} deleted successfully`)
      
    } catch (error) {
      console.error(`❌ Failed to delete menu item ${id}:`, error)
      throw new Error(`Failed to delete menu item: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // OPTIMIZED: Update specific fields in restaurant document
  static async updateRestaurantField(field: string, value: any): Promise<void> {
    try {
      const restaurantRef = doc(db, this.COLLECTIONS.restaurants, this.RESTAURANT_DOC_ID)
      await updateDoc(restaurantRef, {
        [field]: value,
        updatedAt: serverTimestamp()
      })
      console.log(`✅ ${field} updated successfully`)
    } catch (error) {
      console.error(`❌ Failed to update ${field}:`, error)
      throw new Error(`Failed to update ${field}`)
    }
  }

  // OPTIMIZED: Batch update multiple menu items
  static async batchUpdateMenuItems(items: Array<{id: string, updates: any}>): Promise<void> {
    try {
      console.log(`Batch updating ${items.length} menu items...`)
      
      const updatePromises = items.map(({ id, updates }) => {
        const itemRef = doc(db, this.COLLECTIONS.menuItems, id)
        return updateDoc(itemRef, {
          ...updates,
          updatedAt: serverTimestamp()
        })
      })
      
      await Promise.all(updatePromises)
      console.log('✅ Batch menu update completed')
    } catch (error) {
      console.error('❌ Failed to batch update menu items:', error)
      throw new Error('Failed to update menu items')
    }
  }

  // OPTIMIZED: Get only restaurant info without loading everything
  static async getRestaurantInfoOnly(): Promise<RestaurantInfo> {
    try {
      const restaurantRef = doc(db, this.COLLECTIONS.restaurants, this.RESTAURANT_DOC_ID)
      const restaurantSnap = await getDoc(restaurantRef)
      
      if (restaurantSnap.exists()) {
        const data = restaurantSnap.data()
        return data.restaurantInfo || INITIAL_RESTAURANT_INFO
      }
      
      return INITIAL_RESTAURANT_INFO
    } catch (error) {
      console.error('Failed to load restaurant info:', error)
      return INITIAL_RESTAURANT_INFO
    }
  }

  // OPTIMIZED: Get only buffet settings without loading everything
  static async getBuffetSettingsOnly(): Promise<BuffetSettings> {
    try {
      const restaurantRef = doc(db, this.COLLECTIONS.restaurants, this.RESTAURANT_DOC_ID)
      const restaurantSnap = await getDoc(restaurantRef)
      
      if (restaurantSnap.exists()) {
        const data = restaurantSnap.data()
        return data.buffetSettings || INITIAL_DATA.buffetSettings
      }
      
      return INITIAL_DATA.buffetSettings
    } catch (error) {
      console.error('Failed to load buffet settings:', error)
      return INITIAL_DATA.buffetSettings
    }
  }

  // Initialize Firestore with default data
  static async initializeDefaultData(): Promise<void> {
    try {
      console.log('Initializing Firestore with default data...')
      
      // Save restaurant info
      const restaurantRef = doc(db, this.COLLECTIONS.restaurants, this.RESTAURANT_DOC_ID)
      await setDoc(restaurantRef, {
        buffetSettings: INITIAL_DATA.buffetSettings,
        categories: INITIAL_DATA.categories,
        restaurantInfo: INITIAL_DATA.restaurantInfo,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      
      // Save initial menu items
      for (const item of INITIAL_DATA.menuItems) {
        const itemRef = doc(db, this.COLLECTIONS.menuItems, item.id)
        const cleanItem = this.removeUndefinedValues(item)
        await setDoc(itemRef, {
          ...cleanItem,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        })
      }
      
      console.log('✅ Default data initialized in Firestore')
      
    } catch (error) {
      console.error('❌ Failed to initialize default data:', error)
      throw error
    }
  }

  // Load pending changes status (stored with restaurant info)
  static async loadPendingChanges(): Promise<boolean> {
    try {
      const restaurantRef = doc(db, this.COLLECTIONS.restaurants, this.RESTAURANT_DOC_ID)
      const restaurantSnap = await getDoc(restaurantRef)
      
      if (restaurantSnap.exists()) {
        return restaurantSnap.data().pendingChanges || false
      }
      return false
    } catch (error) {
      console.error('Failed to load pending changes:', error)
      return false
    }
  }

  // Load last backup
  static async loadLastBackup(): Promise<BackupData | null> {
    try {
      const backupsRef = collection(db, this.COLLECTIONS.backups)
      const backupsSnap = await getDocs(backupsRef)
      
      if (backupsSnap.empty) return null
      
      // Get the most recent backup
      const backups = backupsSnap.docs.map(doc => doc.data() as BackupData)
      backups.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      
      return backups[0]
    } catch (error) {
      console.error('Failed to load backup:', error)
      return null
    }
  }

  // Clear all data (for reset functionality)
  static async clearAllData(): Promise<void> {
    try {
      console.log('Clearing all data from Firestore...')
      
      // Delete restaurant info
      const restaurantRef = doc(db, this.COLLECTIONS.restaurants, this.RESTAURANT_DOC_ID)
      await deleteDoc(restaurantRef)
      
      // Delete all menu items
      const menuItemsRef = collection(db, this.COLLECTIONS.menuItems)
      const menuItemsSnap = await getDocs(menuItemsRef)
      
      const deletePromises = menuItemsSnap.docs.map(doc => deleteDoc(doc.ref))
      await Promise.all(deletePromises)
      
      console.log('✅ All data cleared from Firestore')
      
    } catch (error) {
      console.error('❌ Failed to clear data:', error)
      throw error
    }
  }

  // Export data as JSON string
  static exportData(data: RestaurantData): string {
    return JSON.stringify(data, null, 2)
  }

  // Import data from JSON string
  static importData(jsonData: string): RestaurantData {
    try {
      const importedData = JSON.parse(jsonData)
      
      // Validate imported data structure
      if (!importedData.buffetSettings || !importedData.menuItems) {
        throw new Error('Invalid data format: missing required fields')
      }
      
      return {
        ...importedData,
        categories: importedData.categories || INITIAL_DATA.categories,
        restaurantInfo: importedData.restaurantInfo || INITIAL_DATA.restaurantInfo
      }
    } catch (error) {
      console.error('Failed to import data:', error)
      throw new Error('Failed to import data: Invalid JSON format')
    }
  }

  // Create a backup file name
  static generateBackupFileName(): string {
    const now = new Date()
    const dateStr = now.toISOString().split('T')[0] // YYYY-MM-DD
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-') // HH-MM-SS
    return `rice-spice-backup-${dateStr}-${timeStr}.json`
  }
}
// lib/admin/clean-slate-manager.ts
// Clean slate functionality for wiping and reimporting menu data

import { collection, getDocs, deleteDoc, doc, writeBatch } from 'firebase/firestore'
import { db } from '../firebase'
import { COMPLETE_MENU_DATA } from '../menu-data'
import type { MenuItem } from './types'

export class CleanSlateManager {
  // Step 1: Completely wipe all menu items from Firebase
  static async wipeAllMenuItems(): Promise<{ success: boolean; message: string; deletedCount: number }> {
    try {
      console.log('Starting complete menu wipe...')
      
      // Get all menu items from Firebase
      const menuItemsRef = collection(db, 'menu-items')
      const snapshot = await getDocs(menuItemsRef)
      
      const totalItems = snapshot.size
      console.log(`Found ${totalItems} items to delete`)
      
      if (totalItems === 0) {
        return {
          success: true,
          message: 'No menu items found to delete',
          deletedCount: 0
        }
      }
      
      // Delete all items in batches (Firestore limit is 500 per batch)
      const batchSize = 500
      const batches = []
      let currentBatch = writeBatch(db)
      let operationCount = 0
      
      snapshot.docs.forEach((docSnapshot) => {
        currentBatch.delete(docSnapshot.ref)
        operationCount++
        
        // If we've reached the batch size, add to batches array
        if (operationCount === batchSize) {
          batches.push(currentBatch)
          currentBatch = writeBatch(db)
          operationCount = 0
        }
      })
      
      // Add the last batch if it has operations
      if (operationCount > 0) {
        batches.push(currentBatch)
      }
      
      // Execute all batches
      await Promise.all(batches.map(batch => batch.commit()))
      
      console.log(`Successfully deleted ${totalItems} menu items`)
      
      return {
        success: true,
        message: `Successfully deleted ${totalItems} menu items`,
        deletedCount: totalItems
      }
      
    } catch (error) {
      console.error('Error wiping menu items:', error)
      return {
        success: false,
        message: `Failed to wipe menu items: ${error instanceof Error ? error.message : 'Unknown error'}`,
        deletedCount: 0
      }
    }
  }
  
  // Step 2: Import all 141 fresh menu items
  static async importFreshMenuItems(): Promise<{ success: boolean; message: string; importedCount: number }> {
    try {
      console.log('Starting fresh menu import...')
      console.log(`Importing ${COMPLETE_MENU_DATA.length} menu items...`)
      
      // Add timestamps to all items
      const itemsWithTimestamps = COMPLETE_MENU_DATA.map(item => ({
        ...item,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }))
      
      // Import in batches (Firestore limit is 500 per batch)
      const batchSize = 500
      const batches = []
      let currentBatch = writeBatch(db)
      let operationCount = 0
      
      itemsWithTimestamps.forEach((item) => {
        const docRef = doc(db, 'menu-items', item.id)
        currentBatch.set(docRef, item)
        operationCount++
        
        // If we've reached the batch size, add to batches array
        if (operationCount === batchSize) {
          batches.push(currentBatch)
          currentBatch = writeBatch(db)
          operationCount = 0
        }
      })
      
      // Add the last batch if it has operations
      if (operationCount > 0) {
        batches.push(currentBatch)
      }
      
      // Execute all batches
      await Promise.all(batches.map(batch => batch.commit()))
      
      console.log(`Successfully imported ${COMPLETE_MENU_DATA.length} menu items`)
      
      return {
        success: true,
        message: `Successfully imported ${COMPLETE_MENU_DATA.length} fresh menu items`,
        importedCount: COMPLETE_MENU_DATA.length
      }
      
    } catch (error) {
      console.error('Error importing fresh menu items:', error)
      return {
        success: false,
        message: `Failed to import menu items: ${error instanceof Error ? error.message : 'Unknown error'}`,
        importedCount: 0
      }
    }
  }
  
  // Step 3: Complete clean slate operation (wipe + import)
  static async performCleanSlate(): Promise<{ 
    success: boolean; 
    message: string; 
    deletedCount: number; 
    importedCount: number;
    steps: string[]
  }> {
    const steps: string[] = []
    
    try {
      // Step 1: Wipe everything
      steps.push('Step 1: Wiping all existing menu items...')
      const wipeResult = await this.wipeAllMenuItems()
      steps.push(`✅ ${wipeResult.message}`)
      
      if (!wipeResult.success) {
        return {
          success: false,
          message: 'Failed during wipe phase',
          deletedCount: wipeResult.deletedCount,
          importedCount: 0,
          steps
        }
      }
      
      // Step 2: Import fresh data
      steps.push('Step 2: Importing fresh menu items...')
      const importResult = await this.importFreshMenuItems()
      steps.push(`✅ ${importResult.message}`)
      
      if (!importResult.success) {
        return {
          success: false,
          message: 'Failed during import phase',
          deletedCount: wipeResult.deletedCount,
          importedCount: 0,
          steps
        }
      }
      
      // Success!
      steps.push('🎉 Clean slate operation completed successfully!')
      
      return {
        success: true,
        message: 'Clean slate operation completed successfully',
        deletedCount: wipeResult.deletedCount,
        importedCount: importResult.importedCount,
        steps
      }
      
    } catch (error) {
      steps.push(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      return {
        success: false,
        message: 'Clean slate operation failed',
        deletedCount: 0,
        importedCount: 0,
        steps
      }
    }
  }
  
  // Utility: Get current menu item count
  static async getCurrentMenuItemCount(): Promise<number> {
    try {
      const menuItemsRef = collection(db, 'menu-items')
      const snapshot = await getDocs(menuItemsRef)
      return snapshot.size
    } catch (error) {
      console.error('Error getting menu item count:', error)
      return 0
    }
  }
  
  // Utility: Verify data integrity after import
  static async verifyDataIntegrity(): Promise<{
    success: boolean;
    totalItems: number;
    categoryCounts: { [key: string]: number };
    issues: string[];
  }> {
    try {
      const menuItemsRef = collection(db, 'menu-items')
      const snapshot = await getDocs(menuItemsRef)
      
      const items = snapshot.docs.map(doc => doc.data() as MenuItem)
      const categoryCounts: { [key: string]: number } = {}
      const issues: string[] = []
      
      // Count items by category
      items.forEach(item => {
        if (!categoryCounts[item.category]) {
          categoryCounts[item.category] = 0
        }
        categoryCounts[item.category]++
        
        // Check for data integrity issues
        if (!item.name || !item.description || !item.price) {
          issues.push(`Item ${item.id} missing required fields`)
        }
        
        if (item.price <= 0) {
          issues.push(`Item ${item.id} has invalid price: ${item.price}`)
        }
      })
      
      return {
        success: issues.length === 0,
        totalItems: items.length,
        categoryCounts,
        issues
      }
      
    } catch (error) {
      return {
        success: false,
        totalItems: 0,
        categoryCounts: {},
        issues: [`Error verifying data: ${error instanceof Error ? error.message : 'Unknown error'}`]
      }
    }
  }
}
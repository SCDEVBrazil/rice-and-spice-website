// lib/admin/buffet-manager.ts
// Buffet settings management operations

import type { BuffetSettings } from './types'

export class BuffetManager {
  // Get buffet settings (returns a copy to prevent direct mutation)
  static getBuffetSettings(settings: BuffetSettings): BuffetSettings {
    return { ...settings }
  }

  // Update buffet settings
  static updateBuffetSettings(
    currentSettings: BuffetSettings, 
    updates: Partial<BuffetSettings>
  ): BuffetSettings {
    return {
      ...currentSettings,
      ...updates,
      updatedAt: new Date().toISOString()
    }
  }

  // Update only the buffet price
  static updateBuffetPrice(settings: BuffetSettings, newPrice: number): BuffetSettings {
    return this.updateBuffetSettings(settings, { price: newPrice })
  }

  // Update only the buffet hours
  static updateBuffetHours(settings: BuffetSettings, newHours: string): BuffetSettings {
    return this.updateBuffetSettings(settings, { hours: newHours })
  }

  // Update only the buffet description
  static updateBuffetDescription(settings: BuffetSettings, newDescription: string): BuffetSettings {
    return this.updateBuffetSettings(settings, { description: newDescription })
  }

  // Toggle buffet active status
  static toggleBuffetStatus(settings: BuffetSettings): BuffetSettings {
    return this.updateBuffetSettings(settings, { isActive: !settings.isActive })
  }

  // Validate buffet settings
  static validateBuffetSettings(settings: Partial<BuffetSettings>): string[] {
    const errors: string[] = []

    if (settings.price !== undefined) {
      if (settings.price <= 0) {
        errors.push('Buffet price must be greater than 0')
      } else if (settings.price > 999.99) {
        errors.push('Buffet price must be less than $1000')
      }
    }

    if (settings.hours !== undefined) {
      if (!settings.hours.trim()) {
        errors.push('Buffet hours are required')
      } else if (settings.hours.length > 50) {
        errors.push('Buffet hours must be less than 50 characters')
      }
    }

    if (settings.description !== undefined) {
      if (!settings.description.trim()) {
        errors.push('Buffet description is required')
      } else if (settings.description.length > 200) {
        errors.push('Buffet description must be less than 200 characters')
      }
    }

    return errors
  }

  // Format buffet price for display
  static formatPrice(price: number): string {
    return `$${price.toFixed(2)}`
  }

  // Parse price string to number
  static parsePrice(priceString: string): number | null {
    const cleaned = priceString.replace(/[$,\s]/g, '')
    const parsed = parseFloat(cleaned)
    return isNaN(parsed) ? null : parsed
  }

  // Check if buffet is currently active (based on day and time)
  static isBuffetCurrentlyActive(settings: BuffetSettings): boolean {
    if (!settings.isActive) return false

    const now = new Date()
    const currentDay = now.getDay() // 0 = Sunday, 6 = Saturday
    
    // Saturday buffet only (day 6)
    if (currentDay !== 6) return false

    // Parse hours (assumes format like "11:00AM - 3:00PM")
    const timeRegex = /(\d{1,2}):(\d{2})(AM|PM)\s*-\s*(\d{1,2}):(\d{2})(AM|PM)/i
    const match = settings.hours.match(timeRegex)
    
    if (!match) return false

    const [, startHour, startMin, startPeriod, endHour, endMin, endPeriod] = match
    
    // Convert to 24-hour format
    let start24Hour = parseInt(startHour)
    let end24Hour = parseInt(endHour)
    
    if (startPeriod.toUpperCase() === 'PM' && start24Hour !== 12) start24Hour += 12
    if (startPeriod.toUpperCase() === 'AM' && start24Hour === 12) start24Hour = 0
    if (endPeriod.toUpperCase() === 'PM' && end24Hour !== 12) end24Hour += 12
    if (endPeriod.toUpperCase() === 'AM' && end24Hour === 12) end24Hour = 0

    const startTime = start24Hour * 60 + parseInt(startMin)
    const endTime = end24Hour * 60 + parseInt(endMin)
    const currentTime = now.getHours() * 60 + now.getMinutes()

    return currentTime >= startTime && currentTime <= endTime
  }

  // Get time until buffet starts/ends
  static getBuffetTimeStatus(settings: BuffetSettings): {
    status: 'active' | 'upcoming' | 'closed'
    message: string
    minutesUntilChange?: number
  } {
    if (!settings.isActive) {
      return { status: 'closed', message: 'Buffet is currently disabled' }
    }

    const now = new Date()
    const currentDay = now.getDay()
    
    // If it's not Saturday
    if (currentDay !== 6) {
      const daysUntilSaturday = (6 - currentDay) % 7 || 7
      return {
        status: 'upcoming',
        message: `Next buffet in ${daysUntilSaturday} day${daysUntilSaturday !== 1 ? 's' : ''}`,
        minutesUntilChange: daysUntilSaturday * 24 * 60
      }
    }

    // It's Saturday, check if buffet is active
    if (this.isBuffetCurrentlyActive(settings)) {
      return { status: 'active', message: 'Buffet is currently active!' }
    }

    return { status: 'closed', message: 'Buffet is closed for today' }
  }

  // Generate buffet summary for display
  static generateBuffetSummary(settings: BuffetSettings): {
    priceDisplay: string
    hoursDisplay: string
    statusMessage: string
    isActive: boolean
  } {
    const timeStatus = this.getBuffetTimeStatus(settings)
    
    return {
      priceDisplay: this.formatPrice(settings.price),
      hoursDisplay: settings.hours,
      statusMessage: timeStatus.message,
      isActive: timeStatus.status === 'active'
    }
  }

  // Compare two buffet settings to see what changed
  static getChanges(oldSettings: BuffetSettings, newSettings: BuffetSettings): string[] {
    const changes: string[] = []

    if (oldSettings.price !== newSettings.price) {
      changes.push(`Price: ${this.formatPrice(oldSettings.price)} → ${this.formatPrice(newSettings.price)}`)
    }

    if (oldSettings.hours !== newSettings.hours) {
      changes.push(`Hours: "${oldSettings.hours}" → "${newSettings.hours}"`)
    }

    if (oldSettings.description !== newSettings.description) {
      changes.push('Description updated')
    }

    if (oldSettings.isActive !== newSettings.isActive) {
      changes.push(`Status: ${oldSettings.isActive ? 'Active' : 'Inactive'} → ${newSettings.isActive ? 'Active' : 'Inactive'}`)
    }

    return changes
  }

  // Create default buffet settings
  static createDefaultSettings(): BuffetSettings {
    return {
      price: 17.99,
      hours: "11:00AM - 3:00PM",
      description: "All-you-can-eat Saturday buffet featuring rotating dishes and much more!",
      isActive: true,
      updatedAt: new Date().toISOString()
    }
  }

  // Reset buffet settings to defaults
  static resetToDefaults(): BuffetSettings {
    return this.createDefaultSettings()
  }
}
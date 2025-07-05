// lib/admin/analytics.ts
// Statistics and analytics operations for the admin system

import type { RestaurantData, RestaurantStats, CategoryStats, MenuItem } from './types'

export class AnalyticsManager {
  // Calculate comprehensive restaurant statistics
  static calculateStats(data: RestaurantData): RestaurantStats {
    const totalItems = data.menuItems.length
    const activeItems = data.menuItems.filter(item => item.isAvailable !== false).length
    const popularItems = data.menuItems.filter(item => item.isPopular === true).length
    const avgPrice = totalItems > 0 
      ? data.menuItems.reduce((sum, item) => sum + item.price, 0) / totalItems 
      : 0
    
    const categoryStats = this.calculateCategoryStats(data.menuItems, data.categories)

    return {
      totalItems,
      activeItems,
      popularItems,
      averagePrice: Math.round(avgPrice * 100) / 100,
      buffetPrice: data.buffetSettings.price,
      categoryStats,
      lastUpdated: data.buffetSettings.updatedAt
    }
  }

  // Calculate statistics for each category
  static calculateCategoryStats(items: MenuItem[], categories: string[]): CategoryStats[] {
    return categories.map(category => ({
      category,
      count: items.filter(item => item.category === category).length
    }))
  }

  // Get detailed category analytics
  static getCategoryAnalytics(items: MenuItem[], category: string) {
    const categoryItems = items.filter(item => item.category === category)
    const activeItems = categoryItems.filter(item => item.isAvailable !== false)
    const popularItems = categoryItems.filter(item => item.isPopular === true)
    
    const prices = categoryItems.map(item => item.price)
    const avgPrice = prices.length > 0 ? prices.reduce((sum, price) => sum + price, 0) / prices.length : 0
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0

    return {
      category,
      totalItems: categoryItems.length,
      activeItems: activeItems.length,
      popularItems: popularItems.length,
      averagePrice: Math.round(avgPrice * 100) / 100,
      minPrice,
      maxPrice,
      priceRange: maxPrice - minPrice,
      popularityRate: categoryItems.length > 0 ? (popularItems.length / categoryItems.length) * 100 : 0,
      availabilityRate: categoryItems.length > 0 ? (activeItems.length / categoryItems.length) * 100 : 0
    }
  }

  // Get price distribution analytics
  static getPriceAnalytics(items: MenuItem[]) {
    const prices = items.map(item => item.price).sort((a, b) => a - b)
    const totalItems = prices.length

    if (totalItems === 0) {
      return {
        min: 0,
        max: 0,
        average: 0,
        median: 0,
        mode: 0,
        priceRanges: []
      }
    }

    const min = prices[0]
    const max = prices[totalItems - 1]
    const average = prices.reduce((sum, price) => sum + price, 0) / totalItems
    const median = totalItems % 2 === 0 
      ? (prices[totalItems / 2 - 1] + prices[totalItems / 2]) / 2
      : prices[Math.floor(totalItems / 2)]

    // Calculate mode (most frequent price)
    const priceFrequency = new Map<number, number>()
    prices.forEach(price => {
      priceFrequency.set(price, (priceFrequency.get(price) || 0) + 1)
    })
    const mode = Array.from(priceFrequency.entries())
      .reduce((a, b) => a[1] > b[1] ? a : b)[0]

    // Create price ranges
    const priceRanges = this.createPriceRanges(prices)

    return {
      min,
      max,
      average: Math.round(average * 100) / 100,
      median: Math.round(median * 100) / 100,
      mode,
      priceRanges
    }
  }

  // Create price distribution ranges
  private static createPriceRanges(prices: number[]) {
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    const rangeSize = (max - min) / 5 // Create 5 ranges

    const ranges = []
    for (let i = 0; i < 5; i++) {
      const rangeMin = min + (rangeSize * i)
      const rangeMax = i === 4 ? max : min + (rangeSize * (i + 1))
      const count = prices.filter(price => price >= rangeMin && price <= rangeMax).length

      ranges.push({
        label: `$${rangeMin.toFixed(2)} - $${rangeMax.toFixed(2)}`,
        min: rangeMin,
        max: rangeMax,
        count,
        percentage: (count / prices.length) * 100
      })
    }

    return ranges
  }

  // Get popularity analytics
  static getPopularityAnalytics(items: MenuItem[]) {
    const popularItems = items.filter(item => item.isPopular === true)
    const popularByCategory = new Map<string, number>()

    popularItems.forEach(item => {
      popularByCategory.set(item.category, (popularByCategory.get(item.category) || 0) + 1)
    })

    const categoryPopularity = Array.from(popularByCategory.entries()).map(([category, count]) => ({
      category,
      popularCount: count,
      totalInCategory: items.filter(item => item.category === category).length,
      popularityRate: (count / items.filter(item => item.category === category).length) * 100
    }))

    return {
      totalPopularItems: popularItems.length,
      popularityRate: (popularItems.length / items.length) * 100,
      categoryPopularity: categoryPopularity.sort((a, b) => b.popularityRate - a.popularityRate),
      mostPopularCategory: categoryPopularity.length > 0 
        ? categoryPopularity.reduce((a, b) => a.popularityRate > b.popularityRate ? a : b).category
        : null
    }
  }

  // Get availability analytics
  static getAvailabilityAnalytics(items: MenuItem[]) {
    const availableItems = items.filter(item => item.isAvailable !== false)
    const unavailableItems = items.filter(item => item.isAvailable === false)

    const availabilityByCategory = new Map<string, { available: number; total: number }>()

    items.forEach(item => {
      const current = availabilityByCategory.get(item.category) || { available: 0, total: 0 }
      current.total++
      if (item.isAvailable !== false) current.available++
      availabilityByCategory.set(item.category, current)
    })

    const categoryAvailability = Array.from(availabilityByCategory.entries()).map(([category, stats]) => ({
      category,
      availableCount: stats.available,
      totalCount: stats.total,
      availabilityRate: (stats.available / stats.total) * 100
    }))

    return {
      totalAvailable: availableItems.length,
      totalUnavailable: unavailableItems.length,
      overallAvailabilityRate: (availableItems.length / items.length) * 100,
      categoryAvailability: categoryAvailability.sort((a, b) => b.availabilityRate - a.availabilityRate),
      leastAvailableCategory: categoryAvailability.length > 0
        ? categoryAvailability.reduce((a, b) => a.availabilityRate < b.availabilityRate ? a : b).category
        : null
    }
  }

  // Get recent updates analytics
  static getUpdateAnalytics(items: MenuItem[]) {
    const now = new Date()
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const recentlyUpdated = {
      lastDay: items.filter(item => new Date(item.updatedAt) > oneDayAgo).length,
      lastWeek: items.filter(item => new Date(item.updatedAt) > oneWeekAgo).length,
      lastMonth: items.filter(item => new Date(item.updatedAt) > oneMonthAgo).length
    }

    const recentlyCreated = {
      lastDay: items.filter(item => new Date(item.createdAt) > oneDayAgo).length,
      lastWeek: items.filter(item => new Date(item.createdAt) > oneWeekAgo).length,
      lastMonth: items.filter(item => new Date(item.createdAt) > oneMonthAgo).length
    }

    // Get most recently updated items
    const sortedByUpdate = [...items].sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )

    return {
      recentlyUpdated,
      recentlyCreated,
      mostRecentlyUpdated: sortedByUpdate.slice(0, 5),
      oldestItems: sortedByUpdate.slice(-5).reverse()
    }
  }

  // Generate comprehensive analytics report
  static generateAnalyticsReport(data: RestaurantData) {
    const basicStats = this.calculateStats(data)
    const priceAnalytics = this.getPriceAnalytics(data.menuItems)
    const popularityAnalytics = this.getPopularityAnalytics(data.menuItems)
    const availabilityAnalytics = this.getAvailabilityAnalytics(data.menuItems)
    const updateAnalytics = this.getUpdateAnalytics(data.menuItems)

    // Detailed category analytics
    const detailedCategoryStats = data.categories.map(category =>
      this.getCategoryAnalytics(data.menuItems, category)
    )

    return {
      summary: basicStats,
      pricing: priceAnalytics,
      popularity: popularityAnalytics,
      availability: availabilityAnalytics,
      updates: updateAnalytics,
      categories: detailedCategoryStats,
      recommendations: this.generateRecommendations(data)
    }
  }

  // Generate recommendations based on analytics
  static generateRecommendations(data: RestaurantData): string[] {
    const recommendations: string[] = []
    const items = data.menuItems
    
    // Check for categories with no popular items
    const categoriesWithoutPopular = data.categories.filter(category => {
      const categoryItems = items.filter(item => item.category === category)
      return categoryItems.length > 0 && !categoryItems.some(item => item.isPopular)
    })

    if (categoriesWithoutPopular.length > 0) {
      recommendations.push(`Consider marking some items as popular in: ${categoriesWithoutPopular.join(', ')}`)
    }

    // Check for price gaps
    const priceAnalytics = this.getPriceAnalytics(items)
    if (priceAnalytics.max - priceAnalytics.min > 30) {
      recommendations.push('Consider adding mid-range priced items to fill pricing gaps')
    }

    // Check for availability issues
    const availabilityAnalytics = this.getAvailabilityAnalytics(items)
    if (availabilityAnalytics.overallAvailabilityRate < 90) {
      recommendations.push('Review unavailable items - consider updating or removing them')
    }

    // Check for categories with few items
    const smallCategories = data.categories.filter(category => {
      const count = items.filter(item => item.category === category).length
      return count > 0 && count < 3
    })

    if (smallCategories.length > 0) {
      recommendations.push(`Consider adding more items to: ${smallCategories.join(', ')}`)
    }

    // Check buffet pricing
    if (data.buffetSettings.price < priceAnalytics.average * 2) {
      recommendations.push('Buffet price seems competitive compared to average menu item prices')
    }

    return recommendations
  }

  // Export analytics data for external use
  static exportAnalytics(data: RestaurantData): string {
    const report = this.generateAnalyticsReport(data)
    return JSON.stringify(report, null, 2)
  }
}
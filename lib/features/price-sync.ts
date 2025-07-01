/**
 * Price Synchronization System for MU Waterwear
 * Ensures consistency between Stripe prices and internal product data
 */

export interface ProductPrice {
  id: string
  name: string
  stripeProductId?: string
  stripePriceId?: string
  currentPrice: number
  originalPrice?: number
  currency: 'usd'
  lastSyncDate?: string
  syncStatus: 'synced' | 'pending' | 'error' | 'outdated'
  discountPercentage?: number
}

export interface PriceSyncResult {
  success: boolean
  productId: string
  oldPrice?: number
  newPrice?: number
  stripeUpdated: boolean
  internalUpdated: boolean
  error?: string
  timestamp: string
}

export interface PricingRule {
  id: string
  name: string
  condition: (product: ProductPrice) => boolean
  action: (product: ProductPrice) => Partial<ProductPrice>
  priority: number
  enabled: boolean
}

export class PriceSynchronizer {
  private static instance: PriceSynchronizer
  private syncInProgress: boolean = false
  private lastFullSync?: Date
  private pricingRules: PricingRule[] = []

  private constructor() {
    this.initializeDefaultPricingRules()
  }

  public static getInstance(): PriceSynchronizer {
    if (!PriceSynchronizer.instance) {
      PriceSynchronizer.instance = new PriceSynchronizer()
    }
    return PriceSynchronizer.instance
  }

  /**
   * Initialize default pricing rules for MU Waterwear
   */
  private initializeDefaultPricingRules(): void {
    this.pricingRules = [
      {
        id: 'seasonal-discount',
        name: 'Seasonal Discount',
        condition: (product) => {
          const month = new Date().getMonth()
          // Apply discount during off-season (Oct-Mar)
          return month >= 9 || month <= 2
        },
        action: (product) => ({
          currentPrice: Math.round(product.originalPrice! * 0.85 * 100) / 100,
          discountPercentage: 15
        }),
        priority: 1,
        enabled: true
      },
      {
        id: 'bulk-pricing',
        name: 'Bulk Pricing Adjustment',
        condition: (product) => product.name.toLowerCase().includes('bundle'),
        action: (product) => ({
          currentPrice: Math.round(product.originalPrice! * 0.9 * 100) / 100,
          discountPercentage: 10
        }),
        priority: 2,
        enabled: true
      },
      {
        id: 'premium-pricing',
        name: 'Premium Product Pricing',
        condition: (product) => 
          product.name.toLowerCase().includes('premium') || 
          product.name.toLowerCase().includes('pro'),
        action: (product) => ({
          currentPrice: Math.round(product.originalPrice! * 1.15 * 100) / 100
        }),
        priority: 3,
        enabled: true
      }
    ]
  }

  /**
   * Sync a single product price with Stripe
   */
  public async syncProductPrice(productId: string, internalPrice: number): Promise<PriceSyncResult> {
    const startTime = Date.now()
    
    try {
      console.log('Price sync started', { 
        productId, 
        internalPrice,
        context: 'price-sync'
      })

      // Get current Stripe price
      const stripePrice = await this.getStripePrice(productId)
      const stripePriceCents = stripePrice ? stripePrice.unit_amount : null
      const stripeActualPrice = stripePriceCents ? stripePriceCents / 100 : null

      const internalPriceCents = Math.round(internalPrice * 100)
      let stripeUpdated = false
      let internalUpdated = false

      // Check if prices match
      if (stripeActualPrice !== internalPrice) {
        // Update Stripe if internal price is different
        if (stripePriceCents !== internalPriceCents) {
          await this.updateStripePrice(productId, internalPriceCents)
          stripeUpdated = true
        }
      }

      const result: PriceSyncResult = {
        success: true,
        productId,
        oldPrice: stripeActualPrice || undefined,
        newPrice: internalPrice,
        stripeUpdated,
        internalUpdated,
        timestamp: new Date().toISOString()
      }

      console.log('Price sync completed', {
        ...result,
        duration: Date.now() - startTime,
        context: 'price-sync'
      })

      return result

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'

      return {
        success: false,
        productId,
        stripeUpdated: false,
        internalUpdated: false,
        error: errorMessage,
        timestamp: new Date().toISOString()
      }
    }
  }

  /**
   * Sync all product prices
   */
  public async syncAllPrices(products: ProductPrice[]): Promise<PriceSyncResult[]> {
    if (this.syncInProgress) {
      throw new Error('Price synchronization is already in progress')
    }

    this.syncInProgress = true
    const results: PriceSyncResult[] = []

    try {
      console.log('Bulk price sync started', {
        productCount: products.length,
        context: 'price-sync'
      })

      // Apply pricing rules first
      const processedProducts = this.applyPricingRules(products)

      // Sync in batches to avoid rate limiting
      const batchSize = 10
      for (let i = 0; i < processedProducts.length; i += batchSize) {
        const batch = processedProducts.slice(i, i + batchSize)
        
        const batchPromises = batch.map(async (product) => {
          return this.syncProductPrice(product.id, product.currentPrice)
        })

        const batchResults = await Promise.allSettled(batchPromises)
        
        batchResults.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            results.push(result.value)
          } else {
            results.push({
              success: false,
              productId: batch[index].id,
              stripeUpdated: false,
              internalUpdated: false,
              error: result.reason?.message || 'Unknown error',
              timestamp: new Date().toISOString()
            })
          }
        })

        // Add delay between batches
        if (i + batchSize < processedProducts.length) {
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }

      this.lastFullSync = new Date()

      console.log('Bulk price sync completed', {
        totalProducts: products.length,
        successCount: results.filter(r => r.success).length,
        errorCount: results.filter(r => !r.success).length,
        context: 'price-sync'
      })

    } finally {
      this.syncInProgress = false
    }

    return results
  }

  /**
   * Apply pricing rules to products
   */
  private applyPricingRules(products: ProductPrice[]): ProductPrice[] {
    return products.map(product => {
      let processedProduct = { ...product }
      
      // Set original price if not set
      if (!processedProduct.originalPrice) {
        processedProduct.originalPrice = processedProduct.currentPrice
      }

      // Apply enabled rules in priority order
      const applicableRules = this.pricingRules
        .filter(rule => rule.enabled && rule.condition(processedProduct))
        .sort((a, b) => a.priority - b.priority)

      for (const rule of applicableRules) {
        const changes = rule.action(processedProduct)
        processedProduct = { ...processedProduct, ...changes }
        
        console.log('Pricing rule applied', {
          productId: product.id,
          ruleId: rule.id,
          ruleName: rule.name,
          changes,
          context: 'price-sync'
        })
      }

      return processedProduct
    })
  }

  /**
   * Get price from Stripe
   */
  private async getStripePrice(productId: string): Promise<any> {
    try {
      // This would integrate with your Stripe API
      // For now, return mock data
      const response = await fetch(`/api/stripe/prices/${productId}`)
      if (!response.ok) {
        throw new Error(`Stripe API error: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.warn('Failed to get Stripe price', {
        productId,
        error: error instanceof Error ? error.message : 'Unknown error',
        context: 'price-sync'
      })
      return null
    }
  }

  /**
   * Update price in Stripe
   */
  private async updateStripePrice(productId: string, priceCents: number): Promise<void> {
    try {
      const response = await fetch(`/api/stripe/prices/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unit_amount: priceCents })
      })

      if (!response.ok) {
        throw new Error(`Failed to update Stripe price: ${response.status}`)
      }

      console.log('Stripe price updated', {
        productId,
        priceCents,
        context: 'price-sync'
      })

    } catch (error) {
      throw new Error(`Failed to update price in Stripe: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Validate price consistency
   */
  public async validatePriceConsistency(products: ProductPrice[]): Promise<{
    consistent: boolean
    issues: Array<{
      productId: string
      issue: string
      internalPrice?: number
      stripePrice?: number
      recommendation: string
    }>
  }> {
    const issues: Array<{
      productId: string
      issue: string
      internalPrice?: number
      stripePrice?: number
      recommendation: string
    }> = []

    for (const product of products) {
      try {
        const stripePrice = await this.getStripePrice(product.id)
        const stripePriceValue = stripePrice ? stripePrice.unit_amount / 100 : null

        if (stripePriceValue === null) {
          issues.push({
            productId: product.id,
            issue: 'Product not found in Stripe',
            internalPrice: product.currentPrice,
            recommendation: 'Create product in Stripe or remove from internal catalog'
          })
        } else if (Math.abs(stripePriceValue - product.currentPrice) > 0.01) {
          issues.push({
            productId: product.id,
            issue: 'Price mismatch between internal and Stripe',
            internalPrice: product.currentPrice,
            stripePrice: stripePriceValue,
            recommendation: 'Sync prices using syncProductPrice method'
          })
        }
      } catch (error) {
        issues.push({
          productId: product.id,
          issue: 'Error checking Stripe price',
          internalPrice: product.currentPrice,
          recommendation: 'Check Stripe API connectivity and product configuration'
        })
      }
    }

    return {
      consistent: issues.length === 0,
      issues
    }
  }

  /**
   * Get sync status
   */
  public getSyncStatus(): {
    syncInProgress: boolean
    lastFullSync?: Date
    activePricingRules: number
  } {
    return {
      syncInProgress: this.syncInProgress,
      lastFullSync: this.lastFullSync,
      activePricingRules: this.pricingRules.filter(r => r.enabled).length
    }
  }

  /**
   * Add or update pricing rule
   */
  public updatePricingRule(rule: PricingRule): void {
    const existingIndex = this.pricingRules.findIndex(r => r.id === rule.id)
    
    if (existingIndex >= 0) {
      this.pricingRules[existingIndex] = rule
    } else {
      this.pricingRules.push(rule)
    }

    console.log('Pricing rule updated', {
      ruleId: rule.id,
      ruleName: rule.name,
      enabled: rule.enabled,
      context: 'price-sync'
    })
  }

  /**
   * Remove pricing rule
   */
  public removePricingRule(ruleId: string): boolean {
    const initialLength = this.pricingRules.length
    this.pricingRules = this.pricingRules.filter(r => r.id !== ruleId)
    
    const removed = this.pricingRules.length < initialLength
    if (removed) {
      console.log('Pricing rule removed', {
        ruleId,
        context: 'price-sync'
      })
    }
    
    return removed
  }

  /**
   * Get all pricing rules
   */
  public getPricingRules(): PricingRule[] {
    return [...this.pricingRules]
  }
} 
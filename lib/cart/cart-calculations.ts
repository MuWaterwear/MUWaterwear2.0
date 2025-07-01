// Cart Calculation Utilities
'use client'

import { CartItem } from './cart-types'

/**
 * Handles all cart calculation operations
 * Provides utilities for pricing, quantities, taxes, and shipping
 */
export class CartCalculations {
  
  /**
   * Calculate the total price of all items in cart
   * @param items - Array of cart items
   * @returns Formatted total price string
   */
  static calculateTotal(items: CartItem[]): string {
    try {
      const total = items.reduce((sum, item) => {
        const price = this.parsePrice(item.price)
        if (isNaN(price)) {
          console.warn(`Invalid price for item ${item.name}: ${item.price}`)
          return sum
        }
        return sum + (price * item.quantity)
      }, 0)

      return this.formatPrice(total)
    } catch (error) {
      console.error('Error calculating cart total:', error)
      return '$0.00'
    }
  }

  /**
   * Calculate total number of items in cart
   * @param items - Array of cart items
   * @returns Total quantity count
   */
  static calculateItemCount(items: CartItem[]): number {
    try {
      return items.reduce((total, item) => total + item.quantity, 0)
    } catch (error) {
      console.error('Error calculating item count:', error)
      return 0
    }
  }

  /**
   * Calculate subtotal (before taxes and shipping)
   * @param items - Array of cart items
   * @returns Subtotal amount as number
   */
  static calculateSubtotal(items: CartItem[]): number {
    try {
      return items.reduce((sum, item) => {
        const price = this.parsePrice(item.price)
        return sum + (price * item.quantity)
      }, 0)
    } catch (error) {
      console.error('Error calculating subtotal:', error)
      return 0
    }
  }

  /**
   * Calculate tax amount based on subtotal and tax rate
   * @param subtotal - Subtotal amount
   * @param taxRate - Tax rate as decimal (e.g., 0.08 for 8%)
   * @returns Tax amount
   */
  static calculateTax(subtotal: number, taxRate: number = 0.08): number {
    try {
      return Math.round(subtotal * taxRate * 100) / 100
    } catch (error) {
      console.error('Error calculating tax:', error)
      return 0
    }
  }

  /**
   * Calculate shipping cost based on cart contents
   * @param items - Array of cart items
   * @param shippingRules - Shipping calculation rules
   * @returns Shipping cost
   */
  static calculateShipping(
    items: CartItem[], 
    shippingRules: ShippingRules = DEFAULT_SHIPPING_RULES
  ): number {
    try {
      const subtotal = this.calculateSubtotal(items)
      const itemCount = this.calculateItemCount(items)

      // Free shipping threshold
      if (subtotal >= shippingRules.freeShippingThreshold) {
        return 0
      }

      // Base shipping cost + per item cost
      return shippingRules.baseShippingCost + (itemCount * shippingRules.perItemCost)
    } catch (error) {
      console.error('Error calculating shipping:', error)
      return DEFAULT_SHIPPING_RULES.baseShippingCost
    }
  }

  /**
   * Calculate grand total including tax and shipping
   * @param items - Array of cart items
   * @param taxRate - Tax rate as decimal
   * @param shippingRules - Shipping calculation rules
   * @returns Grand total as formatted string
   */
  static calculateGrandTotal(
    items: CartItem[],
    taxRate: number = 0.08,
    shippingRules: ShippingRules = DEFAULT_SHIPPING_RULES
  ): string {
    try {
      const subtotal = this.calculateSubtotal(items)
      const tax = this.calculateTax(subtotal, taxRate)
      const shipping = this.calculateShipping(items, shippingRules)
      
      const grandTotal = subtotal + tax + shipping
      return this.formatPrice(grandTotal)
    } catch (error) {
      console.error('Error calculating grand total:', error)
      return '$0.00'
    }
  }

  /**
   * Get detailed cart summary with all calculations
   * @param items - Array of cart items
   * @param taxRate - Tax rate as decimal
   * @param shippingRules - Shipping calculation rules
   * @returns Detailed cart summary
   */
  static getCartSummary(
    items: CartItem[],
    taxRate: number = 0.08,
    shippingRules: ShippingRules = DEFAULT_SHIPPING_RULES
  ): CartSummary {
    try {
      const subtotal = this.calculateSubtotal(items)
      const tax = this.calculateTax(subtotal, taxRate)
      const shipping = this.calculateShipping(items, shippingRules)
      const grandTotal = subtotal + tax + shipping

      return {
        itemCount: this.calculateItemCount(items),
        subtotal: this.formatPrice(subtotal),
        subtotalRaw: subtotal,
        tax: this.formatPrice(tax),
        taxRaw: tax,
        taxRate: taxRate * 100, // Convert to percentage
        shipping: this.formatPrice(shipping),
        shippingRaw: shipping,
        freeShippingThreshold: shippingRules.freeShippingThreshold,
        freeShippingRemaining: Math.max(0, shippingRules.freeShippingThreshold - subtotal),
        grandTotal: this.formatPrice(grandTotal),
        grandTotalRaw: grandTotal,
        savings: shipping === 0 && subtotal >= shippingRules.freeShippingThreshold 
          ? this.formatPrice(shippingRules.baseShippingCost) 
          : '$0.00'
      }
    } catch (error) {
      console.error('Error generating cart summary:', error)
      return this.getEmptyCartSummary()
    }
  }

  /**
   * Calculate price per item including quantity
   * @param item - Cart item
   * @returns Item total price
   */
  static calculateItemTotal(item: CartItem): string {
    try {
      const price = this.parsePrice(item.price)
      const total = price * item.quantity
      return this.formatPrice(total)
    } catch (error) {
      console.error(`Error calculating total for item ${item.name}:`, error)
      return '$0.00'
    }
  }

  /**
   * Check if cart qualifies for free shipping
   * @param items - Array of cart items
   * @param threshold - Free shipping threshold
   * @returns Whether cart qualifies for free shipping
   */
  static qualifiesForFreeShipping(
    items: CartItem[], 
    threshold: number = DEFAULT_SHIPPING_RULES.freeShippingThreshold
  ): boolean {
    const subtotal = this.calculateSubtotal(items)
    return subtotal >= threshold
  }

  /**
   * Calculate amount needed for free shipping
   * @param items - Array of cart items
   * @param threshold - Free shipping threshold
   * @returns Amount needed for free shipping
   */
  static amountForFreeShipping(
    items: CartItem[],
    threshold: number = DEFAULT_SHIPPING_RULES.freeShippingThreshold
  ): string {
    const subtotal = this.calculateSubtotal(items)
    const remaining = Math.max(0, threshold - subtotal)
    return this.formatPrice(remaining)
  }

  /**
   * Parse price string to number
   * @param priceString - Price in format "$XX.XX"
   * @returns Price as number
   */
  private static parsePrice(priceString: string): number {
    try {
      const cleaned = priceString.replace(/[$,]/g, '')
      const parsed = parseFloat(cleaned)
      return isNaN(parsed) ? 0 : parsed
    } catch {
      return 0
    }
  }

  /**
   * Format number to price string
   * @param amount - Amount as number
   * @returns Formatted price string
   */
  private static formatPrice(amount: number): string {
    try {
      return `$${amount.toFixed(2)}`
    } catch {
      return '$0.00'
    }
  }

  /**
   * Get empty cart summary for error states
   * @returns Empty cart summary
   */
  private static getEmptyCartSummary(): CartSummary {
    return {
      itemCount: 0,
      subtotal: '$0.00',
      subtotalRaw: 0,
      tax: '$0.00',
      taxRaw: 0,
      taxRate: 8,
      shipping: '$0.00',
      shippingRaw: 0,
      freeShippingThreshold: DEFAULT_SHIPPING_RULES.freeShippingThreshold,
      freeShippingRemaining: DEFAULT_SHIPPING_RULES.freeShippingThreshold,
      grandTotal: '$0.00',
      grandTotalRaw: 0,
      savings: '$0.00'
    }
  }
}

// Supporting interfaces and types
export interface ShippingRules {
  baseShippingCost: number
  perItemCost: number
  freeShippingThreshold: number
  expeditedShippingCost?: number
}

export interface CartSummary {
  itemCount: number
  subtotal: string
  subtotalRaw: number
  tax: string
  taxRaw: number
  taxRate: number // As percentage
  shipping: string
  shippingRaw: number
  freeShippingThreshold: number
  freeShippingRemaining: number
  grandTotal: string
  grandTotalRaw: number
  savings: string // Amount saved on shipping
}

// Default shipping rules
export const DEFAULT_SHIPPING_RULES: ShippingRules = {
  baseShippingCost: 8.99,
  perItemCost: 0.50,
  freeShippingThreshold: 75.00,
  expeditedShippingCost: 15.99
} 
// Cart Action Handlers - Business Logic for Cart Operations
'use client'

import { CartItem, CartError, CartOperationResult, CartItemInput, DEFAULT_VALIDATION_RULES } from './cart-types'
import { CartStorageManager } from './cart-storage'
import { CartCalculations } from './cart-calculations'

/**
 * Handles all cart business logic operations
 * Provides centralized, validated, and error-handled cart actions
 */
export class CartActions {
  
  /**
   * Add an item to cart with validation and error handling
   * @param items - Current cart items
   * @param newItem - Item to add (without quantity)
   * @returns Cart operation result
   */
  static async addItem(items: CartItem[], newItem: CartItemInput): Promise<CartOperationResult> {
    try {
      // Validate the new item
      const validation = this.validateCartItem(newItem)
      if (!validation.isValid) {
        return {
          success: false,
          error: {
            message: `Invalid item: ${validation.errors.join(', ')}`,
            type: 'validation',
            timestamp: Date.now()
          }
        }
      }

      // Check cart limits
      const itemCount = CartCalculations.calculateItemCount(items)
      if (itemCount >= DEFAULT_VALIDATION_RULES.maxQuantity) {
        return {
          success: false,
          error: {
            message: 'Cart is full. Please remove items before adding more.',
            type: 'validation',
            timestamp: Date.now()
          }
        }
      }

      // Create updated cart
      const updatedItems = [...items]
      const existingItemIndex = updatedItems.findIndex(
        item => item.id === newItem.id && item.size === newItem.size
      )

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const existingItem = updatedItems[existingItemIndex]
        const newQuantity = existingItem.quantity + 1

        if (newQuantity > DEFAULT_VALIDATION_RULES.maxQuantity) {
          return {
            success: false,
            error: {
              message: `Maximum quantity (${DEFAULT_VALIDATION_RULES.maxQuantity}) reached for this item.`,
              type: 'validation',
              timestamp: Date.now()
            }
          }
        }

        updatedItems[existingItemIndex] = { ...existingItem, quantity: newQuantity }
      } else {
        // Add new item
        updatedItems.push({ ...newItem, quantity: 1 })
      }

      // Save to storage
      const saved = await CartStorageManager.saveCart(updatedItems)
      
      if (!saved) {
        return {
          success: false,
          error: {
            message: 'Failed to save cart changes. Please try again.',
            type: 'storage',
            timestamp: Date.now()
          }
        }
      }

      return {
        success: true,
        items: updatedItems
      }

    } catch (error) {
      console.error('Error adding item to cart:', error)
      return {
        success: false,
        error: {
          message: `Failed to add ${newItem.name} to cart. Please try again.`,
          type: 'unknown',
          timestamp: Date.now()
        }
      }
    }
  }

  /**
   * Update item quantity in cart
   * @param items - Current cart items
   * @param itemId - ID of item to update
   * @param quantity - New quantity
   * @param size - Optional size for item identification
   * @returns Cart operation result
   */
  static async updateQuantity(
    items: CartItem[], 
    itemId: string, 
    quantity: number, 
    size?: string
  ): Promise<CartOperationResult> {
    try {
      // Validate quantity
      if (quantity < 0) {
        return {
          success: false,
          error: {
            message: 'Quantity cannot be negative.',
            type: 'validation',
            timestamp: Date.now()
          }
        }
      }

      if (quantity > DEFAULT_VALIDATION_RULES.maxQuantity) {
        return {
          success: false,
          error: {
            message: `Maximum quantity is ${DEFAULT_VALIDATION_RULES.maxQuantity}.`,
            type: 'validation',
            timestamp: Date.now()
          }
        }
      }

      // If quantity is 0, remove the item
      if (quantity === 0) {
        return this.removeItem(items, itemId, size)
      }

      // Find and update item
      const updatedItems = items.map(item => {
        const matches = item.id === itemId && (!size || item.size === size)
        return matches ? { ...item, quantity } : item
      })

      // Check if item was found
      const itemFound = updatedItems.some(item => 
        item.id === itemId && (!size || item.size === size)
      )

      if (!itemFound) {
        return {
          success: false,
          error: {
            message: 'Item not found in cart.',
            type: 'validation',
            timestamp: Date.now()
          }
        }
      }

      // Save to storage
      const saved = await CartStorageManager.saveCart(updatedItems)
      
      if (!saved) {
        return {
          success: false,
          error: {
            message: 'Failed to save cart changes. Please try again.',
            type: 'storage',
            timestamp: Date.now()
          }
        }
      }

      return {
        success: true,
        items: updatedItems
      }

    } catch (error) {
      console.error('Error updating item quantity:', error)
      return {
        success: false,
        error: {
          message: 'Failed to update item quantity. Please try again.',
          type: 'unknown',
          timestamp: Date.now()
        }
      }
    }
  }

  /**
   * Remove item from cart
   * @param items - Current cart items
   * @param itemId - ID of item to remove
   * @param size - Optional size for item identification
   * @returns Cart operation result
   */
  static async removeItem(
    items: CartItem[], 
    itemId: string, 
    size?: string
  ): Promise<CartOperationResult> {
    try {
      // Filter out the item
      const updatedItems = items.filter(item => {
        const matches = item.id === itemId && (!size || item.size === size)
        return !matches
      })

      // Check if item was actually removed
      if (updatedItems.length === items.length) {
        return {
          success: false,
          error: {
            message: 'Item not found in cart.',
            type: 'validation',
            timestamp: Date.now()
          }
        }
      }

      // Save to storage
      const saved = await CartStorageManager.saveCart(updatedItems)
      
      if (!saved) {
        return {
          success: false,
          error: {
            message: 'Failed to save cart changes. Please try again.',
            type: 'storage',
            timestamp: Date.now()
          }
        }
      }

      return {
        success: true,
        items: updatedItems
      }

    } catch (error) {
      console.error('Error removing item from cart:', error)
      return {
        success: false,
        error: {
          message: 'Failed to remove item from cart. Please try again.',
          type: 'unknown',
          timestamp: Date.now()
        }
      }
    }
  }

  /**
   * Clear all items from cart
   * @returns Cart operation result
   */
  static async clearCart(): Promise<CartOperationResult> {
    try {
      const saved = await CartStorageManager.clearCart()
      
      if (!saved) {
        return {
          success: false,
          error: {
            message: 'Failed to clear cart. Please try again.',
            type: 'storage',
            timestamp: Date.now()
          }
        }
      }

      return {
        success: true,
        items: []
      }

    } catch (error) {
      console.error('Error clearing cart:', error)
      return {
        success: false,
        error: {
          message: 'Failed to clear cart. Please try again.',
          type: 'unknown',
          timestamp: Date.now()
        }
      }
    }
  }

  /**
   * Load cart from storage
   * @returns Cart operation result
   */
  static async loadCart(): Promise<CartOperationResult> {
    try {
      const { items, error } = await CartStorageManager.loadCart()
      
      return {
        success: !error,
        items,
        error
      }

    } catch (error) {
      console.error('Error loading cart:', error)
      return {
        success: false,
        error: {
          message: 'Failed to load cart. Please refresh the page.',
          type: 'storage',
          timestamp: Date.now()
        }
      }
    }
  }

  /**
   * Validate cart item data
   * @param item - Item to validate
   * @returns Validation result
   */
  private static validateCartItem(item: CartItemInput): { 
    isValid: boolean; 
    errors: string[] 
  } {
    const errors: string[] = []

    // Check required fields
    if (!item.id || typeof item.id !== 'string' || item.id.trim().length === 0) {
      errors.push('Item ID is required')
    }

    if (!item.name || typeof item.name !== 'string' || item.name.trim().length === 0) {
      errors.push('Item name is required')
    }

    if (!item.price || typeof item.price !== 'string') {
      errors.push('Item price is required')
    } else if (!DEFAULT_VALIDATION_RULES.priceFormat.test(item.price)) {
      errors.push('Invalid price format')
    }

    if (!item.image || typeof item.image !== 'string' || item.image.trim().length === 0) {
      errors.push('Item image is required')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Merge two cart arrays (useful for syncing across devices)
   * @param cart1 - First cart
   * @param cart2 - Second cart
   * @returns Merged cart with combined quantities
   */
  static mergeCart(cart1: CartItem[], cart2: CartItem[]): CartItem[] {
    const merged = [...cart1]

    cart2.forEach(item2 => {
      const existingIndex = merged.findIndex(
        item1 => item1.id === item2.id && item1.size === item2.size
      )

      if (existingIndex >= 0) {
        // Combine quantities
        merged[existingIndex].quantity += item2.quantity
      } else {
        // Add new item
        merged.push(item2)
      }
    })

    return merged
  }

  /**
   * Validate entire cart for consistency
   * @param items - Cart items to validate
   * @returns Validation result with cleaned items
   */
  static validateCart(items: CartItem[]): { 
    isValid: boolean; 
    cleanedItems: CartItem[]; 
    issues: string[] 
  } {
    const issues: string[] = []
    const cleanedItems: CartItem[] = []

    items.forEach((item, index) => {
      const validation = this.validateCartItem(item)
      
      if (validation.isValid) {
        // Additional quantity validation
        if (item.quantity <= 0) {
          issues.push(`Item ${index + 1}: Invalid quantity`)
        } else if (item.quantity > DEFAULT_VALIDATION_RULES.maxQuantity) {
          issues.push(`Item ${index + 1}: Quantity exceeds maximum`)
          cleanedItems.push({ ...item, quantity: DEFAULT_VALIDATION_RULES.maxQuantity })
        } else {
          cleanedItems.push(item)
        }
      } else {
        issues.push(`Item ${index + 1}: ${validation.errors.join(', ')}`)
      }
    })

    return {
      isValid: issues.length === 0,
      cleanedItems,
      issues
    }
  }
} 
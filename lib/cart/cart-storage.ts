// Cart Storage Operations - Handles localStorage interaction
'use client'

import { CartItem, CartError } from './cart-types'
import { cartValidation } from './cart-validation'

const STORAGE_KEY = 'mu-waterwear-cart'

/**
 * Manages cart data persistence using localStorage
 * Provides error handling and data validation for storage operations
 */
// Export cartStorage object to match expected interface
export const cartStorage = {
  loadCart: async (): Promise<CartItem[]> => {
    try {
      const savedCart = localStorage.getItem(STORAGE_KEY)
      
      if (!savedCart) {
        return []
      }

      const cartData = JSON.parse(savedCart)
      const validation = cartValidation.validateCartData(cartData)

      if (validation.isValid) {
        return cartValidation.sanitizeCartData(cartData)
      } else {
        console.warn('Invalid cart data found, clearing cart:', validation.errors)
        await cartStorage.clearCart()
        return []
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error)
      return []
    }
  },

  /**
   * Save cart data to localStorage
   * @param items - Cart items to save
   * @returns Promise<boolean> - Success status
   */
  saveCart: async (items: CartItem[]): Promise<boolean> => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
      return true
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error)
      return false
    }
  },

  /**
   * Clear all cart data from localStorage
   * @returns Promise<boolean> - Success status
   */
  clearCart: async (): Promise<boolean> => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      return true
    } catch (error) {
      console.error('Failed to clear cart from localStorage:', error)
      return false
    }
  },

  /**
   * Check if localStorage is available
   * @returns boolean - Storage availability
   */
  isStorageAvailable: (): boolean => {
    try {
      const test = '__storage_test__'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch {
      return false
    }
  },

  /**
   * Get cart storage size in bytes
   * @returns number - Storage size
   */
  getCartStorageSize: (): number => {
    try {
      const cartData = localStorage.getItem(STORAGE_KEY)
      return cartData ? new Blob([cartData]).size : 0
    } catch {
      return 0
    }
  },

  /**
   * Migrate old cart format to new format if needed
   * @returns Promise<boolean> - Migration success
   */
  migrateCartFormat: async (): Promise<boolean> => {
    try {
      const oldCartKey = 'mu-cart-items' // Legacy key
      const oldCart = localStorage.getItem(oldCartKey)
      
      if (oldCart && !localStorage.getItem(STORAGE_KEY)) {
        const oldData = JSON.parse(oldCart)
        const migrated = await cartStorage.saveCart(oldData)
        
        if (migrated) {
          localStorage.removeItem(oldCartKey)
          console.log('✅ Cart data migrated to new format')
        }
        
        return migrated
      }
      
      return true
    } catch (error) {
      console.error('Failed to migrate cart format:', error)
      return false
    }
  }
}

/**
 * Back-compatibility wrapper so other modules can call
 * CartStorageManager.saveCart / loadCart / clearCart.
 * Simply forwards to the functions defined in `cartStorage` above.
 */
export const CartStorageManager = {
  /**
   * Load cart items and return in the shape expected by callers.
   */
  loadCart: async (): Promise<{ items: CartItem[]; error?: CartError }> => {
    try {
      const items = await cartStorage.loadCart()
      return { items }
    } catch (err) {
      return {
        items: [],
        error: {
          message: 'Failed to load cart from storage.',
          type: 'storage',
          timestamp: Date.now()
        }
      }
    }
  },

  /** Save cart items */
  saveCart: cartStorage.saveCart,

  /** Clear cart items */
  clearCart: cartStorage.clearCart,
} 
import { CartItem, CartError, CartOperationResult } from './cart-types'
import { cartValidation } from './cart-validation'
import { cartStorage } from './cart-storage'

export const cartOperations = {
  addItemToCart: async (
    currentItems: CartItem[], 
    newItem: Omit<CartItem, 'quantity'>
  ): Promise<CartOperationResult> => {
    try {
      // Validate item
      if (!cartValidation.validateCartItem(newItem)) {
        return {
          success: false,
          error: {
            message: `Invalid item data for ${newItem.name || 'unknown item'}`,
            type: 'validation',
            timestamp: Date.now(),
          }
        }
      }

      const updatedItems = [...currentItems]
      const existingItem = updatedItems.find(
        item => item.id === newItem.id && item.size === newItem.size
      )

      if (existingItem) {
        existingItem.quantity += 1
      } else {
        updatedItems.push({ ...newItem, quantity: 1 })
      }

      const saved = await cartStorage.saveCart(updatedItems)
      
      return {
        success: saved,
        data: updatedItems,
        error: saved ? undefined : {
          message: 'Failed to save cart changes',
          type: 'storage',
          timestamp: Date.now(),
        }
      }
    } catch (error) {
      console.error('Failed to add item to cart:', error)
      return {
        success: false,
        error: {
          message: `Failed to add ${newItem.name} to cart. Please try again.`,
          type: 'unknown',
          timestamp: Date.now(),
        }
      }
    }
  },

  updateItemQuantity: async (
    currentItems: CartItem[],
    id: string,
    quantity: number
  ): Promise<CartOperationResult> => {
    try {
      if (!cartValidation.validateQuantity(quantity)) {
        return {
          success: false,
          error: {
            message: 'Invalid quantity value',
            type: 'validation',
            timestamp: Date.now(),
          }
        }
      }

      if (quantity === 0) {
        return cartOperations.removeItemFromCart(currentItems, id)
      }

      const updatedItems = currentItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )

      const saved = await cartStorage.saveCart(updatedItems)

      return {
        success: saved,
        data: updatedItems,
        error: saved ? undefined : {
          message: 'Failed to update item quantity',
          type: 'storage',
          timestamp: Date.now(),
        }
      }
    } catch (error) {
      console.error('Failed to update quantity:', error)
      return {
        success: false,
        error: {
          message: 'Failed to update item quantity. Please try again.',
          type: 'unknown',
          timestamp: Date.now(),
        }
      }
    }
  },

  removeItemFromCart: async (
    currentItems: CartItem[],
    id: string
  ): Promise<CartOperationResult> => {
    try {
      const updatedItems = currentItems.filter(item => item.id !== id)
      const saved = await cartStorage.saveCart(updatedItems)

      return {
        success: saved,
        data: updatedItems,
        error: saved ? undefined : {
          message: 'Failed to remove item from cart',
          type: 'storage',
          timestamp: Date.now(),
        }
      }
    } catch (error) {
      console.error('Failed to remove item:', error)
      return {
        success: false,
        error: {
          message: 'Failed to remove item from cart. Please try again.',
          type: 'unknown',
          timestamp: Date.now(),
        }
      }
    }
  },

  clearCart: async (): Promise<CartOperationResult> => {
    try {
      const saved = await cartStorage.saveCart([])

      return {
        success: saved,
        data: [],
        error: saved ? undefined : {
          message: 'Failed to clear cart',
          type: 'storage',
          timestamp: Date.now(),
        }
      }
    } catch (error) {
      console.error('Failed to clear cart:', error)
      return {
        success: false,
        error: {
          message: 'Failed to clear cart. Please try again.',
          type: 'unknown',
          timestamp: Date.now(),
        }
      }
    }
  },

  calculateCartTotal: (items: CartItem[]): string => {
    try {
      return items
        .reduce((total, item) => {
          const price = parseFloat(item.price.replace('$', ''))
          if (isNaN(price)) {
            console.warn(`Invalid price for item ${item.name}: ${item.price}`)
            return total
          }
          return total + price * item.quantity
        }, 0)
        .toFixed(2)
    } catch (error) {
      console.error('Error calculating cart total:', error)
      return '0.00'
    }
  },

  calculateItemCount: (items: CartItem[]): number => {
    try {
      return items.reduce((total, item) => total + item.quantity, 0)
    } catch (error) {
      console.error('Error calculating cart item count:', error)
      return 0
    }
  }
} 
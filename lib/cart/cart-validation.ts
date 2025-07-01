import { CartItem, CartValidationResult } from './cart-types'

export const cartValidation = {
  validateCartItem: (item: Omit<CartItem, 'quantity'>): boolean => {
    return !!(
      item.id &&
      item.name &&
      item.price &&
      item.image &&
      typeof item.id === 'string' &&
      typeof item.name === 'string' &&
      typeof item.price === 'string' &&
      typeof item.image === 'string'
    )
  },

  validateQuantity: (quantity: number): boolean => {
    return typeof quantity === 'number' && quantity >= 0 && Number.isInteger(quantity)
  },

  validateCartData: (cartData: unknown): CartValidationResult => {
    const errors: string[] = []

    if (!Array.isArray(cartData)) {
      errors.push('Cart data must be an array')
      return { isValid: false, errors }
    }

    cartData.forEach((item, index) => {
      if (!item || typeof item !== 'object') {
        errors.push(`Item at index ${index} is not a valid object`)
        return
      }

      if (!item.id || typeof item.id !== 'string') {
        errors.push(`Item at index ${index} has invalid id`)
      }

      if (!item.name || typeof item.name !== 'string') {
        errors.push(`Item at index ${index} has invalid name`)
      }

      if (!item.price || typeof item.price !== 'string') {
        errors.push(`Item at index ${index} has invalid price`)
      }

      if (typeof item.quantity !== 'number' || item.quantity <= 0) {
        errors.push(`Item at index ${index} has invalid quantity`)
      }
    })

    return {
      isValid: errors.length === 0,
      errors
    }
  },

  sanitizeCartData: (cartData: any[]): CartItem[] => {
    return cartData.filter(item =>
      item &&
      typeof item.id === 'string' &&
      typeof item.name === 'string' &&
      typeof item.price === 'string' &&
      typeof item.quantity === 'number' &&
      item.quantity > 0
    )
  }
} 
// Shared Types for Cart System
'use client'

/**
 * Represents an item in the shopping cart
 */
export interface CartItem {
  /** Unique identifier for the product */
  id: string
  /** Display name of the product */
  name: string
  /** Formatted price string (e.g., "$89.99") */
  price: string
  /** Optional size selection (e.g., "Large", "XL") */
  size?: string
  /** Product image URL */
  image: string
  /** Quantity of this item in cart */
  quantity: number
}

/**
 * Represents an error that occurred during cart operations
 */
export interface CartError {
  /** Human-readable error message */
  message: string
  /** Type of error for categorization and handling */
  type: 'storage' | 'validation' | 'network' | 'unknown'
  /** Timestamp when error occurred */
  timestamp: number
}

/**
 * Internal cart state management
 */
export interface CartState {
  /** Array of items currently in cart */
  items: CartItem[]
  /** Whether cart is currently performing an operation */
  isLoading: boolean
  /** Current error state, if any */
  error: CartError | null
  /** Description of current/last action being performed */
  lastAction: string | null
}

/**
 * Cart operation result with success status and optional error
 */
export interface CartOperationResult {
  /** Whether the operation succeeded */
  success: boolean
  /** Error details if operation failed */
  error?: CartError
  /** Updated cart items after operation */
  /** Alias used by existing code (e.g., CartActions) */
  items?: CartItem[]
  /** Preferred property for new code */
  data?: CartItem[]
}

/**
 * Configuration for cart behavior
 */
export interface CartConfig {
  /** Maximum number of items allowed in cart */
  maxItems?: number
  /** Maximum quantity per item */
  maxQuantityPerItem?: number
  /** Whether to auto-save cart changes */
  autoSave?: boolean
  /** Storage key for localStorage */
  storageKey?: string
}

/**
 * Cart analytics data
 */
export interface CartAnalytics {
  /** Total number of items added to cart */
  totalItemsAdded: number
  /** Total value of items in cart */
  totalValue: number
  /** Most frequently added items */
  popularItems: Array<{ id: string; count: number }>
  /** Cart abandonment events */
  abandonmentCount: number
}

/**
 * Item to be added to cart (without quantity, which defaults to 1)
 */
export type CartItemInput = Omit<CartItem, 'quantity'>

/**
 * Cart action types for state management
 */
export type CartActionType = 
  | 'LOAD_CART'
  | 'ADD_ITEM' 
  | 'UPDATE_QUANTITY'
  | 'REMOVE_ITEM'
  | 'CLEAR_CART'
  | 'SET_LOADING'
  | 'SET_ERROR'
  | 'CLEAR_ERROR'

/**
 * Cart action for reducer pattern
 */
export interface CartAction {
  type: CartActionType
  payload?: any
}

/**
 * Cart validation rules
 */
export interface CartValidationRules {
  /** Minimum quantity allowed */
  minQuantity: number
  /** Maximum quantity allowed */
  maxQuantity: number
  /** Required fields for cart items */
  requiredFields: Array<keyof CartItem>
  /** Price format validation regex */
  priceFormat: RegExp
}

/**
 * Default validation rules
 */
export const DEFAULT_VALIDATION_RULES: CartValidationRules = {
  minQuantity: 1,
  maxQuantity: 99,
  requiredFields: ['id', 'name', 'price', 'image'],
  priceFormat: /^\$\d+\.?\d*$/
}

/**
 * Default cart configuration
 */
export const DEFAULT_CART_CONFIG: CartConfig = {
  maxItems: 50,
  maxQuantityPerItem: 99,
  autoSave: true,
  storageKey: 'mu-waterwear-cart'
}

export interface CartContextType {
  cart: CartItem[]
  isCartOpen: boolean
  isLoading: boolean
  error: CartError | null
  lastAction: string | null
  setIsCartOpen: (open: boolean) => void
  addToCart: (item: Omit<CartItem, 'quantity'>) => Promise<boolean>
  updateQuantity: (id: string, quantity: number) => Promise<boolean>
  removeItem: (id: string) => Promise<boolean>
  clearCart: () => Promise<boolean>
  getCartTotal: () => string
  getCartItemCount: () => number
  clearError: () => void
  retryLastAction: () => void
}

export interface CartValidationResult {
  isValid: boolean
  errors: string[]
} 
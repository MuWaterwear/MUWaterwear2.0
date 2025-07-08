'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react'
import { CartItem, CartError, CartState, CartContextType } from '@/lib/cart/cart-types'
import { cartOperations } from '@/lib/cart/cart-operations'
import { handleError, ErrorType } from '@/lib/core/error-handling'
import { useToast } from '@/contexts/ToastContext'
import { cartStorage } from '@/lib/cart/cart-storage'
import { cartValidation } from '@/lib/cart/cart-validation'

// Debounce utility
function debounce<T extends (...args: any[]) => any>(func: T, delay: number): T {
  let timeoutId: NodeJS.Timeout
  return ((...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }) as T
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartState, setCartState] = useState<CartState>({
    items: [],
    isLoading: false,
    error: null,
    lastAction: null,
  })
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [retryFunction, setRetryFunction] = useState<(() => Promise<boolean>) | null>(null)
  
  // Use refs to prevent unnecessary dependencies in useCallback
  const cartStateRef = useRef(cartState)
  cartStateRef.current = cartState
  
  // Debounced localStorage save function
  const debouncedSaveCart = useCallback(
    debounce((cartData: CartItem[]) => {
      try {
        cartStorage.saveCart(cartData)
      } catch (error) {
        console.error('Failed to save cart to localStorage:', error)
      }
    }, 300),
    []
  )
  
  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (cartState.items.length >= 0) { // Allow saving empty cart
      debouncedSaveCart(cartState.items)
    }
  }, [cartState.items, debouncedSaveCart])

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = async () => {
      setCartState(prev => ({ ...prev, isLoading: true, lastAction: 'Loading cart' }))

      try {
        const cartData = await cartStorage.loadCart()
        setCartState(prev => ({
          ...prev,
          items: cartData,
          isLoading: false,
          error: null,
          lastAction: null,
        }))
      } catch (error) {
        console.error('Failed to load cart:', error)
        setCartState(prev => ({
          ...prev,
          isLoading: false,
          error: {
            message: 'Failed to load your saved cart. Starting with an empty cart.',
            type: 'storage',
            timestamp: Date.now(),
          },
          lastAction: null,
        }))
      }
    }

    loadCart()
  }, [])

  // Optimized state update function
  const updateCartState = useCallback((updater: (prev: CartState) => CartState) => {
    setCartState(updater)
  }, [])

  const addToCart = useCallback(async (newItem: Omit<CartItem, 'quantity'>): Promise<boolean> => {
    updateCartState(prev => ({
      ...prev,
      isLoading: true,
      lastAction: `Adding ${newItem.name} to cart`,
    }))

    const result = await cartOperations.addItemToCart(cartStateRef.current.items, newItem)

    updateCartState(prev => ({
      ...prev,
      items: result.data || prev.items,
      isLoading: false,
      error: result.error || null,
      lastAction: null,
    }))

    if (!result.success && result.error) {
      setRetryFunction(() => () => addToCart(newItem))
    }

    return result.success
  }, [updateCartState])

  const updateQuantity = useCallback(async (id: string, quantity: number): Promise<boolean> => {
    updateCartState(prev => ({ ...prev, isLoading: true, lastAction: 'Updating quantity' }))

    const result = await cartOperations.updateItemQuantity(cartStateRef.current.items, id, quantity)

    updateCartState(prev => ({
      ...prev,
      items: result.data || prev.items,
      isLoading: false,
      error: result.error || null,
      lastAction: null,
    }))

    if (!result.success && result.error) {
      setRetryFunction(() => () => updateQuantity(id, quantity))
    }

    return result.success
  }, [updateCartState])

  const removeItem = useCallback(async (id: string): Promise<boolean> => {
    updateCartState(prev => ({ ...prev, isLoading: true, lastAction: 'Removing item' }))

    const result = await cartOperations.removeItemFromCart(cartStateRef.current.items, id)

    updateCartState(prev => ({
      ...prev,
      items: result.data || prev.items,
      isLoading: false,
      error: result.error || null,
      lastAction: null,
    }))

    if (!result.success && result.error) {
      setRetryFunction(() => () => removeItem(id))
    }

    return result.success
  }, [updateCartState])

  const clearCart = useCallback(async (): Promise<boolean> => {
    updateCartState(prev => ({ ...prev, isLoading: true, lastAction: 'Clearing cart' }))

    const result = await cartOperations.clearCart()

    updateCartState(prev => ({
      ...prev,
      items: result.data || [],
      isLoading: false,
      error: result.error || null,
      lastAction: null,
    }))

    if (!result.success && result.error) {
      setRetryFunction(() => clearCart)
    }

    return result.success
  }, [updateCartState])

  // Memoized calculations to prevent unnecessary recalculations
  const getCartTotal = useCallback((): string => {
    return cartOperations.calculateCartTotal(cartStateRef.current.items)
  }, [])

  const getCartItemCount = useCallback((): number => {
    return cartOperations.calculateItemCount(cartStateRef.current.items)
  }, [])

  const clearError = useCallback(() => {
    updateCartState(prev => ({ ...prev, error: null }))
    setRetryFunction(null)
  }, [updateCartState])

  const retryLastAction = useCallback(async () => {
    if (retryFunction) {
      const success = await retryFunction()
      if (success) {
        setRetryFunction(null)
      }
    }
  }, [retryFunction])

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useCallback((): CartContextType => ({
    cart: cartState.items,
    isCartOpen,
    isLoading: cartState.isLoading,
    error: cartState.error,
    lastAction: cartState.lastAction,
    setIsCartOpen,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    getCartTotal,
    getCartItemCount,
    clearError,
    retryLastAction,
  }), [
    cartState.items,
    cartState.isLoading,
    cartState.error,
    cartState.lastAction,
    isCartOpen,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    getCartTotal,
    getCartItemCount,
    clearError,
    retryLastAction,
  ])

  return (
    <CartContext.Provider value={contextValue()}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

// Re-export types for convenience
export type { CartItem, CartError, CartState, CartContextType }

'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { CartItem, CartError, CartState, CartContextType } from '@/lib/cart/cart-types'
import { cartOperations } from '@/lib/cart/cart-operations'
import { handleError, ErrorType } from '@/lib/core/error-handling'
import { useToast } from '@/contexts/ToastContext'
import { cartStorage } from '@/lib/cart/cart-storage'
import { cartValidation } from '@/lib/cart/cart-validation'

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

  const addToCart = useCallback(async (newItem: Omit<CartItem, 'quantity'>): Promise<boolean> => {
    setCartState(prev => ({
      ...prev,
      isLoading: true,
      lastAction: `Adding ${newItem.name} to cart`,
    }))

    const result = await cartOperations.addItemToCart(cartState.items, newItem)

    setCartState(prev => ({
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
  }, [cartState.items])

  const updateQuantity = useCallback(async (id: string, quantity: number): Promise<boolean> => {
    setCartState(prev => ({ ...prev, isLoading: true, lastAction: 'Updating quantity' }))

    const result = await cartOperations.updateItemQuantity(cartState.items, id, quantity)

    setCartState(prev => ({
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
  }, [cartState.items])

  const removeItem = async (id: string): Promise<boolean> => {
    setCartState(prev => ({ ...prev, isLoading: true, lastAction: 'Removing item' }))

    const result = await cartOperations.removeItemFromCart(cartState.items, id)

    setCartState(prev => ({
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
  }

  const clearCart = useCallback(async (): Promise<boolean> => {
    setCartState(prev => ({ ...prev, isLoading: true, lastAction: 'Clearing cart' }))

    const result = await cartOperations.clearCart()

    setCartState(prev => ({
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
  }, [])

  const getCartTotal = (): string => {
    return cartOperations.calculateCartTotal(cartState.items)
  }

  const getCartItemCount = (): number => {
    return cartOperations.calculateItemCount(cartState.items)
  }

  const clearError = () => {
    setCartState(prev => ({ ...prev, error: null }))
    setRetryFunction(null)
  }

  const retryLastAction = async () => {
    if (retryFunction) {
      const success = await retryFunction()
      if (success) {
        setRetryFunction(null)
      }
    }
  }

  return (
    <CartContext.Provider
      value={{
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
      }}
    >
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

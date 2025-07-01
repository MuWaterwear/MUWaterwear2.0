import React from 'react'
import { render, screen, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CartProvider, useCart, CartItem } from '@/contexts/CartContext'
import { cartStorage } from '@/lib/cart/cart-storage'
import { cartOperations } from '@/lib/cart/cart-operations'
import { cartValidation } from '@/lib/cart/cart-validation'

// Mock the cart modules
jest.mock('@/lib/cart/cart-storage')
jest.mock('@/lib/cart/cart-operations')
jest.mock('@/lib/cart/cart-validation')

const mockCartStorage = cartStorage as jest.Mocked<typeof cartStorage>
const mockCartOperations = cartOperations as jest.Mocked<typeof cartOperations>
const mockCartValidation = cartValidation as jest.Mocked<typeof cartValidation>

const mockCartItem = {
  id: 'test-item-1',
  name: 'Test Product',
  price: '$29.99',
  image: '/test-image.jpg',
  size: 'M'
}

const mockCartItemWithoutSize = {
  id: 'test-item-2',
  name: 'Test Product 2',
  price: '$39.99',
  image: '/test-image-2.jpg'
}

// Test component to use the cart hook
const TestComponent = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    getCartTotal,
    getCartItemCount,
  } = useCart()

  return (
    <div>
      <div data-testid="cart-count">{getCartItemCount()}</div>
      <div data-testid="cart-total">${getCartTotal()}</div>
      <div data-testid="cart-open">{isCartOpen ? 'open' : 'closed'}</div>

      <button data-testid="toggle-cart" onClick={() => setIsCartOpen(!isCartOpen)}>
        Toggle Cart
      </button>

      <button
        data-testid="add-item"
        onClick={() =>
          addToCart({
            id: 'test-1',
            name: 'Test Tee',
            price: '$29.99',
            size: 'M',
            image: '/test.jpg',
          })
        }
      >
        Add Item
      </button>

      <button
        data-testid="add-same-item"
        onClick={() =>
          addToCart({
            id: 'test-1',
            name: 'Test Tee',
            price: '$29.99',
            size: 'M',
            image: '/test.jpg',
          })
        }
      >
        Add Same Item
      </button>

      <button
        data-testid="add-different-size"
        onClick={() =>
          addToCart({
            id: 'test-1',
            name: 'Test Tee',
            price: '$29.99',
            size: 'L',
            image: '/test.jpg',
          })
        }
      >
        Add Different Size
      </button>

      <button
        data-testid="update-quantity"
        onClick={() => cart.length > 0 && updateQuantity(cart[0].id, 3)}
      >
        Update Quantity
      </button>

      <button data-testid="remove-item" onClick={() => cart.length > 0 && removeItem(cart[0].id)}>
        Remove Item
      </button>

      <button data-testid="clear-cart" onClick={clearCart}>
        Clear Cart
      </button>

      <div data-testid="cart-items">
        {cart.map((item, index) => (
          <div key={`${item.id}-${item.size}-${index}`} data-testid={`item-${index}`}>
            {item.name} - {item.size} - {item.quantity} - {item.price}
          </div>
        ))}
      </div>
    </div>
  )
}

const renderWithProvider = () => {
  return render(
    <CartProvider>
      <TestComponent />
    </CartProvider>
  )
}

describe('CartContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    jest.clearAllMocks()
    
    // Default mock implementations
    mockCartStorage.loadCart.mockResolvedValue([])
    mockCartStorage.saveCart.mockResolvedValue(true)
    mockCartStorage.clearCart.mockResolvedValue(true)
    
    mockCartOperations.addItemToCart.mockResolvedValue({ 
      success: true, 
      data: [{ ...mockCartItem, quantity: 1 }] 
    })
    mockCartOperations.updateItemQuantity.mockResolvedValue({ 
      success: true, 
      data: [] 
    })
    mockCartOperations.removeItemFromCart.mockResolvedValue({ 
      success: true, 
      data: [] 
    })
    mockCartOperations.clearCart.mockResolvedValue({ 
      success: true, 
      data: [] 
    })
    mockCartOperations.calculateCartTotal.mockReturnValue('0.00')
    mockCartOperations.calculateItemCount.mockReturnValue(0)
    
    mockCartValidation.validateCartItem.mockReturnValue(true)
  })

  describe('Initial State', () => {
    it('should initialize with empty cart', async () => {
      const { result } = renderHook(() => useCart())

      await waitFor(() => {
        expect(result.current.cart).toEqual([])
        expect(result.current.isLoading).toBe(false)
        expect(result.current.error).toBeNull()
        expect(result.current.isCartOpen).toBe(false)
      })
    })

    it('should load cart from storage on initialization', async () => {
      const savedItems = [{ ...mockCartItem, quantity: 2 }]
      mockCartStorage.loadCart.mockResolvedValue(savedItems)

      const { result } = renderHook(() => useCart())

      await waitFor(() => {
        expect(mockCartStorage.loadCart).toHaveBeenCalled()
        expect(result.current.cart).toEqual(savedItems)
      })
    })

    it('should handle storage loading errors gracefully', async () => {
      mockCartStorage.loadCart.mockRejectedValue(new Error('Storage error'))

      const { result } = renderHook(() => useCart())

      await waitFor(() => {
        expect(result.current.cart).toEqual([])
        expect(result.current.error).toMatchObject({
          type: 'storage',
          message: expect.stringContaining('Failed to load')
        })
      })
    })
  })

  describe('Cart Operations', () => {
    it('should add item to cart successfully', async () => {
      const { result } = renderHook(() => useCart())
      const newItems = [{ ...mockCartItem, quantity: 1 }]
      
      mockCartOperations.addItemToCart.mockResolvedValue({
        success: true,
        data: newItems
      })

      await act(async () => {
        const success = await result.current.addToCart(mockCartItem)
        expect(success).toBe(true)
      })

      await waitFor(() => {
        expect(mockCartOperations.addItemToCart).toHaveBeenCalledWith([], mockCartItem)
        expect(result.current.cart).toEqual(newItems)
        expect(result.current.error).toBeNull()
      })
    })

    it('should handle add item failure', async () => {
      const { result } = renderHook(() => useCart())
      const errorMessage = 'Failed to add item'
      
      mockCartOperations.addItemToCart.mockResolvedValue({
        success: false,
        error: {
          message: errorMessage,
          type: 'validation',
          timestamp: Date.now()
        }
      })

      await act(async () => {
        const success = await result.current.addToCart(mockCartItem)
        expect(success).toBe(false)
      })

      await waitFor(() => {
        expect(result.current.error).toMatchObject({
          message: errorMessage,
          type: 'validation'
        })
      })
    })

    it('should update item quantity successfully', async () => {
      const { result } = renderHook(() => useCart())
      const updatedItems = [{ ...mockCartItem, quantity: 3 }]
      
      mockCartOperations.updateItemQuantity.mockResolvedValue({
        success: true,
        data: updatedItems
      })

      await act(async () => {
        const success = await result.current.updateQuantity('test-item-1', 3)
        expect(success).toBe(true)
      })

      await waitFor(() => {
        expect(mockCartOperations.updateItemQuantity).toHaveBeenCalledWith([], 'test-item-1', 3)
        expect(result.current.cart).toEqual(updatedItems)
      })
    })

    it('should remove item successfully', async () => {
      const { result } = renderHook(() => useCart())
      
      mockCartOperations.removeItemFromCart.mockResolvedValue({
        success: true,
        data: []
      })

      await act(async () => {
        const success = await result.current.removeItem('test-item-1')
        expect(success).toBe(true)
      })

      await waitFor(() => {
        expect(mockCartOperations.removeItemFromCart).toHaveBeenCalledWith([], 'test-item-1')
        expect(result.current.cart).toEqual([])
      })
    })

    it('should clear cart successfully', async () => {
      const { result } = renderHook(() => useCart())
      
      mockCartOperations.clearCart.mockResolvedValue({
        success: true,
        data: []
      })

      await act(async () => {
        const success = await result.current.clearCart()
        expect(success).toBe(true)
      })

      await waitFor(() => {
        expect(mockCartOperations.clearCart).toHaveBeenCalled()
        expect(result.current.cart).toEqual([])
      })
    })
  })

  describe('Cart Calculations', () => {
    it('should calculate cart total correctly', () => {
      mockCartOperations.calculateCartTotal.mockReturnValue('59.98')
      
      const { result } = renderHook(() => useCart())
      
      expect(result.current.getCartTotal()).toBe('59.98')
      expect(mockCartOperations.calculateCartTotal).toHaveBeenCalled()
    })

    it('should calculate item count correctly', () => {
      mockCartOperations.calculateItemCount.mockReturnValue(3)
      
      const { result } = renderHook(() => useCart())
      
      expect(result.current.getCartItemCount()).toBe(3)
      expect(mockCartOperations.calculateItemCount).toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('should clear errors', async () => {
      const { result } = renderHook(() => useCart())
      
      // First, create an error
      mockCartOperations.addItemToCart.mockResolvedValue({
        success: false,
        error: {
          message: 'Test error',
          type: 'validation',
          timestamp: Date.now()
        }
      })

      await act(async () => {
        await result.current.addToCart(mockCartItem)
      })

      await waitFor(() => {
        expect(result.current.error).not.toBeNull()
      })

      // Clear the error
      act(() => {
        result.current.clearError()
      })

      expect(result.current.error).toBeNull()
    })

    it('should set up retry function on operation failure', async () => {
      const { result } = renderHook(() => useCart())
      
      mockCartOperations.addItemToCart.mockResolvedValue({
        success: false,
        error: {
          message: 'Network error',
          type: 'network',
          timestamp: Date.now()
        }
      })

      await act(async () => {
        await result.current.addToCart(mockCartItem)
      })

      await waitFor(() => {
        expect(result.current.error).not.toBeNull()
      })

      // Retry should be available
      expect(typeof result.current.retryLastAction).toBe('function')
    })

    it('should retry last action successfully', async () => {
      const { result } = renderHook(() => useCart())
      
      // First call fails
      mockCartOperations.addItemToCart.mockResolvedValueOnce({
        success: false,
        error: {
          message: 'Network error',
          type: 'network',
          timestamp: Date.now()
        }
      })

      await act(async () => {
        await result.current.addToCart(mockCartItem)
      })

      // Second call succeeds
      mockCartOperations.addItemToCart.mockResolvedValueOnce({
        success: true,
        data: [{ ...mockCartItem, quantity: 1 }]
      })

      await act(async () => {
        await result.current.retryLastAction()
      })

      await waitFor(() => {
        expect(result.current.cart).toEqual([{ ...mockCartItem, quantity: 1 }])
        expect(result.current.error).toBeNull()
      })
    })
  })

  describe('Loading States', () => {
    it('should show loading state during operations', async () => {
      const { result } = renderHook(() => useCart())
      
      // Mock a delayed operation
      let resolveOperation: any
      const operationPromise = new Promise(resolve => {
        resolveOperation = resolve
      })
      
      mockCartOperations.addItemToCart.mockReturnValue(operationPromise)

      act(() => {
        result.current.addToCart(mockCartItem)
      })

      // Should be loading
      expect(result.current.isLoading).toBe(true)
      expect(result.current.lastAction).toContain('Adding')

      // Resolve the operation
      act(() => {
        resolveOperation({
          success: true,
          data: [{ ...mockCartItem, quantity: 1 }]
        })
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
        expect(result.current.lastAction).toBeNull()
      })
    })
  })

  describe('Cart Visibility', () => {
    it('should toggle cart visibility', () => {
      const { result } = renderHook(() => useCart())
      
      expect(result.current.isCartOpen).toBe(false)
      
      act(() => {
        result.current.setIsCartOpen(true)
      })
      
      expect(result.current.isCartOpen).toBe(true)
      
      act(() => {
        result.current.setIsCartOpen(false)
      })
      
      expect(result.current.isCartOpen).toBe(false)
    })
  })

  describe('Edge Cases', () => {
    it('should handle items with and without sizes separately', async () => {
      const { result } = renderHook(() => useCart())
      
      mockCartOperations.addItemToCart.mockResolvedValueOnce({
        success: true,
        data: [{ ...mockCartItem, quantity: 1 }]
      })

      await act(async () => {
        await result.current.addToCart(mockCartItem)
      })

      mockCartOperations.addItemToCart.mockResolvedValueOnce({
        success: true,
        data: [
          { ...mockCartItem, quantity: 1 },
          { ...mockCartItemWithoutSize, quantity: 1 }
        ]
      })

      await act(async () => {
        await result.current.addToCart(mockCartItemWithoutSize)
      })

      expect(mockCartOperations.addItemToCart).toHaveBeenCalledTimes(2)
    })

    it('should handle concurrent operations gracefully', async () => {
      const { result } = renderHook(() => useCart())
      
      mockCartOperations.addItemToCart.mockResolvedValue({
        success: true,
        data: [{ ...mockCartItem, quantity: 1 }]
      })

      // Start multiple operations simultaneously
      const promises = [
        result.current.addToCart(mockCartItem),
        result.current.addToCart(mockCartItemWithoutSize),
      ]

      await act(async () => {
        await Promise.all(promises)
      })

      // All operations should complete
      expect(mockCartOperations.addItemToCart).toHaveBeenCalledTimes(2)
    })
  })

  describe('Context Error Handling', () => {
    it('should throw error when used outside provider', () => {
      // Mock console.error to prevent test output noise
      const originalError = console.error
      console.error = jest.fn()

      expect(() => {
        renderHook(() => useCart())
      }).toThrow('useCart must be used within a CartProvider')

      console.error = originalError
    })
  })
})

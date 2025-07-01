import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

export interface CachedUser {
  firstName: string
  lastName: string
  email: string
  phone?: string
  favoriteBodyOfWater?: string
  isGuest: boolean
  lastUsed: string
  shippingAddresses?: ShippingAddress[]
  orderHistory?: OrderHistory[]
}

export interface ShippingAddress {
  id: string
  name: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
  createdAt: string
}

export interface OrderHistory {
  id: string
  orderId: string
  sessionId: string
  orderDate: string
  amount?: number
  status: string
  items?: Array<{
    name: string
    price: string
    quantity: number
    size?: string
    image?: string
  }>
  shippingAddress?: {
    name: string
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
}

export function useUserProfile() {
  const { data: session, status } = useSession()
  const [cachedUser, setCachedUser] = useState<CachedUser | null>(null)
  const [dbProfile, setDbProfile] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load cached user data on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('mu-user-profile')
      if (savedUser) {
        const userData = JSON.parse(savedUser) as CachedUser
        setCachedUser(userData)
      }
    } catch (err) {
      console.error('Error loading cached user data:', err)
      setError('Failed to load user profile')
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch profile from backend when authenticated
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      ;(async () => {
        try {
          const res = await fetch('/api/profile')
          if (res.ok) {
            const data = await res.json()
            setDbProfile(data.profile)
          }
        } catch (err) {
          console.error('Failed to fetch profile', err)
        }
      })()
    }
  }, [status, session])

  const saveCachedUser = (userData: Omit<CachedUser, 'lastUsed'>) => {
    try {
      const userWithTimestamp: CachedUser = {
        ...userData,
        lastUsed: new Date().toISOString(),
      }
      localStorage.setItem('mu-user-profile', JSON.stringify(userWithTimestamp))
      setCachedUser(userWithTimestamp)
      setError(null)
    } catch (err) {
      console.error('Error saving user profile:', err)
      setError('Failed to save user profile')
    }
  }

  const clearUserProfile = () => {
    try {
      localStorage.removeItem('mu-user-profile')
      setCachedUser(null)
      setError(null)
    } catch (err) {
      console.error('Error clearing user profile:', err)
      setError('Failed to clear user profile')
    }
  }

  const saveShippingAddress = (address: Omit<ShippingAddress, 'id' | 'createdAt'>) => {
    if (!cachedUser) return

    try {
      const newAddress: ShippingAddress = {
        ...address,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      }

      const updatedAddresses = [...(cachedUser.shippingAddresses || []), newAddress]

      // If this is set as default, unset other defaults
      if (newAddress.isDefault) {
        updatedAddresses.forEach(addr => {
          if (addr.id !== newAddress.id) addr.isDefault = false
        })
      }

      const updatedUser = {
        ...cachedUser,
        shippingAddresses: updatedAddresses,
      }

      saveCachedUser(updatedUser)
    } catch (err) {
      console.error('Error saving shipping address:', err)
      setError('Failed to save shipping address')
    }
  }

  const updateShippingAddress = (addressId: string, updates: Partial<ShippingAddress>) => {
    if (!cachedUser) return

    try {
      const updatedAddresses =
        cachedUser.shippingAddresses?.map(addr => {
          if (addr.id === addressId) {
            return { ...addr, ...updates }
          }
          return addr
        }) || []

      // If setting as default, unset other defaults
      if (updates.isDefault) {
        updatedAddresses.forEach(addr => {
          if (addr.id !== addressId) addr.isDefault = false
        })
      }

      const updatedUser = {
        ...cachedUser,
        shippingAddresses: updatedAddresses,
      }

      saveCachedUser(updatedUser)
    } catch (err) {
      console.error('Error updating shipping address:', err)
      setError('Failed to update shipping address')
    }
  }

  const deleteShippingAddress = (addressId: string) => {
    if (!cachedUser) return

    try {
      const updatedAddresses =
        cachedUser.shippingAddresses?.filter(addr => addr.id !== addressId) || []

      const updatedUser = {
        ...cachedUser,
        shippingAddresses: updatedAddresses,
      }

      saveCachedUser(updatedUser)
    } catch (err) {
      console.error('Error deleting shipping address:', err)
      setError('Failed to delete shipping address')
    }
  }

  const saveOrderToHistory = (orderData: Omit<OrderHistory, 'id'>) => {
    if (!cachedUser) return

    try {
      const newOrder: OrderHistory = {
        ...orderData,
        id: Date.now().toString(),
      }

      const existingOrders = cachedUser.orderHistory || []

      // Check if order already exists
      const orderExists = existingOrders.some(
        order => order.sessionId === orderData.sessionId || order.orderId === orderData.orderId
      )

      if (orderExists) {
        console.log('Order already exists in history')
        return
      }

      const updatedUser = {
        ...cachedUser,
        orderHistory: [newOrder, ...existingOrders], // Latest orders first
      }

      saveCachedUser(updatedUser)
      console.log('Order saved to history:', newOrder.orderId)
    } catch (err) {
      console.error('Error saving order to history:', err)
      setError('Failed to save order to history')
    }
  }

  // Get the current user (either authenticated session or cached)
  const currentUser = dbProfile || session?.user || cachedUser
  const isAuthenticated = !!session?.user
  const userDisplayName =
    currentUser?.firstName || (session?.user ? session.user.name : '') || 'User'
  const userEmail = currentUser?.email || ''

  return {
    session,
    status,
    cachedUser,
    currentUser,
    isAuthenticated,
    userDisplayName,
    userEmail,
    loading,
    error,
    saveCachedUser,
    clearUserProfile,
    saveShippingAddress,
    updateShippingAddress,
    deleteShippingAddress,
    saveOrderToHistory,
  }
}

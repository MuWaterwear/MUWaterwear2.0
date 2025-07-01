import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Shipping address utility functions
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

export function saveShippingAddressToProfile(address: {
  name: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
}) {
  try {
    const cachedUserData = localStorage.getItem('mu-user-profile')
    if (!cachedUserData) return false

    const userData = JSON.parse(cachedUserData)
    const existingAddresses = userData.shippingAddresses || []

    // Check if this address already exists (based on street + postal code)
    const addressExists = existingAddresses.some(
      (addr: ShippingAddress) =>
        addr.street.toLowerCase() === address.street.toLowerCase() &&
        addr.postalCode === address.postalCode
    )

    if (addressExists) {
      console.log('Address already exists, skipping save')
      return false
    }

    // Create new address
    const newAddress: ShippingAddress = {
      ...address,
      id: Date.now().toString(),
      isDefault: existingAddresses.length === 0, // First address becomes default
      createdAt: new Date().toISOString(),
    }

    // Update user data
    const updatedUserData = {
      ...userData,
      shippingAddresses: [...existingAddresses, newAddress],
      lastUsed: new Date().toISOString(),
    }

    localStorage.setItem('mu-user-profile', JSON.stringify(updatedUserData))
    console.log('Shipping address saved to profile:', newAddress.name)
    return true
  } catch (error) {
    console.error('Error saving shipping address to profile:', error)
    return false
  }
}

export function getDefaultShippingAddress(): ShippingAddress | null {
  try {
    const cachedUserData = localStorage.getItem('mu-user-profile')
    if (!cachedUserData) return null

    const userData = JSON.parse(cachedUserData)
    const addresses = userData.shippingAddresses || []

    return addresses.find((addr: ShippingAddress) => addr.isDefault) || addresses[0] || null
  } catch (error) {
    console.error('Error getting default shipping address:', error)
    return null
  }
}

export function getAllShippingAddresses(): ShippingAddress[] {
  try {
    const cachedUserData = localStorage.getItem('mu-user-profile')
    if (!cachedUserData) return []

    const userData = JSON.parse(cachedUserData)
    return userData.shippingAddresses || []
  } catch (error) {
    console.error('Error getting shipping addresses:', error)
    return []
  }
}

// Order history utility functions
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

export function saveOrderToProfile(orderData: Omit<OrderHistory, 'id'>) {
  try {
    const cachedUserData = localStorage.getItem('mu-user-profile')
    if (!cachedUserData) return false

    const userData = JSON.parse(cachedUserData)
    const existingOrders = userData.orderHistory || []

    // Check if order already exists
    const orderExists = existingOrders.some(
      (order: OrderHistory) =>
        order.sessionId === orderData.sessionId || order.orderId === orderData.orderId
    )

    if (orderExists) {
      console.log('Order already exists in profile')
      return false
    }

    const newOrder: OrderHistory = {
      ...orderData,
      id: Date.now().toString(),
    }

    const updatedUserData = {
      ...userData,
      orderHistory: [newOrder, ...existingOrders],
      lastUsed: new Date().toISOString(),
    }

    localStorage.setItem('mu-user-profile', JSON.stringify(updatedUserData))
    console.log('✅ Order saved to profile:', newOrder.orderId)
    return true
  } catch (error) {
    console.error('Error saving order to profile:', error)
    return false
  }
}

export function getOrderHistory(): OrderHistory[] {
  try {
    const cachedUserData = localStorage.getItem('mu-user-profile')
    if (!cachedUserData) return []

    const userData = JSON.parse(cachedUserData)
    return userData.orderHistory || []
  } catch (error) {
    console.error('Error getting order history:', error)
    return []
  }
}

/**
 * Convert GPS coordinates from degree format to decimal format
 * @param coordinates - GPS coordinates in format "39.10° N, 120.03° W"
 * @returns Coordinates in format "39.10,-120.03" suitable for weather API
 */
export function convertGPSToDecimal(coordinates: string): string {
  // Remove degree symbols and split by comma
  const parts = coordinates.replace(/°/g, '').split(',').map(s => s.trim());
  
  if (parts.length !== 2) {
    throw new Error('Invalid GPS coordinate format');
  }
  
  // Parse latitude
  const [latValue, latDir] = parts[0].split(' ');
  let lat = parseFloat(latValue);
  if (latDir === 'S') lat = -lat;
  
  // Parse longitude
  const [lonValue, lonDir] = parts[1].split(' ');
  let lon = parseFloat(lonValue);
  if (lonDir === 'W') lon = -lon;
  
  return `${lat},${lon}`;
}

'use client'

import MobileNavigation from './MobileNavigation'
import { useCart } from '@/contexts/CartContext'

export default function GlobalMobileNav() {
  const { setIsCartOpen } = useCart()
  return <MobileNavigation onCartOpen={() => setIsCartOpen(true)} />
} 
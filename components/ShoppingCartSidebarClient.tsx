"use client"

import dynamic from 'next/dynamic'

// Dynamically import the heavy ShoppingCartSidebar on the client only
const ShoppingCartSidebar = dynamic(() => import('./ShoppingCartSidebar'), {
  ssr: false,
  loading: () => null,
})

export default ShoppingCartSidebar 
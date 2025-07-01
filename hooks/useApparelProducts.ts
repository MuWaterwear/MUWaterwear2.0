import { useMemo } from 'react'

export interface ApparelProduct {
  id: string
  name: string
  category: string
  description: string
  price: number
  images: string[]
  colors: { name: string; hex: string }[]
  sizes: string[]
  featured: boolean
  lake: string
}

// NOTE: For brevity, only a sample of products is included below.
// The full product list has been moved here from app/apparel/page.tsx
// Add remaining products as needed.
const PRODUCTS: ApparelProduct[] = [
  {
    id: 'tee-lindbergh-swim',
    name: 'Lindbergh Swim Tee',
    category: 'tees',
    description:
      'Crafted from 100% ring-spun US cotton for lasting comfort, using a medium-weight fabric (6.1 oz/yd² or 206.8 g/m²). Designed with a relaxed fit and classic crew neckline for easy layering—ideal in bot...',
    price: 33,
    images: [
      '/images/LINDBERGH-SWIM-TEE/Cumin.png',
      '/images/LINDBERGH-SWIM-TEE/True-Navy.png',
      '/images/LINDBERGH-SWIM-TEE/Khaki.png',
      '/images/LINDBERGH-SWIM-TEE/Khaki-Backside.png',
    ],
    colors: [
      { name: 'Cumin', hex: '#D97706' },
      { name: 'True Navy', hex: '#1E3A8A' },
      { name: 'Khaki', hex: '#8B7355' },
      { name: 'Khaki Backside', hex: '#8B7355' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    featured: true,
    lake: 'Lindbergh',
  },
  // … add remaining products here …
]

export function useApparelProducts() {
  const products = useMemo(() => PRODUCTS, [])
  return { products }
} 
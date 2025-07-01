// ResponsiveLayout.tsx (Updated sections)
'use client'

import { ReactNode, useState } from 'react'
import { useMobile } from '@/hooks/useMobile'
import MobileNavigation from './MobileNavigation'
import MobileShoppingCart from './MobileShoppingCart'
import { useCart } from '@/contexts/CartContext'
import { Menu, User, Search, SlidersHorizontal, Heart } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

// Add MobileHeader component
export function MobileHeader({ 
  showSearch = false,
  title = '',
  onMenuClick,
  onProfileClick 
}: {
  showSearch?: boolean
  title?: string
  onMenuClick?: () => void
  onProfileClick?: () => void
}) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-gray-950 md:hidden">
      {/* Status Bar */}
      <div className="flex justify-between items-center px-4 py-1 text-xs text-gray-400">
        <span>9:41</span>
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-1 h-3 bg-white rounded-sm"></div>
            <div className="w-1 h-3 bg-white rounded-sm"></div>
            <div className="w-1 h-3 bg-white rounded-sm"></div>
            <div className="w-1 h-3 bg-gray-600 rounded-sm"></div>
          </div>
          <span className="ml-1">📶</span>
          <span>🔋</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <button 
            onClick={onMenuClick}
            className="p-2 -ml-2 touch-manipulation"
          >
            <Menu className="h-6 w-6 text-white" />
          </button>
          
          {title && (
            <h1 className="text-lg font-medium text-white">{title}</h1>
          )}
          
          <button 
            onClick={onProfileClick}
            className="p-2 -mr-2 touch-manipulation"
          >
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-gray-400" />
            </div>
          </button>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="w-full bg-gray-900 border border-gray-800 rounded-full pl-10 pr-12 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
            <button className="absolute right-1 top-1/2 -translate-y-1/2 p-2 bg-gray-800 rounded-full touch-manipulation">
              <SlidersHorizontal className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

// Add Product Grid component for shop pages
export function MobileProductGrid({ products }: { products: any[] }) {
  const router = useRouter()
  const [favorites, setFavorites] = useState<string[]>([])

  const toggleFavorite = (productId: string) => {
    setFavorites((prev: string[]) =>
      prev.includes(productId)
        ? prev.filter((id: string) => id !== productId)
        : [...prev, productId]
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 px-4 pb-20 pt-32">
      {products.map((product) => (
        <div 
          key={product.id}
          className="bg-gray-900 rounded-xl overflow-hidden"
        >
          <div className="relative aspect-square">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              onClick={() => router.push(`/product/${product.id}`)}
            />
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleFavorite(product.id)
              }}
              className="absolute top-2 right-2 p-2 bg-black/50 backdrop-blur-sm rounded-full touch-manipulation"
            >
              <Heart 
                className={`h-4 w-4 ${
                  favorites.includes(product.id) 
                    ? 'text-red-500 fill-red-500' 
                    : 'text-white'
                }`}
              />
            </button>
          </div>
          
          <div className="p-3">
            <h3 className="font-medium text-white text-sm mb-1 line-clamp-1">
              {product.name}
            </h3>
            <div className="flex items-center gap-1 mb-2">
              <span className="text-yellow-400 text-xs">★</span>
              <span className="text-gray-400 text-xs">{product.rating || '5.0'}</span>
            </div>
            <p className="text-cyan-400 font-bold">{product.price}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// Re-export helper components to allow import from this module
export function MobileOnly({ children }: { children: ReactNode }) {
  const { isMobile } = useMobile()
  return isMobile ? <>{children}</> : null
}

export function DesktopOnly({ children }: { children: ReactNode }) {
  const { isDesktop, isTablet } = useMobile()
  return isDesktop || isTablet ? <>{children}</> : null
}

// Wrapper to conditionally render per device
export function Responsive({ mobile, tablet, desktop }: { mobile?: ReactNode; tablet?: ReactNode; desktop?: ReactNode }) {
  const { isMobile, isTablet, isDesktop } = useMobile()
  if (isMobile && mobile) return <>{mobile}</>
  if (isTablet && tablet) return <>{tablet}</>
  if (isDesktop && desktop) return <>{desktop}</>
  return <>{desktop}</>
}
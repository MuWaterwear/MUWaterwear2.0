'use client'
import { useState } from 'react'
import Link from 'next/link'
import { FadeImage } from '@/components/ui/fade-image'
import { Button } from '@/components/ui/button'
import { Eye, ShoppingCart, Heart } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useToast } from '@/contexts/ToastContext'

interface ProductCardProps {
  id: string
  title: string
  price: number
  originalPrice?: number
  image: string
  hoverImage?: string
  tags?: string[]
  onQuickView?: () => void
  isFullWidth?: boolean
}

export default function ProductCard({
  id,
  title,
  price,
  originalPrice,
  image,
  hoverImage,
  tags = [],
  onQuickView,
  isFullWidth = false
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const { addToCart } = useCart()
  const { showSuccess } = useToast()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addToCart({
      id,
      name: title,
      price: price.toString(),
      image,
    })
    showSuccess(`${title} added to cart`)
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    onQuickView?.()
  }

  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  return (
    <Link href={`/product/${id}`}>
      <div 
        className={`group relative bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
          isFullWidth ? 'h-full' : ''
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container with Zoom Effect */}
        <div className={`relative overflow-hidden bg-gray-100 ${
          isFullWidth ? 'aspect-[16/9]' : 'aspect-[3/4]'
        }`}>
          <FadeImage
            src={isHovered && hoverImage ? hoverImage : image}
            alt={title}
            fill
            className={`object-cover transition-transform duration-700 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-4 left-4 bg-brand-accent text-white px-3 py-1 rounded-full text-sm font-medium">
              -{discount}%
            </div>
          )}

          {/* Quick Actions Overlay */}
          <div className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-3 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}>
            <Button
              size="icon"
              variant="secondary"
              className="bg-white hover:bg-gray-100 text-gray-900"
              onClick={handleQuickView}
              aria-label="Quick view"
            >
              <Eye className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="bg-white hover:bg-gray-100 text-gray-900"
              onClick={handleAddToCart}
              aria-label="Add to cart"
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="bg-white hover:bg-gray-100 text-gray-900"
              aria-label="Add to wishlist"
            >
              <Heart className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className={`font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-brand-ocean transition-colors ${
            isFullWidth ? 'text-xl' : 'text-lg'
          }`}>
            {title}
          </h3>
          
          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className={`font-semibold text-gray-900 ${
              isFullWidth ? 'text-2xl' : 'text-xl'
            }`}>
              ${price.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Mobile Quick Add Button */}
        <div className="md:hidden p-4 pt-0">
          <Button 
            className="w-full bg-brand-ocean hover:bg-brand-ocean/90 text-white"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </Link>
  )
} 
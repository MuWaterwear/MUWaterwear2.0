'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Heart, Share2, ZoomIn } from 'lucide-react'
import Image from 'next/image'
import { useCart } from '@/contexts/CartContext'
import { useToast } from '@/contexts/ToastContext'

interface Product {
  id: string
  name: string
  description: string
  price: string
  images: string[]
  colors: { name: string; hex: string }[]
  sizes: string[]
  details: string
  featuresList: string[]
}

interface MobileProductGridProps {
  products: Product[]
  onProductClick?: (product: Product, index: number) => void
  onImageClick?: (imageSrc: string) => void
}

export default function MobileProductGrid({
  products,
  onProductClick,
  onImageClick,
}: MobileProductGridProps) {
  const { addToCart, setIsCartOpen } = useCart()
  const { showSuccess } = useToast()
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null)
  const [selectedColor, setSelectedColor] = useState<{ [key: number]: string }>({})
  const [selectedSize, setSelectedSize] = useState<{ [key: number]: string }>({})
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: number]: number }>({})
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [addingToCart, setAddingToCart] = useState<{ [key: number]: boolean }>({})
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Initialize default selections
  useEffect(() => {
    const defaultColors: { [key: number]: string } = {}
    const defaultImages: { [key: number]: number } = {}

    products.forEach((product, index) => {
      if (product.colors.length > 0) {
        defaultColors[index] = product.colors[0].name
      }
      defaultImages[index] = 0
    })

    setSelectedColor(defaultColors)
    setCurrentImageIndex(defaultImages)
  }, [products])

  const handleAddToCart = (product: Product, index: number) => {
    const size = selectedSize[index]
    const color = selectedColor[index]

    if (!size) {
      // Vibrate for error feedback (if supported)
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100])
      }
      alert('Please select a size first')
      return
    }

    if (!color && product.colors.length > 0) {
      // Vibrate for error feedback
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100])
      }
      alert('Please select a color first')
      return
    }

    // Set loading state
    setAddingToCart(prev => ({ ...prev, [index]: true }))

    const colorIndex = product.colors.findIndex(c => c.name === color)
    const productImage = product.images[colorIndex >= 0 ? colorIndex : 0] || product.images[0]

    const cartItem = {
      id: `${product.name}-${size}${color ? `-${color}` : ''}`,
      name: `${product.name}${color ? ` (${color})` : ''}`,
      price: product.price,
      size: size,
      image: productImage,
    }

    addToCart(cartItem)
    
    // Haptic feedback for success
    if (navigator.vibrate) {
      navigator.vibrate(200)
    }

    // Show toast notification
    showSuccess(
      'Added to Cart!',
      `${product.name} (${size}) has been added to your cart.`
    )

    // Animate button and reset after delay
    setTimeout(() => {
      setAddingToCart(prev => ({ ...prev, [index]: false }))
      // Briefly open cart to show the item
      setIsCartOpen(true)
      setTimeout(() => setIsCartOpen(false), 2000)
    }, 500)
  }

  const toggleFavorite = (productId: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId)
    } else {
      newFavorites.add(productId)
    }
    setFavorites(newFavorites)
  }

  const navigateImage = (productIndex: number, direction: 'prev' | 'next') => {
    const product = products[productIndex]
    const currentIndex = currentImageIndex[productIndex] || 0
    let newIndex

    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : product.images.length - 1
    } else {
      newIndex = currentIndex < product.images.length - 1 ? currentIndex + 1 : 0
    }

    setCurrentImageIndex(prev => ({ ...prev, [productIndex]: newIndex }))

    // Update selected color if images correspond to colors
    if (product.colors[newIndex]) {
      setSelectedColor(prev => ({ ...prev, [productIndex]: product.colors[newIndex].name }))
    }
  }

  // Swipe gesture handling
  const handleTouchStart = (e: React.TouchEvent, productIndex: number) => {
    const touch = e.touches[0]
    const startX = touch.clientX
    const startTime = Date.now()
    let lastTap = 0

    const handleTouchMove = (moveEvent: TouchEvent) => {
      const moveTouch = moveEvent.touches[0]
      const deltaX = moveTouch.clientX - startX

      if (Math.abs(deltaX) > 50) {
        // Minimum swipe distance
        if (deltaX > 0) {
          navigateImage(productIndex, 'prev')
        } else {
          navigateImage(productIndex, 'next')
        }

        // Remove event listeners
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleTouchEnd)
      }
    }

    const handleTouchEnd = (endEvent: TouchEvent) => {
      const endTime = Date.now()
      const tapTime = endTime - startTime

      // Handle double-tap to zoom
      if (tapTime < 300) {
        const currentTime = new Date().getTime()
        const timeDiff = currentTime - lastTap
        
        if (timeDiff < 300 && timeDiff > 0) {
          // Double tap detected - zoom image
          if (onImageClick) {
            onImageClick(products[productIndex].images[currentImageIndex[productIndex] || 0])
          }
        }
        lastTap = currentTime
      }

      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }

    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)
  }

  // Handle pinch-to-zoom
  const handleImageTouch = (e: React.TouchEvent, productIndex: number) => {
    if (e.touches.length === 2) {
      // Pinch gesture detected - open zoom modal
      e.preventDefault()
      if (onImageClick) {
        onImageClick(products[productIndex].images[currentImageIndex[productIndex] || 0])
      }
    } else if (e.touches.length === 1) {
      handleTouchStart(e, productIndex)
    }
  }

  return (
    <div className="md:hidden">
      {/* Product Grid */}
      <div className="grid gap-4 p-4">
        {products.map((product, index) => {
          // Every third product (0-based index) should be full width
          const isFullWidth = index % 3 === 2
          
          return (
            <div
              key={product.id}
              className={`bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 shadow-lg ${
                isFullWidth ? 'col-span-2' : 'col-span-1'
              }`}
              style={{
                gridColumn: isFullWidth ? 'span 2' : 'span 1',
              }}
            >
              {/* Product Image */}
              <div className="relative">
                <div
                  className={`relative ${isFullWidth ? 'h-96' : 'h-80'} bg-gray-900 overflow-hidden`}
                  onTouchStart={e => handleImageTouch(e, index)}
                >
                  <Image
                    src={product.images[currentImageIndex[index] || 0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />

                  {/* Image Navigation Overlay */}
                  <div className="absolute inset-0 flex">
                    <button
                      className="flex-1 flex items-center justify-start pl-4 touch-manipulation"
                      onClick={() => navigateImage(index, 'prev')}
                      aria-label="Previous image"
                    >
                      <div className="bg-black/30 backdrop-blur-sm rounded-full p-3 opacity-70 active:opacity-100 active:scale-110 transition-all">
                        <ChevronLeft className="h-7 w-7 text-white" />
                      </div>
                    </button>
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-white/60 text-sm font-medium bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        Double-tap to zoom
                      </div>
                    </div>
                    <button
                      className="flex-1 flex items-center justify-end pr-4 touch-manipulation"
                      onClick={() => navigateImage(index, 'next')}
                      aria-label="Next image"
                    >
                      <div className="bg-black/30 backdrop-blur-sm rounded-full p-3 opacity-70 active:opacity-100 active:scale-110 transition-all">
                        <ChevronRight className="h-7 w-7 text-white" />
                      </div>
                    </button>
                  </div>

                  {/* Product Actions */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className="bg-black/30 backdrop-blur-sm rounded-full p-3 opacity-70 active:opacity-100 active:scale-110 transition-all"
                      aria-label="Add to favorites"
                    >
                      <Heart
                        className={`h-6 w-6 ${
                          favorites.has(product.id) ? 'text-red-500 fill-red-500' : 'text-white'
                        }`}
                      />
                    </button>
                    <button
                      onClick={() =>
                        onImageClick?.(product.images[currentImageIndex[index] || 0])
                      }
                      className="bg-black/30 backdrop-blur-sm rounded-full p-3 opacity-70 active:opacity-100 active:scale-110 transition-all"
                      aria-label="Zoom image"
                    >
                      <ZoomIn className="h-6 w-6 text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-2">{product.name}</h3>
                <p className="text-gray-300 text-sm mb-4">{product.description}</p>

                {/* Color Selection */}
                {product.colors.length > 0 && (
                  <div className="mb-4">
                    <label className="text-sm text-gray-400 mb-2 block">Color</label>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color, colorIndex) => (
                        <button
                          key={color.name}
                          onClick={() => {
                            setSelectedColor(prev => ({ ...prev, [index]: color.name }))
                            setCurrentImageIndex(prev => ({ ...prev, [index]: colorIndex }))
                          }}
                          className={`w-8 h-8 rounded-full border-2 transition-transform ${
                            selectedColor[index] === color.name
                              ? 'border-cyan-400 scale-110'
                              : 'border-transparent scale-100'
                          }`}
                          style={{ backgroundColor: color.hex }}
                          aria-label={`Select ${color.name} color`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selection */}
                {product.sizes.length > 0 && (
                  <div className="mb-4">
                    <label className="text-sm text-gray-400 mb-2 block">Size</label>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map(size => (
                        <button
                          key={size}
                          onClick={() =>
                            setSelectedSize(prev => ({ ...prev, [index]: size }))
                          }
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            selectedSize[index] === size
                              ? 'bg-cyan-400 text-black'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price and Add to Cart */}
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xl font-bold text-white">${product.price}</span>
                  <Button
                    onClick={() => handleAddToCart(product, index)}
                    className={`bg-cyan-400 hover:bg-cyan-500 text-black px-6 py-2 rounded-lg font-medium transition-all ${
                      addingToCart[index] ? 'opacity-75' : ''
                    }`}
                    disabled={addingToCart[index]}
                  >
                    {addingToCart[index] ? 'Adding...' : 'Add to Cart'}
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

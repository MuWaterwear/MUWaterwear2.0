"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Heart, Share2, ZoomIn } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/contexts/CartContext"

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
  onImageClick 
}: MobileProductGridProps) {
  const { addToCart, setIsCartOpen } = useCart()
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null)
  const [selectedColor, setSelectedColor] = useState<{ [key: number]: string }>({})
  const [selectedSize, setSelectedSize] = useState<{ [key: number]: string }>({})
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: number]: number }>({})
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
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
      alert("Please select a size first")
      return
    }
    
    if (!color && product.colors.length > 0) {
      alert("Please select a color first")
      return
    }
    
    const colorIndex = product.colors.findIndex((c) => c.name === color)
    const productImage = product.images[colorIndex >= 0 ? colorIndex : 0] || product.images[0]
    
    const cartItem = {
      id: `${product.name}-${size}${color ? `-${color}` : ''}`,
      name: `${product.name}${color ? ` (${color})` : ''}`,
      price: product.price,
      size: size,
      image: productImage,
    }
    
    addToCart(cartItem)
    setIsCartOpen(true)
    
    // Show success feedback
    const button = document.getElementById(`add-to-cart-${index}`)
    if (button) {
      button.textContent = "Added! ✓"
      setTimeout(() => {
        button.textContent = "ADD TO CART"
      }, 2000)
    }
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
    
    const handleTouchMove = (moveEvent: TouchEvent) => {
      const moveTouch = moveEvent.touches[0]
      const deltaX = moveTouch.clientX - startX
      
      if (Math.abs(deltaX) > 50) { // Minimum swipe distance
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
    
    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
    
    document.addEventListener('touchmove', handleTouchMove)
    document.addEventListener('touchend', handleTouchEnd)
  }

  return (
    <div className="md:hidden">
      {/* Product Grid */}
      <div className="grid grid-cols-1 gap-6 p-4">
        {products.map((product, index) => (
          <div key={product.id} className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 shadow-lg">
            {/* Product Image */}
            <div className="relative">
              <div 
                className="relative h-80 bg-gray-900 overflow-hidden"
                onTouchStart={(e) => handleTouchStart(e, index)}
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
                    <div className="bg-black/20 backdrop-blur-sm rounded-full p-2 opacity-0 active:opacity-100 transition-opacity">
                      <ChevronLeft className="h-6 w-6 text-white" />
                    </div>
                  </button>
                  <button
                    className="flex-1 flex items-center justify-end pr-4 touch-manipulation"
                    onClick={() => navigateImage(index, 'next')}
                    aria-label="Next image"
                  >
                    <div className="bg-black/20 backdrop-blur-sm rounded-full p-2 opacity-0 active:opacity-100 transition-opacity">
                      <ChevronRight className="h-6 w-6 text-white" />
                    </div>
                  </button>
                </div>

                {/* Top Actions */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="bg-black/40 backdrop-blur-sm rounded-full p-3 touch-manipulation transition-colors"
                    aria-label="Add to favorites"
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        favorites.has(product.id) ? "text-red-400 fill-current" : "text-white"
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => onImageClick?.(product.images[currentImageIndex[index] || 0])}
                    className="bg-black/40 backdrop-blur-sm rounded-full p-3 touch-manipulation"
                    aria-label="Zoom image"
                  >
                    <ZoomIn className="h-5 w-5 text-white" />
                  </button>
                  <button
                    className="bg-black/40 backdrop-blur-sm rounded-full p-3 touch-manipulation"
                    aria-label="Share product"
                  >
                    <Share2 className="h-5 w-5 text-white" />
                  </button>
                </div>

                {/* Image Indicators */}
                {product.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {product.images.map((_, imgIndex) => (
                      <button
                        key={imgIndex}
                        onClick={() => setCurrentImageIndex(prev => ({ ...prev, [index]: imgIndex }))}
                        className={`w-2 h-2 rounded-full transition-colors touch-manipulation ${
                          imgIndex === (currentImageIndex[index] || 0)
                            ? "bg-cyan-400"
                            : "bg-white/50"
                        }`}
                        aria-label={`View image ${imgIndex + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              {/* Quick Actions Bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-semibold text-lg truncate">{product.name}</h3>
                    <p className="text-cyan-400 font-bold text-xl">{product.price}</p>
                  </div>
                  <Button
                    onClick={() => setSelectedProduct(selectedProduct === index ? null : index)}
                    className="bg-cyan-400 hover:bg-cyan-500 text-black font-semibold px-6 py-2 rounded-full touch-manipulation"
                  >
                    {selectedProduct === index ? "Close" : "Options"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="p-4">
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>

              {/* Expanded Options */}
              {selectedProduct === index && (
                <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
                  {/* Color Selection */}
                  {product.colors.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">Color:</label>
                      <div className="flex flex-wrap gap-2">
                        {product.colors.map((color) => (
                          <button
                            key={color.name}
                            onClick={() => {
                              setSelectedColor(prev => ({ ...prev, [index]: color.name }))
                              const colorIndex = product.colors.findIndex(c => c.name === color.name)
                              setCurrentImageIndex(prev => ({ ...prev, [index]: colorIndex }))
                            }}
                            className={`px-4 py-2 text-sm rounded-xl border-2 transition-all touch-manipulation ${
                              selectedColor[index] === color.name
                                ? "border-cyan-400 bg-cyan-400/10 text-cyan-400"
                                : "border-gray-600 hover:border-gray-500 text-gray-300"
                            }`}
                          >
                            {color.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Size Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Size:</label>
                    <div className="grid grid-cols-5 gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(prev => ({ ...prev, [index]: size }))}
                          className={`py-3 text-sm rounded-xl border-2 transition-all touch-manipulation ${
                            selectedSize[index] === size
                              ? "border-cyan-400 bg-cyan-400/10 text-cyan-400"
                              : "border-gray-600 hover:border-gray-500 text-gray-300"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Add to Cart */}
                  <Button
                    id={`add-to-cart-${index}`}
                    onClick={() => handleAddToCart(product, index)}
                    className="w-full bg-cyan-400 hover:bg-cyan-500 text-black font-semibold py-4 text-lg rounded-xl shadow-lg shadow-cyan-400/20 transition-all hover:shadow-cyan-400/30 touch-manipulation"
                  >
                    ADD TO CART
                  </Button>

                  {/* Product Details */}
                  <div className="border-t border-gray-700 pt-4">
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">{product.details}</p>
                    <div>
                      <h4 className="text-white text-sm font-medium mb-2">Features</h4>
                      <ul className="text-gray-400 text-sm space-y-1">
                        {product.featuresList.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start">
                            <span className="text-cyan-400 mr-2 mt-1">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 
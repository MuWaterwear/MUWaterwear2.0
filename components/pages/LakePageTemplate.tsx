'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/contexts/CartContext'
import { MobileOnly, DesktopOnly } from '@/components/responsive/ResponsiveLayout'
import MobileNavigation from '@/components/responsive/MobileNavigation'
import ResponsiveLayout from '@/components/responsive/MobileShoppingCart'
import { useMobile } from '@/hooks/useMobile'
import { useWeatherData } from '@/hooks/useWeatherData'

// Minimal type definitions
type Product = {
  id: string
  name: string
  images: string[]
  description?: string
  price?: number
  category?: string
  colors?: { name: string; hex: string }[]
  sizes?: string[]
}

type LakeInfo = {
  name: string
  description: string
  heroImage: string
  headerBackgroundImage?: string
  footerBackgroundImage?: string
  icon?: string
  gpsCoordinates?: string
  elevation?: string
  maxDepth?: string
}

type WebcamConfig = {
  src: string
  title: string
}

type LakePageTemplateProps = {
  lakeInfo: LakeInfo
  apparelProducts: Product[]
  webcamConfig: WebcamConfig
}

export const LakePageTemplate: React.FC<LakePageTemplateProps> = ({
  lakeInfo,
  apparelProducts,
  webcamConfig
}) => {
  const { isMobile } = useMobile()
  const { setIsCartOpen, addToCart } = useCart()
  
  const { 
    currentWeather, 
    isLoadingWeather 
  } = useWeatherData(lakeInfo.name, "")

  // Mobile product grid state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [lastTouchDistance, setLastTouchDistance] = useState(0)
  const [touchStartX, setTouchStartX] = useState(0)
  const [touchStartY, setTouchStartY] = useState(0)
  const [isSwiping, setIsSwiping] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [showPurchaseOptions, setShowPurchaseOptions] = useState(false)

  // Zoom control functions
  const handleZoomIn = () => {
    const newZoomLevel = Math.min(zoomLevel + 0.5, 4)
    setZoomLevel(newZoomLevel)
    setIsZoomed(newZoomLevel > 1)
  }

  const handleZoomOut = () => {
    const newZoomLevel = Math.max(zoomLevel - 0.5, 1)
    setZoomLevel(newZoomLevel)
    if (newZoomLevel === 1) {
      setPanPosition({ x: 0, y: 0 })
      setIsZoomed(false)
    }
  }

  const handleZoomReset = () => {
    setZoomLevel(1)
    setPanPosition({ x: 0, y: 0 })
    setIsZoomed(false)
  }

  // Mouse event handlers for desktop panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      setPanPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }
  
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Helper function to find a random color image
  const findRandomColorImage = (product: Product): { image: string, color: string } => {
    // Create a consistent seed based on product ID
    const seedRandom = (seed: string) => {
      let x = 0
      for (let i = 0; i < seed.length; i++) {
        x = ((x << 5) - x) + seed.charCodeAt(i)
        x = x & x // Convert to 32-bit integer
      }
      return Math.abs(x) / 0x7FFFFFFF
    }

    const seed = product.id
    const randomSeed = seedRandom(seed)

    // Special handling for specific product types
    const specialProductTypes = ['Traditional Logo Tee', 'Fish Tee']
    const isSpecialProduct = specialProductTypes.some(type => 
      product.name.includes(type)
    )

    // If product has colors
    if (product.colors && product.colors.length > 0) {
      // Use seeded random to select a color consistently
      const randomColorIndex = Math.floor(randomSeed * product.colors.length)
      const randomColor = product.colors[randomColorIndex].name

      // Find image for the random color
      const colorImageIndex = product.images.findIndex(img => 
        img.toLowerCase().includes(randomColor.toLowerCase().replace(' ', '-'))
      )

      // If color-specific image found, return it
      if (colorImageIndex !== -1) {
        return {
          image: product.images[colorImageIndex],
          color: randomColor
        }
      }
    }

    // If no color-specific image or no colors, handle special products
    if (isSpecialProduct) {
      const frontImageIndex = product.images.findIndex(img => 
        img.toLowerCase().includes('front')
      )
      
      if (frontImageIndex !== -1) {
        return {
          image: product.images[frontImageIndex],
          color: product.colors?.[0]?.name || 'Default'
        }
      }
    }

    // Fallback to first image
    return {
      image: product.images[0],
      color: product.colors?.[0]?.name || 'Default'
    }
  }

  // Memoize random color selections to keep consistent during render
  const [productDisplayImages, setProductDisplayImages] = useState<{[key: string]: { image: string, color: string }}>({})

  // Effect to generate random color images on initial render
  useEffect(() => {
    const randomImages: {[key: string]: { image: string, color: string }} = {}
    apparelProducts.forEach(product => {
      randomImages[product.id] = findRandomColorImage(product)
    })
    setProductDisplayImages(randomImages)
  }, [apparelProducts])

  // Helper function to find image for selected color
  const findImageForColor = (product: Product, color: string): number => {
    // Special handling for specific product types
    const specialProductTypes = ['Traditional Logo Tee', 'Fish Tee']
    const isSpecialProduct = specialProductTypes.some(type => 
      product.name.includes(type)
    )

    // If it's a special product type, prioritize front images
    if (isSpecialProduct) {
      const frontImageIndex = product.images.findIndex(img => 
        img.toLowerCase().includes('front')
      )
      
      if (frontImageIndex !== -1) {
        return frontImageIndex
      }
    }

    // If no color specified or no color-specific images, return 0
    if (!color || !product.colors || product.colors.length === 0) {
      return 0
    }

    // Try to find an exact color match in the image filename
    const colorMatchIndex = product.images.findIndex(img => 
      img.toLowerCase().includes(color.toLowerCase().replace(' ', '-'))
    )

    // If exact match found, return that index
    if (colorMatchIndex !== -1) {
      return colorMatchIndex
    }

    // If no match, return the first image
    return 0
  }

  // Handle product selection
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product)
    
    // Set initial color and size
    const initialColor = product.colors?.[0]?.name || ''
    const initialSize = product.sizes?.[0] || ''
    
    setSelectedColor(initialColor)
    setSelectedSize(initialSize)
    
    // Set initial image based on color
    const initialImageIndex = findImageForColor(product, initialColor)
    setCurrentImageIndex(initialImageIndex)
    
    setShowPurchaseOptions(false)
    setZoomLevel(1)
    setIsZoomed(false)
    setPanPosition({ x: 0, y: 0 })
  }

  // Modify color selection to update image
  const handleColorSelect = (color: string) => {
    setSelectedColor(color)
    
    // Only change image if we have a selected product
    if (selectedProduct) {
      const colorImageIndex = findImageForColor(selectedProduct, color)
      setCurrentImageIndex(colorImageIndex)
    }
  }

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!selectedProduct) return
    
    const cartItem = {
      id: `${selectedProduct.id}-${selectedColor}-${selectedSize}`,
      name: selectedProduct.name,
      price: (selectedProduct.price || 0).toFixed(2),
      image: selectedProduct.images[0],
      color: selectedColor,
      size: selectedSize,
      category: selectedProduct.category || 'product'
    }
    
    const success = await addToCart(cartItem)
    if (success) {
      setSelectedProduct(null)
      setIsCartOpen(true)
    }
  }

  // Touch gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const distance = getTouchDistance(e.touches[0], e.touches[1])
      setLastTouchDistance(distance)
    } else if (e.touches.length === 1) {
      const touch = e.touches[0]
      setTouchStartX(touch.clientX)
      setTouchStartY(touch.clientY)
      setIsDragging(true)
      setIsSwiping(false)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault()
    
    if (e.touches.length === 2) {
      // Pinch to zoom
      const distance = getTouchDistance(e.touches[0], e.touches[1])
      const scale = distance / lastTouchDistance
      const newZoomLevel = Math.min(Math.max(zoomLevel * scale, 1), 4)
      setZoomLevel(newZoomLevel)
      setLastTouchDistance(distance)
      setIsZoomed(newZoomLevel > 1)
    } else if (e.touches.length === 1 && isDragging) {
      const touch = e.touches[0]
      const deltaX = touch.clientX - touchStartX
      const deltaY = touch.clientY - touchStartY
      
      // Determine if this is a swipe gesture (horizontal movement > vertical)
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 30 && !isZoomed) {
        setIsSwiping(true)
      }
      
      // Pan when zoomed
      if (isZoomed && !isSwiping) {
        const rect = containerRef.current?.getBoundingClientRect()
        if (rect) {
          setPanPosition({
            x: touch.clientX - rect.left - rect.width / 2,
            y: touch.clientY - rect.top - rect.height / 2
          })
        }
      }
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.changedTouches.length === 1 && isSwiping && selectedProduct) {
      const touch = e.changedTouches[0]
      const deltaX = touch.clientX - touchStartX
      const swipeThreshold = 50
      
      if (Math.abs(deltaX) > swipeThreshold) {
        if (deltaX > 0) {
          // Swipe right - go to previous image
          handleSwipeRight()
        } else {
          // Swipe left - go to next image
          handleSwipeLeft()
        }
      }
    }
    
    setIsDragging(false)
    setIsSwiping(false)
  }
  
  const getTouchDistance = (touch1: React.Touch, touch2: React.Touch) => {
    const dx = touch1.clientX - touch2.clientX
    const dy = touch1.clientY - touch2.clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  // Swipe handlers for image navigation
  const handleSwipeLeft = () => {
    if (selectedProduct && currentImageIndex < selectedProduct.images.length - 1) {
      setCurrentImageIndex(prev => prev + 1)
    }
  }

  const handleSwipeRight = () => {
    if (selectedProduct && currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1)
    }
  }

  return (
    <ResponsiveLayout
      hero={!isMobile ? {
        img: lakeInfo.heroImage,
        title: "",
        subtitle: "",
      } : undefined}
    >
      <div className="min-h-screen bg-black text-white relative">
        {/* Mobile Navigation */}
        <MobileOnly>
          <MobileNavigation onCartOpen={() => setIsCartOpen(true)} />
        </MobileOnly>

        {/* Webcam handled externally by WeatherWebcam component */}

        {/* Mobile Product Grid with Enhanced Touch Support */}
        {isMobile ? (
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              {apparelProducts.map((product) => {
                // Get the pre-selected random image for this product
                const displayData = productDisplayImages[product.id] || findRandomColorImage(product)

                return (
                  <div 
                    key={product.id} 
                    className="bg-gray-800 rounded-lg p-2 hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => handleProductSelect(product)}
                  >
                    <img 
                      src={displayData.image} 
                      alt={`${product.name} - ${displayData.color}`} 
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <h3 className="text-lg font-medium mt-2">{product.name}</h3>
                  </div>
                )
              })}
            </div>

            {/* Mobile Product Modal with Touch Gestures */}
            {selectedProduct && (
              <div 
                className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center"
                onClick={() => setSelectedProduct(null)}
              >
                <div 
                  ref={containerRef}
                  className="relative w-full h-full flex items-center justify-center p-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="absolute top-4 right-4 z-[10000] bg-black/70 text-white p-2 rounded-full hover:bg-black/90 transition-colors"
                  >
                    ✕
                  </button>

                  {/* Image Navigation Dots */}
                  {selectedProduct.images.length > 1 && (
                    <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2 z-[10000]">
                      {selectedProduct.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 rounded-full ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Product Image with Touch Gestures */}
                  <img
                    ref={imageRef}
                    src={selectedProduct.images[currentImageIndex]}
                    alt={selectedProduct.name}
                    className={`max-w-full max-h-[70vh] object-contain transition-transform duration-200 ${
                      isSwiping ? 'cursor-grabbing' : 'cursor-grab'
                    }`}
                    style={{
                      transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
                      transformOrigin: 'center center',
                      cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
                    }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    draggable={false}
                  />

                  {/* Zoom Level Indicator */}
                  {isZoomed && (
                    <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                      {Math.round(zoomLevel * 100)}%
                    </div>
                  )}

                  {/* Bottom Panel */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent">
                    <div className="p-4 pb-6 space-y-4">
                      {/* Product Header */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-white">{selectedProduct.name}</h3>
                          <p className="text-white text-2xl font-extrabold mt-1">${selectedProduct.price}</p>
                        </div>
                        
                        {/* Purchase Options Toggle */}
                        <button
                          onClick={() => setShowPurchaseOptions(!showPurchaseOptions)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center"
                        >
                          {showPurchaseOptions ? 'Hide Options' : 'Purchase'}
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Product Description */}
                      {selectedProduct.description && !showPurchaseOptions && (
                        <p className="text-gray-300 text-sm line-clamp-2">{selectedProduct.description}</p>
                      )}
                      
                      {/* Purchase Options Panel */}
                      {showPurchaseOptions && (
                        <div className="space-y-4">
                          {/* Color Selection */}
                          {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                            <div>
                              <label className="block text-white text-sm font-medium mb-2">Color</label>
                              <div className="flex flex-wrap gap-2">
                                {selectedProduct.colors.map((color) => (
                                  <button
                                    key={color.name}
                                    onClick={() => handleColorSelect(color.name)}
                                    className={`
                                      px-4 py-2 rounded-lg text-sm font-medium transition-all 
                                      ${selectedColor === color.name 
                                        ? 'bg-blue-600 text-white ring-2 ring-blue-400' 
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
                                    `}
                                    style={{
                                      backgroundColor: color.hex,
                                      color: selectedColor === color.name ? 'white' : 'black'
                                    }}
                                  >
                                    {color.name}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Size Selection */}
                          {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                            <div>
                              <label className="block text-white text-sm font-medium mb-2">Size</label>
                              <div className="flex flex-wrap gap-2">
                                {selectedProduct.sizes.map((size) => (
                                  <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`
                                      px-4 py-2 rounded-lg text-sm font-medium transition-all 
                                      ${selectedSize === size 
                                        ? 'bg-blue-600 text-white ring-2 ring-blue-400' 
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
                                    `}
                                  >
                                    {size}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Add to Cart Button */}
                          <button
                            onClick={handleAddToCart}
                            disabled={
                              (selectedProduct.colors && selectedProduct.colors.length > 0 && !selectedColor) ||
                              (selectedProduct.sizes && selectedProduct.sizes.length > 0 && !selectedSize)
                            }
                            className="
                              w-full bg-green-600 hover:bg-green-700 
                              disabled:bg-gray-600 disabled:cursor-not-allowed 
                              text-white px-4 py-3 rounded-lg 
                              font-semibold transition-colors 
                              flex items-center justify-center
                              space-x-2
                            "
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span>Add to Cart</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Desktop Product Grid */
          <div className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {apparelProducts.map((product) => {
                // Get the pre-selected random image for this product
                const displayData = productDisplayImages[product.id] || findRandomColorImage(product)

                return (
                  <div 
                    key={product.id} 
                    className="bg-gray-800 rounded-lg p-2 hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => handleProductSelect(product)}
                  >
                    <img 
                      src={displayData.image} 
                      alt={`${product.name} - ${displayData.color}`} 
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <h3 className="text-lg font-medium mt-2">{product.name}</h3>
                  </div>
                )
              })}
            </div>

            {/* Desktop Product Modal with Touch Gestures */}
            {selectedProduct && (
              <div 
                className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center"
                onClick={() => setSelectedProduct(null)}
              >
                <div 
                  ref={containerRef}
                  className="relative w-full h-full flex items-center justify-center p-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="absolute top-4 right-4 z-[10000] bg-black/70 text-white p-2 rounded-full hover:bg-black/90 transition-colors"
                  >
                    ✕
                  </button>

                  {/* Image Navigation Dots */}
                  {selectedProduct.images.length > 1 && (
                    <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2 z-[10000]">
                      {selectedProduct.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 rounded-full ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Product Image with Touch Gestures */}
                  <img
                    ref={imageRef}
                    src={selectedProduct.images[currentImageIndex]}
                    alt={selectedProduct.name}
                    className={`max-w-full max-h-[70vh] object-contain transition-transform duration-200 ${
                      isSwiping ? 'cursor-grabbing' : 'cursor-grab'
                    }`}
                    style={{
                      transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
                      transformOrigin: 'center center',
                      cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
                    }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    draggable={false}
                  />

                  {/* Zoom Control Buttons */}
                  <div className="absolute top-4 right-20 flex flex-col gap-2 z-[10000]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleZoomIn()
                      }}
                      className="bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-colors shadow-lg border border-white/20"
                      aria-label="Zoom in"
                      disabled={zoomLevel >= 4}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleZoomOut()
                      }}
                      className="bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-colors shadow-lg border border-white/20"
                      aria-label="Zoom out"
                      disabled={zoomLevel <= 1}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleZoomReset()
                      }}
                      className="bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-colors shadow-lg border border-white/20"
                      aria-label="Reset zoom"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>

                  {/* Zoom Level Indicator */}
                  {isZoomed && (
                    <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                      {Math.round(zoomLevel * 100)}%
                    </div>
                  )}

                  {/* Bottom Panel */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent">
                    <div className="p-4 pb-6 space-y-4">
                      {/* Product Header */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-white">{selectedProduct.name}</h3>
                          <p className="text-white text-2xl font-extrabold mt-1">${selectedProduct.price}</p>
                        </div>
                        
                        {/* Purchase Options Toggle */}
                        <button
                          onClick={() => setShowPurchaseOptions(!showPurchaseOptions)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center"
                        >
                          {showPurchaseOptions ? 'Hide Options' : 'Purchase'}
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Product Description */}
                      {selectedProduct.description && !showPurchaseOptions && (
                        <p className="text-gray-300 text-sm line-clamp-2">{selectedProduct.description}</p>
                      )}
                      
                      {/* Purchase Options Panel */}
                      {showPurchaseOptions && (
                        <div className="space-y-4">
                          {/* Color Selection */}
                          {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                            <div>
                              <label className="block text-white text-sm font-medium mb-2">Color</label>
                              <div className="flex flex-wrap gap-2">
                                {selectedProduct.colors.map((color) => (
                                  <button
                                    key={color.name}
                                    onClick={() => handleColorSelect(color.name)}
                                    className={`
                                      px-4 py-2 rounded-lg text-sm font-medium transition-all 
                                      ${selectedColor === color.name 
                                        ? 'bg-blue-600 text-white ring-2 ring-blue-400' 
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
                                    `}
                                    style={{
                                      backgroundColor: color.hex,
                                      color: selectedColor === color.name ? 'white' : 'black'
                                    }}
                                  >
                                    {color.name}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Size Selection */}
                          {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                            <div>
                              <label className="block text-white text-sm font-medium mb-2">Size</label>
                              <div className="flex flex-wrap gap-2">
                                {selectedProduct.sizes.map((size) => (
                                  <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`
                                      px-4 py-2 rounded-lg text-sm font-medium transition-all 
                                      ${selectedSize === size 
                                        ? 'bg-blue-600 text-white ring-2 ring-blue-400' 
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
                                    `}
                                  >
                                    {size}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Add to Cart Button */}
                          <button
                            onClick={handleAddToCart}
                            disabled={
                              (selectedProduct.colors && selectedProduct.colors.length > 0 && !selectedColor) ||
                              (selectedProduct.sizes && selectedProduct.sizes.length > 0 && !selectedSize)
                            }
                            className="
                              w-full bg-green-600 hover:bg-green-700 
                              disabled:bg-gray-600 disabled:cursor-not-allowed 
                              text-white px-4 py-3 rounded-lg 
                              font-semibold transition-colors 
                              flex items-center justify-center
                              space-x-2
                            "
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span>Add to Cart</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ResponsiveLayout>
  )
}

export default LakePageTemplate 
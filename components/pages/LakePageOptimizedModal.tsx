"use client"

import React, { useState, useCallback, useEffect } from "react"
import { getOptimizedImagePath } from "@/lib/utils/product-optimization"

type LakeProduct = {
  id: string
  name: string
  images: string[]
  description?: string
  price?: number
  category?: string
  colors?: { name: string; hex: string }[]
  sizes?: string[]
}

interface LakePageOptimizedModalProps {
  isOpen: boolean
  onClose: () => void
  product: LakeProduct | null
  currentImageIndex: number
  onNavigate: (direction: 'prev' | 'next') => void
  selectedColor: string
  selectedSize: string
  onColorSelect: (color: string) => void
  onSizeSelect: (size: string) => void
  onAddToCart: () => void
  showPurchaseOptions: boolean
  onTogglePurchaseOptions: () => void
}

const LakePageOptimizedModal: React.FC<LakePageOptimizedModalProps> = ({
  isOpen,
  onClose,
  product,
  currentImageIndex,
  onNavigate,
  selectedColor,
  selectedSize,
  onColorSelect,
  onSizeSelect,
  onAddToCart,
  showPurchaseOptions,
  onTogglePurchaseOptions
}) => {
  const [imageZoom, setImageZoom] = useState(1)
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isSwiping, setIsSwiping] = useState(false)
  const [optimizedImageSrc, setOptimizedImageSrc] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)

  // Reset zoom and position when image changes
  useEffect(() => {
    setImageZoom(1)
    setImagePosition({ x: 0, y: 0 })
    setImageError(false)
    setOptimizedImageSrc(null)
  }, [currentImageIndex, product])

  // Load optimized image with fallback - OPTIMIZED VERSION
  useEffect(() => {
    if (!product || !product.images[currentImageIndex]) return

    const currentImageSrc = product.images[currentImageIndex]
    
    // Only change size category, not on every zoom level
    const getSizeCategory = (zoom: number) => {
      if (zoom > 2) return 'hero'
      if (zoom > 1) return 'large'
      return 'medium'
    }
    
    const sizeCategory = getSizeCategory(imageZoom)
    const optimizedPath = getOptimizedImagePath(currentImageSrc, sizeCategory)
    
    // Skip if we already have this optimized image
    if (optimizedImageSrc === optimizedPath) return
    
    // Prefer AVIF, then WebP, then PNG
    const testOptimizedImage = async () => {
      const extensions = ['avif', 'webp', 'png']
      const basePath = optimizedPath.replace(/\.[^/.]+$/, '')
      
      for (const ext of extensions) {
        try {
          const testPath = `${basePath}.${ext}`
          const img = new Image()
          
          await new Promise((resolve, reject) => {
            img.onload = resolve
            img.onerror = reject
            img.src = testPath
          })
          
          setOptimizedImageSrc(testPath)
          setImageError(false)
          return
        } catch {
          // Try next format
        }
      }
      
      // Fallback to original if no optimized version works
      setOptimizedImageSrc(currentImageSrc)
      setImageError(false)
    }
    
    testOptimizedImage()
  }, [product, currentImageIndex, Math.floor(imageZoom)]) // Only update on major zoom changes

  // Zoom handlers
  const handleZoomIn = useCallback(() => {
    setImageZoom(prev => Math.min(prev + 0.5, 4))
  }, [])

  const handleZoomOut = useCallback(() => {
    setImageZoom(prev => Math.max(prev - 0.5, 1))
  }, [])

  const handleZoomReset = useCallback(() => {
    setImageZoom(1)
    setImagePosition({ x: 0, y: 0 })
  }, [])

  // Mouse handlers for dragging
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (imageZoom > 1) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - imagePosition.x, y: e.clientY - imagePosition.y })
    }
  }, [imageZoom, imagePosition])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && imageZoom > 1) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }, [isDragging, imageZoom, dragStart])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Touch handlers for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1 && imageZoom > 1) {
      const touch = e.touches[0]
      setIsDragging(true)
      setDragStart({ x: touch.clientX - imagePosition.x, y: touch.clientY - imagePosition.y })
    }
  }, [imageZoom, imagePosition])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (isDragging && imageZoom > 1 && e.touches.length === 1) {
      const touch = e.touches[0]
      setImagePosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      })
    }
  }, [isDragging, imageZoom, dragStart])

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
          e.preventDefault()
          onNavigate('prev')
          break
        case 'ArrowRight':
          e.preventDefault()
          onNavigate('next')
          break
        case '+':
        case '=':
          e.preventDefault()
          handleZoomIn()
          break
        case '-':
          e.preventDefault()
          handleZoomOut()
          break
        case '0':
          e.preventDefault()
          handleZoomReset()
          break
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [isOpen, onClose, onNavigate, handleZoomIn, handleZoomOut, handleZoomReset])

  // Handle image load error
  const handleImageError = useCallback(() => {
    if (!product) return
    
    // If optimized image fails, try original image
    const originalSrc = product.images[currentImageIndex]
    if (optimizedImageSrc !== originalSrc) {
      setOptimizedImageSrc(originalSrc)
      setImageError(false)
    } else {
      setImageError(true)
    }
  }, [product, currentImageIndex, optimizedImageSrc])

  if (!isOpen || !product) return null

  // Get current image source with fallback
  const currentImageSrc = optimizedImageSrc || product.images[currentImageIndex]

  return (
    <div 
      className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center"
      onClick={onClose}
    >
      <div 
        className="relative w-full h-full flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-[10000] bg-black/70 text-white p-2 rounded-full hover:bg-black/90 transition-colors"
        >
          ✕
        </button>

        {/* Zoom Controls */}
        <div className="absolute top-4 left-4 z-[10000] flex flex-col space-y-2">
          <button
            onClick={handleZoomIn}
            className="bg-black/70 text-white p-2 rounded-full hover:bg-black/90 transition-colors"
            disabled={imageZoom >= 4}
          >
            +
          </button>
          <button
            onClick={handleZoomOut}
            className="bg-black/70 text-white p-2 rounded-full hover:bg-black/90 transition-colors"
            disabled={imageZoom <= 1}
          >
            -
          </button>
          {imageZoom > 1 && (
            <button
              onClick={handleZoomReset}
              className="bg-black/70 text-white px-2 py-1 rounded text-xs hover:bg-black/90 transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        {/* Image Navigation Dots */}
        {product.images.length > 1 && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2 z-[10000]">
            {product.images.map((_, index) => (
              <button
                key={index}
                onClick={() => onNavigate(index > currentImageIndex ? 'next' : 'prev')}
                className={`w-3 h-3 rounded-full ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Product Image with Touch Gestures */}
        {!imageError && currentImageSrc ? (
          <img
            src={currentImageSrc}
            alt={product.name}
            className={`max-w-full max-h-[70vh] object-contain transition-transform duration-200 ${
              isSwiping ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{
              transform: `scale(${imageZoom}) translate(${imagePosition.x / imageZoom}px, ${imagePosition.y / imageZoom}px)`,
              transformOrigin: 'center center',
              cursor: imageZoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
            }}
            onError={handleImageError}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            draggable={false}
          />
        ) : (
          <div className="flex items-center justify-center text-white">
            <p>Image not available</p>
          </div>
        )}

        {/* Zoom Level Indicator */}
        {imageZoom > 1 && (
          <div className="absolute top-16 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
            {Math.round(imageZoom * 100)}%
          </div>
        )}

        {/* Bottom Panel */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent">
          <div className="p-4 pb-6 space-y-4">
            {/* Product Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">{product.name}</h3>
                {product.price && (
                  <p className="text-white text-2xl font-extrabold mt-1">${product.price}</p>
                )}
              </div>
              
              {/* Purchase Options Toggle */}
              <button
                onClick={onTogglePurchaseOptions}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center"
              >
                {showPurchaseOptions ? 'Hide Options' : 'Purchase'}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            {/* Product Description */}
            {product.description && !showPurchaseOptions && (
              <p className="text-gray-300 text-sm line-clamp-2">{product.description}</p>
            )}
            
            {/* Purchase Options Panel */}
            {showPurchaseOptions && (
              <div className="space-y-4">
                {/* Color Selection */}
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Color</label>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color, index) => (
                        <button
                          key={index}
                          onClick={() => onColorSelect(color.name)}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-lg border-2 transition-colors ${
                            selectedColor === color.name
                              ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                              : 'border-gray-600 text-gray-300 hover:border-gray-500'
                          }`}
                        >
                          <div
                            className="w-4 h-4 rounded-full border border-gray-400"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className="text-sm">{color.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Size Selection */}
                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Size</label>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size, index) => (
                        <button
                          key={index}
                          onClick={() => onSizeSelect(size)}
                          className={`px-3 py-2 rounded-lg border-2 transition-colors ${
                            selectedSize === size
                              ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                              : 'border-gray-600 text-gray-300 hover:border-gray-500'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Add to Cart Button */}
                <button
                  onClick={onAddToCart}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  </svg>
                  Add to Cart
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LakePageOptimizedModal 
"use client"

import React, { useState, useCallback, useEffect, useMemo } from "react"
import Image from "next/image"
import { Product } from "@/lib/features/apparel-products"
import { getOptimizedImagePath } from "@/lib/utils/product-optimization"

interface OptimizedExpandedImageModalProps {
  isOpen: boolean
  onClose: () => void
  currentImage: string | null
  product: Product | null
  currentImageIndex: number
  onNavigate: (direction: 'prev' | 'next') => void
}

const OptimizedExpandedImageModal = React.memo(({
  isOpen,
  onClose,
  currentImage,
  product,
  currentImageIndex,
  onNavigate
}: OptimizedExpandedImageModalProps) => {
  const [imageZoom, setImageZoom] = useState(1)
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [imageLoaded, setImageLoaded] = useState(false)
  const [highResLoaded, setHighResLoaded] = useState(false)

  // Current image source - use original path directly
  const currentImageSrc = useMemo(() => {
    if (!currentImage) return null
    
    console.log('🔍 OptimizedExpandedImageModal - using currentImage:', currentImage)
    
    // Use the original image path directly
    return currentImage
  }, [currentImage])

  // Preload images for smooth navigation
  useEffect(() => {
    if (!isOpen || !product?.images) return

    const preloadAdjacentImages = () => {
      const nextIndex = (currentImageIndex + 1) % product.images.length
      const prevIndex = (currentImageIndex - 1 + product.images.length) % product.images.length
      
      if (nextIndex !== currentImageIndex) {
        const nextImageSrc = product.images[nextIndex]
        const img = new window.Image()
        img.src = nextImageSrc
        img.onload = () => console.log('🔍 Preloaded next:', nextImageSrc)
        img.onerror = () => console.warn('🔍 Failed to preload next:', nextImageSrc)
      }
      
      if (prevIndex !== currentImageIndex) {
        const prevImageSrc = product.images[prevIndex]
        const img = new window.Image()
        img.src = prevImageSrc
        img.onload = () => console.log('🔍 Preloaded prev:', prevImageSrc)
        img.onerror = () => console.warn('🔍 Failed to preload prev:', prevImageSrc)
      }
    }

    const timeoutId = setTimeout(preloadAdjacentImages, 200)
    return () => clearTimeout(timeoutId)
  }, [isOpen, product?.images, currentImageIndex])

  // Reset zoom and position when image changes
  useEffect(() => {
    if (isOpen) {
      setImageZoom(1)
      setImagePosition({ x: 0, y: 0 })
      setImageLoaded(false)
      setHighResLoaded(false)
    }
  }, [currentImageIndex, isOpen])

  // Zoom handlers
  const handleZoomIn = useCallback(() => {
    setImageZoom(prev => Math.min(prev + 0.5, 3))
  }, [])

  const handleZoomOut = useCallback(() => {
    setImageZoom(prev => {
      const newZoom = Math.max(prev - 0.5, 1)
      if (newZoom === 1) {
        setImagePosition({ x: 0, y: 0 })
      }
      return newZoom
    })
  }, [])

  const handleZoomReset = useCallback(() => {
    setImageZoom(1)
    setImagePosition({ x: 0, y: 0 })
  }, [])

  // Drag handlers
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

  if (!isOpen || !currentImageSrc || !product) return null

  const totalImages = product.images.length
  const isSpecialProduct = product.id === 'uv-mu-paddleboard'

  console.log('🔍 OptimizedExpandedImageModal - rendering with currentImageSrc:', currentImageSrc)

  return (
    <div
      className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 max-sm:p-0"
      onClick={onClose}
    >
      <div className={`relative ${
        isSpecialProduct 
          ? 'max-w-7xl max-h-[98vh]' 
          : 'max-w-5xl max-h-[90vh] max-sm:max-w-full max-sm:max-h-full'
      }`}>
        
        {/* Close Button */}
        <button
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-50 max-sm:top-4 max-sm:right-4 max-sm:bg-black/70 max-sm:p-2 max-sm:rounded-full"
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 max-sm:h-6 max-sm:w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="sr-only">Close (Esc)</span>
        </button>
        
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          
          {/* Main Image Container */}
          <div 
            className="relative overflow-hidden max-h-[90vh] flex items-center justify-center max-sm:max-h-screen max-sm:h-screen"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ cursor: imageZoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
          >
            
            {/* Loading Placeholder */}
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
              </div>
            )}

            {/* Main Image - Using Next.js Image component directly */}
            <Image
              src={currentImageSrc}
              alt="Expanded Product"
              width={1200}
              height={1200}
              className={`w-auto object-contain transition-opacity duration-300 ${
                isSpecialProduct 
                  ? 'max-h-[98vh] min-h-[80vh]' 
                  : 'max-h-[90vh] max-sm:max-h-[80vh] max-sm:max-w-full'
              }`}
              style={{
                transform: `scale(${isSpecialProduct ? imageZoom * 1.5 : imageZoom}) translate(${imagePosition.x / imageZoom}px, ${imagePosition.y / imageZoom}px)`,
                transformOrigin: 'center center'
              }}
              priority
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                console.error('🔍 Image load error:', e)
                setImageLoaded(true) // Still show controls even if image fails
              }}
            />
          </div>

          {/* Navigation Controls */}
          {totalImages > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onNavigate('prev')
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-colors shadow-lg z-[110] border border-white/20 hover:border-white/40 max-sm:p-2 max-sm:left-2"
                aria-label="Previous image (←)"
              >
                <svg className="w-6 h-6 max-sm:w-5 max-sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onNavigate('next')
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-colors shadow-lg z-[110] border border-white/20 hover:border-white/40 max-sm:p-2 max-sm:right-2"
                aria-label="Next image (→)"
              >
                <svg className="w-6 h-6 max-sm:w-5 max-sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Image Counter and Dots */}
          {totalImages > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-[110] max-sm:bottom-20">
              <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm border border-white/20">
                {currentImageIndex + 1} of {totalImages}
              </div>
              
              <div className="flex gap-2 max-sm:gap-1.5">
                {Array.from({ length: Math.min(totalImages, 8) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation()
                      const targetIndex = index
                      if (targetIndex !== currentImageIndex) {
                        onNavigate(targetIndex > currentImageIndex ? 'next' : 'prev')
                      }
                    }}
                    className={`w-3 h-3 rounded-full transition-all border-2 max-sm:w-2.5 max-sm:h-2.5 ${
                      currentImageIndex === index 
                        ? 'bg-white border-white' 
                        : 'bg-white/30 border-white/50 hover:bg-white/50'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
                {totalImages > 8 && (
                  <span className="text-white/70 text-sm">...</span>
                )}
              </div>
            </div>
          )}

          {/* Zoom Controls */}
          <div className="absolute top-4 right-4 flex-col gap-2 z-50 hidden sm:flex">
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleZoomIn()
              }}
              className="bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-colors shadow-lg"
              aria-label="Zoom in (+)"
              disabled={imageZoom >= 3}
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
              className="bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-colors shadow-lg"
              aria-label="Zoom out (-)"
              disabled={imageZoom <= 1}
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
              className="bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-colors shadow-lg"
              aria-label="Reset zoom (0)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>

            {/* Zoom Level Indicator */}
            <div className="bg-black/70 text-white px-2 py-1 rounded text-xs text-center border border-white/20">
              {Math.round(imageZoom * 100)}%
            </div>
          </div>

          {/* Help Text */}
          <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-3 py-2 rounded border border-white/20 hidden sm:block">
            <div>← → Navigate</div>
            <div>+/- Zoom</div>
            <div>Esc Close</div>
          </div>
        </div>
      </div>
    </div>
  )
})

OptimizedExpandedImageModal.displayName = 'OptimizedExpandedImageModal'

export default OptimizedExpandedImageModal 
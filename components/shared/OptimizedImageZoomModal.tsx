'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import OptimizedImage from '@/components/ui/optimized-image'
import { getOptimizedImagePath } from '@/lib/utils/product-optimization'

interface OptimizedImageZoomModalProps {
  isOpen: boolean
  imageSrc: string
  imageZoom: number
  imagePosition: { x: number; y: number }
  isDragging: boolean
  onClose: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  onZoomReset: () => void
  onMouseDown: (e: React.MouseEvent) => void
  onMouseMove: (e: React.MouseEvent) => void
  onMouseUp: () => void
}

const OptimizedImageZoomModal = React.memo(({
  isOpen,
  imageSrc,
  imageZoom,
  imagePosition,
  isDragging,
  onClose,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onMouseDown,
  onMouseMove,
  onMouseUp,
}: OptimizedImageZoomModalProps) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [highResLoaded, setHighResLoaded] = useState(false)

  // Determine optimal image size based on zoom level
  const getOptimalImageSize = useCallback((zoom: number) => {
    if (zoom <= 1.2) return 'medium'
    if (zoom <= 2) return 'large'
    return 'hero'
  }, [])

  // Get optimized image sources for different zoom levels
  const optimizedSources = useMemo(() => {
    if (!imageSrc) return null

    return {
      medium: getOptimizedImagePath(imageSrc, 'medium'),
      large: getOptimizedImagePath(imageSrc, 'large'),
      hero: getOptimizedImagePath(imageSrc, 'hero')
    }
  }, [imageSrc])

  // Current image source based on zoom level
  const currentImageSrc = useMemo(() => {
    if (!optimizedSources) return imageSrc
    
    const optimalSize = getOptimalImageSize(imageZoom)
    return optimizedSources[optimalSize] || imageSrc
  }, [optimizedSources, imageZoom, getOptimalImageSize, imageSrc])

  // Preload higher resolution images when modal opens
  useEffect(() => {
    if (!isOpen || !optimizedSources) return

    const preloadImage = (src: string) => {
      const img = new Image()
      img.src = src
    }

    // Preload large and hero versions for smooth zooming
    if (optimizedSources.large !== optimizedSources.medium) {
      preloadImage(optimizedSources.large)
    }
    if (optimizedSources.hero !== optimizedSources.large) {
      setTimeout(() => preloadImage(optimizedSources.hero), 100)
    }
  }, [isOpen, optimizedSources])

  // Reset loading states when image changes
  useEffect(() => {
    if (isOpen) {
      setImageLoaded(false)
      setHighResLoaded(false)
    }
  }, [imageSrc, isOpen])

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return

    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case '+':
        case '=':
          e.preventDefault()
          onZoomIn()
          break
        case '-':
          e.preventDefault()
          onZoomOut()
          break
        case '0':
          e.preventDefault()
          onZoomReset()
          break
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [isOpen, onClose, onZoomIn, onZoomOut, onZoomReset])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="relative max-w-4xl max-h-full w-full h-full flex items-center justify-center">
        
        {/* Close Button */}
        <Button
          onClick={onClose}
          variant="outline"
          size="icon"
          className="absolute top-4 right-4 z-10 bg-black/50 border-gray-600 text-white hover:bg-black/70"
          aria-label="Close (Esc)"
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Zoom Controls */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <Button
            onClick={onZoomIn}
            variant="outline"
            size="icon"
            className="bg-black/50 border-gray-600 text-white hover:bg-black/70"
            disabled={imageZoom >= 3}
            aria-label="Zoom in (+)"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            onClick={onZoomOut}
            variant="outline"
            size="icon"
            className="bg-black/50 border-gray-600 text-white hover:bg-black/70"
            disabled={imageZoom <= 1}
            aria-label="Zoom out (-)"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            onClick={onZoomReset}
            variant="outline"
            size="icon"
            className="bg-black/50 border-gray-600 text-white hover:bg-black/70"
            aria-label="Reset zoom (0)"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* Image Container */}
        <div
          className="relative w-full h-full overflow-hidden rounded-lg"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          style={{ cursor: isDragging ? 'grabbing' : imageZoom > 1 ? 'grab' : 'default' }}
        >
          {/* Loading indicator */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          )}

          {/* Progressive loading: Show medium quality first */}
          {optimizedSources && (
            <OptimizedImage
              src={optimizedSources.medium}
              alt="Product preview"
              fill
              className={`object-contain transition-opacity duration-300 ${
                highResLoaded ? 'opacity-0' : 'opacity-100'
              }`}
              style={{
                transform: `scale(${imageZoom}) translate(${imagePosition.x / imageZoom}px, ${imagePosition.y / imageZoom}px)`,
                transformOrigin: 'center',
              }}
              priority
              onLoad={() => setImageLoaded(true)}
            />
          )}

          {/* High resolution image */}
          <OptimizedImage
            src={currentImageSrc}
            alt="Expanded product view"
            fill
            className={`object-contain transition-opacity duration-300 ${
              highResLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              transform: `scale(${imageZoom}) translate(${imagePosition.x / imageZoom}px, ${imagePosition.y / imageZoom}px)`,
              transformOrigin: 'center',
            }}
            priority
            onLoad={() => setHighResLoaded(true)}
          />
        </div>

        {/* Zoom Level Indicator */}
        <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
          {Math.round(imageZoom * 100)}%
        </div>

        {/* Help Text */}
        <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-3 py-2 rounded hidden sm:block">
          <div>+/- Zoom</div>
          <div>Drag to pan</div>
          <div>Esc Close</div>
        </div>
      </div>
    </div>
  )
})

OptimizedImageZoomModal.displayName = 'OptimizedImageZoomModal'

export default OptimizedImageZoomModal 
import { useState, useCallback, useMemo, useRef } from 'react'
import { getOptimizedImagePath } from '@/lib/utils/product-optimization'

export interface UseOptimizedImageZoomProps {
  preloadOnMount?: boolean
  debounceMs?: number
  maxZoom?: number
  minZoom?: number
  zoomStep?: number
}

export function useOptimizedImageZoom({
  preloadOnMount = false,
  debounceMs = 50,
  maxZoom = 3,
  minZoom = 1,
  zoomStep = 0.5
}: UseOptimizedImageZoomProps = {}) {
  const [expandedImage, setExpandedImage] = useState(false)
  const [currentFeaturedImage, setCurrentFeaturedImage] = useState('')
  const [imageZoom, setImageZoom] = useState(minZoom)
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isPreloading, setIsPreloading] = useState(false)
  
  // Refs for performance optimization
  const preloadedImages = useRef<Set<string>>(new Set())
  const debounceTimer = useRef<NodeJS.Timeout>()
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map())

  // Memoized image sources for different zoom levels
  const optimizedImageSources = useMemo(() => {
    if (!currentFeaturedImage) return null
    
    return {
      medium: getOptimizedImagePath(currentFeaturedImage, 'medium'),
      large: getOptimizedImagePath(currentFeaturedImage, 'large'),
      hero: getOptimizedImagePath(currentFeaturedImage, 'hero')
    }
  }, [currentFeaturedImage])

  // Preload images for smooth transitions
  const preloadImage = useCallback(async (src: string): Promise<void> => {
    if (preloadedImages.current.has(src)) return Promise.resolve()
    
    return new Promise<void>((resolve) => {
      const img = new Image()
      img.onload = () => {
        preloadedImages.current.add(src)
        imageCache.current.set(src, img)
        resolve(undefined)
      }
      img.onerror = () => resolve(undefined) // Don't fail on error
      img.src = src
    })
  }, [])

  // Preload all sizes when image is set
  const preloadAllSizes = useCallback(async (imageSrc: string) => {
    if (!imageSrc) return
    
    setIsPreloading(true)
    
    const sources = {
      medium: getOptimizedImagePath(imageSrc, 'medium'),
      large: getOptimizedImagePath(imageSrc, 'large'),
      hero: getOptimizedImagePath(imageSrc, 'hero')
    }
    
    // Preload in order of likely usage
    await preloadImage(sources.medium)
    await preloadImage(sources.large)
    await preloadImage(sources.hero)
    
    setIsPreloading(false)
  }, [preloadImage])

  // Optimized image click handler
  const handleImageClick = useCallback((imageSrc: string) => {
    setCurrentFeaturedImage(imageSrc)
    setExpandedImage(true)
    setImageZoom(minZoom)
    setImagePosition({ x: 0, y: 0 })
    setIsDragging(false)
    
    // Preload all sizes for smooth zooming
    if (preloadOnMount) {
      preloadAllSizes(imageSrc)
    }
  }, [minZoom, preloadOnMount, preloadAllSizes])

  // Debounced zoom handlers
  const handleZoomIn = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }
    
    debounceTimer.current = setTimeout(() => {
      setImageZoom(prev => Math.min(prev + zoomStep, maxZoom))
    }, debounceMs)
  }, [zoomStep, maxZoom, debounceMs])

  const handleZoomOut = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }
    
    debounceTimer.current = setTimeout(() => {
      setImageZoom(prev => {
        const newZoom = Math.max(prev - zoomStep, minZoom)
        if (newZoom === minZoom) {
          setImagePosition({ x: 0, y: 0 })
        }
        return newZoom
      })
    }, debounceMs)
  }, [zoomStep, minZoom, debounceMs])

  const handleZoomReset = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }
    
    setImageZoom(minZoom)
    setImagePosition({ x: 0, y: 0 })
  }, [minZoom])

  const handleZoomToLevel = useCallback((level: number) => {
    const clampedLevel = Math.max(minZoom, Math.min(maxZoom, level))
    setImageZoom(clampedLevel)
    
    if (clampedLevel === minZoom) {
      setImagePosition({ x: 0, y: 0 })
    }
  }, [minZoom, maxZoom])

  // Optimized drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (imageZoom > minZoom) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - imagePosition.x, y: e.clientY - imagePosition.y })
    }
  }, [imageZoom, imagePosition, minZoom])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && imageZoom > minZoom) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }, [isDragging, imageZoom, dragStart, minZoom])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Touch handlers for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (imageZoom > minZoom && e.touches.length === 1) {
      const touch = e.touches[0]
      setIsDragging(true)
      setDragStart({ x: touch.clientX - imagePosition.x, y: touch.clientY - imagePosition.y })
    }
  }, [imageZoom, imagePosition, minZoom])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (isDragging && imageZoom > minZoom && e.touches.length === 1) {
      const touch = e.touches[0]
      setImagePosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y,
      })
    }
  }, [isDragging, imageZoom, dragStart, minZoom])

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Optimized close handler
  const closeModal = useCallback(() => {
    setExpandedImage(false)
    setImageZoom(minZoom)
    setImagePosition({ x: 0, y: 0 })
    setIsDragging(false)
    
    // Clear any pending debounced operations
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }
  }, [minZoom])

  // Bulk preload images (useful for product galleries)
  const preloadImages = useCallback(async (imageSrcs: string[]) => {
    setIsPreloading(true)
    
    const preloadPromises = imageSrcs.map(src => preloadAllSizes(src))
    await Promise.all(preloadPromises)
    
    setIsPreloading(false)
  }, [preloadAllSizes])

  // Get current optimal image source based on zoom level
  const getCurrentImageSource = useCallback(() => {
    if (!optimizedImageSources) return currentFeaturedImage
    
    if (imageZoom <= 1.5) return optimizedImageSources.medium
    if (imageZoom <= 2.5) return optimizedImageSources.large
    return optimizedImageSources.hero
  }, [optimizedImageSources, imageZoom, currentFeaturedImage])

  // Check if image is preloaded
  const isImagePreloaded = useCallback((src: string) => {
    return preloadedImages.current.has(src)
  }, [])

  // Get zoom level as percentage
  const zoomPercentage = useMemo(() => {
    return Math.round(imageZoom * 100)
  }, [imageZoom])

  // Check if zoom controls should be disabled
  const canZoomIn = imageZoom < maxZoom
  const canZoomOut = imageZoom > minZoom

  return {
    // State
    expandedImage,
    currentFeaturedImage,
    imageZoom,
    imagePosition,
    isDragging,
    isPreloading,
    
    // Computed values
    optimizedImageSources,
    zoomPercentage,
    canZoomIn,
    canZoomOut,
    
    // Handlers
    handleImageClick,
    handleZoomIn,
    handleZoomOut,
    handleZoomReset,
    handleZoomToLevel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    closeModal,
    
    // Utility functions
    preloadImages,
    preloadImage,
    getCurrentImageSource,
    isImagePreloaded,
  }
} 
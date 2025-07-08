'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  priority?: boolean
  sizes?: string
  onLoad?: () => void
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
}

/**
 * OptimizedImage Component
 * 
 * Provides dramatic performance improvements for image loading:
 * - Serves WebP with PNG fallback for smaller file sizes
 * - Lazy loading with intersection observer
 * - Blur placeholders for better perceived performance
 * - Responsive sizing based on viewport
 * - Smooth fade-in animations
 * - Preloading for above-the-fold images
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  priority = false,
  sizes,
  onLoad,
  quality = 80,
  placeholder = 'blur',
  blurDataURL,
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(priority)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  // Generate WebP and fallback image paths
  const getOptimizedImagePath = (originalPath: string) => {
    // Check if the image is in the regular images directory
    if (originalPath.startsWith('/images/') && !originalPath.startsWith('/images/optimized/')) {
      const optimizedPath = originalPath.replace('/images/', '/images/optimized/')
      return {
        webp: optimizedPath.replace(/\.(png|jpg|jpeg)$/i, '.webp'),
        fallback: optimizedPath,
        original: originalPath
      }
    }
    
    // Already optimized or different path structure
    return {
      webp: originalPath.replace(/\.(png|jpg|jpeg)$/i, '.webp'),
      fallback: originalPath,
      original: originalPath
    }
  }

  const { webp, fallback, original } = getOptimizedImagePath(src)

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [priority])

  // Generate a simple blur placeholder
  const generateBlurDataURL = () => {
    if (blurDataURL) return blurDataURL
    
    // Create a tiny 1x1 pixel base64 image as placeholder
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjZjNmNGY2IiBzdG9wLW9wYWNpdHk9IjAuOCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNlNWU3ZWIiIHN0b3Atb3BhY2l0eT0iMC4yIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0idXJsKCNncmFkaWVudCkiLz4KPC9zdmc+'
  }

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setHasError(true)
  }

  // Don't render anything if not in view and not priority
  if (!isInView && !priority) {
    return (
      <div
        ref={imgRef}
        className={cn(
          'bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse',
          fill && 'absolute inset-0',
          className
        )}
        style={!fill ? { width, height } : undefined}
      />
    )
  }

  return (
    <div
      ref={imgRef}
      className={cn(
        'relative overflow-hidden',
        fill && 'absolute inset-0',
        className
      )}
      style={!fill ? { width, height } : undefined}
    >
      {/* WebP Image with PNG Fallback */}
      <picture>
        <source srcSet={webp} type="image/webp" />
        <Image
          src={hasError ? original : fallback}
          alt={alt}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          fill={fill}
          sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
          quality={quality}
          priority={priority}
          placeholder={placeholder}
          blurDataURL={placeholder === 'blur' ? generateBlurDataURL() : undefined}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'transition-opacity duration-500 ease-in-out',
            isLoaded ? 'opacity-100' : 'opacity-0',
            fill ? 'object-cover' : 'object-contain'
          )}
        />
      </picture>

      {/* Loading placeholder */}
      {!isLoaded && (
        <div className={cn(
          'absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse',
          'flex items-center justify-center'
        )}>
          <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}

export default OptimizedImage 
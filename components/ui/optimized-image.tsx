'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

// Import the generated manifest (you'll need to run the optimization script first)
let imageManifest: Record<string, any> = {}
try {
  imageManifest = require('@/public/images/optimized/manifest.json')
} catch (error) {
  console.warn('Image manifest not found. Run the optimization script first.')
}

interface OptimizedImageProps {
  src: string
  alt: string
  size?: 'thumbnail' | 'small' | 'medium' | 'large' | 'hero'
  className?: string
  priority?: boolean
  placeholder?: 'blur' | 'empty' | 'skeleton'
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void
  onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void
  fallbackSrc?: string
  aspectRatio?: string
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  quality?: number
  loading?: 'lazy' | 'eager'
  fill?: boolean
  width?: number
  height?: number
  sizes?: string
  style?: React.CSSProperties
}

export default function OptimizedImage({
  src,
  alt,
  size = 'medium',
  className,
  priority = false,
  placeholder = 'skeleton',
  onLoad,
  onError,
  fallbackSrc,
  aspectRatio,
  objectFit = 'cover',
  quality = 80,
  loading = 'lazy',
  fill = false,
  width,
  height,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  style
}: OptimizedImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isIntersecting, setIsIntersecting] = useState(priority)
  const imgRef = useRef<HTMLDivElement>(null)
  
  // Extract image path from src for manifest lookup
  const getImagePath = (imageSrc: string) => {
    if (imageSrc.startsWith('/images/')) {
      return imageSrc.replace('/images/', '').replace(/\.[^/.]+$/, '')
    }
    return imageSrc.replace(/\.[^/.]+$/, '')
  }

  // Get optimized image sources from manifest
  const getOptimizedSources = () => {
    const imagePath = getImagePath(src)
    const manifestEntry = imageManifest[imagePath]
    
    if (!manifestEntry || !manifestEntry[size]) {
      return {
        webp: src,
        fallback: src,
        avif: null
      }
    }
    
    const sizeData = manifestEntry[size]
    return {
      webp: sizeData.webp,
      fallback: sizeData.fallback,
      avif: sizeData.avif || null
    }
  }

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || loading === 'eager') {
      setIsIntersecting(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true)
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
  }, [priority, loading])

  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setImageLoaded(true)
    onLoad?.(event)
  }

  const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setImageError(true)
    onError?.(event)
  }

  const sources = getOptimizedSources()
  
  // Create blurred placeholder data URL
  const createBlurDataURL = (width: number, height: number) => {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#f3f4f6'
      ctx.fillRect(0, 0, width, height)
    }
    return canvas.toDataURL()
  }

  const skeletonPlaceholder = (
    <div 
      className={cn(
        'animate-pulse bg-gray-200 rounded',
        className
      )}
      style={{ 
        aspectRatio: aspectRatio || 'auto',
        width: fill ? '100%' : width,
        height: fill ? '100%' : height,
        ...style
      }}
    />
  )

  const blurPlaceholder = placeholder === 'blur' && width && height 
    ? createBlurDataURL(width, height)
    : undefined

  return (
    <div 
      ref={imgRef}
      className={cn(
        'relative overflow-hidden',
        !imageLoaded && placeholder === 'skeleton' && 'bg-gray-100',
        className
      )}
      style={{ 
        aspectRatio: aspectRatio || 'auto',
        width: fill ? '100%' : width,
        height: fill ? '100%' : height,
        ...style
      }}
    >
      {/* Skeleton placeholder */}
      {!imageLoaded && placeholder === 'skeleton' && skeletonPlaceholder}
      
      {/* Main image with optimized sources */}
      {isIntersecting && (
        <picture>
          {/* AVIF source (most efficient) */}
          {sources.avif && (
            <source 
              srcSet={sources.avif} 
              type="image/avif" 
              sizes={sizes}
            />
          )}
          
          {/* WebP source (good compression) */}
          <source 
            srcSet={sources.webp} 
            type="image/webp" 
            sizes={sizes}
          />
          
          {/* Fallback image */}
          <Image
            src={imageError && fallbackSrc ? fallbackSrc : sources.fallback}
            alt={alt}
            fill={fill}
            width={!fill ? width : undefined}
            height={!fill ? height : undefined}
            className={cn(
              'transition-opacity duration-300',
              imageLoaded ? 'opacity-100' : 'opacity-0',
              objectFit === 'cover' && 'object-cover',
              objectFit === 'contain' && 'object-contain',
              objectFit === 'fill' && 'object-fill',
              objectFit === 'none' && 'object-none',
              objectFit === 'scale-down' && 'object-scale-down'
            )}
            priority={priority}
            quality={quality}
            placeholder={blurPlaceholder ? 'blur' : 'empty'}
            blurDataURL={blurPlaceholder}
            sizes={sizes}
            onLoad={handleLoad}
            onError={handleError}
          />
        </picture>
      )}
      
      {/* Loading overlay */}
      {!imageLoaded && isIntersecting && placeholder !== 'skeleton' && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}
    </div>
  )
}

// Hook for preloading images
export function useImagePreload(src: string, size: 'thumbnail' | 'small' | 'medium' | 'large' | 'hero' = 'medium') {
  useEffect(() => {
    const imagePath = src.replace('/images/', '').replace(/\.[^/.]+$/, '')
    const manifestEntry = imageManifest[imagePath]
    
    if (manifestEntry && manifestEntry[size]) {
      const sources = [
        manifestEntry[size].webp,
        manifestEntry[size].fallback
      ]
      
      sources.forEach(source => {
        if (source) {
          const link = document.createElement('link')
          link.rel = 'preload'
          link.as = 'image'
          link.href = source
          document.head.appendChild(link)
        }
      })
    }
  }, [src, size])
}

// Component for critical above-the-fold images
export function CriticalImage(props: OptimizedImageProps) {
  return (
    <OptimizedImage
      {...props}
      priority={true}
      loading="eager"
      placeholder="blur"
    />
  )
}

// Component for product images with aspect ratio
export function ProductImage(props: OptimizedImageProps) {
  return (
    <OptimizedImage
      {...props}
      aspectRatio="1"
      objectFit="cover"
      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
    />
  )
}

// Component for hero images
export function HeroImage(props: OptimizedImageProps) {
  return (
    <OptimizedImage
      {...props}
      size="hero"
      priority={true}
      loading="eager"
      aspectRatio="16/9"
      sizes="100vw"
    />
  )
} 
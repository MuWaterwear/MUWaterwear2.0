'use client'

import { useEffect } from 'react'

interface ImagePreloaderProps {
  images: Array<{
    src: string
    priority?: boolean
    size?: 'thumbnail' | 'small' | 'medium' | 'large' | 'hero'
  }>
}

// Import the generated manifest
let imageManifest: Record<string, any> = {}
try {
  imageManifest = require('@/public/images/optimized/manifest.json')
} catch (error) {
  console.warn('Image manifest not found. Run the optimization script first.')
}

export default function ImagePreloader({ images }: ImagePreloaderProps) {
  useEffect(() => {
    const preloadImage = (src: string, size: string = 'medium') => {
      // Extract image path from src for manifest lookup
      const getImagePath = (imageSrc: string) => {
        if (imageSrc.startsWith('/images/')) {
          return imageSrc.replace('/images/', '').replace(/\.[^/.]+$/, '')
        }
        return imageSrc.replace(/\.[^/.]+$/, '')
      }

      const imagePath = getImagePath(src)
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
      } else {
        // Fallback to original image if manifest not found
        const link = document.createElement('link')
        link.rel = 'preload'
        link.as = 'image'
        link.href = src
        document.head.appendChild(link)
      }
    }

    // Preload priority images first
    const priorityImages = images.filter(img => img.priority)
    const regularImages = images.filter(img => !img.priority)
    
    // Preload priority images immediately
    priorityImages.forEach(img => {
      preloadImage(img.src, img.size)
    })
    
    // Preload regular images after a short delay
    const timeoutId = setTimeout(() => {
      regularImages.forEach(img => {
        preloadImage(img.src, img.size)
      })
    }, 100)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [images])

  return null // This component doesn't render anything
}

// Hook for preloading images
export function useImagePreload(src: string, size: 'thumbnail' | 'small' | 'medium' | 'large' | 'hero' = 'medium') {
  useEffect(() => {
    const getImagePath = (imageSrc: string) => {
      if (imageSrc.startsWith('/images/')) {
        return imageSrc.replace('/images/', '').replace(/\.[^/.]+$/, '')
      }
      return imageSrc.replace(/\.[^/.]+$/, '')
    }

    const imagePath = getImagePath(src)
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
    } else {
      // Fallback to original image if manifest not found
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      document.head.appendChild(link)
    }
  }, [src, size])
}

// Component for critical above-the-fold image preloading
export function CriticalImagePreloader({ 
  heroImage, 
  productImages = [],
  iconImage 
}: {
  heroImage?: string
  productImages?: string[]
  iconImage?: string
}) {
  const imagesToPreload = [
    ...(heroImage ? [{ src: heroImage, priority: true, size: 'hero' as const }] : []),
    ...(iconImage ? [{ src: iconImage, priority: true, size: 'small' as const }] : []),
    ...productImages.slice(0, 6).map(src => ({ src, priority: false, size: 'medium' as const }))
  ]

  return <ImagePreloader images={imagesToPreload} />
} 
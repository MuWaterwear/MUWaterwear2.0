'use client'

import { useEffect, useCallback } from 'react'
import { getOptimizedImagePath } from '@/lib/utils/product-optimization'

interface ModalImagePreloaderProps {
  images: string[]
  trigger?: 'hover' | 'mount' | 'intersection'
  delay?: number
  priority?: boolean
  sizes?: ('medium' | 'large' | 'hero')[]
}

export default function ModalImagePreloader({
  images,
  trigger = 'hover',
  delay = 0,
  priority = false,
  sizes = ['medium', 'large']
}: ModalImagePreloaderProps) {
  
  const preloadImages = useCallback(async () => {
    if (!images.length) return
    
    const preloadPromises = images.flatMap(imageSrc => 
      sizes.map(size => {
        const optimizedSrc = getOptimizedImagePath(imageSrc, size)
        return new Promise<void>((resolve) => {
          const img = new Image()
          img.onload = () => resolve()
          img.onerror = () => resolve()
          img.src = optimizedSrc
        })
      })
    )
    
    await Promise.all(preloadPromises)
  }, [images, sizes])

  useEffect(() => {
    if (trigger === 'mount') {
      if (delay > 0) {
        const timeoutId = setTimeout(preloadImages, delay)
        return () => clearTimeout(timeoutId)
      } else {
        preloadImages()
      }
    }
  }, [trigger, delay, preloadImages])

  // For hover trigger, we'll expose the preload function
  const handleMouseEnter = useCallback(() => {
    if (trigger === 'hover') {
      preloadImages()
    }
  }, [trigger, preloadImages])

  // For intersection trigger, we'll use intersection observer
  useEffect(() => {
    if (trigger === 'intersection') {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              preloadImages()
              observer.disconnect()
            }
          })
        },
        {
          threshold: 0.1,
          rootMargin: '100px'
        }
      )

      // Observe the document body as a fallback
      observer.observe(document.body)
      
      return () => observer.disconnect()
    }
  }, [trigger, preloadImages])

  // Return mouse handler for hover trigger
  if (trigger === 'hover') {
    return { onMouseEnter: handleMouseEnter }
  }

  // For mount and intersection triggers, no visible component needed
  return null
}

// Hook version for more flexible usage
export function useModalImagePreloader(
  images: string[],
  options: Omit<ModalImagePreloaderProps, 'images'> = {}
) {
  const { trigger = 'hover', delay = 0, sizes = ['medium', 'large'] } = options
  
  const preloadImages = useCallback(async () => {
    if (!images.length) return
    
    const preloadPromises = images.flatMap(imageSrc => 
      sizes.map(size => {
        const optimizedSrc = getOptimizedImagePath(imageSrc, size)
        return new Promise<void>((resolve) => {
          const img = new Image()
          img.onload = () => resolve()
          img.onerror = () => resolve()
          img.src = optimizedSrc
        })
      })
    )
    
    await Promise.all(preloadPromises)
  }, [images, sizes])

  useEffect(() => {
    if (trigger === 'mount') {
      if (delay > 0) {
        const timeoutId = setTimeout(preloadImages, delay)
        return () => clearTimeout(timeoutId)
      } else {
        preloadImages()
      }
    }
  }, [trigger, delay, preloadImages])

  return {
    preloadImages,
    handleMouseEnter: trigger === 'hover' ? preloadImages : undefined
  }
} 
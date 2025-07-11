'use client'

import { useEffect } from 'react'

interface ImagePreloaderProps {
  images: Array<{
    src: string
    priority?: boolean
  }>
}

export default function ImagePreloader({ images }: ImagePreloaderProps) {
  useEffect(() => {
    const preloadImage = (src: string) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      document.head.appendChild(link)
    }

    // Preload priority images first
    const priorityImages = images.filter(img => img.priority)
    const regularImages = images.filter(img => !img.priority)
    
    // Preload priority images immediately
    priorityImages.forEach(img => {
      preloadImage(img.src)
    })
    
    // Preload regular images after a short delay
    const timeoutId = setTimeout(() => {
      regularImages.forEach(img => {
        preloadImage(img.src)
      })
    }, 100)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [images])

  return null // This component doesn't render anything
}

// Hook for preloading images
export function useImagePreload(src: string) {
  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src
    document.head.appendChild(link)
  }, [src])
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
    ...(heroImage ? [{ src: heroImage, priority: true }] : []),
    ...(iconImage ? [{ src: iconImage, priority: true }] : []),
    ...productImages.slice(0, 6).map(src => ({ src, priority: false }))
  ]

  return <ImagePreloader images={imagesToPreload} />
} 
/**
 * Image Preloader Utility
 * 
 * Preloads critical images to improve perceived performance
 * for above-the-fold content and user interactions
 */

interface PreloadOptions {
  priority?: boolean
  crossOrigin?: 'anonymous' | 'use-credentials'
  fetchPriority?: 'high' | 'low' | 'auto'
}

/**
 * Preload a single image with WebP support
 * @param src - Image source URL
 * @param options - Preload options
 */
export const preloadImage = (src: string, options: PreloadOptions = {}): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Generate WebP and fallback paths
    const getOptimizedPath = (originalPath: string) => {
      if (originalPath.startsWith('/images/') && !originalPath.startsWith('/images/optimized/')) {
        const optimizedPath = originalPath.replace('/images/', '/images/optimized/')
        return {
          webp: optimizedPath.replace(/\.(png|jpg|jpeg)$/i, '.webp'),
          fallback: optimizedPath
        }
      }
      return {
        webp: originalPath.replace(/\.(png|jpg|jpeg)$/i, '.webp'),
        fallback: originalPath
      }
    }

    const { webp, fallback } = getOptimizedPath(src)
    
    // Try WebP first
    const webpImg = new Image()
    webpImg.onload = () => resolve()
    webpImg.onerror = () => {
      // Fallback to original format
      const fallbackImg = new Image()
      fallbackImg.onload = () => resolve()
      fallbackImg.onerror = () => reject(new Error(`Failed to preload image: ${src}`))
      fallbackImg.src = fallback
    }
    webpImg.src = webp

    // Add preload link for better browser optimization
    if (typeof document !== 'undefined') {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = webp
      link.type = 'image/webp'
      
      if (options.fetchPriority) {
        link.fetchPriority = options.fetchPriority
      }
      
      if (options.crossOrigin) {
        link.crossOrigin = options.crossOrigin
      }
      
      document.head.appendChild(link)
    }
  })
}

/**
 * Preload multiple images with priority handling
 * @param images - Array of image sources
 * @param options - Preload options
 */
export const preloadImages = async (
  images: string[], 
  options: PreloadOptions = {}
): Promise<void> => {
  const promises = images.map(src => preloadImage(src, options))
  
  try {
    await Promise.all(promises)
  } catch (error) {
    console.warn('Some images failed to preload:', error)
  }
}

/**
 * Preload hero and above-the-fold images for a product grid
 * @param products - Array of product objects with images
 * @param maxPreload - Maximum number of images to preload
 */
export const preloadProductImages = async (
  products: Array<{ images: string[] }>,
  maxPreload = 8
): Promise<void> => {
  const criticalImages = products
    .slice(0, maxPreload)
    .map(product => product.images[0])
    .filter(Boolean)
  
  await preloadImages(criticalImages, { 
    priority: true, 
    fetchPriority: 'high' 
  })
}

/**
 * Preload images on user interaction (hover, focus)
 * @param images - Array of image sources to preload
 */
export const preloadOnInteraction = (images: string[]): void => {
  const preloadQueue = [...images]
  
  const preloadNext = () => {
    if (preloadQueue.length > 0) {
      const nextImage = preloadQueue.shift()!
      preloadImage(nextImage, { fetchPriority: 'low' })
        .catch(() => {}) // Ignore errors for interaction-based preloading
    }
  }
  
  // Use requestIdleCallback for better performance
  if (typeof requestIdleCallback !== 'undefined') {
    const preloadWithIdle = () => {
      requestIdleCallback(() => {
        preloadNext()
        if (preloadQueue.length > 0) {
          preloadWithIdle()
        }
      })
    }
    preloadWithIdle()
  } else {
    // Fallback for browsers without requestIdleCallback
    images.forEach(src => {
      setTimeout(() => preloadImage(src, { fetchPriority: 'low' }).catch(() => {}), 100)
    })
  }
}

export default {
  preloadImage,
  preloadImages,
  preloadProductImages,
  preloadOnInteraction
} 
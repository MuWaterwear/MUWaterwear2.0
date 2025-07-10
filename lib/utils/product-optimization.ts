// Product optimization utilities for better performance
export interface OptimizedProduct {
  id: string
  name: string
  category: string
  description: string
  price: number
  displayImage: string // Pre-computed optimal display image
  hoverImage?: string // Pre-computed hover image
  images: string[]
  colors: Array<{ name: string; hex: string }>
  sizes: string[]
  featured: boolean
  lake: string
  details: string
  // Performance optimizations
  imagePreloads: {
    thumbnail: string
    small: string
    medium: string
    large?: string
  }
  colorImageMap: Record<string, string> // Pre-computed color -> image mapping
  primaryColor: string // Most prominent color for display
}

// Import image manifest for optimized paths
let imageManifest: Record<string, any> = {}
try {
  imageManifest = require('@/public/images/optimized/manifest.json')
} catch (error) {
  console.warn('Image manifest not found. Using original images.')
}

// Function to get optimized image path with robust fallback handling
export function getOptimizedImagePath(originalPath: string, size: 'thumbnail' | 'small' | 'medium' | 'large' | 'hero' = 'medium') {
  // Handle empty or invalid paths
  if (!originalPath || typeof originalPath !== 'string') {
    return originalPath || ''
  }
  
  try {
    // For files with special characters (commas, spaces), prefer original image
    // since these often have issues with optimization
    const hasSpecialChars = originalPath.includes(',') || originalPath.includes(' ') || originalPath.includes('%')
    
    if (hasSpecialChars) {
      return originalPath
    }
    
    const imagePath = originalPath.replace('/images/', '').replace(/\.[^/.]+$/, '')
    const manifestEntry = imageManifest[imagePath]
    
    if (manifestEntry && manifestEntry[size]) {
      const webpPath = manifestEntry[size].webp
      const fallbackPath = manifestEntry[size].fallback
      
      // Return WebP if available, otherwise fallback
      return webpPath || fallbackPath || originalPath
    }
    
    // No manifest entry found
    return originalPath
  } catch (error) {
    // Graceful fallback on any error
    console.warn(`Error getting optimized image path for ${originalPath}:`, error)
    return originalPath
  }
}

// Function to create consistent random selection based on product ID
function createSeededRandom(seed: string): number {
  let x = 0
  for (let i = 0; i < seed.length; i++) {
    x = ((x << 5) - x) + seed.charCodeAt(i)
    x = x & x // Convert to 32-bit integer
  }
  return Math.abs(x) / 0x7FFFFFFF
}

// Function to find the best display image for a product
export function selectOptimalDisplayImage(product: any): { displayImage: string; hoverImage?: string; primaryColor: string } {
  if (!product.images || product.images.length === 0) {
    return { displayImage: '', primaryColor: 'Default' }
  }

  // Special handling for specific product types
  const specialProductTypes = ['Traditional Logo Tee', 'Fish Tee']
  const isSpecialProduct = specialProductTypes.some(type => 
    product.name.includes(type)
  )

  // If product has colors, use seeded random to select consistently
  if (product.colors && product.colors.length > 0) {
    const randomSeed = createSeededRandom(product.id)
    const randomColorIndex = Math.floor(randomSeed * product.colors.length)
    const primaryColor = product.colors[randomColorIndex].name

    // Find image for the selected color
    const colorImageIndex = product.images.findIndex((img: string) => 
      img.toLowerCase().includes(primaryColor.toLowerCase().replace(' ', '-'))
    )

    if (colorImageIndex !== -1) {
      const displayImage = product.images[colorImageIndex]
      
      // Find a different color for hover effect
      const hoverColorIndex = product.colors.findIndex((color: any, index: number) => 
        index !== randomColorIndex && 
        product.images.some((img: string) => 
          img.toLowerCase().includes(color.name.toLowerCase().replace(' ', '-'))
        )
      )
      
      let hoverImage
      if (hoverColorIndex !== -1) {
        const hoverColorName = product.colors[hoverColorIndex].name
        hoverImage = product.images.find((img: string) => 
          img.toLowerCase().includes(hoverColorName.toLowerCase().replace(' ', '-'))
        )
      }

      return { displayImage, hoverImage, primaryColor }
    }
  }

  // Fallback handling for special products
  if (isSpecialProduct) {
    const frontImageIndex = product.images.findIndex((img: string) => 
      img.toLowerCase().includes('front')
    )
    
    if (frontImageIndex !== -1) {
      const displayImage = product.images[frontImageIndex]
      const hoverImage = product.images.find((img: string, index: number) => 
        index !== frontImageIndex && img.toLowerCase().includes('back')
      )
      
      return { 
        displayImage, 
        hoverImage, 
        primaryColor: product.colors?.[0]?.name || 'Default' 
      }
    }
  }

  // Final fallback to first image
  return { 
    displayImage: product.images[0], 
    hoverImage: product.images[1], 
    primaryColor: product.colors?.[0]?.name || 'Default' 
  }
}

// Function to create color to image mapping
export function createColorImageMap(product: any): Record<string, string> {
  const colorImageMap: Record<string, string> = {}
  
  if (product.colors && product.images) {
    product.colors.forEach((color: any) => {
      const colorImage = product.images.find((img: string) => 
        img.toLowerCase().includes(color.name.toLowerCase().replace(' ', '-'))
      )
      
      if (colorImage) {
        colorImageMap[color.name] = colorImage
      }
    })
  }
  
  return colorImageMap
}

// Function to generate image preloads for different sizes
export function generateImagePreloads(imagePath: string): OptimizedProduct['imagePreloads'] {
  const preloads: OptimizedProduct['imagePreloads'] = {
    thumbnail: getOptimizedImagePath(imagePath, 'thumbnail'),
    small: getOptimizedImagePath(imagePath, 'small'),
    medium: getOptimizedImagePath(imagePath, 'medium'),
    large: getOptimizedImagePath(imagePath, 'large'),
  }
  
  return preloads
}

// Main function to optimize a single product
export function optimizeProduct(product: any): OptimizedProduct {
  const { displayImage, hoverImage, primaryColor } = selectOptimalDisplayImage(product)
  const colorImageMap = createColorImageMap(product)
  const imagePreloads = generateImagePreloads(displayImage)

  return {
    id: product.id,
    name: product.name,
    category: product.category,
    description: product.description,
    price: product.price,
    displayImage,
    hoverImage,
    images: product.images,
    colors: product.colors || [],
    sizes: product.sizes || [],
    featured: product.featured || false,
    lake: product.lake,
    details: product.details,
    imagePreloads,
    colorImageMap,
    primaryColor,
  }
}

// Function to optimize an array of products
export function optimizeProducts(products: any[]): OptimizedProduct[] {
  return products.map(optimizeProduct)
}

// Function to get critical images for preloading
export function getCriticalImages(products: OptimizedProduct[], limit: number = 6): string[] {
  return products
    .slice(0, limit)
    .map(product => product.displayImage)
    .filter(Boolean)
}

// Function to batch optimize products by category
export function optimizeProductsByCategory(products: any[]): Record<string, OptimizedProduct[]> {
  const optimizedProducts = optimizeProducts(products)
  
  return optimizedProducts.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = []
    }
    acc[product.category].push(product)
    return acc
  }, {} as Record<string, OptimizedProduct[]>)
}

// Memoization for expensive operations
const optimizedProductsCache = new Map<string, OptimizedProduct>()

export function getOptimizedProduct(product: any): OptimizedProduct {
  const cacheKey = `${product.id}-${product.images?.[0] || 'no-image'}`
  
  if (optimizedProductsCache.has(cacheKey)) {
    return optimizedProductsCache.get(cacheKey)!
  }
  
  const optimized = optimizeProduct(product)
  optimizedProductsCache.set(cacheKey, optimized)
  
  return optimized
}

// Function to clear cache when needed
export function clearOptimizedProductsCache() {
  optimizedProductsCache.clear()
} 
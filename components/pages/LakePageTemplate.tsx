'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/contexts/CartContext'
import { MobileOnly, DesktopOnly } from '@/components/responsive/ResponsiveLayout'
import MobileNavigation from '@/components/responsive/MobileNavigation'
import ResponsiveLayout from '@/components/responsive/MobileShoppingCart'
import { useMobile } from '@/hooks/useMobile'
import { useWeatherData } from '@/hooks/useWeatherData'
import LakePageOptimizedModal from '@/components/pages/LakePageOptimizedModal'

// Minimal type definitions
type Product = {
  id: string
  name: string
  images: string[]
  description?: string
  price?: number
  category?: string
  colors?: { name: string; hex: string }[]
  sizes?: string[]
}

type LakeInfo = {
  name: string
  description: string
  heroImage: string
  headerBackgroundImage?: string
  footerBackgroundImage?: string
  icon?: string
  gpsCoordinates?: string
  elevation?: string
  maxDepth?: string
}

type WebcamConfig = {
  src: string
  title: string
}

type LakePageTemplateProps = {
  lakeInfo: LakeInfo
  apparelProducts: Product[]
  webcamConfig: WebcamConfig
}

export const LakePageTemplate: React.FC<LakePageTemplateProps> = ({
  lakeInfo,
  apparelProducts,
  webcamConfig
}) => {
  const { isMobile } = useMobile()
  const { setIsCartOpen, addToCart } = useCart()
  
  const { 
    currentWeather, 
    isLoadingWeather 
  } = useWeatherData(lakeInfo.name, "")

  // Product selection state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [showPurchaseOptions, setShowPurchaseOptions] = useState(false)

  // Memoize random color selections to keep consistent during render
  const [productDisplayImages, setProductDisplayImages] = useState<{[key: string]: { image: string, color: string }}>({})

  // Helper function to find a random color image
  const findRandomColorImage = (product: Product): { image: string, color: string } => {
    // Create a consistent seed based on product ID
    const seedRandom = (seed: string) => {
      let x = 0
      for (let i = 0; i < seed.length; i++) {
        x = ((x << 5) - x) + seed.charCodeAt(i)
        x = x & x // Convert to 32-bit integer
      }
      return Math.abs(x) / 0x7FFFFFFF
    }

    const seed = product.id
    const randomSeed = seedRandom(seed)

    // Special handling for specific product types
    const specialProductTypes = ['Traditional Logo Tee', 'Fish Tee']
    const isSpecialProduct = specialProductTypes.some(type => 
      product.name.includes(type)
    )

    // If product has colors
    if (product.colors && product.colors.length > 0) {
      // Use seeded random to select a color consistently
      const randomColorIndex = Math.floor(randomSeed * product.colors.length)
      const randomColor = product.colors[randomColorIndex].name

      // Find image for the random color
      const colorImageIndex = product.images.findIndex(img => 
        img.toLowerCase().includes(randomColor.toLowerCase().replace(' ', '-'))
      )

      // If color-specific image found, return it
      if (colorImageIndex !== -1) {
        return {
          image: product.images[colorImageIndex],
          color: randomColor
        }
      }
    }

    // If no color-specific image or no colors, handle special products
    if (isSpecialProduct) {
      const frontImageIndex = product.images.findIndex(img => 
        img.toLowerCase().includes('front')
      )
      
      if (frontImageIndex !== -1) {
        return {
          image: product.images[frontImageIndex],
          color: product.colors?.[0]?.name || 'Default'
        }
      }
    }

    // Fallback to first image
    return {
      image: product.images[0],
      color: product.colors?.[0]?.name || 'Default'
    }
  }

  // Effect to generate random color images on initial render
  useEffect(() => {
    const randomImages: {[key: string]: { image: string, color: string }} = {}
    apparelProducts.forEach(product => {
      randomImages[product.id] = findRandomColorImage(product)
    })
    setProductDisplayImages(randomImages)
  }, [apparelProducts])

  // Helper function to find image for selected color
  const findImageForColor = (product: Product, color: string): number => {
    // Special handling for specific product types
    const specialProductTypes = ['Traditional Logo Tee', 'Fish Tee']
    const isSpecialProduct = specialProductTypes.some(type => 
      product.name.includes(type)
    )

    if (isSpecialProduct) {
      // For special products, look for front images first
      const frontImageIndex = product.images.findIndex(img => 
        img.toLowerCase().includes('front') && 
        img.toLowerCase().includes(color.toLowerCase().replace(' ', '-'))
      )
      
      if (frontImageIndex !== -1) {
        return frontImageIndex
      }
    }

    // Standard color matching
    const colorImageIndex = product.images.findIndex(img => 
      img.toLowerCase().includes(color.toLowerCase().replace(' ', '-'))
    )
    
    return colorImageIndex !== -1 ? colorImageIndex : 0
  }

  // Product selection handler
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product)
    setCurrentImageIndex(0)
    setSelectedColor(product.colors?.[0]?.name || '')
    setSelectedSize(product.sizes?.[0] || '')
    setShowPurchaseOptions(false)
  }

  // Color selection handler
  const handleColorSelect = (color: string) => {
    setSelectedColor(color)
    
    if (selectedProduct) {
      const newImageIndex = findImageForColor(selectedProduct, color)
      setCurrentImageIndex(newImageIndex)
    }
  }

  // Add to cart handler
  const handleAddToCart = async () => {
    if (!selectedProduct) return
    
    const cartItem = {
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: (selectedProduct.price || 0).toString(),
      image: selectedProduct.images[currentImageIndex],
      color: selectedColor,
      size: selectedSize,
      quantity: 1
    }
    
    addToCart(cartItem)
    setShowPurchaseOptions(false)
  }

  // Navigation handlers for image modal
  const handleNavigate = (direction: 'prev' | 'next') => {
    if (!selectedProduct) return
    
    const totalImages = selectedProduct.images.length
    let newIndex = currentImageIndex
    
    if (direction === 'next') {
      newIndex = (currentImageIndex + 1) % totalImages
    } else {
      newIndex = (currentImageIndex - 1 + totalImages) % totalImages
    }
    
    setCurrentImageIndex(newIndex)
  }

  return (
    <ResponsiveLayout
      hero={!isMobile ? {
        img: lakeInfo.heroImage,
        title: "",
        subtitle: "",
      } : undefined}
    >
      <div className="min-h-screen bg-black text-white relative">
        {/* Mobile Navigation */}
        <MobileOnly>
          <MobileNavigation onCartOpen={() => setIsCartOpen(true)} />
        </MobileOnly>

        {/* Webcam handled externally by WeatherWebcam component */}

        {/* Mobile Product Grid with Enhanced Touch Support */}
        {isMobile ? (
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              {apparelProducts.map((product) => {
                // Get the pre-selected random image for this product
                const displayData = productDisplayImages[product.id] || findRandomColorImage(product)

                return (
                  <div 
                    key={product.id} 
                    className="bg-gray-800 rounded-lg p-2 hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => handleProductSelect(product)}
                  >
                    <img 
                      src={displayData.image} 
                      alt={`${product.name} - ${displayData.color}`} 
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <h3 className="text-lg font-medium mt-2">{product.name}</h3>
                  </div>
                )
              })}
            </div>

            {/* Mobile Product Modal with Touch Gestures */}
            {selectedProduct && (
              <LakePageOptimizedModal
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                product={selectedProduct}
                currentImageIndex={currentImageIndex}
                onNavigate={handleNavigate}
                selectedColor={selectedColor}
                selectedSize={selectedSize}
                onColorSelect={handleColorSelect}
                onSizeSelect={setSelectedSize}
                onAddToCart={handleAddToCart}
                showPurchaseOptions={showPurchaseOptions}
                onTogglePurchaseOptions={() => setShowPurchaseOptions(!showPurchaseOptions)}
              />
            )}
          </div>
        ) : (
          /* Desktop Product Grid */
          <div className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {apparelProducts.map((product) => {
                // Get the pre-selected random image for this product
                const displayData = productDisplayImages[product.id] || findRandomColorImage(product)

                return (
                  <div 
                    key={product.id} 
                    className="bg-gray-800 rounded-lg p-2 hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => handleProductSelect(product)}
                  >
                    <img 
                      src={displayData.image} 
                      alt={`${product.name} - ${displayData.color}`} 
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <h3 className="text-lg font-medium mt-2">{product.name}</h3>
                  </div>
                )
              })}
            </div>

            {/* Desktop Product Modal with Touch Gestures */}
            {selectedProduct && (
              <LakePageOptimizedModal
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                product={selectedProduct}
                currentImageIndex={currentImageIndex}
                onNavigate={handleNavigate}
                selectedColor={selectedColor}
                selectedSize={selectedSize}
                onColorSelect={handleColorSelect}
                onSizeSelect={setSelectedSize}
                onAddToCart={handleAddToCart}
                showPurchaseOptions={showPurchaseOptions}
                onTogglePurchaseOptions={() => setShowPurchaseOptions(!showPurchaseOptions)}
              />
            )}
          </div>
        )}
      </div>
    </ResponsiveLayout>
  )
}

export default LakePageTemplate 
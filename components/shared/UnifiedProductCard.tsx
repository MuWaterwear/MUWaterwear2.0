"use client"

import { useState } from "react"
import Image from "next/image"
import { ShoppingCart } from "lucide-react"

// Unified product interface that works for both gear and apparel
interface UnifiedProduct {
  id: string
  name: string
  category: string
  description: string
  price: number
  images: string[]
  colors: { name: string; hex: string }[]
  sizes: string[] | { name: string; price?: number }[]
  featured?: boolean
  lake?: string
  details?: string
  featuresList?: string[]
}

interface UnifiedProductCardProps {
  product: UnifiedProduct
  variant?: "gear" | "apparel"
  onQuickAdd: (product: UnifiedProduct) => void
  onImageClick: (imageSrc: string, productId: string) => void
  selectedSize?: string
  selectedColorIndex?: number
  onSizeChange?: (size: string) => void
  onColorChange?: (index: number) => void
  
  // Layout options
  isFullWidth?: boolean
  isMobile?: boolean
  
  // Feature toggles
  showImageNavigation?: boolean
  showExpandedDetails?: boolean
  imageScale?: number
  
  // Advanced options
  expandedDetails?: boolean
  onToggleDetails?: () => void
  getImageIndexForColor?: (product: UnifiedProduct, colorIndex: number) => number
}

export default function UnifiedProductCard({
  product,
  variant = "apparel",
  onQuickAdd,
  onImageClick,
  selectedSize = "",
  selectedColorIndex = 0,
  onSizeChange,
  onColorChange,
  isFullWidth = false,
  isMobile = false,
  showImageNavigation = true,
  showExpandedDetails = false,
  imageScale = variant === "gear" ? 300 : 150,
  expandedDetails = false,
  onToggleDetails,
  getImageIndexForColor
}: UnifiedProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  // Calculate current image index (with special handling for gear products)
  const currentImageIndex = getImageIndexForColor 
    ? getImageIndexForColor(product, selectedColorIndex)
    : selectedColorIndex
  
  // Get the correct featured image
  const featuredImage = product.images[currentImageIndex] || product.images[0]
  const hasMultipleImages = product.images.length > 1
  
  // Calculate scaling classes
  const scalePercentage = imageScale / 100
  const hoverScalePercentage = (imageScale + 10) / 100
  const scaleClass = `scale-[${scalePercentage}]`
  const hoverScaleClass = `group-hover:scale-[${hoverScalePercentage}]`
  
  // Handle color change with navigation
  const handleColorChange = (index: number) => {
    if (onColorChange) {
      onColorChange(index)
    }
  }
  
  // Handle image navigation
  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    const prevIndex = selectedColorIndex === 0 ? product.images.length - 1 : selectedColorIndex - 1
    handleColorChange(prevIndex)
  }
  
  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    const nextIndex = (selectedColorIndex + 1) % product.images.length
    handleColorChange(nextIndex)
  }
  
  // Handle size selection
  const handleSizeChange = (size: string) => {
    if (onSizeChange) {
      onSizeChange(size)
    }
  }
  
  // Handle add to cart
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    onQuickAdd(product)
  }
  
  // Handle image click
  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onImageClick(featuredImage, product.id)
  }

  return (
    <div
      className="group relative h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative h-full bg-slate-900/50 rounded-lg overflow-hidden border border-slate-800/50 transition-all duration-300 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10 flex flex-col ${
        variant === "gear" ? "sm:overflow-hidden" : ""
      } ${
        product.id === 'uv-mu-paddleboard' 
          ? 'hover:-translate-y-2 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/20' 
          : 'hover:-translate-y-1'
      }`}>
        
        {/* Product Image */}
        <div className={`relative overflow-hidden bg-gradient-to-b from-slate-800/50 to-slate-900/50 ${
          isFullWidth ? (isMobile ? 'aspect-[2/1]' : 'aspect-[2/1]') : 'aspect-square'
        }`}>
          
          {/* Background for apparel variant */}
          {variant === "apparel" && (
            <div className="absolute inset-0 opacity-15 pointer-events-none z-0">
              <Image
                src="/Untitled design (68).svg"
                alt="Background"
                fill
                className="object-cover"
                style={{ transform: 'scale(4)' }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}
          
          {/* Main product image */}
          <div 
            className="absolute inset-0 cursor-pointer z-10 w-full h-full flex items-center justify-center"
            onClick={handleImageClick}
          >
            <Image
              src={featuredImage}
              alt={product.name}
              fill
              className={`transition-transform duration-500 pointer-events-none ${
                variant === "gear" 
                  ? `object-contain p-2 sm:p-4 ${scaleClass} ${hoverScaleClass} sm:${scaleClass} sm:${hoverScaleClass}`
                  : product.id === 'uv-mu-paddleboard' 
                  ? 'object-cover scale-150 group-hover:scale-[1.7]' 
                  : product.id === 'mu-ocean-green-swim-shorts'
                  ? 'object-cover scale-150 group-hover:scale-[1.7]'
                  : product.id === 'swim-mu-sky-blue-shorts'
                  ? 'object-cover scale-100 group-hover:scale-[1.2]'
                  : 'object-cover group-hover:scale-110'
              }`}
              sizes={variant === "gear" 
                ? "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
              }
              quality={75}
              priority={false}
            />
          </div>
          
          {/* Featured Badge */}
          {product.featured && (
            <div className={`absolute top-2 left-2 md:top-3 md:left-3 backdrop-blur-sm text-xs font-medium px-2 py-1 md:px-3 rounded-full border transition-all duration-300 z-10 ${
              product.id === 'uv-mu-paddleboard' 
                ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30 text-cyan-300 border-cyan-400/50 group-hover:from-cyan-500/50 group-hover:to-blue-500/50 group-hover:text-cyan-200 group-hover:border-cyan-300/70 animate-pulse' 
                : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
            }`}>
              {product.id === 'uv-mu-paddleboard' ? '✨ PREMIUM' : 'FEATURED'}
            </div>
          )}
          
          {/* Image Navigation - Desktop Only */}
          {showImageNavigation && hasMultipleImages && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 z-20 hidden sm:block"
                aria-label="Previous image"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 z-20 hidden sm:block"
                aria-label="Next image"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Image Dots - Desktop Only */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-20 hidden sm:flex">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleColorChange(index)
                    }}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      currentImageIndex === index ? 'bg-white w-3' : 'bg-white/60'
                    }`}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Mobile Image Counter */}
          {hasMultipleImages && (
            <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full sm:hidden">
              {currentImageIndex + 1}/{product.images.length}
            </div>
          )}
          
          {/* Expand icon overlay - hide on mobile for apparel */}
          {variant === "apparel" && !isMobile && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
              <div className={`bg-black/50 rounded-full p-3 ${
                product.id === 'uv-mu-paddleboard' 
                  ? 'transform group-hover:scale-110 transition-transform duration-300' 
                  : ''
              }`}>
                <svg className={`text-white fill-none stroke-current ${
                  product.id === 'uv-mu-paddleboard' ? 'w-10 h-10' : 'w-8 h-8'
                }`} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className={`p-3 md:p-4 space-y-2 md:space-y-3 flex-1 flex flex-col ${
          variant === "gear" ? "max-sm:space-y-2" : isMobile ? "pb-3" : ""
        }`}>
          
          {/* Name, Description, and Price */}
          <div className="space-y-1 flex-1">
            <h3 className={`font-medium text-white ${
              variant === "gear" 
                ? "text-sm md:text-base line-clamp-2 max-sm:line-clamp-none"
                : isMobile ? "text-sm leading-tight line-clamp-1" : "line-clamp-1"
            }`}>
              {product.name}
            </h3>
            <p className={`text-slate-400 ${
              variant === "gear" 
                ? "text-xs md:text-sm line-clamp-2 max-sm:line-clamp-3"
                : isMobile ? "text-xs line-clamp-1" : "text-sm line-clamp-1"
            }`}>
              {product.description}
            </p>
            <div className={`font-semibold text-white ${
              variant === "gear" 
                ? "text-cyan-400 font-bold text-lg md:text-xl"
                : isMobile ? "text-base" : "text-lg"
            }`}>
              ${product.price}
            </div>
          </div>
          
          {/* Colors */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {product.colors && product.colors.length > 1 && (
                <div className={`space-y-2 ${variant === "gear" ? "" : "hidden"}`}>
                  <p className="text-xs text-slate-400 font-medium">Color:</p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color, index) => (
                      <button
                        key={color.name}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleColorChange(index)
                        }}
                        className={`relative group/color transition-all touch-manipulation ${
                          selectedColorIndex === index ? 'scale-110' : ''
                        }`}
                        title={color.name}
                        aria-label={`Select ${color.name} color`}
                        aria-pressed={selectedColorIndex === index}
                      >
                        <div
                          className={`rounded-full border-2 transition-all ${
                            selectedColorIndex === index
                              ? 'border-cyan-400 shadow-lg shadow-cyan-400/25'
                              : 'border-slate-600 hover:border-slate-400'
                          } ${
                            variant === "gear" 
                              ? "w-10 h-10 sm:w-8 sm:h-8"
                              : isMobile ? "w-5 h-5 min-w-[20px] min-h-[20px]" : "w-4 h-4"
                          }`}
                          style={{ backgroundColor: color.hex }}
                        />
                        {variant === "gear" && selectedColorIndex === index && (
                          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-cyan-400 whitespace-nowrap font-medium">
                            {color.name}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Apparel-style color swatches */}
            {variant === "apparel" && product.colors.length > 1 && (
              <div className="flex gap-1">
                {product.colors.map((color, index) => (
                  <button
                    key={color.name}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleColorChange(index)
                    }}
                    className={`rounded-full border-2 transition-all ${
                      selectedColorIndex === index 
                        ? 'border-cyan-400 scale-110' 
                        : 'border-transparent hover:border-slate-600'
                    } ${isMobile ? 'w-5 h-5 min-w-[20px] min-h-[20px]' : 'w-4 h-4'}`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                    aria-label={`Select ${color.name} color`}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-slate-400 font-medium">Size:</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size: any, sizeIndex: number) => {
                  const isObjectSize = typeof size === 'object' && size !== null
                  const sizeName = isObjectSize ? size.name : size
                  const sizePrice = isObjectSize ? size.price : null
                  
                  return (
                    <button
                      key={sizeName}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSizeChange(sizeName)
                      }}
                      className={`px-3 py-1.5 text-xs rounded-md transition-all ${
                        selectedSize === sizeName
                          ? 'bg-cyan-500 text-slate-950 font-medium'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {sizeName}
                      {sizePrice && ` - $${sizePrice}`}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
          
          {/* Add to Cart Button */}
          <button
            onClick={handleQuickAdd}
            className={`w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 mt-auto ${
              variant === "gear"
                ? "py-2.5 md:py-3 text-sm md:text-base"
                : "py-2.5 text-sm"
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            {!selectedSize && product.sizes && product.sizes.length > 0 
              ? 'Select Size' 
              : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
} 
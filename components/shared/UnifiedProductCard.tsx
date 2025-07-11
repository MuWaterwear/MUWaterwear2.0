"use client"

import React, { useState, useMemo, useCallback } from "react"
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

const UnifiedProductCard = React.memo(function UnifiedProductCard({
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
  
  // Memoize expensive calculations
  const currentImageIndex = useMemo(() => {
    return getImageIndexForColor 
      ? getImageIndexForColor(product, selectedColorIndex)
      : selectedColorIndex
  }, [getImageIndexForColor, product, selectedColorIndex])
  
  const featuredImage = useMemo(() => {
    return product.images[currentImageIndex] || product.images[0]
  }, [product.images, currentImageIndex])
  
  const hasMultipleImages = useMemo(() => {
    return product.images.length > 1
  }, [product.images.length])
  
  // Memoize style calculations
  const imageStyles = useMemo(() => {
    const scalePercentage = imageScale / 100
    const hoverScalePercentage = (imageScale + 10) / 100
    
    return {
      scaleClass: `scale-[${scalePercentage}]`,
      hoverScaleClass: `group-hover:scale-[${hoverScalePercentage}]`,
      scalePercentage,
      hoverScalePercentage
    }
  }, [imageScale])
  
  // Memoize component classes
  const containerClasses = useMemo(() => {
    const baseClasses = `relative h-full bg-slate-900/50 rounded-lg overflow-hidden border border-slate-800/50 transition-all duration-300 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10 flex flex-col`
    const variantClasses = variant === "gear" ? "sm:overflow-hidden" : ""
    const productSpecificClasses = product.id === 'uv-mu-paddleboard' 
      ? 'hover:-translate-y-2 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/20' 
      : 'hover:-translate-y-1'
    
    return `${baseClasses} ${variantClasses} ${productSpecificClasses}`
  }, [variant, product.id])
  
  const aspectRatioClasses = useMemo(() => {
    return isFullWidth ? (isMobile ? 'aspect-[2/1]' : 'aspect-[2/1]') : 'aspect-square'
  }, [isFullWidth, isMobile])
  
  // Memoize callbacks to prevent unnecessary re-renders
  const handleColorChange = useCallback((index: number) => {
    if (onColorChange) {
      onColorChange(index)
    }
  }, [onColorChange])
  
  const handlePrevImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    const prevIndex = selectedColorIndex === 0 ? product.images.length - 1 : selectedColorIndex - 1
    handleColorChange(prevIndex)
  }, [selectedColorIndex, product.images.length, handleColorChange])
  
  const handleNextImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    const nextIndex = (selectedColorIndex + 1) % product.images.length
    handleColorChange(nextIndex)
  }, [selectedColorIndex, product.images.length, handleColorChange])
  
  const handleSizeChange = useCallback((size: string) => {
    if (onSizeChange) {
      onSizeChange(size)
    }
  }, [onSizeChange])
  
  const handleQuickAdd = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onQuickAdd(product)
  }, [onQuickAdd, product])
  
  const handleImageClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onImageClick(featuredImage, product.id)
  }, [onImageClick, featuredImage, product.id])
  
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])
  
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
  }, [])

  return (
    <div
      className="group relative h-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={containerClasses}>
        
        {/* Product Image */}
        <div className={`relative overflow-hidden ${aspectRatioClasses}`}>
          
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-800/30 to-slate-900/40 z-0"></div>
          

          
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
                  ? `object-contain p-2 sm:p-4 ${imageStyles.scaleClass} ${imageStyles.hoverScaleClass} sm:${imageStyles.scaleClass} sm:${imageStyles.hoverScaleClass}`
                  : product.id === 'uv-mu-paddleboard' 
                  ? 'object-cover scale-150 group-hover:scale-[1.7]' 
                  : product.id === 'mu-ocean-green-swim-shorts'
                  ? 'object-cover scale-150 group-hover:scale-[1.7]'
                  : product.id === 'mu-sky-blue-swim-shorts'
                  ? 'object-cover scale-150 group-hover:scale-[1.7]'
                  : product.id === 'mu-waterwear-hoodie-black' || product.id === 'mu-waterwear-hoodie-sandshell'
                  ? 'object-cover group-hover:scale-110 mix-blend-multiply'
                  : 'object-cover group-hover:scale-110'
              }`}
              sizes={variant === "gear" 
                ? "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
              }
              quality={100}
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
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 hidden md:block"
                aria-label="Previous image"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M7.5 9L4.5 6L7.5 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 hidden md:block"
                aria-label="Next image"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

        {/* Product Details - keeping existing code but could be optimized further */}
        <div className="p-3 md:p-4 flex-1 flex flex-col">
          <div className="flex-1">
            <h3 className="text-sm md:text-base font-medium text-slate-100 mb-1 md:mb-2 line-clamp-2">
              {product.name}
            </h3>
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg md:text-xl font-bold text-cyan-400">
                ${product.price}
              </span>
              
              {product.lake && (
                <span className="text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded">
                  {product.lake}
                </span>
              )}
            </div>
            
            {/* Color Selection - Keep visible on mobile (compact circles) */}
            {product.colors && product.colors.length > 1 && (
              <div className="mb-2">
                <div className="text-xs text-slate-500 mb-1.5 font-medium">Colors:</div>
                <div className={`flex flex-wrap gap-1.5 ${isMobile ? 'gap-1' : 'gap-1.5'}`}>
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => handleColorChange(index)}
                      className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} rounded-full border-2 transition-all hover:scale-110 ${
                        selectedColorIndex === index 
                          ? 'border-cyan-400 ring-2 ring-cyan-400/30 scale-110' 
                          : 'border-slate-600 hover:border-slate-400'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      aria-label={`Select ${color.name} color`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Size Selection - Dropdown on mobile, buttons on desktop */}
            {product.sizes && product.sizes.length > 1 && (
              <div className="mb-3">
                <div className="text-xs text-slate-500 mb-1.5 font-medium">Sizes:</div>
                {isMobile ? (
                  <select
                    value={selectedSize || ''}
                    onChange={(e) => handleSizeChange(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded border bg-slate-800/50 text-slate-300 border-slate-600 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                  >
                    <option value="">Select size</option>
                    {product.sizes.map((size, index) => {
                      const sizeValue = typeof size === 'string' ? size : size.name
                      return (
                        <option key={index} value={sizeValue}>
                          {sizeValue}
                        </option>
                      )
                    })}
                  </select>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {product.sizes.map((size, index) => {
                      const sizeValue = typeof size === 'string' ? size : size.name
                      return (
                        <button
                          key={index}
                          onClick={() => handleSizeChange(sizeValue)}
                          className={`text-xs px-2.5 py-1.5 rounded border transition-all hover:scale-105 font-medium ${
                            selectedSize === sizeValue
                              ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30 scale-105'
                              : 'bg-slate-800/50 text-slate-300 border-slate-600 hover:border-slate-400 hover:bg-slate-700/50'
                          }`}
                        >
                          {sizeValue}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Quick Add Button */}
          <button
            onClick={handleQuickAdd}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn"
          >
            <ShoppingCart size={16} />
            <span>Quick Add</span>
          </button>
        </div>
      </div>
    </div>
  )
})

export default UnifiedProductCard 
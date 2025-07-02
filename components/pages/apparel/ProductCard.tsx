"use client"

import { useState } from "react"
import Image from "next/image"
import { Product } from "@/lib/features/apparel-products"

interface ProductCardProps {
  product: Product
  onQuickAdd: (product: Product) => void
  onImageClick: (imageSrc: string, productId: string) => void
  selectedSize: string
  selectedColorIndex: number
  onSizeChange: (size: string) => void
  onColorChange: (index: number) => void
  expandedDetails: boolean
  onToggleDetails: () => void
  isFullWidth?: boolean
  isMobile?: boolean
}

export default function ProductCard({
  product,
  onQuickAdd,
  onImageClick,
  selectedSize,
  selectedColorIndex,
  onSizeChange,
  onColorChange,
  expandedDetails,
  onToggleDetails,
  isFullWidth = false,
  isMobile = false
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Get the correct featured image based on selected color or default to first image
  const featuredImage = product.images[selectedColorIndex] || product.images[0]

  return (
    <div
      className="group relative h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative h-full bg-slate-900/50 rounded-lg overflow-hidden border border-slate-800/50 transition-all duration-300 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10 ${
        product.id === 'uv-mu-paddleboard' 
          ? 'hover:-translate-y-2 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/20' 
          : 'hover:-translate-y-1'
      }`}>
        {/* Product Image */}
        <div className={`relative overflow-hidden bg-gradient-to-b from-slate-800/50 to-slate-900/50 ${
          isFullWidth ? (isMobile ? 'aspect-[2/1]' : 'aspect-[2/1]') : 'aspect-square'
        }`}>
          {/* Hero Background SVG behind product image */}
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
          <div 
            className="absolute inset-0 cursor-pointer z-10"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onImageClick(featuredImage, product.id)
            }}
          >
            <Image
              src={featuredImage}
              alt={product.name}
              width={400}
              height={400}
              quality={75}
              className={`transition-transform duration-500 pointer-events-none ${
                product.id === 'uv-mu-paddleboard' 
                  ? 'object-cover scale-150 group-hover:scale-[1.7]' 
                  : product.id === 'mu-ocean-green-swim-shorts'
                  ? 'object-cover scale-150 group-hover:scale-[1.7]'
                  : product.id === 'swim-mu-sky-blue-shorts'
                  ? 'object-cover scale-100 group-hover:scale-[1.2]'
                  : 'object-cover group-hover:scale-110'
              }`}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
              placeholder="blur"
            />
          </div>
          
          {/* Expand icon overlay - hide on mobile for better UX */}
          {!isMobile && (
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

          {/* Featured Badge */}
          {product.featured && (
            <div className={`absolute top-2 left-2 md:top-3 md:left-3 backdrop-blur-sm text-xs font-medium px-2 py-1 md:px-3 rounded-full border transition-all duration-300 ${
              product.id === 'uv-mu-paddleboard' 
                ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30 text-cyan-300 border-cyan-400/50 group-hover:from-cyan-500/50 group-hover:to-blue-500/50 group-hover:text-cyan-200 group-hover:border-cyan-300/70 animate-pulse' 
                : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
            }`}>
              {product.id === 'uv-mu-paddleboard' ? '✨ PREMIUM' : 'FEATURED'}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className={`p-3 md:p-4 space-y-2 md:space-y-3 ${isMobile ? 'pb-3' : ''}`}>
          <div className="space-y-1">
            <h3 className={`font-medium text-white line-clamp-1 ${isMobile ? 'text-sm leading-tight' : ''}`}>{product.name}</h3>
            <p className={`text-slate-400 line-clamp-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>{product.description}</p>
          </div>
          
          {/* Price and Colors */}
          <div className="flex items-center justify-between">
            <span className={`font-semibold text-white ${isMobile ? 'text-base' : 'text-lg'}`}>${product.price}</span>
            
            {/* Color Swatches */}
            {product.colors.length > 1 && (
              <div className="flex gap-1">
                {product.colors.map((color, index) => (
                  <button
                    key={color.name}
                    onClick={(e) => {
                      e.stopPropagation()
                      onColorChange(index)
                    }}
                    className={`rounded-full border-2 transition-all ${
                      selectedColorIndex === index 
                        ? 'border-cyan-400 scale-110' 
                        : 'border-transparent hover:border-slate-600'
                    } ${isMobile ? 'w-5 h-5 min-w-[20px] min-h-[20px]' : 'w-4 h-4'}`}
                  ></button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
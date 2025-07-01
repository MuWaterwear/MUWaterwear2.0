"use client"

import { useState } from "react"
import { useCart } from "@/contexts/CartContext"
import ProductCard from "@/components/pages/apparel/ProductCard"
import { Product } from "@/lib/features/apparel-products"
import { useMobile } from "@/hooks/useMobile"

interface ApparelGridProps {
  products: Product[]
  onImageClick: (imageSrc: string, productId: string) => void
  selectedColor?: { [key: string]: number }
  onColorChange?: (productId: string, index: number) => void
}

export default function ApparelGrid({ 
  products, 
  onImageClick, 
  selectedColor: parentSelectedColor,
  onColorChange: parentColorChange 
}: ApparelGridProps) {
  const { addToCart, setIsCartOpen } = useCart()
  const { isMobile } = useMobile()
  const [selectedSize, setSelectedSize] = useState<{ [key: string]: string }>({})
  const [localSelectedColor, setLocalSelectedColor] = useState<{ [key: string]: number }>({})
  const [expandedDetails, setExpandedDetails] = useState<string | null>(null)

  // Use parent selectedColor if provided, otherwise use local state
  const selectedColor = parentSelectedColor || localSelectedColor
  const handleColorChange = (productId: string, index: number) => {
    if (parentColorChange) {
      parentColorChange(productId, index)
    } else {
      setLocalSelectedColor(prev => ({ ...prev, [productId]: index }))
    }
  }

  const handleQuickAdd = (product: Product) => {
    const size = selectedSize[product.id] || product.sizes[Math.floor(product.sizes.length / 2)]
    const colorIndex = selectedColor[product.id] || 0
    
    const cartItem = {
      id: `${product.id}-${size}-${colorIndex}`,
      name: `${product.name} - ${product.colors[colorIndex].name}`,
      price: `$${product.price}`,
      size: size,
      image: product.images[colorIndex] || product.images[0],
    }
    
    addToCart(cartItem)
    setIsCartOpen(true)
  }

  const toggleDetails = (productId: string) => {
    setExpandedDetails(expandedDetails === productId ? null : productId)
  }

  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        {isMobile ? (
          // Mobile Layout with alternating pattern
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {products.map((product, index) => {
              const isFullWidth = index % 3 === 2;
              return (
                <div
                  key={product.id}
                  className={`${isFullWidth ? 'col-span-2' : 'col-span-1'} relative transform transition-all duration-300`}
                >
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickAdd={handleQuickAdd}
                    onImageClick={onImageClick}
                    selectedSize={selectedSize[product.id] || ''}
                    selectedColorIndex={selectedColor[product.id] || 0}
                    onSizeChange={(size) => setSelectedSize({ ...selectedSize, [product.id]: size })}
                    onColorChange={(index) => handleColorChange(product.id, index)}
                    expandedDetails={expandedDetails === product.id}
                    onToggleDetails={() => toggleDetails(product.id)}
                    isFullWidth={isFullWidth}
                    isMobile={isMobile}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          // Desktop Layout
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickAdd={handleQuickAdd}
                onImageClick={onImageClick}
                selectedSize={selectedSize[product.id] || ''}
                selectedColorIndex={selectedColor[product.id] || 0}
                onSizeChange={(size) => setSelectedSize({ ...selectedSize, [product.id]: size })}
                onColorChange={(index) => handleColorChange(product.id, index)}
                expandedDetails={expandedDetails === product.id}
                onToggleDetails={() => toggleDetails(product.id)}
                isMobile={false}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}